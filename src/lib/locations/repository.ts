import "server-only";

import { createClient } from "@/lib/supabase/server";
import type {
  AtollDetail,
  AtollSummary,
  IslandDetail,
  IslandSummary,
  LocationDetail,
  LocationSummary,
  LocationType,
  PaginatedResult,
} from "@/lib/locations/types";

/**
 * Server-side location data-access layer. Pages/components should call
 * these functions instead of querying Supabase directly — this is the only
 * place that knows the `nodes` + `locations` table shapes and how they
 * embed via PostgREST.
 *
 * Every function here only returns published locations: these are public
 * read paths with no user context, matching the `nodes_public_read` /
 * `locations_public_read` RLS policies (status = 'published').
 */

// `locations!inner(...)` — not a plain `locations(...)` embed. Every query
// below filters on an embedded `locations` column (location_type or
// parent_id). Without `!inner`, PostgREST only filters which embedded rows
// are attached to a match, not which parent `nodes` rows are returned at
// all — the filter would silently do nothing at the top level and every
// location node (islands, atolls, sites, ...) would come back regardless
// of the intended location_type/parent_id filter. `!inner` makes it a real
// join-level filter that actually restricts the result set.
const NODE_LOCATION_SELECT =
  "id, slug, title, summary, meta_title, meta_description, locations!inner(location_type, parent_id, lat, lng, is_inhabited, administrative_code, path)";

type NodeLocationRow = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  meta_title: string | null;
  meta_description: string | null;
  // PostgREST returns a one-to-one embed as an object, but is defensive-
  // coded here as possibly-an-array since this couldn't be verified
  // end-to-end against a live PostgREST instance in this environment
  // (see the Task 4 report).
  locations:
    | {
        location_type: LocationType;
        parent_id: string | null;
        lat: number | null;
        lng: number | null;
        is_inhabited: boolean | null;
        administrative_code: string | null;
        path: string;
      }
    | Array<{
        location_type: LocationType;
        parent_id: string | null;
        lat: number | null;
        lng: number | null;
        is_inhabited: boolean | null;
        administrative_code: string | null;
        path: string;
      }>
    | null;
};

function locationDetailOf(row: NodeLocationRow): LocationDetail | null {
  const loc = Array.isArray(row.locations) ? row.locations[0] : row.locations;
  if (!loc) return null;

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    locationType: loc.location_type,
    parentId: loc.parent_id,
    isInhabited: loc.is_inhabited,
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
    lat: loc.lat,
    lng: loc.lng,
    administrativeCode: loc.administrative_code,
    path: loc.path,
  };
}

function locationSummaryOf(row: NodeLocationRow): LocationSummary | null {
  const detail = locationDetailOf(row);
  if (!detail) return null;
  const { id, slug, title, summary, locationType, parentId, isInhabited } = detail;
  return { id, slug, title, summary, locationType, parentId, isInhabited };
}

/** The single `location_type = 'country'` node (Maldives). */
export async function getCountry(): Promise<LocationDetail | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("nodes")
    .select(NODE_LOCATION_SELECT)
    .eq("node_type", "location")
    .eq("status", "published")
    .eq("locations.location_type", "country")
    .limit(1)
    .maybeSingle<NodeLocationRow>();

  if (error || !data) return null;
  return locationDetailOf(data);
}

/** Every published atoll, with its inhabited-island count, ordered by name. */
export async function getAtolls(): Promise<AtollSummary[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("nodes")
    .select(NODE_LOCATION_SELECT)
    .eq("node_type", "location")
    .eq("status", "published")
    .eq("locations.location_type", "atoll")
    .order("title", { ascending: true })
    .returns<NodeLocationRow[]>();

  if (error || !data) return [];

  const atollIds = data.map((row) => row.id).filter(Boolean);
  const counts = await getIslandCountsByAtoll(atollIds);

  return data
    .map((row) => {
      const summary = locationSummaryOf(row);
      if (!summary || summary.locationType !== "atoll") return null;
      return { ...summary, locationType: "atoll" as const, islandCount: counts.get(summary.id) ?? 0 };
    })
    .filter((a): a is AtollSummary => a !== null);
}

/**
 * Island counts per atoll in a single grouped query, so the atoll
 * directory never runs one count query per atoll (no N+1).
 */
async function getIslandCountsByAtoll(atollIds: string[]): Promise<Map<string, number>> {
  const counts = new Map<string, number>();
  if (atollIds.length === 0) return counts;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("locations")
    .select("parent_id")
    .eq("location_type", "island")
    .in("parent_id", atollIds)
    .returns<Array<{ parent_id: string | null }>>();

  if (error || !data) return counts;

  for (const row of data) {
    if (!row.parent_id) continue;
    counts.set(row.parent_id, (counts.get(row.parent_id) ?? 0) + 1);
  }
  return counts;
}

export async function getAtollBySlug(slug: string): Promise<AtollDetail | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("nodes")
    .select(NODE_LOCATION_SELECT)
    .eq("node_type", "location")
    .eq("status", "published")
    .eq("slug", slug)
    .eq("locations.location_type", "atoll")
    .maybeSingle<NodeLocationRow>();

  if (error || !data) return null;
  const detail = locationDetailOf(data);
  if (!detail || detail.locationType !== "atoll") return null;
  return { ...detail, locationType: "atoll" };
}

