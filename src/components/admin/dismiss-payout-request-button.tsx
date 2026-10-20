"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { dismissPayoutRequest } from "@/lib/admin/payout-requests-actions";

/** Clears a request on the admin Payments tab without recording any
 * payout/payment — see dismissPayoutRequest's own comment for when
 * that's the right call versus just recording the real payout/payment
 * on the affiliate's/partner's own page, which resolves it automatically. */
export function DismissPayoutRequestButton({ requestId }: { requestId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");

  if (!open) {
    return (
      <Button type="button" variant="ghost" onClick={() => setOpen(true)}>
        Dismiss
      </Button>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <input
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Reason (optional)"
        className="rounded-xl border border-neutral-300 px-2.5 py-1.5 text-sm focus:border-maldives-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-maldives-500 focus-visible:ring-offset-1"
      />
      <Button
        type="button"
        variant="ghost"
        disabled={isPending}
        onClick={() => {
          startTransition(async () => {
            await dismissPayoutRequest(requestId, note);
            router.refresh();
          });
        }}
      >
        {isPending ? "Dismissing…" : "Confirm"}
      </Button>
    </div>
  );
}
