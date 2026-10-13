import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { AffiliateLoginForm } from "@/components/affiliate/affiliate-login-form";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Affiliate Sign In | MTG",
  robots: { index: false, follow: false },
};

export default async function AffiliateLoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    const { data: isAffiliateResult } = await supabase.rpc("is_affiliate" as unknown as never);
    if (isAffiliateResult) redirect("/affiliate");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-sand-50 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-semibold text-ocean-900">Affiliate Sign In</h1>
        <p className="mt-1 text-sm text-neutral-600">
          New here?{" "}
          <Link href="/affiliate/signup" className="font-medium text-maldives-600 hover:underline">
            Become an Affiliate
          </Link>
          .
        </p>
        <div className="mt-6">
          <AffiliateLoginForm />
        </div>
      </div>
    </main>
  );
}
