import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { AgentLoginForm } from "@/components/agent/agent-login-form";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Travel Agent Sign In | MTG",
  robots: { index: false, follow: false },
};

export default async function AgentLoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    const { data: isAgentResult } = await supabase.rpc("is_agent" as unknown as never);
    if (isAgentResult) redirect("/agent");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-sand-50 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-semibold text-ocean-900">Travel Agent Sign In</h1>
        <p className="mt-1 text-sm text-neutral-600">
          New here?{" "}
          <Link href="/agent/signup" className="font-medium text-maldives-600 hover:underline">
            Apply as a Travel Agent
          </Link>
          .
        </p>
        <div className="mt-6">
          <AgentLoginForm />
        </div>
      </div>
    </main>
  );
}
