"use server";

import { revalidatePath } from "next/cache";

import { requireStaff } from "@/lib/admin/auth";
import type { AdminActionResult } from "@/lib/admin/node-actions";
import type { LocationOption } from "@/lib/admin/node-relations-repository";
import { searchLocations } from "@/lib/locations/repository";
import { createClient } from "@/lib/supabase/server";

/** Interactive search-as-you-type for the location picker — a Server
 * Action (not node-relations-repository.ts's plain server-only reads)
 * because it's invoked directly from a client component on keystroke. */
export async function searchLocationOptions(query: string): Promise<LocationOption[]> {
  await requireStaff();
  const results = await searchLocations(query, { limit: 15 });
  return results.map((r) => ({ id: r.id, title: r.title, locationType: r.locationType }));
}

/** Replaces this node's primary location (at most one is allowed — see
 * node_locations_one_primary_per_node). Pass locationId=null to clear it. */
export async function setPrimaryLocation(nodeId: string, locationId: string | null, revalidateAt: string): Promise<AdminActionResult> {
  await requireStaff();
  const supabase = await createClient();

  const { error: clearError } = await supabase.from("node_locations").delete().eq("node_id", nodeId).eq("relation", "primary");
  if (clearError) return { ok: false, error: clearError.message };

  if (locationId) {
    const { error: insertError } = await supabase
      .from("node_locations")
      .insert({ node_id: nodeId, location_id: locationId, relation: "primary" } as unknown as never);
    if (insertError) return { ok: false, error: insertError.message };
  }

  revalidatePath(revalidateAt);
  return { ok: true };
}

/** Replaces the full set of locations a node is tagged to — unlike
 * setPrimaryLocation (at most one row), this is the multi-destination
 * picker's save: the first id in `locationIds` becomes the 'primary' row
 * (every other reader in this codebase — SEO, breadcrumbs, the card's
 * single-location fallback — still resolves exactly one primary location,
 * unchanged), every remaining id becomes a 'secondary' row. Delete-then-
 * insert, same pattern as setPrimaryLocation/setNodeCategories. Passing an
 * empty array clears every location this node had. */
export async function setNodeLocations(nodeId: string, locationIds: string[], revalidateAt: string): Promise<AdminActionResult> {
  await requireStaff();
  const supabase = await createClient();

  const { error: clearError } = await supabase.from("node_locations").delete().eq("node_id", nodeId);
  if (clearError) return { ok: false, error: clearError.message };

  if (locationIds.length > 0) {
    const rows = locationIds.map((locationId, index) => ({
      node_id: nodeId,
      location_id: locationId,
      relation: index === 0 ? "primary" : "secondary",
    }));
    const { error: insertError } = await supabase.from("node_locations").insert(rows as unknown as never[]);
    if (insertError) return { ok: false, error: insertError.message };
  }

  revalidatePath(revalidateAt);
  return { ok: true };
}

/** Replaces the full set of category tags for a node within one taxonomy
 * group at a time (delete-then-insert, same pattern as setPrimaryLocation
 * — a node can belong to categories from several different groups
 * simultaneously, e.g. a package's package-style AND traveler-type tags,
 * so this only ever touches the categories belonging to `categoryIds`'
 * own group, never wiping tags from other groups). */
export async function setNodeCategories(nodeId: string, categoryIds: string[], revalidateAt: string): Promise<AdminActionResult> {
  await requireStaff();
  const supabase = await createClient();

  if (categoryIds.length === 0) {
    // Nothing to set this time -- caller is responsible for passing the
    // exact set for one group; an empty array here is a no-op, not "clear
    // everything", since we don't know which group to scope the clear to.
    return { ok: true };
  }

  const { data: groupRows } = await supabase.from("categories").select("id, category_group").in("id", categoryIds).returns<Array<{ id: string; category_group: string }>>();
  const group = groupRows?.[0]?.category_group;
  if (!group) return { ok: false, error: "Could not resolve the category group." };

  const { data: allInGroup } = await supabase.from("categories").select("id").eq("category_group", group).returns<Array<{ id: string }>>();
  const groupCategoryIds = (allInGroup ?? []).map((c) => c.id);

  const { error: clearError } = await supabase.from("node_categories").delete().eq("node_id", nodeId).in("category_id", groupCategoryIds);
  if (clearError) return { ok: false, error: clearError.message };

  const { error: insertError } = await supabase
    .from("node_categories")
    .insert(categoryIds.map((categoryId) => ({ node_id: nodeId, category_id: categoryId })) as unknown as never[]);
  if (insertError) return { ok: false, error: insertError.message };

  revalidatePath(revalidateAt);
  return { ok: true };
}
