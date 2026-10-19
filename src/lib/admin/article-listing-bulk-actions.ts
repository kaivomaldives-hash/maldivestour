"use server";

import { updateTag, revalidatePath } from "next/cache";

import { requireStaff } from "@/lib/admin/auth";
import type { AdminActionResult } from "@/lib/admin/node-actions";
import { createClient } from "@/lib/supabase/server";

const LISTING_MARKER_PRESENT_RE = /<!--\s*listing:/;
const SECTION_END_RE = /<\/h2>/gi;
const MAX_LISTINGS_PER_ARTICLE = 3;

type ArticleRow = { id: string; body: string };
type RelationshipRow = { node_id: string; related_node_id: string };
type ActivityNodeRow = { id: string; slug: string; status: string; node_type: string };

/**
 * Splices `<!--listing:activity:SLUG-->` markers (the same marker the
 * "+ Insert real listing" editor button writes — see
 * listing-embeds.ts/listing-insert-picker.tsx) into section boundaries of
 * an article body, spread evenly rather than clumped at the top or
 * bottom. Falls back to appending at the end for a body with no `<h2>`
 * sections (too short to need spreading).
 */
function insertListingMarkersEvenly(body: string, slugs: string[]): string {
  if (slugs.length === 0) return body;
  const markers = slugs.map((slug) => `<!--listing:activity:${slug}-->`);

  const sectionEnds = Array.from(body.matchAll(SECTION_END_RE), (m) => (m.index ?? 0) + m[0].length);
  if (sectionEnds.length === 0) {
    return `${body}\n${markers.join("\n")}`;
  }

  // Spread markers across section boundaries, e.g. 3 markers over 7
  // sections land after sections 2, 4, 6 — never bunched together.
  const step = sectionEnds.length / (markers.length + 1);
  const insertAt = markers.map((_, i) => sectionEnds[Math.min(sectionEnds.length - 1, Math.floor(step * (i + 1)))]);

  let result = "";
  let cursor = 0;
  insertAt.forEach((pos, i) => {
    result += body.slice(cursor, pos) + `\n${markers[i]}\n`;
    cursor = pos;
  });
  result += body.slice(cursor);
  return result;
}

/** Published articles whose body has no listing marker yet, alongside how
 * many real published activities their node_relationships could supply —
 * the set bulkInsertActivityListingsIntoArticles will actually touch. */
export async function getArticlesMissingListingEmbeds(): Promise<Array<{ id: string; title: string; relatedActivityCount: number }>> {
  await requireStaff();
  const supabase = await createClient();

  const { data: articles } = await supabase
    .from("nodes")
    .select("id, title, status, articles!inner(body)")
    .eq("node_type", "article")
    .eq("status", "published")
    .returns<Array<{ id: string; title: string; status: string; articles: { body: string } | { body: string }[] }>>();
  if (!articles || articles.length === 0) return [];

  const candidates = articles
    .map((a) => {
      const fields = Array.isArray(a.articles) ? a.articles[0] : a.articles;
      return fields && !LISTING_MARKER_PRESENT_RE.test(fields.body) ? { id: a.id, title: a.title } : null;
    })
    .filter((a): a is { id: string; title: string } => a !== null);
  if (candidates.length === 0) return [];

  const { data: relationships } = await supabase
    .from("node_relationships")
    .select("node_id, related_node_id")
    .eq("relation_type", "related")
    .in("node_id", candidates.map((c) => c.id))
    .returns<RelationshipRow[]>();
  if (!relationships || relationships.length === 0) return candidates.map((c) => ({ ...c, relatedActivityCount: 0 }));

  const { data: relatedNodes } = await supabase
    .from("nodes")
    .select("id, slug, status, node_type")
    .eq("node_type", "activity")
    .eq("status", "published")
    .in("id", Array.from(new Set(relationships.map((r) => r.related_node_id))))
    .returns<ActivityNodeRow[]>();
  const publishedActivityIds = new Set((relatedNodes ?? []).map((n) => n.id));

  const countByArticle = new Map<string, number>();
  for (const rel of relationships) {
    if (!publishedActivityIds.has(rel.related_node_id)) continue;
    countByArticle.set(rel.node_id, (countByArticle.get(rel.node_id) ?? 0) + 1);
  }

  return candidates.map((c) => ({ ...c, relatedActivityCount: countByArticle.get(c.id) ?? 0 }));
}

