"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { approveListingSubmission, rejectListingSubmission } from "@/lib/admin/listing-submissions-actions";
import type { ListingSubmissionStatus } from "@/lib/partner/listings/types";

export function ListingSubmissionReviewForm({ submissionId, status }: { submissionId: string; status: ListingSubmissionStatus }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [reason, setReason] = useState("");

  if (status !== "pending") {
    return <p className="text-sm text-neutral-600">This submission has already been {status}.</p>;
  }

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Review Decision</h2>
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="mt-3">
        <Button
          type="button"
          disabled={isPending}
          onClick={() => {
            setError(null);
            startTransition(async () => {
              const result = await approveListingSubmission(submissionId);
              if (!result.ok) {
                setError(result.error ?? "Something went wrong.");
                return;
              }
              router.refresh();
            });
          }}
        >
          {isPending ? "Working…" : "Approve & Publish"}
        </Button>
      </div>

      <div className="mt-4 space-y-2">
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Reason (sent to the partner)</span>
          <textarea
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            rows={3}
            className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:border-maldives-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-maldives-500 focus-visible:ring-offset-1"
          />
        </label>
        <Button
          type="button"
          variant="secondary"
          disabled={isPending}
          onClick={() => {
            setError(null);
            startTransition(async () => {
              const result = await rejectListingSubmission(submissionId, reason);
              if (!result.ok) {
                setError(result.error ?? "Something went wrong.");
                return;
              }
              router.refresh();
            });
          }}
        >
          {isPending ? "Working…" : "Reject"}
        </Button>
      </div>
    </div>
  );
}
