"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { updatePartnerProfile } from "@/lib/partner/actions";
import { PARTNER_KINDS, PROPERTY_TYPES, type PartnerAccount } from "@/lib/partner/types";

const INPUT_CLASS =
  "min-touch-target w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:border-maldives-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-maldives-500 focus-visible:ring-offset-1";

export function PartnerProfileForm({ account }: { account: PartnerAccount }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const kindLabel = PARTNER_KINDS.find((k) => k.value === account.partnerKind)?.label ?? account.partnerKind;
  const propertyTypeLabel = account.propertyType ? PROPERTY_TYPES.find((t) => t.value === account.propertyType)?.label : null;

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        setError(null);
        setSaved(false);
        const data = new FormData(event.currentTarget);

        startTransition(async () => {
          const result = await updatePartnerProfile({
            businessName: String(data.get("businessName") ?? ""),
            contactEmail: String(data.get("contactEmail") ?? ""),
            contactPhone: String(data.get("contactPhone") ?? "") || null,
            whatsapp: String(data.get("whatsapp") ?? "") || null,
            country: String(data.get("country") ?? "") || null,
            address: String(data.get("address") ?? "") || null,
            description: String(data.get("description") ?? "") || null,
          });
          if (!result.ok) {
            setError(result.error ?? "Something went wrong. Please try again.");
            return;
          }
          setSaved(true);
          router.refresh();
        });
      }}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <span className="mb-1 block text-sm font-medium text-neutral-700">Partner type</span>
          <p className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-600">
            {kindLabel}
            {propertyTypeLabel ? ` — ${propertyTypeLabel}` : ""}
          </p>
        </div>
      </div>

      <label className="block text-sm">
        <span className="mb-1 block font-medium text-neutral-700">
          Business name <span aria-hidden="true">*</span>
        </span>
        <input name="businessName" type="text" required defaultValue={account.businessName} className={INPUT_CLASS} />
      </label>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-neutral-700">
            Contact email <span aria-hidden="true">*</span>
          </span>
          <input name="contactEmail" type="email" required defaultValue={account.contactEmail} className={INPUT_CLASS} />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Phone</span>
          <input name="contactPhone" type="tel" defaultValue={account.contactPhone ?? ""} className={INPUT_CLASS} />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-neutral-700">WhatsApp</span>
          <input name="whatsapp" type="tel" defaultValue={account.whatsapp ?? ""} className={INPUT_CLASS} />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Country</span>
          <input name="country" type="text" defaultValue={account.country ?? ""} className={INPUT_CLASS} />
        </label>
      </div>

      <label className="block text-sm">
        <span className="mb-1 block font-medium text-neutral-700">Address</span>
        <input name="address" type="text" defaultValue={account.address ?? ""} className={INPUT_CLASS} />
      </label>

      <label className="block text-sm">
        <span className="mb-1 block font-medium text-neutral-700">About your business</span>
        <textarea name="description" rows={4} defaultValue={account.description ?? ""} className={INPUT_CLASS} />
      </label>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
      {saved && !error && <p className="text-sm text-maldives-700">Saved.</p>}

      <div className="flex items-center justify-end gap-4 border-t border-neutral-200 pt-4">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving…" : "Save Profile"}
        </Button>
      </div>
    </form>
  );
}
