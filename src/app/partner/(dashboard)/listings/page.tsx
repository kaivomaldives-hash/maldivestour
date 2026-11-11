import Link from "next/link";
import { notFound } from "next/navigation";

import { DeleteDraftButton } from "@/components/partner/delete-draft-button";
import { Button } from "@/components/ui/button";
import { getMyListingDrafts, getMyListingSubmissions, getMyListings } from "@/lib/partner/listings/repository";
import type { ListingNodeType } from "@/lib/partner/listings/types";
import { getMyPartnerAccount } from "@/lib/partner/repository";
import type { PartnerKind } from "@/lib/partner/types";

const NODE_TYPE_BY_PARTNER_KIND: Record<PartnerKind, ListingNodeType> = {
  property: "accommodation",
  activity: "activity",
  package: "package",
  transfer: "transfer_route",
};

const NODE_TYPE_LABEL: Record<ListingNodeType, string> = {
  accommodation: "Property",
  activity: "Activity",
  package: "Package",
  transfer_route: "Transfer route",
};

const SUBMISSION_STATUS_CLASS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-maldives-100 text-maldives-800",
  rejected: "bg-red-100 text-red-700",
};

export default async function PartnerListingsPage({ searchParams }: { searchParams: Promise<{ submitted?: string }> }) {
  const { submitted } = await searchParams;
  const account = await getMyPartnerAccount();
  if (!account) notFound();

  const nodeTypes = account.partnerKinds.map((kind) => NODE_TYPE_BY_PARTNER_KIND[kind]);
  const [listingsByType, submissions, drafts] = await Promise.all([
    Promise.all(nodeTypes.map((nodeType) => getMyListings(nodeType))),
    getMyListingSubmissions(),
    getMyListingDrafts(),
  ]);
  const listings = listingsByType.flat();
  const pendingOrRejected = submissions.filter((s) => s.status !== "approved");
  const approved = account.onboardingStatus === "approved";
  const isEmpty = listings.length === 0 && drafts.length === 0 && pendingOrRejected.length === 0;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-ocean-900">My Listings</h1>
          <p className="mt-1 text-sm text-neutral-600">{nodeTypes.map((t) => NODE_TYPE_LABEL[t]).join(", ")} listings — new ones and changes need admin approval before they go live.</p>
        </div>
        <Button href="/partner/listings/new">+ New Listing</Button>
      </div>

      {submitted && (
        <p role="status" className="mt-6 rounded-xl bg-maldives-50 p-3 text-sm text-maldives-800">
          Sent for review. We&rsquo;ll email you when it&rsquo;s live, usually within a day.
        </p>
      )}

      {!approved && (
        <p className="mt-6 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
          Your partner profile is still being reviewed. You can already prepare your listings as drafts; send them for review once you&rsquo;re approved.
        </p>
      )}

      {isEmpty && (
        <div className="mt-8 rounded-2xl border border-dashed border-neutral-300 bg-white p-6 text-center">
          <p className="font-medium text-ocean-900">Add your first listing in a few minutes</p>
          <p className="mx-auto mt-1 max-w-md text-sm text-neutral-600">
            Start with just a name and a few photos. Everything saves automatically, so you can finish it later. Have many similar products? Create one,
            then use Duplicate.
          </p>
          <div className="mt-4">
            <Button href="/partner/listings/new">+ New Listing</Button>
          </div>
        </div>
      )}

      {drafts.length > 0 && (
        <div className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Drafts</h2>
          <ul className="mt-3 space-y-2">
            {drafts.map((d) => (
              <li key={d.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-neutral-200 bg-white p-3">
                <div>
                  <p className="text-sm font-medium text-neutral-900">
                    {d.nodeId ? "Changes to: " : ""}
                    {d.title}
                  </p>
                  <p className="mt-0.5 text-xs text-neutral-500">
                    {NODE_TYPE_LABEL[d.nodeType]} · saved {new Date(d.updatedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-4">
                  <Link href={`/partner/listings/new?draft=${d.id}`} className="text-sm font-medium text-maldives-600 hover:underline">
                    Continue
                  </Link>
                  {!d.nodeId && (
                    <Link href={`/partner/listings/new?from=${d.id}`} className="text-sm font-medium text-maldives-600 hover:underline">
                      Duplicate
                    </Link>
                  )}
                  <DeleteDraftButton draftId={d.id} title={d.title} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {pendingOrRejected.length > 0 && (
        <div className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Submissions awaiting review</h2>
          <ul className="mt-3 space-y-2">
            {pendingOrRejected.map((s) => (
              <li key={s.id} className="rounded-xl border border-neutral-200 bg-white p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-medium text-neutral-900">
                    {s.submissionKind === "create" ? "New: " : "Update: "}
                    {s.title}
                  </span>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${SUBMISSION_STATUS_CLASS[s.status]}`}>{s.status}</span>
                </div>
                {s.status === "rejected" && s.adminNote && <p className="mt-1 text-sm text-red-700">{s.adminNote}</p>}
                {s.status === "rejected" && (
                  <Link href={`/partner/listings/new?from=${s.id}`} className="mt-1 inline-block text-sm font-medium text-maldives-600 hover:underline">
                    Fix and resubmit
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Live listings</h2>
        {listings.length === 0 ? (
          <p className="mt-3 text-sm text-neutral-500">Nothing live yet.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {listings.map((item) => (
              <li key={item.nodeId} className="flex items-center justify-between gap-3 rounded-xl border border-neutral-200 bg-white p-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-neutral-900">{item.title}</p>
                    {nodeTypes.length > 1 && (
                      <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600">{NODE_TYPE_LABEL[item.nodeType]}</span>
                    )}
                  </div>
                  {item.summary && <p className="mt-0.5 line-clamp-1 text-sm text-neutral-500">{item.summary}</p>}
                </div>
                <div className="flex shrink-0 items-center gap-4">
                  <Link href={`/partner/listings/${item.nodeId}/edit`} className="text-sm font-medium text-maldives-600 hover:underline">
                    Edit
                  </Link>
                  <Link href={`/partner/listings/new?copy=${item.nodeId}`} className="text-sm font-medium text-maldives-600 hover:underline">
                    Duplicate
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
