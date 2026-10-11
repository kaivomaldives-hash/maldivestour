import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { PartnerAccommodationForm } from "@/components/partner/partner-accommodation-form";
import { PartnerActivityForm } from "@/components/partner/partner-activity-form";
import { PartnerPackageForm } from "@/components/partner/partner-package-form";
import { PartnerTransferForm } from "@/components/partner/partner-transfer-form";
import { getLocationSummaryById } from "@/lib/locations/repository";
import { getAccommodationForEdit, getActivityForEdit, getPackageForEdit, getTransferRouteForEdit } from "@/lib/partner/listings/repository";
import { getMyPartnerAccount } from "@/lib/partner/repository";

export default async function EditListingPage({ params }: { params: Promise<{ nodeId: string }> }) {
  const { nodeId } = await params;
  const account = await getMyPartnerAccount();
  if (!account) notFound();

  if (account.partnerKind === "property") {
    const initial = await getAccommodationForEdit(nodeId);
    if (!initial) notFound();
    const initialLocation = initial.locationId ? await getLocationSummaryById(initial.locationId) : null;
    return (
      <EditShell title={initial.title}>
        <PartnerAccommodationForm
          nodeId={nodeId}
          initial={initial}
          initialLocation={initialLocation ? { id: initialLocation.id, title: initialLocation.title, locationType: initialLocation.locationType } : null}
        />
      </EditShell>
    );
  }

  if (account.partnerKind === "activity") {
    const initial = await getActivityForEdit(nodeId);
    if (!initial) notFound();
    const initialLocation = initial.locationId ? await getLocationSummaryById(initial.locationId) : null;
    return (
      <EditShell title={initial.title}>
        <PartnerActivityForm
          nodeId={nodeId}
          initial={initial}
          initialLocation={initialLocation ? { id: initialLocation.id, title: initialLocation.title, locationType: initialLocation.locationType } : null}
        />
      </EditShell>
    );
  }

  if (account.partnerKind === "package") {
    const initial = await getPackageForEdit(nodeId);
    if (!initial) notFound();
    return (
      <EditShell title={initial.title}>
        <PartnerPackageForm nodeId={nodeId} initial={initial} />
      </EditShell>
    );
  }

  const initial = await getTransferRouteForEdit(nodeId);
  if (!initial) notFound();
  const [originLocation, destinationLocation] = await Promise.all([
    getLocationSummaryById(initial.originLocationId),
    getLocationSummaryById(initial.destinationLocationId),
  ]);
  return (
    <EditShell title={initial.title}>
      <PartnerTransferForm
        nodeId={nodeId}
        initial={initial}
        initialOrigin={originLocation ? { id: originLocation.id, title: originLocation.title, locationType: originLocation.locationType } : null}
        initialDestination={destinationLocation ? { id: destinationLocation.id, title: destinationLocation.title, locationType: destinationLocation.locationType } : null}
      />
    </EditShell>
  );
}

function EditShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-ocean-900">Edit: {title}</h1>
      <p className="mt-1 text-sm text-neutral-600">Changes will be reviewed by our team before they go live — your current live listing is unaffected until then.</p>
      <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-4 sm:p-6">{children}</div>
    </div>
  );
}
