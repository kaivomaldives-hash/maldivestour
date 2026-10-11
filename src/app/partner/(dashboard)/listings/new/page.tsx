import { notFound, redirect } from "next/navigation";

import { PartnerAccommodationForm } from "@/components/partner/partner-accommodation-form";
import { PartnerActivityForm } from "@/components/partner/partner-activity-form";
import { PartnerPackageForm } from "@/components/partner/partner-package-form";
import { PartnerTransferForm } from "@/components/partner/partner-transfer-form";
import { getMyPartnerAccount } from "@/lib/partner/repository";

export default async function NewListingPage() {
  const account = await getMyPartnerAccount();
  if (!account) notFound();
  if (account.onboardingStatus !== "approved") redirect("/partner/listings");

  return (
    <div>
      <h1 className="text-2xl font-semibold text-ocean-900">New Listing</h1>
      <p className="mt-1 text-sm text-neutral-600">This will be reviewed by our team before it goes live.</p>
      <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-4 sm:p-6">
        {account.partnerKind === "property" && <PartnerAccommodationForm nodeId={null} initial={null} initialLocation={null} />}
        {account.partnerKind === "activity" && <PartnerActivityForm nodeId={null} initial={null} initialLocation={null} />}
        {account.partnerKind === "package" && <PartnerPackageForm nodeId={null} initial={null} />}
        {account.partnerKind === "transfer" && <PartnerTransferForm nodeId={null} initial={null} initialOrigin={null} initialDestination={null} />}
      </div>
    </div>
  );
}
