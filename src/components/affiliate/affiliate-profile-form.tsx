"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { updateAffiliateProfile } from "@/lib/affiliate/actions";
import type { AffiliateAccount } from "@/lib/affiliate/types";

const INPUT_CLASS =
  "min-touch-target w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:border-maldives-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-maldives-500 focus-visible:ring-offset-1";

/** Same shape as AgentProfileForm (src/components/agent/
 * agent-profile-form.tsx) — referral_code is never editable here either,
 * rejected a second time by prevent_affiliate_self_review() even if
 * someone tried to send it. */
export function AffiliateProfileForm({ account }: { account: AffiliateAccount }) {
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
          const result = await updateAffiliateProfile({
            businessName: String(data.get("businessName") ?? ""),
            contactPhone: String(data.get("contactPhone") ?? "") || null,
            whatsapp: String(data.get("whatsapp") ?? "") || null,
            country: String(data.get("country") ?? "") || null,
            paypalEmail: String(data.get("paypalEmail") ?? "") || null,
          });
          if (!result.ok) {
            setError(result.error ?? "Something went wrong.");
            return;
          }
          setSaved(true);
          router.refresh();
        });
      }}
    >
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-neutral-700">
          Name / business name <span aria-hidden="true">*</span>
        </span>
        <input name="businessName" type="text" required defaultValue={account.businessName} className={INPUT_CLASS} />
      </label>

      <label className="block text-sm">
        <span className="mb-1 block font-medium text-neutral-700">Contact email</span>
        <input type="email" disabled value={account.contactEmail} className={`${INPUT_CLASS} bg-neutral-50 text-neutral-500`} />
        <span className="mt-1 block text-xs text-neutral-500">Your sign-in email — contact us to change it.</span>
      </label>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Phone</span>
          <input name="contactPhone" type="tel" defaultValue={account.contactPhone ?? ""} className={INPUT_CLASS} />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-neutral-700">WhatsApp</span>
          <input name="whatsapp" type="tel" defaultValue={account.whatsapp ?? ""} className={INPUT_CLASS} />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Country</span>
          <input name="country" type="text" defaultValue={account.country ?? ""} className={INPUT_CLASS} />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-neutral-700">PayPal email</span>
          <input name="paypalEmail" type="email" defaultValue={account.paypalEmail ?? ""} className={INPUT_CLASS} />
          <span className="mt-1 block text-xs text-neutral-500">Where a future commission payout would be sent.</span>
        </label>
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
      {saved && !error && <p className="text-sm text-maldives-700">Saved.</p>}

      <div className="flex items-center justify-end gap-4 border-t border-neutral-200 pt-4">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
