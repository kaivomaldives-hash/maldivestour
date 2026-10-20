import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { AffiliateSignOutButton } from "@/components/affiliate/affiliate-sign-out-button";
import { Badge } from "@/components/ui/badge";
import { requireAffiliate } from "@/lib/affiliate/auth";
import { getMyAffiliateAccount } from "@/lib/affiliate/repository";
import type { AffiliateStatus } from "@/lib/affiliate/types";

export const metadata: Metadata = {
  title: "Affiliate Dashboard | MTG",
  robots: { index: false, follow: false },
};

const STATUS_LABEL: Record<AffiliateStatus, string> = {
  pending: "Pending review",
  approved: "Approved",
  rejected: "Changes requested",
  suspended: "Suspended",
};

const STATUS_TONE: Record<AffiliateStatus, "neutral" | "maldives" | "aqua" | "outline"> = {
  pending: "aqua",
  approved: "maldives",
  rejected: "outline",
  suspended: "outline",
};

/** Same shape as src/app/agent/(dashboard)/layout.tsx. */
export default async function AffiliateDashboardLayout({ children }: { children: ReactNode }) {
  await requireAffiliate();
  const account = await getMyAffiliateAccount();
  if (!account) notFound();

  return (
    <div className="min-h-screen bg-sand-50">
      <div className="flex h-14 items-center justify-between border-b border-neutral-200 bg-white px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="truncate font-semibold text-ocean-900">{account.businessName}</span>
          <Badge tone={STATUS_TONE[account.status]}>{STATUS_LABEL[account.status]}</Badge>
        </div>
        <AffiliateSignOutButton />
      </div>
      <nav className="flex gap-4 border-b border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-600 sm:px-6">
        <Link href="/affiliate" className="border-b-2 border-transparent py-3 hover:text-ocean-900">
          Profile
        </Link>
        <Link href="/affiliate/earnings" className="border-b-2 border-transparent py-3 hover:text-ocean-900">
          Earnings
        </Link>
      </nav>
      <main className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-3xl">{children}</div>
      </main>
    </div>
  );
}
