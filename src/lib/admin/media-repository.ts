import "server-only";

import { requireStaff } from "@/lib/admin/auth";
import { getMediaAssetsByIds } from "@/lib/media/repository";
import type { MediaRole, NodeMediaItem } from "@/lib/media/types";
import { createClient } from "@/lib/supabase/server";

/**
 * Admin read of a node's attached media, regardless of the node's publish
 * status. Deliberately separate from src/lib/media/repository.ts's
 * getMediaForNode(), which uses the stateless public client and is
 * subject to node_media_public_read's `n.status = 'published'` gate — a
 * draft node's images must still be visible/editable in the admin. Uses
 * the cookie-bound staff-session client so node_media_staff_all covers
 * every status. media_assets itself has no publish gate (public read,
 * staff write), so getMediaAssetsByIds is safe to reuse as-is.
 */
export async function getNodeMediaAdmin(nodeId: string): Promise<NodeMediaItem[]> {
  await requireStaff();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("node_media")
    .select("media_id, role, sort_order")
    .eq("node_id", nodeId)
    .order("role", { ascending: true })
    .order("sort_order", { ascending: true })
    .returns<Array<{ media_id: string; role: MediaRole; sort_order: number }>>();

  if (error || !data || data.length === 0) return [];

  const assetsById = await getMediaAssetsByIds(data.map((row) => row.media_id));
  return data
    .map((row): NodeMediaItem | null => {
      const asset = assetsById.get(row.media_id);
      return asset ? { role: row.role, sortOrder: row.sort_order, asset } : null;
    })
    .filter((item): item is NodeMediaItem => item !== null);
}
