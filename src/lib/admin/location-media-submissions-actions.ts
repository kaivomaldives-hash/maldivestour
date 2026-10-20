"use server";

import { revalidatePath, updateTag } from "next/cache";

import { requireStaff } from "@/lib/admin/auth";
import type { AdminActionResult } from "@/lib/admin/node-actions";
import { publicDestinationPath } from "@/lib/locations/public-destination-path";
import { createClient } from "@/lib/supabase/server";

/**
 * Approving a submission is the only path by which a guest-uploaded photo
 * ever reaches the public `media` bucket + media_assets + node_media —
 * same "nothing's live until staff acts" shape as partner
 * listing_submissions, and it reuses the exact sort_order-continuation
 * logic src/lib/admin/media-actions.ts's uploadAndAttachMedia() already
 * uses, so there's only ever one way an image becomes part of a node's
 * gallery.
 */

const CONTENT_TYPE_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

export async function getLocationMediaSubmissionImageSignedUrl(storagePath: string): Promise<{ url: string | null; error?: string }> {
  await requireStaff();
  const supabase = await createClient();
  // 120s — see the identical comment in src/lib/admin/partner-accounts-
  // actions.ts's getPartnerDocumentSignedUrl() on why 60s was too tight.
  const { data, error } = await supabase.storage.from("location-submissions").createSignedUrl(storagePath, 120);
  if (error || !data) return { url: null, error: error?.message };
  return { url: data.signedUrl };
}

export async function approveLocationMediaSubmission(submissionId: string): Promise<AdminActionResult> {
  const staff = await requireStaff();
  const supabase = await createClient();

  const { data: submission, error: submissionError } = await supabase
    .from("location_media_submissions")
    .select("id, location_id, status")
    .eq("id", submissionId)
    .maybeSingle<{ id: string; location_id: string; status: string }>();
  if (submissionError || !submission) return { ok: false, error: "Submission not found." };
  if (submission.status !== "pending") return { ok: false, error: "This submission has already been reviewed." };

  const { data: images, error: imagesError } = await supabase
    .from("location_media_submission_images")
    .select("id, storage_path, caption, file_name, content_type")
    .eq("submission_id", submissionId)
    .returns<Array<{ id: string; storage_path: string; caption: string; file_name: string | null; content_type: string | null }>>();
  if (imagesError) return { ok: false, error: imagesError.message };
  if (!images || images.length === 0) return { ok: false, error: "This submission has no images to approve." };

  const { data: existing } = await supabase
    .from("node_media")
    .select("sort_order")
    .eq("node_id", submission.location_id)
    .eq("role", "gallery")
    .order("sort_order", { ascending: false })
    .limit(1)
    .returns<Array<{ sort_order: number }>>();
  let nextSortOrder = (existing?.[0]?.sort_order ?? -1) + 1;

  for (const image of images) {
    const { data: fileBlob, error: downloadError } = await supabase.storage.from("location-submissions").download(image.storage_path);
    if (downloadError || !fileBlob) return { ok: false, error: `Could not read "${image.file_name ?? image.storage_path}" — ${downloadError?.message ?? "file missing"}.` };

    const contentType = image.content_type ?? fileBlob.type ?? "image/jpeg";
    const ext = CONTENT_TYPE_EXT[contentType] ?? "jpg";
    const newStoragePath = `guest-uploads/${submission.location_id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const { error: uploadError } = await supabase.storage.from("media").upload(newStoragePath, fileBlob, { contentType, upsert: false });
    if (uploadError) return { ok: false, error: uploadError.message };

    // The submitter's required caption becomes both title and alt_text —
    // see 20261105000100_photo_submission_captions.sql's own comment on
    // why this used to be null for every guest-submitted photo on the
    // site.
    const { data: assetRow, error: assetError } = await supabase
      .from("media_assets")
      .insert({ media_type: "image", storage_path: newStoragePath, title: image.caption || null, alt_text: image.caption || null } as unknown as never)
      .select("id")
      .single<{ id: string }>();
    if (assetError || !assetRow) {
      await supabase.storage.from("media").remove([newStoragePath]);
      return { ok: false, error: assetError?.message ?? "Failed to save an approved image." };
    }

    const { error: attachError } = await supabase
      .from("node_media")
      .insert({ node_id: submission.location_id, media_id: assetRow.id, role: "gallery", sort_order: nextSortOrder } as unknown as never);
    if (attachError) {
      await supabase.from("media_assets").delete().eq("id", assetRow.id);
      await supabase.storage.from("media").remove([newStoragePath]);
      return { ok: false, error: attachError.message };
    }
    nextSortOrder += 1;
  }

  const { error: statusError } = await supabase
    .from("location_media_submissions")
    .update({ status: "approved", reviewed_by: staff.userId, reviewed_at: new Date().toISOString() } as unknown as never)
    .eq("id", submissionId);
  if (statusError) return { ok: false, error: statusError.message };

  revalidatePath("/admin/location-media");
  revalidatePath("/admin");

  // getMediaForNode() (src/lib/media/repository.ts) is a cachedRead() --
  // the revalidatePath() calls above (scoped to /admin/*) never reach it,
  // so without this the newly-approved photos silently don't show up on
  // the public destination page for up to 5 minutes. Same gap and same
  // fix shape as updateLocation()'s lat/lng caching bug
  // (src/lib/admin/locations-actions.ts).
  updateTag("node-media");
  const { data: node } = await supabase
    .from("nodes")
    .select("slug, locations!locations_id_fkey!inner(location_type)")
    .eq("id", submission.location_id)
    .maybeSingle<{ slug: string; locations: { location_type: string } }>();
  const publicPath = node ? publicDestinationPath(node.locations?.location_type, node.slug) : null;
  if (publicPath) revalidatePath(publicPath);

  return { ok: true };
}

export async function rejectLocationMediaSubmission(submissionId: string, reason: string | null): Promise<AdminActionResult> {
  const staff = await requireStaff();
  const supabase = await createClient();

  const { data: submission } = await supabase
    .from("location_media_submissions")
    .select("status")
    .eq("id", submissionId)
    .maybeSingle<{ status: string }>();
  if (!submission) return { ok: false, error: "Submission not found." };
  if (submission.status !== "pending") return { ok: false, error: "This submission has already been reviewed." };

  const { error } = await supabase
    .from("location_media_submissions")
    .update({
      status: "rejected",
      rejection_reason: reason?.trim() || null,
      reviewed_by: staff.userId,
      reviewed_at: new Date().toISOString(),
    } as unknown as never)
    .eq("id", submissionId);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/location-media");
  revalidatePath("/admin");
  return { ok: true };
}
