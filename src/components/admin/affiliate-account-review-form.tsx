"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
  approveAffiliateAccount,
  reconsiderAffiliateAccount,
  rejectAffiliateAccount,
  suspendAffiliateAccount,
} from "@/lib/admin/affiliate-accounts-actions";
import type { AffiliateStatus } from "@/lib/affiliate/types";

/** Same shape as AgentAccountReviewForm (src/components/admin/
 * agent-account-review-form.tsx). */
export function AffiliateAccountReviewForm({ affiliateId, status }: { affiliateId: string; status: AffiliateStatus }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [reason, setReason] = useState("");

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Review Decision</h2>

      {error && (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}

      {status === "pending" && (
        <div className="mt-3 space-y-3">
          <Button
            type="button"
            disabled={isPending}
            onClick={() => {
              setError(null);
              startTransition(async () => {
                const result = await approveAffiliateAccount(affiliateId);
                if (!result.ok) {
                  setError(result.error ?? "Something went wrong.");
                  return;
                }
                router.refresh();
              });
            }}
          >
            {isPending ? "Working…" : "Approve"}
          </Button>

          <label className="block text-sm">
            <span className="mb-1 block font-medium text-neutral-700">Reason (sent to the applicant if rejected)</span>
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
                const result = await rejectAffiliateAccount(affiliateId, reason);
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
      )}

      {status === "approved" && (
        <div className="mt-4 space-y-2">
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-neutral-700">Suspension reason</span>
            <textarea
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              rows={2}
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
                const result = await suspendAffiliateAccount(affiliateId, reason);
                if (!result.ok) {
                  setError(result.error ?? "Something went wrong.");
                  return;
                }
                router.refresh();
              });
            }}
          >
            {isPending ? "Working…" : "Suspend Account"}
          </Button>
        </div>
      )}

      {(status === "rejected" || status === "suspended") && (
        <div className="mt-4 space-y-3">
          <p className="text-sm text-neutral-600">
            Currently <span className="font-medium">{status}</span>. Move back to pending to take another look, or approve directly.
          </p>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              disabled={isPending}
              onClick={() => {
                setError(null);
                startTransition(async () => {
                  const result = await reconsiderAffiliateAccount(affiliateId);
                  if (!result.ok) {
                    setError(result.error ?? "Something went wrong.");
                    return;
                  }
                  router.refresh();
                });
              }}
            >
              {isPending ? "Working…" : "Move to Pending"}
            </Button>
            <Button
              type="button"
              disabled={isPending}
              onClick={() => {
                setError(null);
                startTransition(async () => {
                  const result = await approveAffiliateAccount(affiliateId);
                  if (!result.ok) {
                    setError(result.error ?? "Something went wrong.");
                    return;
                  }
                  router.refresh();
                });
              }}
            >
              {isPending ? "Working…" : "Approve"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
