"use server";

import { updateTag } from "next/cache";
import { revalidatePath } from "next/cache";

import { requireStaff } from "@/lib/admin/auth";
import type { AdminActionResult } from "@/lib/admin/node-actions";
import { createClient } from "@/lib/supabase/server";

type NodeMediaRow = { media_id: string; role: "hero" | "gallery" | "thumbnail"; sort_order: number | null };

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
 * Copies one route's hero/gallery images (as node_media rows pointing at
 * the SAME already-uploaded media_assets — no file re-upload, no
 * duplication) onto every OTHER transfer route that currently has zero
 * images. Built because this sandbox has no network path to Supabase
 * Storage, so a real file upload has to happen once, by staff, through
 * the live admin UI — this just removes the need to repeat that upload
 * one-by-one across every route still missing a photo.
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

  const { data: allRoutes, error: routesError } = await supabase.from("nodes").select("id").eq("node_type", "transfer_route").returns<Array<{ id: string }>>();
  if (routesError) return { ok: false, error: routesError.message };
  if (!allRoutes || allRoutes.length === 0) return { ok: true, appliedCount: 0 };

  const { data: existingMedia, error: existingError } = await supabase
    .from("node_media")
    .select("node_id")
    .in("node_id", allRoutes.map((r) => r.id))
    .returns<Array<{ node_id: string }>>();
  if (existingError) return { ok: false, error: existingError.message };
  const hasMediaAlready = new Set((existingMedia ?? []).map((m) => m.node_id));

  const targetNodeIds = allRoutes.map((r) => r.id).filter((id) => id !== sourceNodeId && !hasMediaAlready.has(id));
  if (targetNodeIds.length === 0) return { ok: true, appliedCount: 0 };

  const rows = targetNodeIds.flatMap((nodeId) =>
    sourceMedia.map((m) => ({ node_id: nodeId, media_id: m.media_id, role: m.role, sort_order: m.sort_order })),
  );

  const { error: insertError } = await supabase.from("node_media").insert(rows as unknown as never);
  if (insertError) return { ok: false, error: insertError.message };

  updateTag("transfers:routes-list");
  updateTag("transfers:route-by-slug");
  updateTag("transfers:routes-by-ids");
  revalidatePath("/admin/transfers");
  revalidatePath("/maldives/transfers");

  return { ok: true, appliedCount: targetNodeIds.length };
}
