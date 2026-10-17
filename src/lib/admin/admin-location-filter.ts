import "server-only";

import { createClient } from "@/lib/supabase/server";

/**
 * Admin-scoped "every node tagged (via node_locations) with this atoll or
 * any of its islands" resolver — the same two-step atoll-then-islands
 * lookup every public repository already does (see e.g.
 * src/lib/accommodations/repository.ts's getAccommodationsUncached),
 * just against the staff Supabase client so draft/archived content is
 * included too. Shared by the packages/activities/accommodations admin
 * list filters so the atoll-resolution logic exists exactly once.
 */
export async function getAdminNodeIdsAtAtoll(atollId: string): Promise<string[]> {
  const supabase = await createClient();
  const { data: islands } = await supabase.from("locations").select("id").eq("parent_id", atollId).returns<Array<{ id: string }>>();
  const locationIds = [atollId, ...(islands ?? []).map((i) => i.id)];

  const { data } = await supabase.from("node_locations").select("node_id").in("location_id", locationIds).returns<Array<{ node_id: string }>>();
  return Array.from(new Set((data ?? []).map((row) => row.node_id)));
}
