"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { recordAffiliatePayout } from "@/lib/admin/affiliate-accounts-actions";

/** Records a manual payout against an affiliate's balance — see
 * recordAffiliatePayout's own comment for why this is bookkeeping only,
 * never a real money transfer. */
export function AffiliatePayoutForm({ affiliateId, balanceDue, currency }: { affiliateId: string; balanceDue: number; currency: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [amount, setAmount] = useState(balanceDue > 0 ? balanceDue.toFixed(2) : "");
  const [method, setMethod] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Record Payout</h2>
      <p className="mt-1 text-xs text-neutral-500">Logs that you paid this affiliate outside the platform — nothing is transferred automatically.</p>

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
          <span className="mb-1 block font-medium text-neutral-700">Method</span>
          <input
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            placeholder="e.g. Bank transfer, PayPal"
            className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:border-maldives-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-maldives-500 focus-visible:ring-offset-1"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Note (optional)</span>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:border-maldives-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-maldives-500 focus-visible:ring-offset-1"
          />
        </label>

        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}
        {message && <p className="text-sm text-maldives-600">{message}</p>}

        <Button
          type="button"
          disabled={isPending}
          onClick={() => {
            setError(null);
            setMessage(null);
            startTransition(async () => {
              const result = await recordAffiliatePayout(affiliateId, Number(amount), method, note);
              if (!result.ok) {
                setError(result.error ?? "Something went wrong.");
                return;
              }
              setMessage("Payout recorded.");
              setNote("");
              router.refresh();
            });
          }}
        >
          {isPending ? "Saving…" : "Record Payout"}
        </Button>
      </div>
    </div>
  );
}
