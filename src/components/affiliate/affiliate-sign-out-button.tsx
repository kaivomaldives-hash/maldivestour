"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { createClient } from "@/lib/supabase/client";

/** Same shape as AgentSignOutButton (src/components/agent/
 * agent-sign-out-button.tsx), just redirecting to /affiliate/login. */
export function AffiliateSignOutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          const supabase = createClient();
          await supabase.auth.signOut();
          router.replace("/affiliate/login");
          router.refresh();
        });
      }}
      className="text-sm font-medium text-neutral-600 hover:text-ocean-900 disabled:opacity-50"
    >
      {isPending ? "Signing out…" : "Sign out"}
    </button>
  );
}
