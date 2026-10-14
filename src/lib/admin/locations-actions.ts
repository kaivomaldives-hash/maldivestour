"use server";

import { revalidatePath, updateTag } from "next/cache";

import { requireStaff } from "@/lib/admin/auth";
import { updateNodeCore, type NodeCoreInput } from "@/lib/admin/node-actions";
import { publicDestinationPath } from "@/lib/locations/public-destination-path";
import { createClient } from "@/lib/supabase/server";

export interface AdminActionResult {
  ok: boolean;
  error?: string;
}

export interface LocationFieldsInput {
  lat: number | null;
  lng: number | null;
  isInhabited: boolean | null;
  administrativeCode: string | null;
}

/**
 * Deliberately does NOT accept `locationType` or `parentId` — reassigning
 * either is validated by `enforce_location_hierarchy()` (parent/child type
 * rules, cycle detection) and cascades an ltree `path` recompute across
 * every descendant. Exposing that safely in a form is real work belonging
 * to its own round, not something to bolt on here; editing it stays a
 * migration-script operation for now, same as it already was.
 */
export async function updateLocation(id: string, core: NodeCoreInput, fields: LocationFieldsInput): Promise<AdminActionResult> {
  await requireStaff();

  const coreResult = await updateNodeCore(id, core);
  if (!coreResult.ok) return coreResult;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("locations")
    .update({
      lat: fields.lat,
      lng: fields.lng,
      is_inhabited: fields.isInhabited,
      administrative_code: fields.administrativeCode?.trim() || null,
    } as unknown as never)
    .eq("id", id)
    .select("location_type")
    .maybeSingle<{ location_type: string }>();
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/locations");
  revalidatePath(`/admin/locations/${id}`);
  revalidatePath("/admin");

  // Public pages read locations through cachedRead() (src/lib/cache/
  // cached-read.ts), a time-based Data Cache the revalidatePath() calls
  // above never reach (they only cover /admin/* routes) — without this,
  // an edit here (e.g. a corrected lat/lng) silently keeps serving the
  // old value on the public site for up to 15 minutes. "locations" is the
  // shared tag every locations-repository cachedRead() call carries.
  // updateTag() (not revalidateTag()) gives immediate expiration from a
  // Server Action — see https://nextjs.org/docs/app/api-reference/functions/updateTag.
  updateTag("locations");
  const publicPath = publicDestinationPath(data?.location_type, core.slug);
  if (publicPath) revalidatePath(publicPath);

  return { ok: true };
}
