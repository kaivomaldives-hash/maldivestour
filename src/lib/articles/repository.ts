import "server-only";

import { getCategoriesByGroup } from "@/lib/categories/repository";
import type { CategorySummary } from "@/lib/categories/types";
import { getLocationSummariesByIds } from "@/lib/locations/repository";
import type { LocationSummary } from "@/lib/locations/types";
import { getHeroMediaByNodeIds, resolveStorageImageSrcs } from "@/lib/media/repository";
import type { MediaAsset } from "@/lib/media/types";
import { createClient } from "@/lib/supabase/server";
import type { ArticleDetail, ArticleSummary, GetArticlesOptions, PaginatedResult } from "@/lib/articles/types";

/**
 * Server-side article data-access layer (Task 14), following the same
 * pattern as every other vertical repository in this codebase (see
 * src/lib/packages/repository.ts's header comment for the fuller
 * rationale): pages call these functions, never Supabase directly, and
 * every function only returns published articles.
 *
 * `articles!inner(...)` is a plain embed with no FK name required —
 * `articles.id` has exactly one relationship to `nodes` (its primary key
 * IS the nodes.id FK), and unlike `categories`/`locations` nothing else
 * references `articles` as a junction table, so there is no second path
 * for PostgREST to be ambiguous about. Confirmed against
 * supabase/migrations/20250101000700_packages.sql (where the `articles`
 * table was created) before writing this file.
 */

const NODE_ARTICLE_SELECT =
  "id, slug, title, summary, meta_title, meta_description, published_at, articles!inner(body, reading_time_minutes)";

type ArticleFields = { body: string; reading_time_minutes: number | null };

type NodeArticleRow = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  meta_title: string | null;
  meta_description: string | null;
  published_at: string | null;
  // Defensive-coded as possibly-an-array — see the identical note in
  // src/lib/locations/repository.ts and src/lib/packages/repository.ts.
  articles: ArticleFields | ArticleFields[] | null;
};

interface BareArticle {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  publishedAt: string | null;
  body: string;
  readingTimeMinutes: number | null;
}

function bareArticleOf(row: NodeArticleRow): BareArticle | null {
  const a = Array.isArray(row.articles) ? row.articles[0] : row.articles;
  if (!a) return null;

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
    publishedAt: row.published_at,
    body: a.body,
    readingTimeMinutes: a.reading_time_minutes,
  };
}

function toSummary(bare: BareArticle, category: CategorySummary | null, heroImage: MediaAsset | null): ArticleSummary {
  return {
    id: bare.id,
    slug: bare.slug,
    title: bare.title,
    summary: bare.summary,
    category,
    heroImage,
    readingTimeMinutes: bare.readingTimeMinutes,
    publishedAt: bare.publishedAt,
  };
}

/** Batch-resolve each article's single "article-category" tag. Fetches the
 * whole (small, ~13-category) article-category group once and matches it
 * against node_categories rows in application code — deliberately avoids
 * embedding through node_categories, same reasoning as
 * getCategoriesForPackage in src/lib/packages/repository.ts: category_id
 * references categories directly, and categories.id is itself a nodes.id
 * FK, so an embed here would hit the identical two-path ambiguity already
 * fixed elsewhere via a named relationship (commit 06a9254). */
async function attachCategories(articleIds: string[]): Promise<Map<string, CategorySummary>> {
  const result = new Map<string, CategorySummary>();
  if (articleIds.length === 0) return result;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("node_categories")
    .select("node_id, category_id")
    .in("node_id", articleIds)
    .returns<Array<{ node_id: string; category_id: string }>>();

  if (error || !data || data.length === 0) return result;

  const categories = await getCategoriesByGroup("article-category");
  const categoriesById = new Map(categories.map((c) => [c.id, c]));

  for (const row of data) {
    if (result.has(row.node_id)) continue; // one category per article by migration design
    const category = categoriesById.get(row.category_id);
    if (category) result.set(row.node_id, category);
  }
  return result;
}

async function toSummaries(bares: BareArticle[]): Promise<ArticleSummary[]> {
  const ids = bares.map((b) => b.id);
  const [categoriesById, heroById] = await Promise.all([attachCategories(ids), getHeroMediaByNodeIds(ids)]);
  return bares.map((b) => toSummary(b, categoriesById.get(b.id) ?? null, heroById.get(b.id) ?? null));
}

