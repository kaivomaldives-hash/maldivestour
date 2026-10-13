import "server-only";

import { createClient } from "@/lib/supabase/server";

/**
 * Admin-only reads of location_comments (islands/atolls/attractions/dive
 * sites — all the same `locations` table). `location_comments_staff_read`
 * lets staff see every status; the public repository
 * (src/lib/locations/comments/repository.ts) only ever sees
 * status='published'. Location titles are resolved with a separate
 * batched lookup, same reasoning as src/lib/admin/reviews-repository.ts.
 */

const PAGE_SIZE = 25;
export const LOCATION_COMMENT_STATUSES = ["pending", "published", "rejected"] as const;
export type LocationCommentStatus = (typeof LOCATION_COMMENT_STATUSES)[number];

export interface AdminLocationCommentItem {
  id: string;
  locationId: string;
  locationTitle: string;
  body: string;
  status: LocationCommentStatus;
  commenterName: string;
  commenterEmail: string | null;
  createdAt: string;
}

interface LocationCommentRow {
  id: string;
  location_id: string;
  user_id: string | null;
  body: string;
  status: LocationCommentStatus;
  guest_name: string | null;
  guest_email: string | null;
  created_at: string;
}

export interface AdminLocationCommentListResult {
  items: AdminLocationCommentItem[];
  total: number;
  page: number;
  pageSize: number;
}

export async function getLocationCommentsAdmin(options: { status?: LocationCommentStatus; page?: number } = {}): Promise<AdminLocationCommentListResult> {
  const page = Math.max(1, options.page ?? 1);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const supabase = await createClient();
  let query = supabase.from("location_comments").select("*", { count: "exact" }).order("created_at", { ascending: false });
  if (options.status) query = query.eq("status", options.status);

  const { data, error, count } = await query.range(from, to).returns<LocationCommentRow[]>();
  if (error || !data) return { items: [], total: 0, page, pageSize: PAGE_SIZE };

  const locationIds = [...new Set(data.map((c) => c.location_id))];
  const { data: nodes } = locationIds.length
    ? await supabase.from("nodes").select("id, title").in("id", locationIds).returns<Array<{ id: string; title: string }>>()
    : { data: [] as Array<{ id: string; title: string }> };
  const titleById = new Map((nodes ?? []).map((n) => [n.id, n.title]));

  const items: AdminLocationCommentItem[] = data.map((c) => ({
    id: c.id,
    locationId: c.location_id,
    locationTitle: titleById.get(c.location_id) ?? "(unknown location)",
    body: c.body,
    status: c.status,
    commenterName: c.guest_name ?? "(account holder)",
    commenterEmail: c.guest_email,
    createdAt: c.created_at,
  }));

  return { items, total: count ?? items.length, page, pageSize: PAGE_SIZE };
}
