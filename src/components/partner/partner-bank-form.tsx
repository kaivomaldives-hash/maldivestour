"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { updatePartnerBankDetails } from "@/lib/partner/actions";
import type { PartnerBankDetails } from "@/lib/partner/types";

const INPUT_CLASS =
  "min-touch-target w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:border-maldives-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-maldives-500 focus-visible:ring-offset-1";

export function PartnerBankForm({ bankDetails }: { bankDetails: PartnerBankDetails | null }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        setError(null);
        setSaved(false);
        const data = new FormData(event.currentTarget);

        startTransition(async () => {
          const result = await updatePartnerBankDetails({
            accountHolderName: String(data.get("accountHolderName") ?? "") || null,
            bankName: String(data.get("bankName") ?? "") || null,
            accountNumber: String(data.get("accountNumber") ?? "") || null,
            ibanOrSwift: String(data.get("ibanOrSwift") ?? "") || null,
            branchAddress: String(data.get("branchAddress") ?? "") || null,
            currency: String(data.get("currency") ?? "USD") || "USD",
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
      <p className="text-sm text-neutral-600">
        These details are visible to MTG staff only, for processing your payouts — never shown publicly.
      </p>

      <label className="block text-sm">
        <span className="mb-1 block font-medium text-neutral-700">Account holder name</span>
        <input name="accountHolderName" type="text" defaultValue={bankDetails?.accountHolderName ?? ""} className={INPUT_CLASS} />
      </label>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Bank name</span>
          <input name="bankName" type="text" defaultValue={bankDetails?.bankName ?? ""} className={INPUT_CLASS} />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Currency</span>
          <input name="currency" type="text" defaultValue={bankDetails?.currency ?? "USD"} className={INPUT_CLASS} />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Account number</span>
          <input name="accountNumber" type="text" defaultValue={bankDetails?.accountNumber ?? ""} className={INPUT_CLASS} />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-neutral-700">IBAN / SWIFT</span>
          <input name="ibanOrSwift" type="text" defaultValue={bankDetails?.ibanOrSwift ?? ""} className={INPUT_CLASS} />
        </label>
      </div>

      <label className="block text-sm">
        <span className="mb-1 block font-medium text-neutral-700">Branch address</span>
        <input name="branchAddress" type="text" defaultValue={bankDetails?.branchAddress ?? ""} className={INPUT_CLASS} />
      </label>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
      {saved && !error && <p className="text-sm text-maldives-700">Saved.</p>}

      <div className="flex items-center justify-end gap-4 border-t border-neutral-200 pt-4">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving…" : "Save Bank Details"}
        </Button>
      </div>
    </form>
  );
}
