import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { PartnerSidebar } from "@/components/partner/partner-sidebar";
import { requirePartner } from "@/lib/partner/auth";
import { getMyPartnerAccount } from "@/lib/partner/repository";

export const metadata: Metadata = {
  title: "Partner Dashboard | MTG",
  robots: { index: false, follow: false },
};

/**
 * Every route under this group (src/app/partner/(dashboard)/*) renders
 * behind requirePartner() — same Server-Component-gate shape as the admin
 * dashboard's layout.tsx. /partner/login and /partner/signup deliberately
 * sit OUTSIDE this route group so they aren't themselves gated by the
 * check that would otherwise redirect a signed-out visitor back to one of
 * them in a loop.
 *
 * Sidebar layout: same fixed-on-lg+/slide-in-drawer shape as the admin
 * dashboard's AdminSidebar -- this used to be a row of links under the
 * main site header instead. Sign-out/profile now live in the site-wide
 * HeaderAccountMenu in SiteHeader, not duplicated here.
 */
export default async function PartnerDashboardLayout({ children }: { children: ReactNode }) {
  await requirePartner();
  const account = await getMyPartnerAccount();
  if (!account) notFound();

  return (
    <div className="min-h-screen bg-sand-50 lg:flex">
      <PartnerSidebar businessName={account.businessName} onboardingStatus={account.onboardingStatus} />
      <main className="min-w-0 flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-5xl">{children}</div>
      </main>
    </div>
  );
}
