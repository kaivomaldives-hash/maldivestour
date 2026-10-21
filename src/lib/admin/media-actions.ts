"use server";

import { revalidatePath } from "next/cache";

import { requireStaff } from "@/lib/admin/auth";
import type { AdminActionResult } from "@/lib/admin/node-actions";
import { compressImage } from "@/lib/media/compress-image";
import type { MediaRole } from "@/lib/media/types";
import { createClient } from "@/lib/supabase/server";

/**
 * Admin image upload + node_media attach/detach. Writes via the normal
 * RLS-respecting client (createClient(), never service-role) — staff
 * write access to the `media` Storage bucket and to media_assets/
 * node_media all come from RLS policies (see
 * 20250212000100_admin_content_crud_foundation.sql and
 * 20250101001400_rls_policies.sql), matching every other admin write in
 * this codebase.
 */

const MAX_FILE_BYTES = 8 * 1024 * 1024;
const ALLOWED_CONTENT_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};
const ALLOWED_ROLES: MediaRole[] = ["hero", "gallery"];

export async function uploadAndAttachMedia(nodeId: string, formData: FormData, revalidateAt: string): Promise<AdminActionResult> {
  await requireStaff();

  const file = formData.get("file");
  const role = formData.get("role");
  const titleRaw = formData.get("title");
  const altTextRaw = formData.get("altText");

  if (!(file instanceof File) || file.size === 0) return { ok: false, error: "Choose an image to upload." };
  if (file.size > MAX_FILE_BYTES) return { ok: false, error: "Image is too large — the limit is 8MB." };
  if (!ALLOWED_CONTENT_TYPES[file.type]) return { ok: false, error: "Unsupported image type — use JPEG, PNG, WebP, or AVIF." };
  const roleValue = typeof role === "string" && (ALLOWED_ROLES as string[]).includes(role) ? (role as MediaRole) : null;
  if (!roleValue) return { ok: false, error: "Invalid image role." };
  const title = typeof titleRaw === "string" && titleRaw.trim() ? titleRaw.trim() : null;
  const altText = typeof altTextRaw === "string" && altTextRaw.trim() ? altTextRaw.trim() : null;

  // Resized/recompressed to WebP here rather than relying on Next's
  // per-request image optimizer (MediaImage deliberately renders
  // `unoptimized` to avoid Vercel's metered Image Optimization cost —
  // see that component's own comment) — this is a one-time cost at
  // upload time instead of an ongoing one.
  const compressed = await compressImage(await file.arrayBuffer());

  const supabase = await createClient();
  const storagePath = `admin-uploads/${nodeId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${compressed.ext}`;

  // cacheControl: 1 year — storagePath is timestamp/random-suffixed and
  // never overwritten (upsert: false), so this exact URL's bytes never
  // change; nothing to invalidate. Left at the Supabase SDK's 1-hour
  // default otherwise, which Search Console's Core Web Vitals report
  // flagged as a real, sitewide "inefficient cache lifetime" cost.
  const { error: uploadError } = await supabase.storage
    .from("media")
    .upload(storagePath, compressed.buffer, { contentType: compressed.contentType, upsert: false, cacheControl: "31536000" });
  if (uploadError) return { ok: false, error: uploadError.message };

  const { data: assetRow, error: assetError } = await supabase
    .from("media_assets")
    .insert({ media_type: "image", storage_path: storagePath, title, alt_text: altText } as unknown as never)
    .select("id")
    .single<{ id: string }>();
  if (assetError || !assetRow) {
    await supabase.storage.from("media").remove([storagePath]);
    return { ok: false, error: assetError?.message ?? "Failed to save the uploaded image." };
  }

  const { data: existing } = await supabase
    .from("node_media")
    .select("sort_order")
    .eq("node_id", nodeId)
    .eq("role", roleValue)
    .order("sort_order", { ascending: false })
    .limit(1)
    .returns<Array<{ sort_order: number }>>();
  const nextSortOrder = (existing?.[0]?.sort_order ?? -1) + 1;

  const { error: attachError } = await supabase
    .from("node_media")
    .insert({ node_id: nodeId, media_id: assetRow.id, role: roleValue, sort_order: nextSortOrder } as unknown as never);
  if (attachError) {
    await supabase.from("media_assets").delete().eq("id", assetRow.id);
    await supabase.storage.from("media").remove([storagePath]);
    return { ok: false, error: attachError.message };
  }

  revalidatePath(revalidateAt);
  return { ok: true };
}

export async function detachMedia(nodeId: string, mediaId: string, role: MediaRole, revalidateAt: string): Promise<AdminActionResult> {
  await requireStaff();
  const supabase = await createClient();
  const { error } = await supabase.from("node_media").delete().eq("node_id", nodeId).eq("media_id", mediaId).eq("role", role);
  if (error) return { ok: false, error: error.message };
  revalidatePath(revalidateAt);
  return { ok: true };
}
