"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { UserIcon } from "@/components/ui/icons";
import { createClient } from "@/lib/supabase/client";

/** Same shape as AdminAccountMenu (src/components/admin/admin-account-menu.tsx)
 * -- "Edit Profile" here just goes to /partner itself, which already IS
 * the partner's own profile page (no separate editor to build). */
export function PartnerAccountMenu({ email }: { email: string | null }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-600 hover:bg-neutral-100 hover:text-ocean-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-maldives-600"
      >
        <UserIcon className="h-4.5 w-4.5" />
      </button>
      {open && (
        <div role="menu" className="absolute right-0 z-50 mt-2 w-56 rounded-xl border border-neutral-200 bg-white py-1 shadow-lg">
          {email && <p className="truncate border-b border-neutral-100 px-4 py-2 text-xs text-neutral-500">{email}</p>}
          <Link
            href="/partner"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
          >
            Edit profile
          </Link>
          <Link
            href="/"
            target="_blank"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
          >
            View site
          </Link>
          <button
            type="button"
            role="menuitem"
            disabled={isPending}
            onClick={() => {
              startTransition(async () => {
                const supabase = createClient();
                await supabase.auth.signOut();
                router.replace("/partner/login");
                router.refresh();
              });
            }}
            className="block w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-100 disabled:opacity-50"
          >
            {isPending ? "Signing out…" : "Sign out"}
          </button>
        </div>
      )}
    </div>
  );
}
