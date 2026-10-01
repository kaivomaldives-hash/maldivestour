import "server-only";

import { requireStaff } from "@/lib/admin/auth";
import type { NodeStatus } from "@/lib/admin/node-actions";
import { createClient } from "@/lib/supabase/server";

/**
 * Admin-only article reads. `articles` is node-backed (node_type='article'),
 * same nodes + `!inner` child-table pattern as every other content type,
 * governed by `articles_staff_all` RLS. `body` is stored as raw HTML with
 * storage paths resolved to URLs only at public-render time (see
 * resolveStorageImageSrcs in src/lib/media/repository.ts) — the admin edits
 * the raw HTML directly, same source of truth, no separate draft format.
 */

const PAGE_SIZE = 30;

const NODE_ARTICLE_SELECT =
  "id, slug, title, summary, status, meta_title, meta_description, articles!inner(body, reading_time_minutes, video_youtube_id)";

type ArticleFieldsRow = { body: string; reading_time_minutes: number | null; video_youtube_id: string | null };

type NodeArticleRow = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  status: NodeStatus;
  meta_title: string | null;
  meta_description: string | null;
  articles: ArticleFieldsRow | ArticleFieldsRow[] | null;
};

export interface ArticleFieldsAdmin {
  body: string;
  readingTimeMinutes: number | null;
  videoYoutubeId: string | null;
}

export interface AdminArticleItem {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  status: NodeStatus;
  metaTitle: string | null;
  metaDescription: string | null;
  fields: ArticleFieldsAdmin;
}

function bareOf(row: NodeArticleRow): AdminArticleItem | null {
  const a = Array.isArray(row.articles) ? row.articles[0] : row.articles;
  if (!a) return null;
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    status: row.status,
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
    fields: { body: a.body, readingTimeMinutes: a.reading_time_minutes, videoYoutubeId: a.video_youtube_id },
  };
}

export interface AdminArticleListResult {
  items: AdminArticleItem[];
  total: number;
  page: number;
  pageSize: number;
}

export async function getArticlesAdmin(options: { search?: string; page?: number } = {}): Promise<AdminArticleListResult> {
  await requireStaff();
  const page = Math.max(1, options.page ?? 1);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const supabase = await createClient();
  let query = supabase.from("nodes").select(NODE_ARTICLE_SELECT, { count: "exact" }).eq("node_type", "article").order("title", { ascending: true });
  if (options.search?.trim()) query = query.ilike("title", `%${options.search.trim()}%`);

  const { data, error, count } = await query.range(from, to).returns<NodeArticleRow[]>();
  if (error || !data) return { items: [], total: 0, page, pageSize: PAGE_SIZE };

  const items = data.map(bareOf).filter((a): a is AdminArticleItem => a !== null);
  return { items, total: count ?? items.length, page, pageSize: PAGE_SIZE };
}

export async function getArticleByIdAdmin(id: string): Promise<AdminArticleItem | null> {
  await requireStaff();
  const supabase = await createClient();
  const { data, error } = await supabase.from("nodes").select(NODE_ARTICLE_SELECT).eq("node_type", "article").eq("id", id).maybeSingle<NodeArticleRow>();
  if (error || !data) return null;
  return bareOf(data);
}
