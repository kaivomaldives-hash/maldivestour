import { notFound } from "next/navigation";

import { PartnerDashboardTabs } from "@/components/partner/partner-dashboard-tabs";
import { getMyBankDetails, getMyDocuments, getMyPartnerAccount } from "@/lib/partner/repository";

export default async function PartnerDashboardPage() {
  const account = await getMyPartnerAccount();
  if (!account) notFound();

  const [bankDetails, documents] = await Promise.all([getMyBankDetails(account.id), getMyDocuments(account.id)]);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-ocean-900">Complete Your Profile</h1>
      <p className="mt-1 text-sm text-neutral-600">
        Fill in your profile, upload verification documents, and add your bank details, then submit for our team to review.
      </p>
      <div className="mt-6">
        <PartnerDashboardTabs account={account} bankDetails={bankDetails} documents={documents} />
      </div>
    </div>
  );
}
