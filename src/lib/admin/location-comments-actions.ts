"use server";

import { revalidatePath, updateTag } from "next/cache";

import { requireStaff } from "@/lib/admin/auth";
import { LOCATION_COMMENT_STATUSES, type LocationCommentStatus } from "@/lib/admin/location-comments-repository";
import { publicDestinationPath } from "@/lib/locations/public-destination-path";
import { createClient } from "@/lib/supabase/server";

export interface AdminActionResult {
  ok: boolean;
  error?: string;
}

export async function updateLocationCommentStatus(id: string, status: string): Promise<AdminActionResult> {
  await requireStaff();
  if (!(LOCATION_COMMENT_STATUSES as readonly string[]).includes(status)) return { ok: false, error: "Invalid status." };

  const supabase = await createClient();
  const { data: comment, error } = await supabase
    .from("location_comments")
    .update({ status: status as LocationCommentStatus } as unknown as never)
    .eq("id", id)
    .select("location_id")
    .maybeSingle<{ location_id: string }>();
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/location-comments");
  revalidatePath("/admin");

  // getPublishedLocationComments() is a cachedRead() -- the
  // revalidatePath() calls above (scoped to /admin/*) never reach it, so
  // without this an approve/reject here silently doesn't show up on the
  // public destination page for up to 5 minutes. Same gap and same fix
  // shape as updateLocation()'s lat/lng caching bug
  // (src/lib/admin/locations-actions.ts).
  updateTag("location-comments");
  if (comment) {
    const { data: node } = await supabase
      .from("nodes")
      .select("slug, locations!locations_id_fkey!inner(location_type)")
      .eq("id", comment.location_id)
      .maybeSingle<{ slug: string; locations: { location_type: string } }>();
    const publicPath = node ? publicDestinationPath(node.locations?.location_type, node.slug) : null;
    if (publicPath) revalidatePath(publicPath);
  }

  return { ok: true };
}
