import { ListingAiProvider } from "@/components/partner/listing-ai";
import { PartnerAccommodationForm } from "@/components/partner/partner-accommodation-form";
import { PartnerActivityForm } from "@/components/partner/partner-activity-form";
import { PartnerPackageForm } from "@/components/partner/partner-package-form";
import { PartnerTransferForm } from "@/components/partner/partner-transfer-form";
import { isAiEnabled } from "@/lib/ai/gemini";
import { getLocationSummaryById } from "@/lib/locations/repository";
import type { PartnerLocationOption } from "@/lib/partner/location-search-actions";
import type {
  AccommodationListingPayload,
  ActivityListingPayload,
  ListingDraftRef,
  ListingNodeType,
  ListingPayload,
  PackageListingPayload,
  TransferRouteListingPayload,
} from "@/lib/partner/listings/types";

async function locationOption(id: string | null | undefined): Promise<PartnerLocationOption | null> {
  if (!id) return null;
  const summary = await getLocationSummaryById(id);
  return summary ? { id: summary.id, title: summary.title, locationType: summary.locationType } : null;
}

type ListingEditorProps = {
  nodeType: ListingNodeType;
  nodeId: string | null;
  initial: ListingPayload | null;
  draft: ListingDraftRef;
  canSubmit: boolean;
};

/**
 * Picks the form for a listing type and fills it in: from a draft, a copy,
 * or the live listing. `draft` carries the draft id (null for a fresh
 * draft) and its photos. The AI helpers show only when AI is set up.
 */
export async function ListingEditor(props: ListingEditorProps) {
  return <ListingAiProvider enabled={isAiEnabled()}>{await ListingForm(props)}</ListingAiProvider>;
}

async function ListingForm({
  nodeType,
  nodeId,
  initial,
  draft,
  canSubmit,
}: ListingEditorProps) {
  // A key per draft, so moving between drafts never keeps one form's state.
  const key = draft.id ?? `new-${nodeId ?? ""}`;

  if (nodeType === "accommodation") {
    const payload = initial as AccommodationListingPayload | null;
    return (
      <PartnerAccommodationForm
        key={key}
        nodeId={nodeId}
        initial={payload ? { ...payload, rooms: payload.rooms ?? [] } : null}
        initialLocation={await locationOption(payload?.locationId)}
        draft={draft}
        canSubmit={canSubmit}
      />
    );
  }
  if (nodeType === "activity") {
    const payload = initial as ActivityListingPayload | null;
    return <PartnerActivityForm key={key} nodeId={nodeId} initial={payload} initialLocation={await locationOption(payload?.locationId)} draft={draft} canSubmit={canSubmit} />;
  }
  if (nodeType === "package") {
    return <PartnerPackageForm key={key} nodeId={nodeId} initial={initial as PackageListingPayload | null} draft={draft} canSubmit={canSubmit} />;
  }
  const payload = initial as TransferRouteListingPayload | null;
  const [origin, destination] = await Promise.all([locationOption(payload?.originLocationId), locationOption(payload?.destinationLocationId)]);
  return (
    <PartnerTransferForm key={key} nodeId={nodeId} initial={payload} initialOrigin={origin} initialDestination={destination} draft={draft} canSubmit={canSubmit} />
  );
}
