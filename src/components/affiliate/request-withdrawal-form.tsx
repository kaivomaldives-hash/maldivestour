"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { requestAffiliateWithdrawal } from "@/lib/affiliate/actions";
import type { AffiliatePendingPayoutRequest } from "@/lib/affiliate/types";

/** Lets an affiliate formally submit a withdrawal request instead of
 * messaging staff outside the platform — shows up on the admin Payments
 * tab (src/app/admin/(dashboard)/payments/page.tsx). Only one pending
 * request is allowed at a time (enforced by request_affiliate_payout()
 * itself), so this renders a status message instead of the form while
 * one is outstanding. */
export function RequestWithdrawalForm({
  balanceDue,
  currency,
  pendingPayoutRequest,
}: {
  balanceDue: number;
  currency: string;
  pendingPayoutRequest: AffiliatePendingPayoutRequest | null;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [amount, setAmount] = useState(balanceDue > 0 ? balanceDue.toFixed(2) : "");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (pendingPayoutRequest) {
    return (
      <div className="rounded-2xl border border-maldives-200 bg-maldives-50 p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-maldives-700">Withdrawal requested</h2>
        <p className="mt-1 text-sm text-neutral-700">
          You asked to withdraw {currency} {pendingPayoutRequest.requestedAmount.toFixed(2)} on{" "}
          {new Date(pendingPayoutRequest.requestedAt).toLocaleDateString()}. Our team will pay this out and record it here once processed.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Request Withdrawal</h2>
      <p className="mt-1 text-xs text-neutral-500">Lets our team know you&rsquo;d like to be paid out — we&rsquo;ll process it manually and record it below.</p>

      <div className="mt-3 space-y-3">
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Amount ({currency})</span>
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:border-maldives-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-maldives-500 focus-visible:ring-offset-1"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Note (optional)</span>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            placeholder="e.g. PayPal email to send to"
            className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:border-maldives-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-maldives-500 focus-visible:ring-offset-1"
          />
        </label>

        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}

        <Button
          type="button"
          disabled={isPending}
          onClick={() => {
            setError(null);
            startTransition(async () => {
              const result = await requestAffiliateWithdrawal(Number(amount), note);
              if (!result.ok) {
                setError(result.error ?? "Something went wrong.");
                return;
              }
              router.refresh();
            });
          }}
        >
          {isPending ? "Submitting…" : "Request Withdrawal"}
        </Button>
      </div>
    </div>
  );
}
