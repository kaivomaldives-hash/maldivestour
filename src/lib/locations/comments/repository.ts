import "server-only";

import { cachedRead } from "@/lib/cache/cached-read";
import type { LocationComment } from "@/lib/locations/comments/types";
import { createClient } from "@/lib/supabase/public";

type LocationCommentRow = {
  id: string;
  body: string;
  guest_name: string | null;
  created_at: string;
};

/** Only status='published' rows — a submitted comment sits at 'pending'
 * until an admin approves it, mirroring src/lib/reviews/repository.ts. */
async function getPublishedLocationCommentsUncached(locationId: string): Promise<LocationComment[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("location_comments")
    .select("id, body, guest_name, created_at")
    .eq("location_id", locationId)
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .returns<LocationCommentRow[]>();

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    body: row.body,
    authorName: row.guest_name ?? "Verified traveller",
    createdAt: row.created_at,
  }));
}

export const getPublishedLocationComments = cachedRead(getPublishedLocationCommentsUncached, ["location-comments-for-location"]);
