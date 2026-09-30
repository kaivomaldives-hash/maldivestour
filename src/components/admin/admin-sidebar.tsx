"use client";

import Link from "next/link";
import { useState } from "react";

import { AdminNav } from "@/components/admin/admin-nav";
import { SignOutButton } from "@/components/admin/sign-out-button";

/**
 * Fixed left sidebar on lg+ screens; on smaller screens it's a slide-in
 * drawer behind a hamburger button, since a 12-item vertical nav has
 * nowhere to go on a phone-width screen otherwise. Owns its own open/
 * closed state rather than lifting it into the layout — the layout stays
 * a plain Server Component, this is the only piece that needs to be
 * interactive.
 */
export function AdminSidebar({ isAdmin, email }: { isAdmin: boolean; email: string | null }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar — hidden on lg+, where the sidebar is always visible. */}
      <div className="flex h-14 items-center justify-between border-b border-neutral-200 bg-white px-4 lg:hidden">
        <Link href="/admin" className="font-semibold text-ocean-900">
          MTG Admin
        </Link>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
          className="rounded-lg p-2 text-neutral-600 hover:bg-neutral-100 hover:text-ocean-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maldives-500"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile drawer backdrop */}
      {open && (
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setOpen(false)} aria-hidden="true" />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-neutral-200 bg-white transition-transform duration-200 lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:w-64 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-neutral-200 px-4">
          <Link href="/admin" className="font-semibold text-ocean-900" onClick={() => setOpen(false)}>
            MTG Admin
          </Link>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="rounded-lg p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-ocean-900 lg:hidden"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4">
          <AdminNav isAdmin={isAdmin} onNavigate={() => setOpen(false)} />
        </div>

        <div className="shrink-0 border-t border-neutral-200 px-4 py-4">
          {email && <p className="truncate text-xs text-neutral-500">{email}</p>}
          <div className="mt-2 flex items-center justify-between">
            <Link href="/" target="_blank" className="text-sm text-neutral-600 hover:text-ocean-900">
              View site
            </Link>
            <SignOutButton />
          </div>
        </div>
      </aside>
    </>
  );
}