export interface GetIslandsOptions {
  page?: number;
  pageSize?: number;
}

/** All published islands, paginated (the Maldives has ~190+ inhabited islands). */
export async function getIslands(options: GetIslandsOptions = {}): Promise<PaginatedResult<IslandSummary>> {
  const page = Math.max(1, options.page ?? 1);
  const pageSize = Math.min(100, Math.max(1, options.pageSize ?? 48));
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const supabase = await createClient();
  const { data, error, count } = await supabase
    .from("nodes")
    .select(NODE_LOCATION_SELECT, { count: "exact" })
    .eq("node_type", "location")
    .eq("status", "published")
    .eq("locations.location_type", "island")
    .order("title", { ascending: true })
    .range(from, to)
    .returns<NodeLocationRow[]>();

  if (error || !data) {
    return { items: [], total: 0, page, pageSize };
  }

  const items = data
    .map((row) => {
      const summary = locationSummaryOf(row);
      if (!summary || summary.locationType !== "island") return null;
      return { ...summary, locationType: "island" as const, atollId: summary.parentId };
    })
    .filter((i): i is IslandSummary => i !== null);

  return { items, total: count ?? items.length, page, pageSize };
}

/** All islands belonging to one atoll — a single query, not one per island. */
export async function getIslandsByAtoll(atollSlug: string): Promise<IslandSummary[]> {
  const atoll = await getAtollBySlug(atollSlug);
  if (!atoll) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("nodes")
    .select(NODE_LOCATION_SELECT)
    .eq("node_type", "location")
    .eq("status", "published")
    .eq("locations.location_type", "island")
    .eq("locations.parent_id", atoll.id)
    .order("title", { ascending: true })
    .returns<NodeLocationRow[]>();

  if (error || !data) return [];

  return data
    .map((row) => {
      const summary = locationSummaryOf(row);
      if (!summary || summary.locationType !== "island") return null;
      return { ...summary, locationType: "island" as const, atollId: summary.parentId };
    })
    .filter((i): i is IslandSummary => i !== null);
}

export async function getIslandBySlug(slug: string): Promise<IslandDetail | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("nodes")
    .select(NODE_LOCATION_SELECT)
    .eq("node_type", "location")
    .eq("status", "published")
    .eq("slug", slug)
    .eq("locations.location_type", "island")
    .maybeSingle<NodeLocationRow>();

  if (error || !data) return null;
  const detail = locationDetailOf(data);
  if (!detail || detail.locationType !== "island") return null;
  return { ...detail, locationType: "island" };
}

/** Any locations parented under `locationId` (localities, sites, etc.). */
export async function getChildLocations(locationId: string): Promise<LocationSummary[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("nodes")
    .select(NODE_LOCATION_SELECT)
    .eq("node_type", "location")
    .eq("status", "published")
    .eq("locations.parent_id", locationId)
    .order("title", { ascending: true })
    .returns<NodeLocationRow[]>();

  if (error || !data) return [];

  return data.map(locationSummaryOf).filter((l): l is LocationSummary => l !== null);
}

export interface SearchLocationsOptions {
  locationType?: LocationType;
  limit?: number;
}

/** Basic name search — a starting point for a future autocomplete/filter UI. */
export async function searchLocations(
  query: string,
  options: SearchLocationsOptions = {},
): Promise<LocationSummary[]> {
  const trimmed = query.trim();
  if (trimmed.length === 0) return [];

  const supabase = await createClient();
  let builder = supabase
    .from("nodes")
    .select(NODE_LOCATION_SELECT)
    .eq("node_type", "location")
    .eq("status", "published")
    .ilike("title", `%${trimmed}%`)
    .order("title", { ascending: true })
    .limit(options.limit ?? 20);

  if (options.locationType) {
    builder = builder.eq("locations.location_type", options.locationType);
  }

  const { data, error } = await builder.returns<NodeLocationRow[]>();
  if (error || !data) return [];

  return data.map(locationSummaryOf).filter((l): l is LocationSummary => l !== null);
}

/**
 * Batch lookup by id, added for Task 5: the accommodation repository needs
 * to resolve a set of primary-location ids (islands, resort islands, ...)
 * without one query per accommodation. Kept here rather than duplicated in
 * the accommodation repository, since this module already owns the
 * nodes+locations join shape.
 */
export async function getLocationSummariesByIds(ids: string[]): Promise<Map<string, LocationSummary>> {
  const map = new Map<string, LocationSummary>();
  if (ids.length === 0) return map;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("nodes")
    .select(NODE_LOCATION_SELECT)
    .eq("node_type", "location")
    .eq("status", "published")
    .in("id", ids)
    .returns<NodeLocationRow[]>();

  if (error || !data) return map;

  for (const row of data) {
    const summary = locationSummaryOf(row);
    if (summary) map.set(summary.id, summary);
  }
  return map;
}

export async function getLocationSummaryById(id: string): Promise<LocationSummary | null> {
  const map = await getLocationSummariesByIds([id]);
  return map.get(id) ?? null;
}
