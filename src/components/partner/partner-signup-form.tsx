"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { AgreeToTermsCheckbox } from "@/components/legal/agree-to-terms-checkbox";
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
  // Supabase silently no-ops signUp() for an email that already has an
  // account (even an unconfirmed one) — no error, no new email sent,
  // `session` null — to avoid leaking which emails are registered. That
  // looks identical to a fresh "check your email" success unless we
  // check `user.identities` (empty array only in this exact case) and
  // say so plainly, with a way to actually get a new email sent.
  const [existingAccountEmail, setExistingAccountEmail] = useState<string | null>(null);
  const [resendState, setResendState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [partnerKind, setPartnerKind] = useState<PartnerKind | "">("");
  const [isResending, startResend] = useTransition();

  if (existingAccountEmail) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center">
        <p className="text-lg font-semibold text-ocean-900">That email is already registered</p>
        <p className="mt-2 text-sm text-neutral-700">
          An account for <strong>{existingAccountEmail}</strong> already exists. If you haven&rsquo;t confirmed it yet, check your
          inbox (and spam folder) for the original email, or resend it below. Already confirmed?{" "}
          <Link href="/partner/login" className="font-medium text-maldives-600 hover:underline">
            Sign in instead
          </Link>
          .
        </p>
        <button
          type="button"
          disabled={isResending || resendState === "sent"}
          onClick={() => {
            startResend(async () => {
              setResendState("sending");
              const supabase = createClient();
              const { error: resendError } = await supabase.auth.resend({
                type: "signup",
                email: existingAccountEmail,
                options: { emailRedirectTo: `${window.location.origin}/auth/confirm?next=/partner` },
              });
              setResendState(resendError ? "error" : "sent");
            });
          }}
          className="mt-4 inline-flex items-center justify-center rounded-full bg-maldives-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-maldives-700 disabled:opacity-50"
        >
          {resendState === "sending" ? "Sending…" : resendState === "sent" ? "Confirmation email sent" : "Resend confirmation email"}
        </button>
        {resendState === "error" && <p className="mt-2 text-sm text-red-600">Couldn&rsquo;t resend right now. Please try again shortly.</p>}
      </div>
    );
  }

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
        const agreedToTerms = data.get("agreedToTerms") === "on";

        if (kind === "property" && !propertyType) {
          setError("Please choose a property type.");
          return;
        }
        if (!agreedToTerms) {
          setError("Please agree to the Terms and Conditions to continue.");
          return;
        }

        startTransition(async () => {
          const supabase = createClient();
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              // Persists on the auth user regardless of whether email
              // confirmation is required, so /auth/confirm can create the
              // partner_accounts row later if this signup doesn't get a
              // session immediately (see that route's own comment).
              data: { partnerKind: kind, propertyType, businessName, contactPhone },
              emailRedirectTo: `${window.location.origin}/auth/confirm?next=/partner`,
            },
          });
          if (signUpError) {
            setError(signUpError.message);
            return;
          }
          if (!signUpData.session) {
            if ((signUpData.user?.identities?.length ?? 0) === 0) {
              setExistingAccountEmail(email);
              return;
            }
            setNeedsEmailConfirmation(true);
            return;
          }

          const result = await createPartnerAccount({
            partnerKind: kind,
            propertyType,
            businessName,
            contactEmail: email,
            contactPhone,
            agreedToTerms,
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

      <AgreeToTermsCheckbox />

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
