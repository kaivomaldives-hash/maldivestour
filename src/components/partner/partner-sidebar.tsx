"use client";

import Link from "next/link";
import { useState } from "react";

import { PartnerNav } from "@/components/partner/partner-nav";
import type { OnboardingStatus } from "@/lib/partner/types";

const STATUS_LABEL: Record<OnboardingStatus, string> = {
  profile: "Profile incomplete",
  submitted: "Submitted — awaiting review",
  approved: "Approved",
  rejected: "Changes requested",
  suspended: "Suspended",
};

const STATUS_CLASS: Record<OnboardingStatus, string> = {
  profile: "bg-neutral-100 text-neutral-700",
  submitted: "bg-amber-100 text-amber-800",
  approved: "bg-maldives-100 text-maldives-800",
  rejected: "bg-red-100 text-red-700",
  suspended: "bg-red-100 text-red-700",
};

/**
 * Same fixed-sidebar-on-lg+/slide-in-drawer-below-that shape as
 * AdminSidebar (src/components/admin/admin-sidebar.tsx) -- the partner
 * portal's nav used to live as a row of links under the main site
 * header; this moves it to its own left sidebar so the two dashboards
 * (admin, partner) behave the same way.
 */
export function PartnerSidebar({ businessName, onboardingStatus }: { businessName: string; onboardingStatus: OnboardingStatus }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar — hidden on lg+, where the sidebar is always visible. */}
      <div className="flex h-14 items-center justify-between border-b border-neutral-200 bg-white px-4 lg:hidden">
        <Link href="/partner" className="truncate font-semibold text-ocean-900">
          {businessName}
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
      {open && <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setOpen(false)} aria-hidden="true" />}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-neutral-200 bg-white transition-transform duration-200 lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:w-64 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex shrink-0 items-start justify-between gap-2 border-b border-neutral-200 px-4 py-4">
          <div className="min-w-0">
            <Link href="/partner" className="block truncate font-semibold text-ocean-900" onClick={() => setOpen(false)}>
              {businessName}
            </Link>
            <span className={`mt-1.5 inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_CLASS[onboardingStatus]}`}>
              {STATUS_LABEL[onboardingStatus]}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="shrink-0 rounded-lg p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-ocean-900 lg:hidden"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4">
          <PartnerNav onNavigate={() => setOpen(false)} />
        </div>

        <div className="shrink-0 border-t border-neutral-200 px-4 py-4">
          <Link href="/" target="_blank" className="text-sm text-neutral-600 hover:text-ocean-900">
            View site
          </Link>
        </div>
      </aside>
    </>
  );
}
