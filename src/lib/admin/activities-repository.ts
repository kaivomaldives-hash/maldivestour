import "server-only";

import { requireStaff } from "@/lib/admin/auth";
import { getAdminNodeIdsAtAtoll } from "@/lib/admin/admin-location-filter";
import type { NodeStatus } from "@/lib/admin/node-actions";
import type { ActivityCategory, ActivityDifficulty, ActivityItineraryStep, ActivityRate } from "@/lib/activities/types";
import { createClient } from "@/lib/supabase/server";

/**
 * Admin-only activity reads (all statuses). Covers Activities/Fishing/
 * Diving/Surfing — one table distinguished by activity_category, not
 * four separate tables (confirmed against the schema before building).
 */

const PAGE_SIZE = 30;

const NODE_ACTIVITY_SELECT =
  "id, slug, title, summary, status, meta_title, meta_description, sort_order, activities!inner(activity_category, operated_by_provider_id, duration_minutes, min_age, difficulty, price_from, currency, max_participants, video_youtube_id, description, itinerary, rates)";

interface ActivityRow {
  activity_category: ActivityCategory;
  operated_by_provider_id: string | null;
  duration_minutes: number | null;
  min_age: number | null;
  difficulty: ActivityDifficulty | null;
  price_from: number | null;
  currency: string | null;
  max_participants: number | null;
  video_youtube_id: string | null;
  description: string | null;
  itinerary: ActivityItineraryStep[] | null;
  rates: ActivityRate[] | null;
}

interface NodeActivityRow {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  status: NodeStatus;
  meta_title: string | null;
  meta_description: string | null;
  sort_order: number | null;
  activities: ActivityRow | ActivityRow[] | null;
}

export interface ActivityFieldsAdmin {
  activityCategory: ActivityCategory;
  operatedByProviderId: string | null;
  durationMinutes: number | null;
  minAge: number | null;
  difficulty: ActivityDifficulty | null;
  priceFrom: number | null;
  currency: string;
  maxParticipants: number | null;
  videoYoutubeId: string | null;
  description: string | null;
  itinerary: ActivityItineraryStep[];
  rates: ActivityRate[];
}

export interface AdminActivityItem {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  status: NodeStatus;
  metaTitle: string | null;
  metaDescription: string | null;
  sortOrder: number | null;
  fields: ActivityFieldsAdmin;
}

function toAdminActivity(row: NodeActivityRow): AdminActivityItem | null {
  const a = Array.isArray(row.activities) ? row.activities[0] : row.activities;
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
      activityCategory: a.activity_category,
      operatedByProviderId: a.operated_by_provider_id,
      durationMinutes: a.duration_minutes,
      minAge: a.min_age,
      difficulty: a.difficulty,
      priceFrom: a.price_from,
      currency: a.currency ?? "USD",
      maxParticipants: a.max_participants,
      videoYoutubeId: a.video_youtube_id,
      description: a.description,
      itinerary: a.itinerary ?? [],
      rates: a.rates ?? [],
    },
  };
}

export interface AdminActivityListResult {
  items: AdminActivityItem[];
  total: number;
  page: number;
  pageSize: number;
}

export async function getActivitiesAdmin(
  options: {
    search?: string;
    activityCategory?: ActivityCategory;
    status?: NodeStatus;
    providerId?: string;
    atollId?: string;
    page?: number;
  } = {},
): Promise<AdminActivityListResult> {
  await requireStaff();
  const page = Math.max(1, options.page ?? 1);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const supabase = await createClient();
  let query = supabase
    .from("nodes")
    .select(NODE_ACTIVITY_SELECT, { count: "exact" })
    .eq("node_type", "activity")
    .order("sort_order", { ascending: true, nullsFirst: false })
    .order("title", { ascending: true });
  if (options.search?.trim()) query = query.ilike("title", `%${options.search.trim()}%`);
  if (options.activityCategory) query = query.eq("activities.activity_category", options.activityCategory);
  if (options.status) query = query.eq("status", options.status);
  if (options.providerId) query = query.eq("activities.operated_by_provider_id", options.providerId);
  if (options.atollId) {
    const nodeIds = await getAdminNodeIdsAtAtoll(options.atollId);
    if (nodeIds.length === 0) return { items: [], total: 0, page, pageSize: PAGE_SIZE };
    query = query.in("id", nodeIds);
  }

  const { data, error, count } = await query.range(from, to).returns<NodeActivityRow[]>();
  if (error || !data) return { items: [], total: 0, page, pageSize: PAGE_SIZE };

  const items = data.map(toAdminActivity).filter((a): a is AdminActivityItem => a !== null);
  return { items, total: count ?? items.length, page, pageSize: PAGE_SIZE };
}

export async function getActivityByIdAdmin(id: string): Promise<AdminActivityItem | null> {
  await requireStaff();
  const supabase = await createClient();
  const { data, error } = await supabase.from("nodes").select(NODE_ACTIVITY_SELECT).eq("node_type", "activity").eq("id", id).maybeSingle<NodeActivityRow>();
  if (error || !data) return null;
  return toAdminActivity(data);
}
