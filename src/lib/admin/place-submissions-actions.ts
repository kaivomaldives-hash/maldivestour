"use server";

import { revalidatePath, updateTag } from "next/cache";

import { requireStaff } from "@/lib/admin/auth";
import type { AdminActionResult } from "@/lib/admin/node-actions";
import { publicDestinationPath } from "@/lib/locations/public-destination-path";
import { createClient } from "@/lib/supabase/server";

/**
 * Approving a submission is the only path by which a guest-proposed
 * place ever becomes a real, public `locations` row — same "nothing's
 * live until staff acts" shape as location_media_submissions
 * (src/lib/admin/location-media-submissions-actions.ts), which this
 * mirrors closely for the photo-promotion half. The node+locations
 * insert itself is new territory (see 20261104000100_place_submissions.sql's
 * own comment) — every location before this was seed-migration-only.
 */

const CONTENT_TYPE_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

const CATEGORY_DIRECTORY_PATH: Record<string, string> = {
  attraction: "/maldives/attractions",
  restaurant: "/maldives/restaurants",
  shop: "/maldives/shops",
  hospital: "/maldives/hospitals",
  school: "/maldives/schools",
  gym: "/maldives/gyms",
};

function slugify(title: string): string {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-+|-+$)/g, "");
  return `${base || "place"}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function getPlaceSubmissionImageSignedUrl(storagePath: string): Promise<{ url: string | null; error?: string }> {
  await requireStaff();
  const supabase = await createClient();
  const { data, error } = await supabase.storage.from("place-submissions").createSignedUrl(storagePath, 120);
  if (error || !data) return { url: null, error: error?.message };
  return { url: data.signedUrl };
}

interface SubmissionForApproval {
  id: string;
  location_id: string;
  place_category: string;
  attraction_type: string | null;
  name: string;
  description: string | null;
  phone: string | null;
  lat: number | null;
  lng: number | null;
  status: string;
}

export async function approvePlaceSubmission(submissionId: string): Promise<AdminActionResult> {
  const staff = await requireStaff();
  const supabase = await createClient();

  const { data: submission, error: submissionError } = await supabase
    .from("place_submissions")
    .select("id, location_id, place_category, attraction_type, name, description, phone, lat, lng, status")
    .eq("id", submissionId)
    .maybeSingle<SubmissionForApproval>();
  if (submissionError || !submission) return { ok: false, error: "Submission not found." };
  if (submission.status !== "pending") return { ok: false, error: "This submission has already been reviewed." };

  const locationType = submission.place_category === "attraction" ? "poi" : "place";
  const slug = slugify(submission.name);
  const attributes: Record<string, unknown> = {};
  if (submission.place_category === "attraction") {
    attributes.attraction_type = submission.attraction_type;
  } else {
    attributes.place_category = submission.place_category;
  }
  if (submission.phone) attributes.phone = submission.phone;

  const { data: nodeRow, error: nodeError } = await supabase
    .from("nodes")
    .insert({
      node_type: "location",
      slug,
      title: submission.name,
      summary: submission.description,
      status: "published",
      attributes,
      published_at: new Date().toISOString(),
    } as unknown as never)
    .select("id")
    .single<{ id: string }>();
  if (nodeError || !nodeRow) return { ok: false, error: nodeError?.message ?? "Failed to create the place." };
  const newNodeId = nodeRow.id;

  // `path` is overwritten immediately by the locations_path_on_reparent
  // trigger once parent_id is set (see the migration's own comment) —
  // this placeholder just satisfies the NOT NULL constraint until then.
  const { error: locationError } = await supabase.from("locations").insert({
    id: newNodeId,
    location_type: locationType,
    parent_id: submission.location_id,
    path: "pending",
    lat: submission.lat,
    lng: submission.lng,
  } as unknown as never);
  if (locationError) {
    await supabase.from("nodes").delete().eq("id", newNodeId);
    return { ok: false, error: locationError.message };
  }

  const { data: images } = await supabase
    .from("place_submission_images")
    .select("id, storage_path, file_name, content_type")
    .eq("submission_id", submissionId)
    .returns<Array<{ id: string; storage_path: string; file_name: string | null; content_type: string | null }>>();

  let sortOrder = 0;
  for (const image of images ?? []) {
    const { data: fileBlob, error: downloadError } = await supabase.storage.from("place-submissions").download(image.storage_path);
    if (downloadError || !fileBlob) continue;

    const contentType = image.content_type ?? fileBlob.type ?? "image/jpeg";
    const ext = CONTENT_TYPE_EXT[contentType] ?? "jpg";
    const newStoragePath = `guest-uploads/${newNodeId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const { error: uploadError } = await supabase.storage.from("media").upload(newStoragePath, fileBlob, { contentType, upsert: false });
    if (uploadError) continue;

    const { data: assetRow, error: assetError } = await supabase
      .from("media_assets")
      .insert({ media_type: "image", storage_path: newStoragePath, alt_text: null } as unknown as never)
      .select("id")
      .single<{ id: string }>();
    if (assetError || !assetRow) {
      await supabase.storage.from("media").remove([newStoragePath]);
      continue;
    }

    const { error: attachError } = await supabase
      .from("node_media")
      .insert({ node_id: newNodeId, media_id: assetRow.id, role: sortOrder === 0 ? "hero" : "gallery", sort_order: sortOrder } as unknown as never);
    if (attachError) {
      await supabase.from("media_assets").delete().eq("id", assetRow.id);
      await supabase.storage.from("media").remove([newStoragePath]);
      continue;
    }
    sortOrder += 1;
  }

  const { error: statusError } = await supabase
    .from("place_submissions")
    .update({ status: "approved", reviewed_by: staff.userId, reviewed_at: new Date().toISOString(), created_node_id: newNodeId } as unknown as never)
    .eq("id", submissionId);
  if (statusError) return { ok: false, error: statusError.message };

  revalidatePath("/admin/place-submissions");
  revalidatePath("/admin");
  updateTag("locations");
  updateTag("places:list");
  updateTag("attractions:list");
  updateTag("node-media");

  const directoryPath = CATEGORY_DIRECTORY_PATH[submission.place_category];
  if (directoryPath) revalidatePath(directoryPath);

  const { data: parentNode } = await supabase
    .from("nodes")
    .select("slug, locations!locations_id_fkey!inner(location_type)")
    .eq("id", submission.location_id)
    .maybeSingle<{ slug: string; locations: { location_type: string } }>();
  const parentPublicPath = parentNode ? publicDestinationPath(parentNode.locations?.location_type, parentNode.slug) : null;
  if (parentPublicPath) revalidatePath(parentPublicPath);

  return { ok: true };
}

export async function rejectPlaceSubmission(submissionId: string, reason: string | null): Promise<AdminActionResult> {
  const staff = await requireStaff();
  const supabase = await createClient();

  const { data: submission } = await supabase.from("place_submissions").select("status").eq("id", submissionId).maybeSingle<{ status: string }>();
  if (!submission) return { ok: false, error: "Submission not found." };
  if (submission.status !== "pending") return { ok: false, error: "This submission has already been reviewed." };

  const { error } = await supabase
    .from("place_submissions")
    .update({
      status: "rejected",
      rejection_reason: reason?.trim() || null,
      reviewed_by: staff.userId,
      reviewed_at: new Date().toISOString(),
    } as unknown as never)
    .eq("id", submissionId);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/place-submissions");
  revalidatePath("/admin");
  return { ok: true };
}
