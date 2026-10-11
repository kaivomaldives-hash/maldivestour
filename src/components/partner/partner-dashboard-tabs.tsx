"use client";

import { useState } from "react";

import { PartnerBankForm } from "@/components/partner/partner-bank-form";
import { PartnerCalendarTab } from "@/components/partner/partner-calendar-tab";
import { PartnerProfileForm } from "@/components/partner/partner-profile-form";
import { PartnerSubmitForReview } from "@/components/partner/partner-submit-for-review";
import { PartnerVerificationTab } from "@/components/partner/partner-verification-tab";
import type { PartnerAccount, PartnerBankDetails, PartnerDocument } from "@/lib/partner/types";

const TABS = [
  { key: "profile", label: "Profile" },
  { key: "verification", label: "Verification" },
  { key: "bank", label: "Bank Details" },
  { key: "calendar", label: "Calendar" },
] as const;
type TabKey = (typeof TABS)[number]["key"];

export function PartnerDashboardTabs({
  account,
  bankDetails,
  documents,
}: {
  account: PartnerAccount;
  bankDetails: PartnerBankDetails | null;
  documents: PartnerDocument[];
}) {
  const [active, setActive] = useState<TabKey>("profile");

  return (
    <div>
      <div className="border-b border-neutral-200">
        <nav aria-label="Partner profile sections" className="flex gap-1 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActive(tab.key)}
              aria-current={active === tab.key ? "page" : undefined}
              className={`whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                active === tab.key ? "border-maldives-600 text-ocean-900" : "border-transparent text-neutral-500 hover:text-ocean-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-4 sm:p-6">
        {active === "profile" && <PartnerProfileForm account={account} />}
        {active === "verification" && <PartnerVerificationTab documents={documents} />}
        {active === "bank" && <PartnerBankForm bankDetails={bankDetails} />}
        {active === "calendar" && <PartnerCalendarTab />}
      </div>

      <PartnerSubmitForReview
        status={account.onboardingStatus}
        rejectionReason={account.rejectionReason}
        hasBankDetails={Boolean(bankDetails && (bankDetails.accountNumber || bankDetails.ibanOrSwift))}
        documentCount={documents.length}
      />
    </div>
  );
}
