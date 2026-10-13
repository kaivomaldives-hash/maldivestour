"use server";

import { MAX_SUBMISSION_IMAGES, type SubmitLocationMediaResult } from "@/lib/locations/media-submissions/types";
import { createClient } from "@/lib/supabase/server";

/**
 * Guest-safe photo submission: any random visitor can send up to
 * MAX_SUBMISSION_IMAGES images for a location, capped at 2 submissions a
 * day per email (enforced inside create_location_media_submission() —
 * see 20261014000100_location_comments_and_media_submissions.sql). Nothing
 * here ever writes to the public `media` bucket or node_media directly —
 * that only happens once staff approves the submission
 * (src/lib/admin/location-media-submissions-actions.ts), same
 * "nothing's live until staff acts" shape as partner listing_submissions.
 */

const MAX_FILE_BYTES = 8 * 1024 * 1024;
const ALLOWED_CONTENT_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

export async function createLocationMediaSubmission(locationId: string, formData: FormData): Promise<SubmitLocationMediaResult> {
  const submitterName = String(formData.get("submitterName") ?? "").trim();
  const submitterEmail = String(formData.get("submitterEmail") ?? "").trim();
  const files = formData.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);

  if (!submitterName) return { ok: false, error: "Please enter your name." };
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(submitterEmail)) return { ok: false, error: "Please enter a valid email address." };
  if (files.length === 0) return { ok: false, error: "Please choose at least one photo to upload." };
  if (files.length > MAX_SUBMISSION_IMAGES) return { ok: false, error: `You can upload at most ${MAX_SUBMISSION_IMAGES} photos per submission.` };
  for (const file of files) {
    if (file.size > MAX_FILE_BYTES) return { ok: false, error: `"${file.name}" is too large — the limit is 8MB per photo.` };
    if (!ALLOWED_CONTENT_TYPES[file.type]) return { ok: false, error: `"${file.name}" isn't a supported image type — use JPEG, PNG, WebP, or AVIF.` };
  }

  const supabase = await createClient();

  // src/types/database.ts is still the Task 3 placeholder (see the
  // identical, already-documented cast in src/lib/reviews/actions.ts).
  const { data: submissionId, error: createError } = await supabase.rpc(
    "create_location_media_submission" as unknown as never,
    { p_location_id: locationId, p_submitter_name: submitterName, p_submitter_email: submitterEmail } as unknown as undefined,
  );
  if (createError || !submissionId) {
    if (createError?.message.includes("limit of 2 submissions per day")) {
      return { ok: false, error: "You've reached the limit of 2 submissions per day for this email address. Please try again tomorrow." };
    }
    return { ok: false, error: "We couldn't start your submission right now. Please try again." };
  }

  for (const file of files) {
    const ext = ALLOWED_CONTENT_TYPES[file.type];
    const storagePath = `${submissionId as string}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const { error: uploadError } = await supabase.storage.from("location-submissions").upload(storagePath, file, { contentType: file.type, upsert: false });
    if (uploadError) return { ok: false, error: "We saved your submission, but one of the photos failed to upload. Please try again with fewer or smaller photos." };

    const { error: registerError } = await supabase.rpc(
      "create_location_media_submission_image" as unknown as never,
      { p_submission_id: submissionId, p_storage_path: storagePath, p_file_name: file.name, p_content_type: file.type } as unknown as undefined,
    );
    if (registerError) return { ok: false, error: "We saved your submission, but one of the photos failed to register. Please try again." };
  }

  return { ok: true };
}
