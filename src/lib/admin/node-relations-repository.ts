import "server-only";

import { requireStaff } from "@/lib/admin/auth";
import type { CategoryGroup } from "@/lib/categories/types";
import { createClient } from "@/lib/supabase/server";

/**
 * Admin reads for the node_locations/node_categories junction tables —
 * called at page-render time to prefill create/edit forms (interactive
 * search-as-you-type lives in node-relations-actions.ts instead, since
 * that needs to be callable from a client component).
 */

export interface LocationOption {
  id: string;
  title: string;
  locationType: string;
}

/** Two separate queries rather than a nested embed — this codebase has
 * an explicit, hard-won rule against embedding across nodes/locations
 * (see NODE_LOCATION_SELECT's own comment in src/lib/locations/
 * repository.ts on the PGRST201 relationship-ambiguity trap); simple
 * batched lookups sidestep it entirely and match every other
 * cross-table resolution in this codebase (e.g. bookings-repository.ts). */
export async function getPrimaryLocationForNode(nodeId: string): Promise<LocationOption | null> {
  await requireStaff();
  const supabase = await createClient();

  const { data: rel } = await supabase
    .from("node_locations")
    .select("location_id")
    .eq("node_id", nodeId)
    .eq("relation", "primary")
    .maybeSingle<{ location_id: string }>();
  if (!rel) return null;

  const [{ data: loc }, { data: node }] = await Promise.all([
    supabase.from("locations").select("location_type").eq("id", rel.location_id).maybeSingle<{ location_type: string }>(),
    supabase.from("nodes").select("title").eq("id", rel.location_id).maybeSingle<{ title: string }>(),
  ]);
  if (!loc || !node) return null;

  return { id: rel.location_id, title: node.title, locationType: loc.location_type };
}

/** Every location this node is tagged to (any relation), primary first —
 * the multi-select admin form's prefill, counterpart to
 * getPrimaryLocationForNode above. Same two-separate-queries shape, just
 * batched over however many node_locations rows this node has instead of
 * assuming at most one. */
export async function getAllLocationsForNode(nodeId: string): Promise<LocationOption[]> {
  await requireStaff();
  const supabase = await createClient();

  const { data: rels } = await supabase
    .from("node_locations")
    .select("location_id, relation")
    .eq("node_id", nodeId)
    .returns<Array<{ location_id: string; relation: string }>>();
  if (!rels || rels.length === 0) return [];

  const locationIds = rels.map((r) => r.location_id);
  const [{ data: locs }, { data: nodeRows }] = await Promise.all([
    supabase.from("locations").select("id, location_type").in("id", locationIds).returns<Array<{ id: string; location_type: string }>>(),
    supabase.from("nodes").select("id, title").in("id", locationIds).returns<Array<{ id: string; title: string }>>(),
  ]);
  const typeById = new Map((locs ?? []).map((l) => [l.id, l.location_type]));
  const titleById = new Map((nodeRows ?? []).map((n) => [n.id, n.title]));

  const sorted = [...rels].sort((a, b) => (a.relation === "primary" ? -1 : b.relation === "primary" ? 1 : 0));
  return sorted
    .map((r) => {
      const locationType = typeById.get(r.location_id);
      const title = titleById.get(r.location_id);
      return locationType && title ? { id: r.location_id, title, locationType } : null;
    })
    .filter((o): o is LocationOption => o !== null);
}

/** Batch lookup for specific location ids — used by the transfer route
 * form, which needs two independent locations (origin/destination) rather
 * than the single "primary location" every other content type has. Same
 * two-separate-queries shape as getPrimaryLocationForNode above. */
export async function getLocationOptionsByIds(ids: string[]): Promise<Map<string, LocationOption>> {
  await requireStaff();
  const map = new Map<string, LocationOption>();
  const uniqueIds = Array.from(new Set(ids));
  if (uniqueIds.length === 0) return map;

  const supabase = await createClient();
  const [{ data: locs }, { data: nodeRows }] = await Promise.all([
    supabase.from("locations").select("id, location_type").in("id", uniqueIds).returns<Array<{ id: string; location_type: string }>>(),
    supabase.from("nodes").select("id, title").in("id", uniqueIds).returns<Array<{ id: string; title: string }>>(),
  ]);
  const typeById = new Map((locs ?? []).map((l) => [l.id, l.location_type]));
  const titleById = new Map((nodeRows ?? []).map((n) => [n.id, n.title]));

  for (const id of uniqueIds) {
    const locationType = typeById.get(id);
    const title = titleById.get(id);
    if (locationType && title) map.set(id, { id, title, locationType });
  }
  return map;
}

export interface CategoryOption {
  id: string;
  title: string;
  slug: string;
}

/** Every category in one taxonomy group, for a checkbox picker — e.g. all
 * 'package-style' categories when editing a package. Same separate-
 * queries approach as getPrimaryLocationForNode above. */
export async function getCategoryOptionsByGroup(group: CategoryGroup): Promise<CategoryOption[]> {
  await requireStaff();
  const supabase = await createClient();

  const { data: cats, error } = await supabase
    .from("categories")
    .select("id, slug")
    .eq("category_group", group)
    .returns<Array<{ id: string; slug: string }>>();
  if (error || !cats || cats.length === 0) return [];

  const { data: nodes } = await supabase.from("nodes").select("id, title").in("id", cats.map((c) => c.id)).returns<Array<{ id: string; title: string }>>();
  const titleById = new Map((nodes ?? []).map((n) => [n.id, n.title]));

  return cats
    .map((c) => ({ id: c.id, slug: c.slug, title: titleById.get(c.id) ?? c.slug }))
    .sort((a, b) => a.title.localeCompare(b.title));
}

export async function getCategoryIdsForNode(nodeId: string): Promise<string[]> {
  await requireStaff();
  const supabase = await createClient();
  const { data, error } = await supabase.from("node_categories").select("category_id").eq("node_id", nodeId).returns<Array<{ category_id: string }>>();
  if (error || !data) return [];
  return data.map((row) => row.category_id);
}
