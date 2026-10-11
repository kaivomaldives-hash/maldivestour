"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { updateMyBookingStatus } from "@/lib/partner/bookings/actions";
import type { PartnerBookingStatus } from "@/lib/partner/bookings/repository";

export function PartnerBookingActions({ bookingId, status }: { bookingId: string; status: PartnerBookingStatus }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  if (status === "confirmed" || status === "cancelled" || status === "completed") {
    return <span className="text-xs text-neutral-400">No actions available</span>;
  }

  return (
    <div className="flex flex-col items-end gap-1">
      {error && <p className="text-xs text-red-600">{error}</p>}
      <div className="flex gap-2">
        <button
          type="button"
          disabled={isPending}
          onClick={() => {
            setError(null);
            startTransition(async () => {
              const result = await updateMyBookingStatus(bookingId, "confirmed");
              if (!result.ok) {
                setError(result.error ?? "Something went wrong.");
                return;
              }
              router.refresh();
            });
          }}
          className="rounded-full bg-maldives-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-maldives-700 disabled:opacity-50"
        >
          Confirm
        </button>
        <button
          type="button"
          disabled={isPending}
          onClick={() => {
            setError(null);
            startTransition(async () => {
              const result = await updateMyBookingStatus(bookingId, "cancelled");
              if (!result.ok) {
                setError(result.error ?? "Something went wrong.");
                return;
              }
              router.refresh();
            });
          }}
          className="rounded-full border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-100 disabled:opacity-50"
        >
          Decline
        </button>
      </div>
    </div>
  );
}
