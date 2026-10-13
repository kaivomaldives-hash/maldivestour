import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { AgentSignupForm } from "@/components/agent/agent-signup-form";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Become a Travel Agent | MTG",
  robots: { index: false, follow: false },
};

export default async function AgentSignupPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    const { data: isAgentResult } = await supabase.rpc("is_agent" as unknown as never);
    if (isAgentResult) redirect("/agent");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-sand-50 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-semibold text-ocean-900">Apply as a Travel Agent</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Once approved, you&rsquo;ll get a 10% discount on eligible rates. Already have an account?{" "}
          <Link href="/agent/login" className="font-medium text-maldives-600 hover:underline">
            Sign in
          </Link>
          .
        </p>
        <div className="mt-6">
          <AgentSignupForm />
        </div>
      </div>
    </main>
  );
}
