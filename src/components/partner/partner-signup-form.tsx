"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { createPartnerAccount } from "@/lib/partner/actions";
import { PARTNER_KINDS, PROPERTY_TYPES, type PartnerKind, type PropertyType } from "@/lib/partner/types";
import { createClient } from "@/lib/supabase/client";

const INPUT_CLASS =
  "min-touch-target w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:border-maldives-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-maldives-500 focus-visible:ring-offset-1";

/**
 * Self-service partner signup — property/activity/package/transfer
 * operators only (international travel agents etc. still use the lead
 * form at /become-a-partner). On submit: `supabase.auth.signUp()` creates
 * the login, then `createPartnerAccount()` (a Server Action wrapping the
 * `create_partner_account` RPC) creates the matching partner_accounts +
 * providers + nodes rows, all in one request-response round trip — no
 * admin approval gate at this step, by design (that gate is later, on the
 * completed profile, not on the account itself).
 *
 * If the Supabase project requires email confirmation, `signUp()` returns
 * no session — this form surfaces that as "check your email" rather than
 * erroring, since either project setting is a legitimate configuration.
 */
export function PartnerSignupForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [needsEmailConfirmation, setNeedsEmailConfirmation] = useState(false);
  const [partnerKind, setPartnerKind] = useState<PartnerKind | "">("");

  if (needsEmailConfirmation) {
    return (
      <div className="rounded-2xl border border-maldives-200 bg-maldives-50 p-6 text-center">
        <p className="text-lg font-semibold text-ocean-900">Check your email</p>
        <p className="mt-2 text-sm text-neutral-700">
          We&rsquo;ve sent a confirmation link to your email address. Click it, then come back and sign in to finish setting
          up your partner account.
        </p>
      </div>
    );
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        setError(null);
        const data = new FormData(event.currentTarget);
        const kind = String(data.get("partnerKind") ?? "") as PartnerKind;
        const propertyType = kind === "property" ? (String(data.get("propertyType") ?? "") as PropertyType) : null;
        const businessName = String(data.get("businessName") ?? "").trim();
        const email = String(data.get("email") ?? "").trim();
        const password = String(data.get("password") ?? "");
        const contactPhone = String(data.get("contactPhone") ?? "").trim() || null;

        if (kind === "property" && !propertyType) {
          setError("Please choose a property type.");
          return;
        }

        startTransition(async () => {
          const supabase = createClient();
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password });
          if (signUpError) {
            setError(signUpError.message);
            return;
          }
          if (!signUpData.session) {
            setNeedsEmailConfirmation(true);
            return;
          }

          const result = await createPartnerAccount({
            partnerKind: kind,
            propertyType,
            businessName,
            contactEmail: email,
            contactPhone,
          });
          if (!result.ok) {
            setError(result.error ?? "Something went wrong. Please try again.");
            return;
          }
          router.replace("/partner");
          router.refresh();
        });
      }}
    >
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-neutral-700">
          Partner type <span aria-hidden="true">*</span>
        </span>
        <select
          name="partnerKind"
          required
          value={partnerKind}
          onChange={(event) => setPartnerKind(event.target.value as PartnerKind)}
          className={INPUT_CLASS}
        >
          <option value="" disabled>
            Select a partner type
          </option>
          {PARTNER_KINDS.map((k) => (
            <option key={k.value} value={k.value}>
              {k.label}
            </option>
          ))}
        </select>
      </label>

      {partnerKind === "property" && (
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-neutral-700">
            Property type <span aria-hidden="true">*</span>
          </span>
          <select name="propertyType" required defaultValue="" className={INPUT_CLASS}>
            <option value="" disabled>
              Select a property type
            </option>
            {PROPERTY_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
      )}

      <label className="block text-sm">
        <span className="mb-1 block font-medium text-neutral-700">
          Business name <span aria-hidden="true">*</span>
        </span>
        <input name="businessName" type="text" required className={INPUT_CLASS} />
      </label>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-neutral-700">
            Email <span aria-hidden="true">*</span>
          </span>
          <input name="email" type="email" required autoComplete="email" className={INPUT_CLASS} />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Phone (optional)</span>
          <input name="contactPhone" type="tel" autoComplete="tel" className={INPUT_CLASS} />
        </label>
      </div>

      <label className="block text-sm">
        <span className="mb-1 block font-medium text-neutral-700">
          Password <span aria-hidden="true">*</span>
        </span>
        <input name="password" type="password" required minLength={8} autoComplete="new-password" className={INPUT_CLASS} />
      </label>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="flex items-center justify-end gap-4 border-t border-neutral-200 pt-4">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Creating account…" : "Create Partner Account"}
        </Button>
      </div>
    </form>
  );
}
