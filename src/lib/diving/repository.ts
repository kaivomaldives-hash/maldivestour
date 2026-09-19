import "server-only";

import {
  getActivities,
  getActivityBySlug,
  searchActivities,
  type GetActivitiesOptions,
} from "@/lib/activities/repository";
import type { ActivityDetail, ActivitySummary, PaginatedResult as ActivityPaginatedResult } from "@/lib/activities/types";
import { getCategoriesByGroup, getCategoryBySlug, getNodeIdsByCategory } from "@/lib/categories/repository";
import type { CategorySummary } from "@/lib/categories/types";
import { createClient } from "@/lib/supabase/server";
import {
  getLocationBySlugAndType,
  getLocationIdsForNode,
  getLocationSummariesByIds,
  getLocationSummaryById,
  getLocationsByType,
  getLocationsByTypeAndAtoll,
  getNodeAttributesByIds,
  getNodeIdsAtLocation,
} from "@/lib/locations/repository";
import type { LocationSummary } from "@/lib/locations/types";
import type { DiveSiteDetail, DiveSiteSummary, DiveSiteType, GetDiveSitesOptions, PaginatedResult } from "@/lib/diving/types";

/**
 * Diving is a specialized *view* over two existing systems, not a new data
 * model — exactly the pattern Task 7 established for fishing:
 *
 * - Diving ACTIVITIES (Discover Scuba, Fun Dive, courses, ...) are
 *   `activities` rows (activity_category = 'diving') — see
 *   src/lib/fishing/repository.ts for the identical composition approach.
 * - Physical dive SITES (reefs, thilas, wrecks, ...) are `locations` rows
 *   (location_type = 'dive_site') — never activities, never bookable
 *   products, per Task 8 §2/§17.
 *
 * No new tables, no duplicated query logic.
 */

// ─────────────────────────────────────────────────────────────────
// Diving activities (composes the Task 6 activity repository, identical
// shape to src/lib/fishing/repository.ts)
// ─────────────────────────────────────────────────────────────────

export type GetDivingActivitiesOptions = Omit<GetActivitiesOptions, "category">;

export async function getDivingActivities(
  options: GetDivingActivitiesOptions = {},
): Promise<ActivityPaginatedResult<ActivitySummary>> {
  return getActivities({ ...options, category: "diving" });
}

export async function getDivingActivityBySlug(slug: string): Promise<ActivityDetail | null> {
  const activity = await getActivityBySlug(slug);
  if (!activity || activity.activityCategory !== "diving") return null;
  return activity;
}

export async function getDivingActivitiesByLocation(locationId: string): Promise<ActivitySummary[]> {
  const result = await getDivingActivities({ locationId, pageSize: 100 });
  return result.items;
}

export async function getDivingActivitiesByAtoll(atollId: string): Promise<ActivitySummary[]> {
  const result = await getDivingActivities({ atollId, pageSize: 100 });
  return result.items;
}

export async function getDivingActivitiesByProvider(providerId: string): Promise<ActivitySummary[]> {
  const result = await getDivingActivities({ providerId, pageSize: 100 });
  return result.items;
}

export async function searchDivingActivities(query: string, options: { limit?: number } = {}): Promise<ActivitySummary[]> {
  const results = await searchActivities(query, options);
  return results.filter((a) => a.activityCategory === "diving");
}

/** Every "activity-type" taxonomy tag actually applied to at least one
 * diving activity — the diving-type filter chips are driven entirely by
 * what the seeded data supports, same pattern as fishing types. */
export async function getDivingTypesInUse(): Promise<CategorySummary[]> {
  const allTypes = await getCategoriesByGroup("activity-type");
  if (allTypes.length === 0) return [];

  // Only types actually tagged on a *diving* activity (an "activity-type"
  // category could in principle be reused by fishing/other verticals too).
  const diving = await getDivingActivities({ pageSize: 100 });
  const divingIds = new Set(diving.items.map((a) => a.id));

  const taggedIdSets = await Promise.all(allTypes.map((t) => getNodeIdsByCategory(t.id)));
  return allTypes.filter((_, i) => taggedIdSets[i].some((id) => divingIds.has(id)));
}

export async function getDivingActivitiesByType(
  typeSlug: string,
  options: GetDivingActivitiesOptions = {},
): Promise<ActivityPaginatedResult<ActivitySummary>> {
  const category = await getCategoryBySlug(typeSlug, "activity-type");
  if (!category) return { items: [], total: 0, page: options.page ?? 1, pageSize: options.pageSize ?? 24 };

  const nodeIds = await getNodeIdsByCategory(category.id);
  if (nodeIds.length === 0) return { items: [], total: 0, page: options.page ?? 1, pageSize: options.pageSize ?? 24 };

  return getDivingActivities({ ...options, nodeIds });
}

/** The diving-type tag(s) attached to one activity, for detail-page display. */
export async function getDivingTypesForActivity(nodeId: string): Promise<CategorySummary[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("node_categories")
    .select("category_id")
    .eq("node_id", nodeId)
    .returns<Array<{ category_id: string }>>();

  const categoryIds = (data ?? []).map((row) => row.category_id);
  if (categoryIds.length === 0) return [];

  const allTypes = await getCategoriesByGroup("activity-type");
  return allTypes.filter((t) => categoryIds.includes(t.id));
}

