import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { AffiliateSignupForm } from "@/components/affiliate/affiliate-signup-form";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Become an Affiliate | MTG",
  robots: { index: false, follow: false },
};

export default async function AffiliateSignupPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    const { data: isAffiliateResult } = await supabase.rpc("is_affiliate" as unknown as never);
    if (isAffiliateResult) redirect("/affiliate");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-sand-50 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-semibold text-ocean-900">Become an Affiliate</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Once approved, you&rsquo;ll get a referral link and code — your referrals get 5% off, and you earn 5% commission. Already have an
          account?{" "}
          <Link href="/affiliate/login" className="font-medium text-maldives-600 hover:underline">
            Sign in
          </Link>
          .
        </p>
        <div className="mt-6">
          <AffiliateSignupForm />
        </div>
      </div>
    </main>
  );
}
