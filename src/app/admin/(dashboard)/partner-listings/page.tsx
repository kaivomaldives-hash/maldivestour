import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { getListingSubmissionsAdmin } from "@/lib/admin/listing-submissions-repository";
import type { ListingSubmissionStatus } from "@/lib/partner/listings/types";

const STATUSES: readonly ListingSubmissionStatus[] = ["pending", "approved", "rejected"];

const STATUS_TONE: Record<ListingSubmissionStatus, "neutral" | "maldives" | "aqua" | "outline"> = {
  pending: "aqua",
  approved: "maldives",
  rejected: "outline",
};

const NODE_TYPE_LABEL: Record<string, string> = {
  accommodation: "Property",
  activity: "Activity",
  package: "Package",
  transfer_route: "Transfer",
};

export default async function AdminPartnerListingsPage({ searchParams }: { searchParams: Promise<{ status?: string; page?: string }> }) {
  const sp = await searchParams;
  const status = sp.status && (STATUSES as readonly string[]).includes(sp.status) ? (sp.status as ListingSubmissionStatus) : undefined;
  const page = Math.max(1, Number(sp.page) || 1);

  const results = await getListingSubmissionsAdmin({ status, page });
  const totalPages = Math.max(1, Math.ceil(results.total / results.pageSize));

  return (
    <div>
      <h1 className="text-2xl font-semibold text-ocean-900">Partner Listings ({results.total})</h1>
      <p className="mt-1 text-sm text-neutral-600">New listings and edits submitted by partners — nothing here goes live until approved.</p>

      <nav className="mt-4 flex flex-wrap gap-2 text-sm">
        <Link href="/admin/partner-listings" className={`rounded-full px-3.5 py-2 font-medium ${!status ? "bg-lagoon-100 text-ocean-900" : "text-neutral-600 hover:bg-neutral-100"}`}>
          All
        </Link>
        {STATUSES.map((s) => (
          <Link
            key={s}
            href={`/admin/partner-listings?status=${s}`}
            className={`rounded-full px-3.5 py-2 font-medium capitalize ${status === s ? "bg-lagoon-100 text-ocean-900" : "text-neutral-600 hover:bg-neutral-100"}`}
          >
            {s}
          </Link>
        ))}
      </nav>

      {results.items.length === 0 ? (
        <div className="mt-8">
          <EmptyState title="No partner listing submissions yet" />
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {results.items.map((item) => (
            <li key={item.id}>
              <Link href={`/admin/partner-listings/${item.id}`} className="block rounded-2xl border border-neutral-200 bg-white p-4 hover:border-maldives-300">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge tone={STATUS_TONE[item.status]}>{item.status}</Badge>
                      <span className="text-sm font-medium text-ocean-900">
                        {item.submissionKind === "create" ? "New" : "Edit"} — {NODE_TYPE_LABEL[item.nodeType]}
                      </span>
                    </div>
                    <p className="mt-2 text-sm font-medium text-neutral-900">{item.title}</p>
                    <p className="text-sm text-neutral-600">{item.partnerBusinessName}</p>
                  </div>
                  <span className="text-sm text-neutral-500">{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <Pagination page={page} totalPages={totalPages} basePath="/admin/partner-listings" baseQuery={status ? `status=${status}` : undefined} />
    </div>
  );
}