export async function getArticles(options: GetArticlesOptions = {}): Promise<PaginatedResult<ArticleSummary>> {
  const page = Math.max(1, options.page ?? 1);
  const pageSize = Math.min(100, Math.max(1, options.pageSize ?? 24));
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const supabase = await createClient();

  let nodeIdFilter: string[] | null = null;
  if (options.category) {
    const categories = await getCategoriesByGroup("article-category");
    const category = categories.find((c) => c.slug === options.category);
    if (!category) return { items: [], total: 0, page, pageSize };

    const { data: tagRows } = await supabase
      .from("node_categories")
      .select("node_id")
      .eq("category_id", category.id)
      .returns<Array<{ node_id: string }>>();
    nodeIdFilter = Array.from(new Set((tagRows ?? []).map((row) => row.node_id)));
    if (nodeIdFilter.length === 0) return { items: [], total: 0, page, pageSize };
  }

  let query = supabase
    .from("nodes")
    .select(NODE_ARTICLE_SELECT, { count: "exact" })
    .eq("node_type", "article")
    .eq("status", "published");

  if (nodeIdFilter) query = query.in("id", nodeIdFilter);

  const { data, error, count } = await query
    .order("published_at", { ascending: false })
    .range(from, to)
    .returns<NodeArticleRow[]>();

  if (error || !data) return { items: [], total: 0, page, pageSize };

  const bares = data.map(bareArticleOf).filter((b): b is BareArticle => b !== null);
  const items = await toSummaries(bares);
  return { items, total: count ?? items.length, page, pageSize };
}

/** Most recently published articles, for the homepage Travel Guide section
 * (Task 14 §29/30). */
export async function getRecentArticles(limit = 3): Promise<ArticleSummary[]> {
  const result = await getArticles({ page: 1, pageSize: limit });
  return result.items;
}

export async function getArticleBySlug(slug: string): Promise<ArticleDetail | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("nodes")
    .select(NODE_ARTICLE_SELECT)
    .eq("node_type", "article")
    .eq("status", "published")
    .eq("slug", slug)
    .maybeSingle<NodeArticleRow>();

  if (error || !data) return null;
  const bare = bareArticleOf(data);
  if (!bare) return null;

  const [[summary], relatedLocations] = await Promise.all([
    toSummaries([bare]),
    getRelatedLocationsForArticle(bare.id),
  ]);

  return {
    ...summary,
    metaTitle: bare.metaTitle,
    metaDescription: bare.metaDescription,
    bodyHtml: resolveStorageImageSrcs(bare.body),
    relatedLocations,
  };
}

async function getRelatedLocationsForArticle(articleId: string): Promise<LocationSummary[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("node_locations")
    .select("location_id")
    .eq("node_id", articleId)
    .returns<Array<{ location_id: string }>>();

  if (error || !data || data.length === 0) return [];

  const locationsById = await getLocationSummariesByIds(data.map((row) => row.location_id));
  return data.map((row) => locationsById.get(row.location_id)).filter((l): l is LocationSummary => Boolean(l));
}

/** Every article-category actually tagged on at least one published
 * article — the same "only show a filter that can return something" rule
 * used for diving/fishing/surfing types (Tasks 7-9) and packages
 * (Task 11). */
export async function getArticleCategoriesInUse(): Promise<CategorySummary[]> {
  const all = await getCategoriesByGroup("article-category");
  if (all.length === 0) return [];

  const supabase = await createClient();
  const { data: articleRows, error: articleError } = await supabase
    .from("nodes")
    .select("id")
    .eq("node_type", "article")
    .eq("status", "published")
    .returns<Array<{ id: string }>>();

  if (articleError || !articleRows || articleRows.length === 0) return [];
  const articleIds = new Set(articleRows.map((row) => row.id));

  const { data: tagRows, error: tagError } = await supabase
    .from("node_categories")
    .select("node_id, category_id")
    .in(
      "category_id",
      all.map((c) => c.id),
    )
    .returns<Array<{ node_id: string; category_id: string }>>();

  if (tagError || !tagRows) return [];
  const inUseCategoryIds = new Set(tagRows.filter((row) => articleIds.has(row.node_id)).map((row) => row.category_id));
  return all.filter((c) => inUseCategoryIds.has(c.id));
}

export interface SearchArticlesOptions {
  limit?: number;
}

/** Title search for the site-wide search layer (Task 13/14) — same
 * ilike-title pattern as searchAccommodations/searchPackages/etc. */
export async function searchArticles(query: string, options: SearchArticlesOptions = {}): Promise<ArticleSummary[]> {
  const trimmed = query.trim();
  if (trimmed.length === 0) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("nodes")
    .select(NODE_ARTICLE_SELECT)
    .eq("node_type", "article")
    .eq("status", "published")
    .ilike("title", `%${trimmed}%`)
    .order("title", { ascending: true })
    .limit(options.limit ?? 20)
    .returns<NodeArticleRow[]>();

  if (error || !data) return [];

  const bares = data.map(bareArticleOf).filter((b): b is BareArticle => b !== null);
  return toSummaries(bares);
}
