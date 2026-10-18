"use server";

import { updateTag } from "next/cache";
import { revalidatePath } from "next/cache";

import { requireStaff } from "@/lib/admin/auth";
import type { AdminActionResult } from "@/lib/admin/node-actions";
import { createClient } from "@/lib/supabase/server";

type NodeMediaRow = { media_id: string; role: "hero" | "gallery" | "thumbnail"; sort_order: number | null };
type MediaAssetRow = { id: string; media_type: string; storage_path: string | null; width: number | null; height: number | null; credit: string | null };

/** "Velana International Airport to JW Marriott Maldives Resort & Spa" ->
 * "JW Marriott Maldives Resort & Spa" — every transfer route in this
 * dataset follows that exact title pattern (see the seed migrations), so
 * stripping it gives a clean destination name for a route-specific image
 * title/alt text instead of reusing the source route's own. Falls back to
 * the full title for the rare route that doesn't match. */
function destinationLabelFromRouteTitle(title: string): string {
  const prefix = "Velana International Airport to ";
  return title.startsWith(prefix) ? title.slice(prefix.length) : title;
}

/** Transfer routes that currently have at least one attached image — valid
 * "source" choices for bulkApplyRouteMediaToRoutesWithoutImages below. */
export async function getTransferRoutesWithMedia(): Promise<Array<{ id: string; title: string }>> {
  await requireStaff();
  const supabase = await createClient();

  const { data: routes } = await supabase.from("nodes").select("id, title").eq("node_type", "transfer_route").returns<Array<{ id: string; title: string }>>();
  if (!routes || routes.length === 0) return [];

  const { data: media } = await supabase
    .from("node_media")
    .select("node_id")
    .in("node_id", routes.map((r) => r.id))
    .returns<Array<{ node_id: string }>>();
  const withMedia = new Set((media ?? []).map((m) => m.node_id));

  return routes.filter((r) => withMedia.has(r.id)).sort((a, b) => a.title.localeCompare(b.title));
}

/**
 * Copies one route's hero/gallery photos onto every OTHER transfer route
 * that currently has zero images — same physical files (storage_path is
 * reused, nothing re-uploaded), but each target route gets its OWN new
 * media_assets rows with a title/alt text naming ITS destination, not the
 * source route's. Reusing the exact same alt text ("JW Marriott...") on
 * Club Med Kani's page would be wrong for accessibility and confusing for
 * SEO, so every target gets a fresh row instead of sharing the source's.
 *
 * Built because this sandbox has no network path to Supabase Storage, so
 * a real file upload has to happen once, by staff, through the live admin
 * UI — this just removes the need to repeat that upload one-by-one
 * across every route still missing a photo.
 */
export async function bulkApplyRouteMediaToRoutesWithoutImages(sourceNodeId: string): Promise<AdminActionResult & { appliedCount?: number }> {
  await requireStaff();
  if (!sourceNodeId) return { ok: false, error: "Choose a route to copy images from." };

  const supabase = await createClient();

  const { data: sourceMedia, error: sourceError } = await supabase
    .from("node_media")
    .select("media_id, role, sort_order")
    .eq("node_id", sourceNodeId)
    .returns<NodeMediaRow[]>();
  if (sourceError) return { ok: false, error: sourceError.message };
  if (!sourceMedia || sourceMedia.length === 0) return { ok: false, error: "That route has no images to copy." };

  const { data: sourceAssets, error: assetsError } = await supabase
    .from("media_assets")
    .select("id, media_type, storage_path, width, height, credit")
    .in("id", sourceMedia.map((m) => m.media_id))
    .returns<MediaAssetRow[]>();
  if (assetsError) return { ok: false, error: assetsError.message };
  const assetsById = new Map((sourceAssets ?? []).map((a) => [a.id, a]));

  const { data: allRoutes, error: routesError } = await supabase.from("nodes").select("id, title").eq("node_type", "transfer_route").returns<Array<{ id: string; title: string }>>();
  if (routesError) return { ok: false, error: routesError.message };
  if (!allRoutes || allRoutes.length === 0) return { ok: true, appliedCount: 0 };

  const { data: existingMedia, error: existingError } = await supabase
    .from("node_media")
    .select("node_id")
    .in("node_id", allRoutes.map((r) => r.id))
    .returns<Array<{ node_id: string }>>();
  if (existingError) return { ok: false, error: existingError.message };
  const hasMediaAlready = new Set((existingMedia ?? []).map((m) => m.node_id));

  const targets = allRoutes.filter((r) => r.id !== sourceNodeId && !hasMediaAlready.has(r.id));
  if (targets.length === 0) return { ok: true, appliedCount: 0 };

  // One media_assets insert per (target route x source photo), each
  // carrying that route's own destination name in its title/alt text —
  // then zip the returned ids back up with role/sort_order/node_id to
  // build the node_media rows.
  const assetInserts: Array<{ media_type: string; storage_path: string | null; width: number | null; height: number | null; credit: string | null; title: string; alt_text: string }> = [];
  const assetTargets: Array<{ nodeId: string; role: string; sortOrder: number | null }> = [];
  for (const target of targets) {
    const destination = destinationLabelFromRouteTitle(target.title);
    for (const m of sourceMedia) {
      const asset = assetsById.get(m.media_id);
      if (!asset) continue;
      assetInserts.push({
        media_type: asset.media_type,
        storage_path: asset.storage_path,
        width: asset.width,
        height: asset.height,
        credit: asset.credit,
        title: destination,
        alt_text: `Speedboat transfer to ${destination}`,
      });
      assetTargets.push({ nodeId: target.id, role: m.role, sortOrder: m.sort_order });
    }
  }
  if (assetInserts.length === 0) return { ok: true, appliedCount: 0 };

  const { data: insertedAssets, error: insertAssetsError } = await supabase.from("media_assets").insert(assetInserts as unknown as never).select("id").returns<Array<{ id: string }>>();
  if (insertAssetsError) return { ok: false, error: insertAssetsError.message };
  if (!insertedAssets || insertedAssets.length !== assetTargets.length) return { ok: false, error: "Unexpected result while creating images." };

  const nodeMediaRows = insertedAssets.map((a, i) => ({
    node_id: assetTargets[i].nodeId,
    media_id: a.id,
    role: assetTargets[i].role,
    sort_order: assetTargets[i].sortOrder,
  }));

  const { error: insertError } = await supabase.from("node_media").insert(nodeMediaRows as unknown as never);
  if (insertError) return { ok: false, error: insertError.message };

  updateTag("transfers:routes-list");
  updateTag("transfers:route-by-slug");
  updateTag("transfers:routes-by-ids");
  revalidatePath("/admin/transfers");
  revalidatePath("/maldives/transfers");

  return { ok: true, appliedCount: targets.length };
}
