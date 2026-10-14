import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { PartnerAccommodationForm } from "@/components/partner/partner-accommodation-form";
import { PartnerActivityForm } from "@/components/partner/partner-activity-form";
import { PartnerPackageForm } from "@/components/partner/partner-package-form";
import { PartnerTransferForm } from "@/components/partner/partner-transfer-form";
import { getLocationSummaryById } from "@/lib/locations/repository";
import {
  getAccommodationForEdit,
  getActivityForEdit,
  getListingNodeTypeForEdit,
  getPackageForEdit,
  getTransferRouteForEdit,
} from "@/lib/partner/listings/repository";

export default async function EditListingPage({ params }: { params: Promise<{ nodeId: string }> }) {
  const { nodeId } = await params;
  // Resolved from the node's own node_type (and ownership verified
  // there), not the partner's account kind(s) — a partner holding
  // multiple kinds no longer maps 1:1 to a single listing type.
  const nodeType = await getListingNodeTypeForEdit(nodeId);
  if (!nodeType) notFound();

  if (nodeType === "accommodation") {
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

  if (nodeType === "activity") {
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

  if (nodeType === "package") {
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
