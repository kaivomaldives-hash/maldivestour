"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { requestPartnerPaymentNotice } from "@/lib/partner/actions";
import type { PartnerPendingPaymentNotice } from "@/lib/partner/bookings/repository";

/** Lets a partner formally notify staff that they've sent their owed
 * commission instead of messaging outside the platform — shows up on the
 * admin Payments tab. Unlike the affiliate withdrawal request, this is
 * not asking MTG for money: the partner owes MTG, so this is a "please
 * go confirm what I sent" notice (see request_partner_payment_notice's
 * own comment). Only one pending notice is allowed at a time. */
export function NotifyPaymentSentForm({
  balanceDue,
  currency,
  pendingPaymentNotice,
}: {
  balanceDue: number;
  currency: string;
  pendingPaymentNotice: PartnerPendingPaymentNotice | null;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [amount, setAmount] = useState(balanceDue > 0 ? balanceDue.toFixed(2) : "");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (pendingPaymentNotice) {
    return (
      <div className="rounded-2xl border border-maldives-200 bg-maldives-50 p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-maldives-700">Payment reported</h2>
        <p className="mt-1 text-sm text-neutral-700">
          You reported sending {currency} {pendingPaymentNotice.requestedAmount.toFixed(2)} on{" "}
          {new Date(pendingPaymentNotice.requestedAt).toLocaleDateString()}. Our team will confirm receipt and record it below.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Notify Payment Sent</h2>
      <p className="mt-1 text-xs text-neutral-500">
        Already sent us your owed commission outside the platform? Let us know so we can confirm it and clear your balance.
      </p>

      <div className="mt-3 space-y-3">
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Amount sent ({currency})</span>
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
            placeholder="e.g. Sent via bank transfer on Oct 20"
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
              const result = await requestPartnerPaymentNotice(Number(amount), note);
              if (!result.ok) {
                setError(result.error ?? "Something went wrong.");
                return;
              }
              router.refresh();
            });
          }}
        >
          {isPending ? "Submitting…" : "Notify Payment Sent"}
        </Button>
      </div>
    </div>
  );
}