/** The specific dive site(s) a diving activity visits, ONLY where the
 * source data names one (node_locations secondary tag) — most diving
 * activities won't have one, and that's expected. */
export async function getDiveSitesForActivity(activityId: string): Promise<DiveSiteSummary[]> {
  const locationIds = await getLocationIdsForNode(activityId);
  if (locationIds.length === 0) return [];

  const summaries = await getLocationSummariesByIds(locationIds);
  const siteSummaries = Array.from(summaries.values()).filter((l) => l.locationType === "dive_site");
  if (siteSummaries.length === 0) return [];

  const attrsById = await getNodeAttributesByIds(siteSummaries.map((s) => s.id));
  return siteSummaries.map((s) => toDiveSiteSummary(s, attrsById.get(s.id)));
}

// ─────────────────────────────────────────────────────────────────
// Dive sites (composes the Task 4 location repository — new generic
// getLocationsByType/getLocationBySlugAndType added in this task)
// ─────────────────────────────────────────────────────────────────

function toDiveSiteSummary(location: LocationSummary, attributes: Record<string, unknown> | undefined): DiveSiteSummary {
  const siteType = typeof attributes?.site_type === "string" ? (attributes.site_type as DiveSiteType) : null;
  return {
    id: location.id,
    slug: location.slug,
    title: location.title,
    summary: location.summary,
    siteType,
  };
}

export async function getDiveSites(options: GetDiveSitesOptions = {}): Promise<PaginatedResult<DiveSiteSummary>> {
  const page = options.page ?? 1;
  const pageSize = options.pageSize ?? 48;

  let items: LocationSummary[];
  let total: number;
  if (options.atollId) {
    items = await getLocationsByTypeAndAtoll("dive_site", options.atollId);
    total = items.length;
  } else {
    const result = await getLocationsByType("dive_site", { page, pageSize });
    items = result.items;
    total = result.total;
  }

  const attrsById = await getNodeAttributesByIds(items.map((i) => i.id));
  let sites = items.map((i) => toDiveSiteSummary(i, attrsById.get(i.id)));

  if (options.siteType) {
    sites = sites.filter((s) => s.siteType === options.siteType);
    total = sites.length;
  }

  return { items: sites, total, page, pageSize };
}

export async function getDiveSitesByAtoll(atollId: string): Promise<DiveSiteSummary[]> {
  const result = await getDiveSites({ atollId, pageSize: 100 });
  return result.items;
}

/** Dive sites tagged to a location (typically an island, via a secondary
 * node_locations relation) — the reverse of getDiveSitesForActivity's
 * pattern, used for "dive sites near this island". */
export async function getDiveSitesByLocation(locationId: string): Promise<DiveSiteSummary[]> {
  const nodeIds = await getNodeIdsAtLocation(locationId);
  if (nodeIds.length === 0) return [];

  const summaries = await getLocationSummariesByIds(nodeIds);
  const siteSummaries = Array.from(summaries.values()).filter((l) => l.locationType === "dive_site");
  if (siteSummaries.length === 0) return [];

  const attrsById = await getNodeAttributesByIds(siteSummaries.map((s) => s.id));
  return siteSummaries.map((s) => toDiveSiteSummary(s, attrsById.get(s.id)));
}

export async function getDiveSiteBySlug(slug: string): Promise<DiveSiteDetail | null> {
  const location = await getLocationBySlugAndType(slug, "dive_site");
  if (!location) return null;

  const [attrs, atoll, nearbyIslandId] = await Promise.all([
    getNodeAttributesByIds([location.id]).then((m) => m.get(location.id) ?? {}),
    location.parentId ? getLocationSummaryById(location.parentId) : Promise.resolve(null),
    getLocationIdsForNode(location.id).then(async (ids) => {
      const summaries = await getLocationSummariesByIds(ids);
      return Array.from(summaries.values()).find((l) => l.locationType === "island") ?? null;
    }),
  ]);

  return {
    ...toDiveSiteSummary(location, attrs),
    atoll,
    nearbyIsland: nearbyIslandId,
    depthMinMeters: typeof attrs.depth_min_meters === "number" ? attrs.depth_min_meters : null,
    depthMaxMeters: typeof attrs.depth_max_meters === "number" ? attrs.depth_max_meters : null,
    experienceLevel: typeof attrs.experience_level === "string" ? attrs.experience_level : null,
    currentNotes: typeof attrs.current_notes === "string" ? attrs.current_notes : null,
    marineLifeNotes: typeof attrs.marine_life_notes === "string" ? attrs.marine_life_notes : null,
  };
}

/** Diving activities that visit a given dive site (node_locations tag in
 * either direction — see getDiveSitesForActivity for the activity side). */
export async function getDivingActivitiesAtSite(siteId: string): Promise<ActivitySummary[]> {
  return getDivingActivitiesByLocation(siteId);
}

export type { DiveSiteType };
