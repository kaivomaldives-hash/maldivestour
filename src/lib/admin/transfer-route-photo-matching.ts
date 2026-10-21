"use server";

import { revalidatePath, updateTag } from "next/cache";

import { requireStaff } from "@/lib/admin/auth";
import { compressImage } from "@/lib/media/compress-image";
import type { RouteMatchCandidate } from "@/lib/transfers/photo-filename-matching";
import { createClient } from "@/lib/supabase/server";

/**
 * Backs the bulk route-photo uploader (Task: "250 images named after
 * their route, don't make me do this one-by-one in the admin UI"). This
 * replaces the old bulkApplyRouteMediaToRoutesWithoutImages() approach
 * (copying ONE route's photo onto every other empty route, same
 * storage_path reused) — that tool was a sandbox-era stopgap for not
 * being able to actually upload real files, and it's exactly what caused
 * the "Club Med Kani shows a JW Marriott photo" bug fixed in
 * 20261112000100_fix_borrowed_transfer_route_photos.sql. With real,
 * per-route files now available, every route gets its OWN uploaded
 * photo, matched by filename, never someone else's.
 *
 * Each file is its own request (uploadMatchedRoutePhoto), sequenced from
 * the client with a small concurrency limit — never all 250 files in one
 * request. A single multi-hundred-MB request would blow well past this
 * project's 10MB Server Action body limit (next.config.ts); one file at a
 * time keeps each request far under that limit and under any serverless
 * execution-time limit too.
 */

const MAX_FILE_BYTES = 8 * 1024 * 1024;
const ALLOWED_CONTENT_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

type NodeTransferRouteRow = {
  id: string;
  slug: string;
  title: string;
  transfer_routes: { destination_location_id: string } | { destination_location_id: string }[] | null;
};

/** Every transfer route, unpaginated — a few hundred rows, small enough
 * to hold in memory and match client-side against up to ~250 selected
 * filenames in one pass, with no per-file round trip needed just to find
 * the right route. */
export async function getTransferRoutesForPhotoMatching(): Promise<RouteMatchCandidate[]> {
  await requireStaff();
  const supabase = await createClient();

  const { data: routes } = await supabase
    .from("nodes")
    .select("id, slug, title, transfer_routes!inner(destination_location_id)")
    .eq("node_type", "transfer_route")
    .returns<NodeTransferRouteRow[]>();
  if (!routes || routes.length === 0) return [];

  const destinationIds = Array.from(
    new Set(
      routes
        .map((r) => (Array.isArray(r.transfer_routes) ? r.transfer_routes[0]?.destination_location_id : r.transfer_routes?.destination_location_id))
        .filter((id): id is string => Boolean(id)),
    ),
  );
  const { data: destinationNodes } =
    destinationIds.length > 0
      ? await supabase.from("nodes").select("id, title").in("id", destinationIds).returns<Array<{ id: string; title: string }>>()
      : { data: [] as Array<{ id: string; title: string }> };
  const destinationTitleById = new Map((destinationNodes ?? []).map((d) => [d.id, d.title]));

  const { data: mediaRows } = await supabase
    .from("node_media")
    .select("node_id")
    .in("node_id", routes.map((r) => r.id))
    .eq("role", "hero")
    .returns<Array<{ node_id: string }>>();
  const withHero = new Set((mediaRows ?? []).map((m) => m.node_id));

  return routes
    .map((r) => {
      const fields = Array.isArray(r.transfer_routes) ? r.transfer_routes[0] : r.transfer_routes;
      const destinationTitle = fields ? destinationTitleById.get(fields.destination_location_id) ?? null : null;
      return { routeId: r.id, slug: r.slug, title: r.title, destinationTitle, hasImage: withHero.has(r.id) };
    })
    .sort((a, b) => a.title.localeCompare(b.title));
}

export interface RoutePhotoUploadResult {
  ok: boolean;
  error?: string;
}

/** Uploads and attaches one already-matched photo as a route's hero
 * image — same compress-then-upload-then-attach shape as
 * uploadAndAttachMedia() (src/lib/admin/media-actions.ts), hardcoded to
 * role "hero" and driven by the bulk uploader instead of a manual
 * per-route form. `replaceExisting: false` skips a route that already
 * has a hero photo rather than silently overwriting one someone already
 * set up correctly. */
export async function uploadMatchedRoutePhoto(routeId: string, formData: FormData, replaceExisting: boolean): Promise<RoutePhotoUploadResult> {
  await requireStaff();

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { ok: false, error: "No file received." };
  if (file.size > MAX_FILE_BYTES) return { ok: false, error: "Image is too large — the limit is 8MB." };
  if (!ALLOWED_CONTENT_TYPES.has(file.type)) return { ok: false, error: "Unsupported image type — use JPEG, PNG, WebP, or AVIF." };

  const supabase = await createClient();

  const { data: existingHero } = await supabase.from("node_media").select("media_id").eq("node_id", routeId).eq("role", "hero").returns<Array<{ media_id: string }>>();
  if (existingHero && existingHero.length > 0) {
    if (!replaceExisting) return { ok: false, error: "Already has a photo — skipped." };
    // Leaves the old media_assets row (and its Storage file) in place —
    // deleting the Storage object itself would need the service-role
    // client this project deliberately avoids for staff writes (RLS
    // governs every admin write here, media-actions.ts included).
    await supabase.from("node_media").delete().eq("node_id", routeId).eq("role", "hero");
  }

  const compressed = await compressImage(await file.arrayBuffer());
  const storagePath = `admin-uploads/${routeId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${compressed.ext}`;

  const { error: uploadError } = await supabase.storage
    .from("media")
    .upload(storagePath, compressed.buffer, { contentType: compressed.contentType, upsert: false, cacheControl: "31536000" });
  if (uploadError) return { ok: false, error: uploadError.message };

  const { data: assetRow, error: assetError } = await supabase
    .from("media_assets")
    .insert({ media_type: "image", storage_path: storagePath } as unknown as never)
    .select("id")
    .single<{ id: string }>();
  if (assetError || !assetRow) {
    await supabase.storage.from("media").remove([storagePath]);
    return { ok: false, error: assetError?.message ?? "Failed to save the uploaded image." };
  }

  const { error: attachError } = await supabase
    .from("node_media")
    .insert({ node_id: routeId, media_id: assetRow.id, role: "hero", sort_order: 0 } as unknown as never);
  if (attachError) {
    await supabase.from("media_assets").delete().eq("id", assetRow.id);
    await supabase.storage.from("media").remove([storagePath]);
    return { ok: false, error: attachError.message };
  }

  return { ok: true };
}

/** One shared cache bust at the end of a whole batch, rather than once
 * per file — getHeroMediaByNodeIds/getTransferRoutes are cachedRead()
 * (src/lib/cache/cached-read.ts), so without this the newly-attached
 * photos wouldn't show up on public route cards for up to 5 minutes. */
export async function finalizeRouteBulkPhotoUpload(): Promise<void> {
  await requireStaff();
  updateTag("media:hero-by-node-ids");
  updateTag("transfers:routes-list");
  updateTag("transfers:route-by-slug");
  updateTag("transfers:routes-by-ids");
  updateTag("node-media");
  revalidatePath("/admin/transfers");
  revalidatePath("/maldives/transfers");
}
