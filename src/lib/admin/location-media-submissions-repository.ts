import "server-only";

import { createClient } from "@/lib/supabase/server";

/**
 * Admin-only reads of location_media_submissions + their images.
 * `location_media_submissions_staff_all` is the only RLS policy on this
 * table — unlike location_comments there's no public/own read at all
 * (see 20261014000100_location_comments_and_media_submissions.sql), so
 * this repository only ever runs for staff. Location titles are resolved
 * with a separate batched lookup, same reasoning as
 * src/lib/admin/reviews-repository.ts.
 */

const PAGE_SIZE = 20;
export const LOCATION_MEDIA_SUBMISSION_STATUSES = ["pending", "approved", "rejected"] as const;
export type LocationMediaSubmissionStatus = (typeof LOCATION_MEDIA_SUBMISSION_STATUSES)[number];

export interface AdminLocationMediaSubmissionImage {
  id: string;
  storagePath: string;
  caption: string;
  fileName: string | null;
  contentType: string | null;
}

export interface AdminLocationMediaSubmissionItem {
  id: string;
  locationId: string;
  locationTitle: string;
  submitterName: string;
  submitterEmail: string;
  status: LocationMediaSubmissionStatus;
  rejectionReason: string | null;
  createdAt: string;
  images: AdminLocationMediaSubmissionImage[];
}

interface SubmissionRow {
  id: string;
  location_id: string;
  submitter_name: string;
  submitter_email: string;
  status: LocationMediaSubmissionStatus;
  rejection_reason: string | null;
  created_at: string;
}

interface ImageRow {
  id: string;
  submission_id: string;
  storage_path: string;
  caption: string;
  file_name: string | null;
  content_type: string | null;
}

export interface AdminLocationMediaSubmissionListResult {
  items: AdminLocationMediaSubmissionItem[];
  total: number;
  page: number;
  pageSize: number;
}

export async function getLocationMediaSubmissionsAdmin(
  options: { status?: LocationMediaSubmissionStatus; page?: number } = {},
): Promise<AdminLocationMediaSubmissionListResult> {
  const page = Math.max(1, options.page ?? 1);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const supabase = await createClient();
  let query = supabase.from("location_media_submissions").select("*", { count: "exact" }).order("created_at", { ascending: false });
  if (options.status) query = query.eq("status", options.status);

  const { data, error, count } = await query.range(from, to).returns<SubmissionRow[]>();
  if (error || !data) return { items: [], total: 0, page, pageSize: PAGE_SIZE };

  const submissionIds = data.map((s) => s.id);
  const locationIds = [...new Set(data.map((s) => s.location_id))];

  const [{ data: images }, { data: nodes }] = await Promise.all([
    submissionIds.length
      ? supabase.from("location_media_submission_images").select("*").in("submission_id", submissionIds).returns<ImageRow[]>()
      : Promise.resolve({ data: [] as ImageRow[] }),
    locationIds.length
      ? supabase.from("nodes").select("id, title").in("id", locationIds).returns<Array<{ id: string; title: string }>>()
      : Promise.resolve({ data: [] as Array<{ id: string; title: string }> }),
  ]);

  const titleById = new Map((nodes ?? []).map((n) => [n.id, n.title]));
  const imagesBySubmission = new Map<string, AdminLocationMediaSubmissionImage[]>();
  for (const img of images ?? []) {
    const list = imagesBySubmission.get(img.submission_id) ?? [];
    list.push({ id: img.id, storagePath: img.storage_path, caption: img.caption, fileName: img.file_name, contentType: img.content_type });
    imagesBySubmission.set(img.submission_id, list);
  }

  const items: AdminLocationMediaSubmissionItem[] = data.map((s) => ({
    id: s.id,
    locationId: s.location_id,
    locationTitle: titleById.get(s.location_id) ?? "(unknown location)",
    submitterName: s.submitter_name,
    submitterEmail: s.submitter_email,
    status: s.status,
    rejectionReason: s.rejection_reason,
    createdAt: s.created_at,
    images: imagesBySubmission.get(s.id) ?? [],
  }));

  return { items, total: count ?? items.length, page, pageSize: PAGE_SIZE };
}
