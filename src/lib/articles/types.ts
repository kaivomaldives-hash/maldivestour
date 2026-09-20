import type { CategorySummary } from "@/lib/categories/types";
import type { LocationSummary } from "@/lib/locations/types";
import type { MediaAsset } from "@/lib/media/types";

/**
 * An article is a `nodes` row (node_type = 'article') with a matching
 * `articles` row (body, reading_time_minutes) — the same table the
 * foundation schema created in Task 2/3 and Task 14 now actually populates
 * via the legacy Travel Guide migration
 * (scripts/import-legacy-articles.mjs). No second content system: this is
 * the one and only article model.
 */

export interface ArticleSummary {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  /** The single "article-category" tag the migration assigned (Islands,
   * Diving, Accommodation, ...) — null only if a future article is created
   * without one. */
  category: CategorySummary | null;
  heroImage: MediaAsset | null;
  readingTimeMinutes: number | null;
  publishedAt: string | null;
}

export interface ArticleDetail extends ArticleSummary {
  metaTitle: string | null;
  metaDescription: string | null;
  /** Already resolved to real public Storage URLs (see
   * resolveStorageImageSrcs in src/lib/media/repository.ts) — safe to
   * render directly, never a bare storage_path. */
  bodyHtml: string;
  /** Real islands/atolls the article's content is actually about, tagged
   * at migration time via token-overlap matching against the live
   * catalogue (Task 14) — never fabricated. Empty when nothing matched. */
  relatedLocations: LocationSummary[];
}

export interface GetArticlesOptions {
  page?: number;
  pageSize?: number;
  /** Category slug (article-category group) to filter by. */
  category?: string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export function articleHref(article: { slug: string }): string {
  return `/maldives/travel-guide/${article.slug}/`;
}
