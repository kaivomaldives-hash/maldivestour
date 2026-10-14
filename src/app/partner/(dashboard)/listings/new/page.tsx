import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { PartnerAccommodationForm } from "@/components/partner/partner-accommodation-form";
import { PartnerActivityForm } from "@/components/partner/partner-activity-form";
import { PartnerPackageForm } from "@/components/partner/partner-package-form";
import { PartnerTransferForm } from "@/components/partner/partner-transfer-form";
import type { ListingNodeType } from "@/lib/partner/listings/types";
import { getMyPartnerAccount } from "@/lib/partner/repository";
import type { PartnerKind } from "@/lib/partner/types";

const NODE_TYPE_BY_PARTNER_KIND: Record<PartnerKind, ListingNodeType> = {
  property: "accommodation",
  activity: "activity",
  package: "package",
  transfer: "transfer_route",
};

const KIND_LABEL: Record<PartnerKind, string> = {
  property: "Property",
  activity: "Activity",
  package: "Package",
  transfer: "Transfer route",
};

export default async function NewListingPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const { type } = await searchParams;
  const account = await getMyPartnerAccount();
  if (!account) notFound();
  if (account.onboardingStatus !== "approved") redirect("/partner/listings");

  const requestedNodeType = (type ?? null) as ListingNodeType | null;
  const allowedNodeTypes = account.partnerKinds.map((kind) => NODE_TYPE_BY_PARTNER_KIND[kind]);
  const nodeType = requestedNodeType && allowedNodeTypes.includes(requestedNodeType) ? requestedNodeType : allowedNodeTypes.length === 1 ? allowedNodeTypes[0] : null;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-ocean-900">New Listing</h1>
      <p className="mt-1 text-sm text-neutral-600">This will be reviewed by our team before it goes live.</p>
      <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-4 sm:p-6">
        {!nodeType ? (
          <div>
            <p className="text-sm font-medium text-neutral-700">What kind of listing do you want to create?</p>
            <div className="mt-3 flex flex-wrap gap-3">
              {account.partnerKinds.map((kind) => (
                <Link
                  key={kind}
                  href={`/partner/listings/new?type=${NODE_TYPE_BY_PARTNER_KIND[kind]}`}
                  className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium text-ocean-900 hover:border-maldives-500 hover:text-maldives-700"
                >
                  {KIND_LABEL[kind]}
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <>
            {nodeType === "accommodation" && <PartnerAccommodationForm nodeId={null} initial={null} initialLocation={null} />}
            {nodeType === "activity" && <PartnerActivityForm nodeId={null} initial={null} initialLocation={null} />}
            {nodeType === "package" && <PartnerPackageForm nodeId={null} initial={null} />}
            {nodeType === "transfer_route" && <PartnerTransferForm nodeId={null} initial={null} initialOrigin={null} initialDestination={null} />}
          </>
        )}
      </div>
    </div>
  );
}