/**
 * For every published article with no listing marker yet, pulls its real
 * related activities (node_relationships, relation_type='related' — the
 * same non-fabricated source the "Related" sections already use) and
 * splices up to MAX_LISTINGS_PER_ARTICLE real `<!--listing:activity:SLUG-->`
 * markers into its body. Articles that already have a marker (e.g. the
 * one staff curated by hand) are left untouched; articles with zero
 * related activities are skipped — never a fabricated or guessed listing.
 */
export async function bulkInsertActivityListingsIntoArticles(): Promise<AdminActionResult & { updatedCount?: number; skippedCount?: number }> {
  await requireStaff();
  const supabase = await createClient();

  const { data: articles, error: articlesError } = await supabase
    .from("nodes")
    .select("id, articles!inner(body)")
    .eq("node_type", "article")
    .eq("status", "published")
    .returns<Array<{ id: string; articles: { body: string } | { body: string }[] }>>();
  if (articlesError) return { ok: false, error: articlesError.message };
  if (!articles || articles.length === 0) return { ok: true, updatedCount: 0, skippedCount: 0 };

  const rows: ArticleRow[] = articles
    .map((a) => {
      const fields = Array.isArray(a.articles) ? a.articles[0] : a.articles;
      return fields ? { id: a.id, body: fields.body } : null;
    })
    .filter((r): r is ArticleRow => r !== null);

  const candidates = rows.filter((r) => !LISTING_MARKER_PRESENT_RE.test(r.body));
  const alreadyMarked = rows.length - candidates.length;
  if (candidates.length === 0) return { ok: true, updatedCount: 0, skippedCount: alreadyMarked };

  const { data: relationships, error: relError } = await supabase
    .from("node_relationships")
    .select("node_id, related_node_id")
    .eq("relation_type", "related")
    .in("node_id", candidates.map((c) => c.id))
    .returns<RelationshipRow[]>();
  if (relError) return { ok: false, error: relError.message };

  const relatedIds = Array.from(new Set((relationships ?? []).map((r) => r.related_node_id)));
  const { data: activityNodes, error: nodesError } = await supabase
    .from("nodes")
    .select("id, slug, status, node_type")
    .eq("node_type", "activity")
    .eq("status", "published")
    .in("id", relatedIds.length > 0 ? relatedIds : [""])
    .returns<ActivityNodeRow[]>();
  if (nodesError) return { ok: false, error: nodesError.message };
  const slugById = new Map((activityNodes ?? []).map((n) => [n.id, n.slug]));

  const slugsByArticle = new Map<string, string[]>();
  for (const rel of relationships ?? []) {
    const slug = slugById.get(rel.related_node_id);
    if (!slug) continue;
    const list = slugsByArticle.get(rel.node_id) ?? [];
    if (!list.includes(slug)) list.push(slug);
    slugsByArticle.set(rel.node_id, list);
  }

  let updatedCount = 0;
  let skippedCount = alreadyMarked;
  for (const article of candidates) {
    const slugs = (slugsByArticle.get(article.id) ?? []).slice(0, MAX_LISTINGS_PER_ARTICLE);
    if (slugs.length === 0) {
      skippedCount += 1;
      continue;
    }
    const newBody = insertListingMarkersEvenly(article.body, slugs);
    const { error: updateError } = await supabase.from("articles").update({ body: newBody } as unknown as never).eq("id", article.id);
    if (updateError) return { ok: false, error: updateError.message };
    updatedCount += 1;
  }

  updateTag("articles:by-slug");
  updateTag("articles:translated-by-slug");
  updateTag("articles:list");
  updateTag("articles:translated-list");
  revalidatePath("/admin/articles");
  revalidatePath("/maldives/travel-guide");

  return { ok: true, updatedCount, skippedCount };
}
