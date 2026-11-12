"use client";

import { useCallback } from "react";

import { CommissionPercentField } from "@/components/partner/commission-percent-field";
import { ListingFormShell } from "@/components/partner/listing-form-shell";
import type { ListingDraftRef, PackageListingPayload } from "@/lib/partner/listings/types";

const INPUT_CLASS =
  "min-touch-target w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:border-maldives-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-maldives-500 focus-visible:ring-offset-1";

/** Core package fields only — no itinerary builder here: the staff
 * itinerary editor (src/components/admin/package-itinerary-editor.tsx)
 * lets a stage reference ANY existing node/transfer service across
 * providers, which isn't safe to expose unscoped to a partner. Itinerary
 * curation stays a staff enrichment step after approval. */
export function PartnerPackageForm({
  nodeId,
  initial,
  draft = null,
  canSubmit = true,
}: {
  nodeId: string | null;
  initial: PackageListingPayload | null;
  draft?: ListingDraftRef | null;
  canSubmit?: boolean;
}) {
  const buildPayload = useCallback(
    (data: FormData): PackageListingPayload => ({
      title: String(data.get("title") ?? ""),
      summary: String(data.get("summary") ?? "") || null,
      durationNights: Number(data.get("durationNights")) || null,
      priceFrom: Number(data.get("priceFrom")) || null,
      currency: String(data.get("currency") ?? "USD") || "USD",
      commissionPercent: Number(data.get("commissionPercent")) || 15,
    }),
    [],
  );

  return (
    <ListingFormShell nodeType="package" nodeId={nodeId} draft={draft} canSubmit={canSubmit} buildPayload={buildPayload}>
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

      <CommissionPercentField defaultValue={initial?.commissionPercent ?? null} />

      <p className="text-xs text-neutral-500">
        The day-by-day itinerary isn&rsquo;t part of this form — once approved, our team will build out the itinerary with you.
      </p>
    </ListingFormShell>
  );
}
