import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { QuickAddListing } from "@/components/partner/listing-ai";
import { ListingEditor } from "@/components/partner/listing-editor";
import { isAiEnabled } from "@/lib/ai/gemini";
import type { ListingNodeType, ListingPayload, TransferRouteListingPayload } from "@/lib/partner/listings/types";
import { getMyListingPayload, getMySubmissionForEdit } from "@/lib/partner/listings/repository";
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

/** A copy starts as a brand-new listing: new name, no link to the original. */
function asCopy(nodeType: ListingNodeType, payload: ListingPayload, keepPhotos: boolean): ListingPayload {
  const copy = { ...payload, title: `Copy of ${payload.title}`.slice(0, 200), photos: keepPhotos ? (payload.photos ?? []) : [] } as ListingPayload;
  if (nodeType === "transfer_route") {
    const transfer = copy as TransferRouteListingPayload;
    transfer.service = { ...transfer.service, id: null };
  }
  return copy;
}

/**
 * New listing, a draft picked up again, or a copy:
 *   ?type=activity          blank form of that type
 *   ?draft=<submission id>  continue a draft
 *   ?from=<submission id>   copy a draft or submission (e.g. resubmit a rejected one)
 *   ?copy=<listing id>      duplicate one of the partner's live listings
 * Partners can draft before their profile is approved; only submitting
 * waits for approval.
 */
export default async function NewListingPage({ searchParams }: { searchParams: Promise<{ type?: string; draft?: string; from?: string; copy?: string; ai?: string }> }) {
  const sp = await searchParams;
  const account = await getMyPartnerAccount();
  if (!account) notFound();
  const canSubmit = account.onboardingStatus === "approved";
  const allowedNodeTypes = account.partnerKinds.map((kind) => NODE_TYPE_BY_PARTNER_KIND[kind]);

  let heading = "New Listing";
  let editor: ReactNode = null;

  if (sp.draft) {
    const draft = await getMySubmissionForEdit(sp.draft);
    if (!draft || draft.status !== "draft") notFound();
    heading = draft.nodeId ? "Continue editing" : "Continue your draft";
    editor = (
      <>
        {sp.ai && (
          <p role="status" className="mb-6 rounded-xl border border-maldives-200 bg-maldives-50 px-4 py-3 text-sm text-neutral-700">
            AI filled in what it found in your text. Please check every field, fill in anything missing (such as the location), add photos, then send it for review.
          </p>
        )}
        <ListingEditor
          nodeType={draft.nodeType}
          nodeId={draft.nodeId}
          initial={draft.payload}
          draft={{ id: draft.id, photos: draft.payload.photos ?? [] }}
          canSubmit={canSubmit}
        />
      </>
    );
  } else if (sp.from) {
    const source = await getMySubmissionForEdit(sp.from);
    if (!source) notFound();
    // A rejected change to a live listing is resubmitted against that
    // listing; anything else becomes a new listing.
    const resubmit = source.status === "rejected";
    const nodeId = resubmit ? source.nodeId : null;
    const payload = resubmit ? source.payload : asCopy(source.nodeType, source.payload, true);
    heading = resubmit ? "Fix and resubmit" : "Duplicate listing";
    editor = <ListingEditor nodeType={source.nodeType} nodeId={nodeId} initial={payload} draft={{ id: null, photos: payload.photos ?? [] }} canSubmit={canSubmit} />;
  } else if (sp.copy) {
    const live = await getMyListingPayload(sp.copy);
    if (!live) notFound();
    // The live listing's photos belong to that listing; the copy gets its own.
    const payload = asCopy(live.nodeType, live.payload, false);
    heading = "Duplicate listing";
    editor = <ListingEditor nodeType={live.nodeType} nodeId={null} initial={payload} draft={{ id: null, photos: [] }} canSubmit={canSubmit} />;
  } else {
    const requested = (sp.type ?? null) as ListingNodeType | null;
    const nodeType = requested && allowedNodeTypes.includes(requested) ? requested : allowedNodeTypes.length === 1 ? allowedNodeTypes[0] : null;
    if (nodeType) {
      editor = (
        <>
          {isAiEnabled() && <QuickAddListing nodeType={nodeType} />}
          <ListingEditor nodeType={nodeType} nodeId={null} initial={null} draft={{ id: null, photos: [] }} canSubmit={canSubmit} />
        </>
      );
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-ocean-900">{heading}</h1>
      <p className="mt-1 text-sm text-neutral-600">
        Only the name is needed to start; fill in the rest when you can. Our team reviews every listing before it goes live.
      </p>
      <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-4 sm:p-6">
        {editor ?? (
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
        )}
      </div>
    </div>
  );
}
