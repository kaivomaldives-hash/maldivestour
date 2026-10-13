"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { createAffiliateAccount } from "@/lib/affiliate/actions";
import { createClient } from "@/lib/supabase/client";

const INPUT_CLASS =
  "min-touch-target w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:border-maldives-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-maldives-500 focus-visible:ring-offset-1";

/** Self-service Affiliate signup — same shape as AgentSignupForm
 * (src/components/agent/agent-signup-form.tsx). A referral code/link is
 * generated at signup, but — per the task's own requirement — stays
 * inert until admin approval: is_approved_affiliate() (not is_affiliate())
 * is what Phase 2+'s discount/commission logic will gate on. */
export function AffiliateSignupForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [needsEmailConfirmation, setNeedsEmailConfirmation] = useState(false);
  const [existingAccountEmail, setExistingAccountEmail] = useState<string | null>(null);
  const [resendState, setResendState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [isResending, startResend] = useTransition();

  if (existingAccountEmail) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center">
        <p className="text-lg font-semibold text-ocean-900">That email is already registered</p>
        <p className="mt-2 text-sm text-neutral-700">
          An account for <strong>{existingAccountEmail}</strong> already exists. If you haven&rsquo;t confirmed it yet, check your inbox
          (and spam folder) for the original email, or resend it below. Already confirmed?{" "}
          <Link href="/affiliate/login" className="font-medium text-maldives-600 hover:underline">
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
                options: { emailRedirectTo: `${window.location.origin}/auth/confirm?next=/affiliate` },
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
          We&rsquo;ve sent a confirmation link to your email address. Click it, then come back and sign in to reach your affiliate dashboard.
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
        const businessName = String(data.get("businessName") ?? "").trim();
        const email = String(data.get("email") ?? "").trim();
        const password = String(data.get("password") ?? "");
        const contactPhone = String(data.get("contactPhone") ?? "").trim() || null;
        const country = String(data.get("country") ?? "").trim() || null;
        const paypalEmail = String(data.get("paypalEmail") ?? "").trim() || null;

        startTransition(async () => {
          const supabase = createClient();
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: { affiliateApplication: true, businessName, contactPhone, country, paypalEmail },
              emailRedirectTo: `${window.location.origin}/auth/confirm?next=/affiliate`,
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

          const result = await createAffiliateAccount({
            businessName,
            contactEmail: email,
            contactPhone,
            whatsapp: null,
            country,
            paypalEmail,
          });
          if (!result.ok) {
            setError(result.error ?? "Something went wrong. Please try again.");
            return;
          }
          router.replace("/affiliate");
          router.refresh();
        });
      }}
    >
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-neutral-700">
          Name or business name <span aria-hidden="true">*</span>
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Country (optional)</span>
          <input name="country" type="text" className={INPUT_CLASS} />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-neutral-700">PayPal email (optional)</span>
          <input name="paypalEmail" type="email" className={INPUT_CLASS} />
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
          {isPending ? "Creating account…" : "Apply as an Affiliate"}
        </Button>
      </div>
    </form>
  );
}
