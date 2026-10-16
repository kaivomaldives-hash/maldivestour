/** The node_type values that currently have a configurable default public
 * sort order — matches content_sort_settings' seeded rows exactly
 * (20261021000100_admin_sort_management.sql). */
export type SortableNodeType = "package" | "activity" | "accommodation" | "transfer_route";

export type ContentSortMode = "title_asc" | "price_asc" | "price_desc" | "rating_desc" | "published_desc" | "manual";

export const CONTENT_SORT_MODES: readonly ContentSortMode[] = ["title_asc", "price_asc", "price_desc", "rating_desc", "published_desc", "manual"];

export const CONTENT_SORT_LABELS: Record<ContentSortMode, string> = {
  title_asc: "Title (A–Z)",
  price_asc: "Price (low to high)",
  price_desc: "Price (high to low)",
  rating_desc: "Rating (highest first)",
  published_desc: "Publish date (newest first)",
  manual: "Manual (set a position per item)",
};

/** transfer_route has no single price column of its own (a route can
 * carry several transfer_services at different prices) — price sort
 * isn't offered for it. Every other sortable type has a direct
 * `price_from` column on its 1:1 child table. */
export const PRICE_SORT_SUPPORTED: Record<SortableNodeType, boolean> = {
  package: true,
  activity: true,
  accommodation: true,
  transfer_route: false,
};
