"use server";

import { MAX_SUBMISSION_IMAGES, type SubmissionPlaceCategory, type SubmitPlaceResult } from "@/lib/locations/place-submissions/types";
import { createClient } from "@/lib/supabase/server";

/**
 * Guest-safe place submission: any visitor can propose a new attraction,
 * restaurant, shop, hospital, school, or gym for an island/atoll, capped
 * at 2 submissions a day per email (enforced inside
 * create_place_submission() — see 20261104000100_place_submissions.sql).
 * Nothing here ever writes to the public `nodes`/`locations` tables or
 * the public `media` bucket directly — that only happens once staff
 * approves the submission (src/lib/admin/place-submissions-actions.ts),
 * same "nothing's live until staff acts" shape as
 * location_media_submissions.
 */

const MAX_FILE_BYTES = 8 * 1024 * 1024;
const ALLOWED_CONTENT_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

function parseCoordinate(raw: FormDataEntryValue | null): number | null {
  if (typeof raw !== "string" || raw.trim() === "") return null;
  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
}

export async function createPlaceSubmission(locationId: string, formData: FormData): Promise<SubmitPlaceResult> {
  const placeCategory = String(formData.get("placeCategory") ?? "") as SubmissionPlaceCategory;
  const attractionType = String(formData.get("attractionType") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const lat = parseCoordinate(formData.get("lat"));
  const lng = parseCoordinate(formData.get("lng"));
  const submitterName = String(formData.get("submitterName") ?? "").trim();
  const submitterEmail = String(formData.get("submitterEmail") ?? "").trim();
  const agreedToTerms = formData.get("agreedToTerms") === "on";
  // "files" and "captions" are appended in matching pairs, one per photo
  // (see CaptionedPhotoPicker's own comment) — zip them together before
  // any filtering, so a dropped empty-file entry can never desync a
  // caption from the wrong photo.
  const rawFiles = formData.getAll("files");
  const rawCaptions = formData.getAll("captions");
  const photos = rawFiles
    .map((file, index) => ({ file, caption: String(rawCaptions[index] ?? "").trim() }))
    .filter((p): p is { file: File; caption: string } => p.file instanceof File && p.file.size > 0);
  const files = photos.map((p) => p.file);

  if (!["attraction", "restaurant", "shop", "hospital", "school", "gym"].includes(placeCategory)) {
    return { ok: false, error: "Please choose a category." };
  }
  if (!name) return { ok: false, error: "Please enter a name for this place." };
  if (!submitterName) return { ok: false, error: "Please enter your name." };
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(submitterEmail)) return { ok: false, error: "Please enter a valid email address." };
  if (!agreedToTerms) return { ok: false, error: "Please confirm you're responsible for this submission before submitting." };
  if (files.length > MAX_SUBMISSION_IMAGES) return { ok: false, error: `You can upload at most ${MAX_SUBMISSION_IMAGES} photos per submission.` };
  for (const photo of photos) {
    if (photo.file.size > MAX_FILE_BYTES) return { ok: false, error: `"${photo.file.name}" is too large — the limit is 8MB per photo.` };
    if (!ALLOWED_CONTENT_TYPES[photo.file.type]) return { ok: false, error: `"${photo.file.name}" isn't a supported image type — use JPEG, PNG, WebP, or AVIF.` };
    if (!photo.caption) return { ok: false, error: `Please add a short caption describing "${photo.file.name}".` };
  }

  const supabase = await createClient();

  const { data: submissionId, error: createError } = await supabase.rpc(
    "create_place_submission" as unknown as never,
    {
      p_location_id: locationId,
      p_place_category: placeCategory,
      p_name: name,
      p_submitter_name: submitterName,
      p_submitter_email: submitterEmail,
      p_agreed_to_terms: true,
      p_description: description || null,
      p_phone: phone || null,
      p_lat: lat,
      p_lng: lng,
      p_attraction_type: placeCategory === "attraction" ? attractionType : null,
    } as unknown as undefined,
  );
  if (createError || !submissionId) {
    if (createError?.message.includes("limit of 2 submissions per day")) {
      return { ok: false, error: "You've reached the limit of 2 submissions per day for this email address. Please try again tomorrow." };
    }
    return { ok: false, error: createError?.message ?? "We couldn't start your submission right now. Please try again." };
  }

  for (const photo of photos) {
    const { file, caption } = photo;
    const ext = ALLOWED_CONTENT_TYPES[file.type];
    const storagePath = `${submissionId as string}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const { error: uploadError } = await supabase.storage.from("place-submissions").upload(storagePath, file, { contentType: file.type, upsert: false });
    if (uploadError) return { ok: false, error: "We saved your submission, but one of the photos failed to upload. Please try again with fewer or smaller photos." };

    const { error: registerError } = await supabase.rpc(
      "create_place_submission_image" as unknown as never,
      { p_submission_id: submissionId, p_storage_path: storagePath, p_caption: caption, p_file_name: file.name, p_content_type: file.type } as unknown as undefined,
    );
    if (registerError) return { ok: false, error: "We saved your submission, but one of the photos failed to register. Please try again." };
  }

  return { ok: true };
}
