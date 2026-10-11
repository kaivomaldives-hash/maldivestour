import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { getMyListingSubmissions, getMyListings } from "@/lib/partner/listings/repository";
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

export default async function PartnerListingsPage() {
  const account = await getMyPartnerAccount();
  if (!account) notFound();

  const nodeType = NODE_TYPE_BY_PARTNER_KIND[account.partnerKind];
  const [listings, submissions] = await Promise.all([getMyListings(nodeType), getMyListingSubmissions()]);
  const pendingOrRejected = submissions.filter((s) => s.status !== "approved");
  const canCreate = account.onboardingStatus === "approved";

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-ocean-900">My Listings</h1>
          <p className="mt-1 text-sm text-neutral-600">{NODE_TYPE_LABEL[nodeType]} listings — new ones and changes need admin approval before they go live.</p>
        </div>
        {canCreate ? (
          <Button href="/partner/listings/new">+ New Listing</Button>
        ) : (
          <p className="text-sm text-neutral-500">You can create listings once your profile is approved.</p>
        )}
      </div>

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
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Published listings</h2>
        {listings.length === 0 ? (
          <p className="mt-3 text-sm text-neutral-500">Nothing published yet.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {listings.map((item) => (
              <li key={item.nodeId} className="flex items-center justify-between gap-3 rounded-xl border border-neutral-200 bg-white p-3">
                <div>
                  <p className="text-sm font-medium text-neutral-900">{item.title}</p>
                  {item.summary && <p className="mt-0.5 line-clamp-1 text-sm text-neutral-500">{item.summary}</p>}
                </div>
                <Link href={`/partner/listings/${item.nodeId}/edit`} className="shrink-0 text-sm font-medium text-maldives-600 hover:underline">
                  Edit
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
