"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { UserIcon } from "@/components/ui/icons";
import { createClient } from "@/lib/supabase/client";

type Status =
  | { kind: "loading" }
  | { kind: "anon" }
  | { kind: "in"; email: string | null; isStaff: boolean; isPartner: boolean };

/**
 * Site-wide, role-aware account menu — the one place login state shows up
 * across the whole public site, including on top of the admin/partner
 * dashboards (both still render inside the root layout's SiteHeader; see
 * that file). Deliberately entirely client-side: the root layout stays
 * free of cookies()/headers() reads on purpose (see its own comment) so
 * every public page keeps its static/ISR caching, and checking auth state
 * here instead costs nothing server-side. Re-checks on every
 * onAuthStateChange event, so sign-in/sign-out from any tab or any portal
 * updates this without a full page reload, and a fresh mount (direct URL
 * nav, refresh) always re-resolves from the current session rather than
 * trusting stale props.
 *
 * is_staff()/is_partner() are both granted to anon/authenticated (same
 * RPCs every RLS policy and requireStaff()/requirePartner() already
 * trust), so calling them from the browser client is safe and returns
 * false rather than erroring for a signed-out visitor.
 */
export function HeaderAccountMenu() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>({ kind: "loading" });
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const supabase = createClient();

    async function resolve(userId: string | undefined, email: string | null) {
      if (!userId) {
        setStatus({ kind: "anon" });
        return;
      }
      const [{ data: isStaff }, { data: isPartner }] = await Promise.all([
        supabase.rpc("is_staff" as unknown as never),
        supabase.rpc("is_partner" as unknown as never),
      ]);
      setStatus({ kind: "in", email, isStaff: Boolean(isStaff), isPartner: Boolean(isPartner) });
    }

    supabase.auth.getUser().then(({ data }) => resolve(data.user?.id, data.user?.email ?? null));

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      resolve(session?.user.id, session?.user.email ?? null);
    });

    return () => subscription.subscription.unsubscribe();
  }, []);

  if (status.kind === "loading") return null;

  if (status.kind === "anon") {
    return (
      <Link
        href="/partner/login"
        className="min-touch-target inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-ocean-900"
      >
        <UserIcon className="h-4 w-4" />
        Log in
      </Link>
    );
  }

  const { email, isStaff, isPartner } = status;

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
          {isStaff && (
            <>
              <Link
                href="/admin/profile"
                role="menuitem"
                onClick={() => setOpen(false)}
                className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
              >
                My Profile
              </Link>
              <Link
                href="/admin"
                role="menuitem"
                onClick={() => setOpen(false)}
                className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
              >
                Admin Dashboard
              </Link>
            </>
          )}
          {isPartner && (
            <Link
              href="/partner"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
            >
              Partner Portal
            </Link>
          )}
          {!isStaff && !isPartner && (
            <Link
              href="/become-a-partner"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
            >
              Become a Partner
            </Link>
          )}
          <button
            type="button"
            role="menuitem"
            disabled={isPending}
            onClick={() => {
              startTransition(async () => {
                const supabase = createClient();
                await supabase.auth.signOut();
                setOpen(false);
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
