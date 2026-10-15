"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
  approveLocationMediaSubmission,
  getLocationMediaSubmissionImageSignedUrl,
  rejectLocationMediaSubmission,
} from "@/lib/admin/location-media-submissions-actions";
import type { AdminLocationMediaSubmissionItem, LocationMediaSubmissionStatus } from "@/lib/admin/location-media-submissions-repository";
import { Badge } from "@/components/ui/badge";
import { SignedUrlViewModal } from "@/components/admin/signed-url-view-modal";

const STATUS_TONE: Record<LocationMediaSubmissionStatus, "neutral" | "maldives" | "aqua" | "outline"> = {
  pending: "outline",
  approved: "maldives",
  rejected: "neutral",
};

export function LocationMediaSubmissionReviewList({ submissions }: { submissions: AdminLocationMediaSubmissionItem[] }) {
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
              </div>
              <p className="mt-1 text-sm text-neutral-600">
                {submission.locationTitle} — {submission.submitterName} ({submission.submitterEmail}) —{" "}
                {new Date(submission.createdAt).toLocaleDateString()}
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
                      const result = await approveLocationMediaSubmission(submission.id);
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
                      const result = await rejectLocationMediaSubmission(submission.id, reason);
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

          <ul className="mt-3 flex flex-wrap gap-2">
            {submission.images.map((image) => (
              <li key={image.id}>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => {
                    setViewError(null);
                    startTransition(async () => {
                      const result = await getLocationMediaSubmissionImageSignedUrl(image.storagePath);
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
        </div>
      ))}
      {viewingUrl && <SignedUrlViewModal url={viewingUrl} onClose={() => setViewingUrl(null)} />}
    </div>
  );
}
