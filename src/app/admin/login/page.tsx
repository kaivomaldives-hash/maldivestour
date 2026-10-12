import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/admin/login-form";
import { SignOutButton } from "@/components/admin/sign-out-button";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Admin Sign In | MTG",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ reason?: string }> }) {
  const { reason } = await searchParams;

  // Already signed in and staff? Skip straight to the dashboard rather
  // than showing a pointless login form. Not signed in at all: fall
  // through and show the form, same as always. Signed in but NOT staff:
  // this is the one case worth being explicit about — the admin and
  // partner portals share one Supabase Auth session per browser, so
  // testing a partner account in the same browser silently signs you out
  // of admin, and a plain "sign in" form with no explanation looks like
  // nothing happened at all.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  let notStaffEmail: string | null = null;
  if (user) {
    const { data: isStaffResult } = await supabase.rpc("is_staff" as unknown as never);
    if (isStaffResult) redirect("/admin");
    notStaffEmail = user.email ?? "this account";
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-sand-50 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-semibold text-ocean-900">MTG Admin</h1>
        <p className="mt-1 text-sm text-neutral-600">Sign in with your staff account.</p>

        {reason === "not_staff" && notStaffEmail && (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            <p>
              You&rsquo;re currently signed in as <strong>{notStaffEmail}</strong>, which isn&rsquo;t a staff account.
            </p>
            <p className="mt-2">Sign out first, then sign in below with a staff account.</p>
            <div className="mt-2">
              <SignOutButton />
            </div>
          </div>
        )}

        <div className="mt-6">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
