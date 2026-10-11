import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { PartnerLoginForm } from "@/components/partner/partner-login-form";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Partner Sign In | MTG",
  robots: { index: false, follow: false },
};

export default async function PartnerLoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    const { data: isPartnerResult } = await supabase.rpc("is_partner" as unknown as never);
    if (isPartnerResult) redirect("/partner");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-sand-50 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-semibold text-ocean-900">Partner Sign In</h1>
        <p className="mt-1 text-sm text-neutral-600">
          New partner?{" "}
          <Link href="/partner/signup" className="font-medium text-maldives-600 hover:underline">
            Create an account
          </Link>
          .
        </p>
        <div className="mt-6">
          <PartnerLoginForm />
        </div>
      </div>
    </main>
  );
}
