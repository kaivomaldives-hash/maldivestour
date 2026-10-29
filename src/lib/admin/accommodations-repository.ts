import "server-only";

import { requireStaff } from "@/lib/admin/auth";
import { getAdminNodeIdsAtAtoll } from "@/lib/admin/admin-location-filter";
import type { NodeStatus } from "@/lib/admin/node-actions";
import type { AccommodationType, PriceTier } from "@/lib/accommodations/types";
import { createClient } from "@/lib/supabase/server";
import { titleSearchFilter } from "@/lib/search/normalize";

/**
 * Admin-only accommodation reads (all statuses), mirroring providers-
 * repository.ts's shape exactly. Covers Hotels/Resorts/Guesthouses —
 * they're one table distinguished by accommodation_type, not three
 * separate tables (confirmed against the schema before building this).
 */

const PAGE_SIZE = 30;

const NODE_ACCOMMODATION_SELECT =
  "id, slug, title, summary, status, meta_title, meta_description, sort_order, accommodations!inner(accommodation_type, star_rating, price_tier, room_count, all_inclusive, overwater_villas, check_in_time, check_out_time, currency, operated_by_provider_id, price_from, video_youtube_id)";

interface NodeAccommodationRow {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  status: NodeStatus;
  meta_title: string | null;
  meta_description: string | null;
  sort_order: number | null;
  accommodations: AccommodationRow | AccommodationRow[] | null;
}

interface AccommodationRow {
  accommodation_type: AccommodationType;
  star_rating: number | null;
  price_tier: PriceTier | null;
  room_count: number | null;
  all_inclusive: boolean | null;
  overwater_villas: boolean | null;
  check_in_time: string | null;
  check_out_time: string | null;
  currency: string | null;
  operated_by_provider_id: string | null;
  price_from: number | null;
  video_youtube_id: string | null;
}

export interface AccommodationFieldsAdmin {
  accommodationType: AccommodationType;
  starRating: number | null;
  priceTier: PriceTier | null;
  roomCount: number | null;
  allInclusive: boolean;
  overwaterVillas: boolean;
  checkInTime: string | null;
  checkOutTime: string | null;
  currency: string;
  operatedByProviderId: string | null;
  priceFrom: number | null;
  videoYoutubeId: string | null;
}

export interface AdminAccommodationItem {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  status: NodeStatus;
  metaTitle: string | null;
  metaDescription: string | null;
  sortOrder: number | null;
  fields: AccommodationFieldsAdmin;
}

function toAdminAccommodation(row: NodeAccommodationRow): AdminAccommodationItem | null {
  const a = Array.isArray(row.accommodations) ? row.accommodations[0] : row.accommodations;
  if (!a) return null;
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    status: row.status,
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
    sortOrder: row.sort_order,
    fields: {
      accommodationType: a.accommodation_type,
      starRating: a.star_rating,
      priceTier: a.price_tier,
      roomCount: a.room_count,
      allInclusive: a.all_inclusive ?? false,
      overwaterVillas: a.overwater_villas ?? false,
      checkInTime: a.check_in_time,
      checkOutTime: a.check_out_time,
      currency: a.currency ?? "USD",
      operatedByProviderId: a.operated_by_provider_id,
      priceFrom: a.price_from,
      videoYoutubeId: a.video_youtube_id,
    },
  };
}

export interface AdminAccommodationListResult {
  items: AdminAccommodationItem[];
  total: number;
  page: number;
  pageSize: number;
}

export async function getAccommodationsAdmin(
  options: {
    search?: string;
    accommodationType?: AccommodationType;
    status?: NodeStatus;
    providerId?: string;
    atollId?: string;
    page?: number;
  } = {},
): Promise<AdminAccommodationListResult> {
  await requireStaff();
  const page = Math.max(1, options.page ?? 1);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const supabase = await createClient();
  let query = supabase
    .from("nodes")
    .select(NODE_ACCOMMODATION_SELECT, { count: "exact" })
    .eq("node_type", "accommodation")
    .order("sort_order", { ascending: true, nullsFirst: false })
    .order("title", { ascending: true });
  if (options.search?.trim()) query = query.filter("title", ...titleSearchFilter(options.search));
  if (options.accommodationType) query = query.eq("accommodations.accommodation_type", options.accommodationType);
  if (options.status) query = query.eq("status", options.status);
  if (options.providerId) query = query.eq("accommodations.operated_by_provider_id", options.providerId);
  if (options.atollId) {
    const nodeIds = await getAdminNodeIdsAtAtoll(options.atollId);
    if (nodeIds.length === 0) return { items: [], total: 0, page, pageSize: PAGE_SIZE };
    query = query.in("id", nodeIds);
  }

  const { data, error, count } = await query.range(from, to).returns<NodeAccommodationRow[]>();
  if (error || !data) return { items: [], total: 0, page, pageSize: PAGE_SIZE };

  const items = data.map(toAdminAccommodation).filter((a): a is AdminAccommodationItem => a !== null);
  return { items, total: count ?? items.length, page, pageSize: PAGE_SIZE };
}

export async function getAccommodationByIdAdmin(id: string): Promise<AdminAccommodationItem | null> {
  await requireStaff();
  const supabase = await createClient();
  const { data, error } = await supabase.from("nodes").select(NODE_ACCOMMODATION_SELECT).eq("node_type", "accommodation").eq("id", id).maybeSingle<NodeAccommodationRow>();
  if (error || !data) return null;
  return toAdminAccommodation(data);
}
