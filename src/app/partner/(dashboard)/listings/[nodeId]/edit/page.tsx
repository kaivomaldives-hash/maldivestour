import { notFound } from "next/navigation";

import { ListingEditor } from "@/components/partner/listing-editor";
import { getMyDraftForNode, getMyListingPayload } from "@/lib/partner/listings/repository";
import { getMyPartnerAccount } from "@/lib/partner/repository";

export default async function EditListingPage({ params }: { params: Promise<{ nodeId: string }> }) {
  const { nodeId } = await params;
  // Resolved from the node's own node_type (and ownership verified
  // there), not the partner's account kind(s) — a partner holding
  // multiple kinds no longer maps 1:1 to a single listing type.
  const [live, draft, account] = await Promise.all([getMyListingPayload(nodeId), getMyDraftForNode(nodeId), getMyPartnerAccount()]);
  if (!live || !account) notFound();

  // Unsent changes from last time are picked up rather than started over.
  const initial = draft?.payload ?? live.payload;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-ocean-900">Edit: {live.payload.title}</h1>
      <p className="mt-1 text-sm text-neutral-600">
        Changes will be reviewed by our team before they go live — your current live listing is unaffected until then. New photos are added to the
        listing&rsquo;s gallery.
      </p>
      {draft && <p className="mt-2 text-sm text-maldives-700">You have unsent changes from earlier; they&rsquo;re loaded below.</p>}
      <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-4 sm:p-6">
        <ListingEditor
          nodeType={live.nodeType}
          nodeId={nodeId}
          initial={initial}
          draft={{ id: draft?.id ?? null, photos: draft?.payload.photos ?? [] }}
          canSubmit={account.onboardingStatus === "approved"}
        />
      </div>
    </div>
  );
}
