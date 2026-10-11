"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { submitListing } from "@/lib/partner/listings/actions";
import type { PackageListingPayload } from "@/lib/partner/listings/types";

const INPUT_CLASS =
  "min-touch-target w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:border-maldives-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-maldives-500 focus-visible:ring-offset-1";

/** Core package fields only — no itinerary builder here: the staff
 * itinerary editor (src/components/admin/package-itinerary-editor.tsx)
 * lets a stage reference ANY existing node/transfer service across
 * providers, which isn't safe to expose unscoped to a partner. Itinerary
 * curation stays a staff enrichment step after approval. */
export function PartnerPackageForm({ nodeId, initial }: { nodeId: string | null; initial: PackageListingPayload | null }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        setError(null);
        const data = new FormData(event.currentTarget);

        const payload: PackageListingPayload = {
          title: String(data.get("title") ?? ""),
          summary: String(data.get("summary") ?? "") || null,
          durationNights: Number(data.get("durationNights")) || null,
          priceFrom: Number(data.get("priceFrom")) || null,
          currency: String(data.get("currency") ?? "USD") || "USD",
        };

        startTransition(async () => {
          const result = await submitListing({ submissionKind: nodeId ? "update" : "create", nodeId, payload });
          if (!result.ok) {
            setError(result.error ?? "Something went wrong. Please try again.");
            return;
          }
          router.push("/partner/listings");
        });
      }}
    >
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-neutral-700">
          Package name <span aria-hidden="true">*</span>
        </span>
        <input name="title" type="text" required defaultValue={initial?.title ?? ""} className={INPUT_CLASS} />
      </label>

      <label className="block text-sm">
        <span className="mb-1 block font-medium text-neutral-700">Summary</span>
        <textarea name="summary" rows={3} defaultValue={initial?.summary ?? ""} className={INPUT_CLASS} />
      </label>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Duration (nights)</span>
          <input name="durationNights" type="number" min={1} defaultValue={initial?.durationNights ?? ""} className={INPUT_CLASS} />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-neutral-700">From price</span>
          <input name="priceFrom" type="number" min={0} step="0.01" defaultValue={initial?.priceFrom ?? ""} className={INPUT_CLASS} />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Currency</span>
          <input name="currency" type="text" defaultValue={initial?.currency ?? "USD"} className={INPUT_CLASS} />
        </label>
      </div>

      <p className="text-xs text-neutral-500">
        The day-by-day itinerary isn&rsquo;t part of this form — once approved, our team will build out the itinerary with you.
      </p>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="flex items-center justify-end gap-4 border-t border-neutral-200 pt-4">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Submitting…" : nodeId ? "Submit Changes for Review" : "Submit for Review"}
        </Button>
      </div>
    </form>
  );
}
