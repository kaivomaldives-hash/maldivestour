import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { PartnerSignupForm } from "@/components/partner/partner-signup-form";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Become a Partner | MTG",
  robots: { index: false, follow: false },
};

export default async function PartnerSignupPage() {
  // Already signed in as a partner? Skip straight to the dashboard.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    const { data: isPartnerResult } = await supabase.rpc("is_partner" as unknown as never);
    if (isPartnerResult) redirect("/partner");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-sand-50 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-semibold text-ocean-900">Create Your Partner Account</h1>
        <p className="mt-1 text-sm text-neutral-600">
          For property, activity, package, and transfer operators. Already have an account?{" "}
          <Link href="/partner/login" className="font-medium text-maldives-600 hover:underline">
            Sign in
          </Link>
          .
        </p>
        <div className="mt-6">
          <PartnerSignupForm />
        </div>
      </div>
    </main>
  );
}
