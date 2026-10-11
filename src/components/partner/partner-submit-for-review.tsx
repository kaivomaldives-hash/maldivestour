"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { submitPartnerProfileForReview } from "@/lib/partner/actions";
import type { OnboardingStatus } from "@/lib/partner/types";

/** Checklist + "Submit for Review" action — shown regardless of which tab
 * is active, since it's about the whole profile, not one section. The
 * checklist is informational only (nothing here blocks the submit button):
 * the database is the real gatekeeper on when a resubmit is even allowed
 * (submit_partner_profile_for_review() — only from 'profile'/'rejected'),
 * and an incomplete-but-submitted profile just gets rejected with a
 * reason, same as any other review outcome. */
export function PartnerSubmitForReview({
  status,
  rejectionReason,
  hasBankDetails,
  documentCount,
}: {
  status: OnboardingStatus;
  rejectionReason: string | null;
  hasBankDetails: boolean;
  documentCount: number;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const canSubmit = status === "profile" || status === "rejected";

  return (
    <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-4">
      {status === "rejected" && rejectionReason && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3">
          <p className="text-sm font-medium text-red-800">Changes requested</p>
          <p className="mt-1 text-sm text-red-700">{rejectionReason}</p>
        </div>
      )}

      <ul className="space-y-1 text-sm text-neutral-600">
        <li>{hasBankDetails ? "✓" : "—"} Bank details added</li>
        <li>
          {documentCount > 0 ? "✓" : "—"} Verification documents uploaded ({documentCount})
        </li>
      </ul>

      {error && (
        <p role="alert" className="mt-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="mt-4 flex items-center justify-between gap-4 border-t border-neutral-200 pt-4">
        {canSubmit ? (
          <>
            <p className="text-sm text-neutral-600">Ready to send this to our team for review?</p>
            <Button
              type="button"
              disabled={isPending}
              onClick={() => {
                setError(null);
                startTransition(async () => {
                  const result = await submitPartnerProfileForReview();
                  if (!result.ok) {
                    setError(result.error ?? "Something went wrong. Please try again.");
                    return;
                  }
                  router.refresh();
                });
              }}
            >
              {isPending ? "Submitting…" : "Submit for Review"}
            </Button>
          </>
        ) : status === "submitted" ? (
          <p className="text-sm text-neutral-600">Your profile has been submitted and is awaiting review.</p>
        ) : status === "approved" ? (
          <p className="text-sm text-maldives-700">Your profile has been approved.</p>
        ) : (
          <p className="text-sm text-neutral-600">Your account is suspended. Contact us for details.</p>
        )}
      </div>
    </div>
  );
}
