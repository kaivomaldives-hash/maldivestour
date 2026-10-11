"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

/** Same shape as the staff LoginForm (src/components/admin/login-form.tsx),
 * just signed-in-anyone — requirePartner() (src/lib/partner/auth.ts) is
 * what actually decides whether this account has a partner_accounts row. */
export function PartnerLoginForm() {
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
        const email = String(data.get("email") ?? "").trim();
        const password = String(data.get("password") ?? "");

        startTransition(async () => {
          const supabase = createClient();
          const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
          if (signInError) {
            setError("Incorrect email or password.");
            return;
          }
          router.replace("/partner");
          router.refresh();
        });
      }}
    >
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-neutral-700">Email</span>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="min-touch-target w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:border-maldives-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-maldives-500 focus-visible:ring-offset-1"
        />
      </label>

      <label className="block text-sm">
        <span className="mb-1 block font-medium text-neutral-700">Password</span>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="min-touch-target w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:border-maldives-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-maldives-500 focus-visible:ring-offset-1"
        />
      </label>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <Button type="submit" disabled={isPending} className="w-full justify-center">
        {isPending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
