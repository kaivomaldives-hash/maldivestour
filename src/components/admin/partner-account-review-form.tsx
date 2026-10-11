"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { approvePartnerAccount, rejectPartnerAccount, suspendPartnerAccount } from "@/lib/admin/partner-accounts-actions";
import type { OnboardingStatus } from "@/lib/partner/types";

export function PartnerAccountReviewForm({
  partnerId,
  providerId,
  status,
}: {
  partnerId: string;
  providerId: string | null;
  status: OnboardingStatus;
}) {
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

      {(status === "submitted" || status === "rejected") && (
        <div className="mt-3 flex gap-3">
          <Button
            type="button"
            disabled={isPending}
            onClick={() => {
              setError(null);
              startTransition(async () => {
                const result = await approvePartnerAccount(partnerId, providerId);
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
      )}

      {status === "submitted" && (
        <div className="mt-4 space-y-2">
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-neutral-700">Reason (sent to the partner if rejected)</span>
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
                const result = await rejectPartnerAccount(partnerId, reason);
                if (!result.ok) {
                  setError(result.error ?? "Something went wrong.");
                  return;
                }
                router.refresh();
              });
            }}
          >
            {isPending ? "Working…" : "Request Changes"}
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
                const result = await suspendPartnerAccount(partnerId, reason);
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

      {status === "profile" && <p className="mt-2 text-sm text-neutral-600">Waiting for the partner to submit their profile.</p>}
    </div>
  );
}
