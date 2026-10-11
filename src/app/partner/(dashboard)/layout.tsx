import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { PartnerSignOutButton } from "@/components/partner/partner-sign-out-button";
import { requirePartner } from "@/lib/partner/auth";
import { getMyPartnerAccount } from "@/lib/partner/repository";
import type { OnboardingStatus } from "@/lib/partner/types";

export const metadata: Metadata = {
  title: "Partner Dashboard | MTG",
  robots: { index: false, follow: false },
};

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
 * Every route under this group (src/app/partner/(dashboard)/*) renders
 * behind requirePartner() — same Server-Component-gate shape as the admin
 * dashboard's layout.tsx. /partner/login and /partner/signup deliberately
 * sit OUTSIDE this route group so they aren't themselves gated by the
 * check that would otherwise redirect a signed-out visitor back to one of
 * them in a loop.
 */
export default async function PartnerDashboardLayout({ children }: { children: ReactNode }) {
  await requirePartner();
  const account = await getMyPartnerAccount();
  if (!account) notFound();

  return (
    <div className="min-h-screen bg-sand-50">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div>
            <Link href="/partner" className="font-semibold text-ocean-900">
              {account.businessName}
            </Link>
            <span className={`ml-3 inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_CLASS[account.onboardingStatus]}`}>
              {STATUS_LABEL[account.onboardingStatus]}
            </span>
          </div>
          <nav aria-label="Partner" className="flex items-center gap-4 text-sm font-medium">
            <Link href="/partner" className="text-neutral-600 hover:text-ocean-900">
              Profile
            </Link>
            <Link href="/partner/listings" className="text-neutral-600 hover:text-ocean-900">
              My Listings
            </Link>
            <Link href="/partner/bookings" className="text-neutral-600 hover:text-ocean-900">
              Bookings
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/" target="_blank" className="text-sm text-neutral-600 hover:text-ocean-900">
              View site
            </Link>
            <PartnerSignOutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
