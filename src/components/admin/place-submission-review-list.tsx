"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Badge } from "@/components/ui/badge";
import { SignedUrlViewModal } from "@/components/admin/signed-url-view-modal";
import {
  approvePlaceSubmission,
  getPlaceSubmissionImageSignedUrl,
  rejectPlaceSubmission,
} from "@/lib/admin/place-submissions-actions";
import type { AdminPlaceSubmissionItem, PlaceSubmissionStatus } from "@/lib/admin/place-submissions-repository";
import { ATTRACTION_TYPE_LABEL, type AttractionType } from "@/lib/attractions/types";
import { PLACE_CATEGORY_LABEL, type PlaceCategory } from "@/lib/places/types";

const STATUS_TONE: Record<PlaceSubmissionStatus, "neutral" | "maldives" | "aqua" | "outline"> = {
  pending: "outline",
  approved: "maldives",
  rejected: "neutral",
};

function categoryLabel(submission: AdminPlaceSubmissionItem): string {
  if (submission.placeCategory === "attraction") {
    return submission.attractionType ? `Attraction — ${ATTRACTION_TYPE_LABEL[submission.attractionType as AttractionType]}` : "Attraction";
  }
  return PLACE_CATEGORY_LABEL[submission.placeCategory as PlaceCategory];
}

export function PlaceSubmissionReviewList({ submissions }: { submissions: AdminPlaceSubmissionItem[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [viewError, setViewError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<Record<string, string>>({});
  const [viewingUrl, setViewingUrl] = useState<string | null>(null);

  if (submissions.length === 0) {
    return <p className="text-sm text-neutral-500">No submissions match this filter.</p>;
  }

  return (
    <div className="space-y-4">
      {viewError && <p className="text-sm text-red-600">{viewError}</p>}
      {submissions.map((submission) => (
        <div key={submission.id} className="rounded-2xl border border-neutral-200 bg-white p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Badge tone={STATUS_TONE[submission.status]}>{submission.status}</Badge>
                <Badge tone="aqua">{categoryLabel(submission)}</Badge>
              </div>
              <p className="mt-2 text-sm font-medium text-neutral-900">
                {submission.name} — on {submission.locationTitle}
              </p>
              {submission.description && <p className="mt-1 text-sm text-neutral-600">{submission.description}</p>}
              <p className="mt-1 text-sm text-neutral-600">
                {submission.submitterName} ({submission.submitterEmail}) — {new Date(submission.createdAt).toLocaleDateString()}
                {submission.phone && <> — {submission.phone}</>}
                {submission.lat != null && submission.lng != null && (
                  <>
                    {" — "}
                    {submission.lat.toFixed(5)}, {submission.lng.toFixed(5)}
                  </>
                )}
              </p>
              {submission.rejectionReason && <p className="mt-1 text-xs text-neutral-500">Reason: {submission.rejectionReason}</p>}
            </div>

            <div className="flex gap-2">
              {submission.status !== "approved" && (
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => {
                    setActionError((prev) => ({ ...prev, [submission.id]: "" }));
                    startTransition(async () => {
                      const result = await approvePlaceSubmission(submission.id);
                      if (!result.ok) {
                        setActionError((prev) => ({ ...prev, [submission.id]: result.error ?? "Could not approve this submission." }));
                        return;
                      }
                      router.refresh();
                    });
                  }}
                  className="rounded-full bg-maldives-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-ocean-800 disabled:opacity-50"
                >
                  Approve
                </button>
              )}
              {submission.status !== "rejected" && (
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => {
                    const reason = window.prompt("Reason (optional, not shown publicly):") ?? "";
                    setActionError((prev) => ({ ...prev, [submission.id]: "" }));
                    startTransition(async () => {
                      const result = await rejectPlaceSubmission(submission.id, reason);
                      if (!result.ok) {
                        setActionError((prev) => ({ ...prev, [submission.id]: result.error ?? "Could not reject this submission." }));
                        return;
                      }
                      router.refresh();
                    });
                  }}
                  className="rounded-full border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:border-red-400 hover:text-red-600 disabled:opacity-50"
                >
                  Reject
                </button>
              )}
            </div>
          </div>

          {actionError[submission.id] && <p className="mt-2 text-sm text-red-600">{actionError[submission.id]}</p>}

          {submission.images.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-2">
              {submission.images.map((image) => (
                <li key={image.id}>
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => {
                      setViewError(null);
                      startTransition(async () => {
                        const result = await getPlaceSubmissionImageSignedUrl(image.storagePath);
                        if (!result.url) {
                          setViewError(result.error ?? "Could not open this photo.");
                          return;
                        }
                        setViewingUrl(result.url);
                      });
                    }}
                    className="rounded-lg border border-neutral-300 px-2.5 py-1 text-xs font-medium text-maldives-600 hover:underline disabled:opacity-50"
                  >
                    {image.fileName ?? "View photo"}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
      {viewingUrl && <SignedUrlViewModal url={viewingUrl} onClose={() => setViewingUrl(null)} />}
    </div>
  );
}
