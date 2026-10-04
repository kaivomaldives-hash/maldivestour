import Link from "next/link";

import { PartnerRequestStatusButtons } from "@/components/admin/partner-request-status-buttons";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { getPartnerRequestsAdmin, PARTNER_REQUEST_STATUSES, type PartnerRequestStatus } from "@/lib/admin/partners-repository";
import { partnerTypeLabel } from "@/lib/partners/types";

const STATUS_TONE: Record<string, "neutral" | "maldives" | "aqua" | "outline"> = {
  new: "aqua",
  contacted: "maldives",
  archived: "neutral",
};

export default async function AdminVendorsPage({ searchParams }: { searchParams: Promise<{ status?: string; page?: string }> }) {
  const sp = await searchParams;
  const status =
    sp.status && (PARTNER_REQUEST_STATUSES as readonly string[]).includes(sp.status) ? (sp.status as PartnerRequestStatus) : undefined;
  const page = Math.max(1, Number(sp.page) || 1);

  const results = await getPartnerRequestsAdmin({ status, page });
  const totalPages = Math.max(1, Math.ceil(results.total / results.pageSize));

  return (
    <div>
      <h1 className="text-2xl font-semibold text-ocean-900">Vendors ({results.total})</h1>
      <p className="mt-1 text-sm text-neutral-600">
        Requests submitted through the &ldquo;Become a Partner&rdquo; footer form. This is request triage only — adding and managing a
        vendor&rsquo;s own activities or properties is a separate feature, not built yet.
      </p>

      <nav className="mt-4 flex gap-2 text-sm">
        <Link href="/admin/vendors" className={`rounded-full px-3.5 py-2 font-medium ${!status ? "bg-lagoon-100 text-ocean-900" : "text-neutral-600 hover:bg-neutral-100"}`}>
          All
        </Link>
        {PARTNER_REQUEST_STATUSES.map((s) => (
          <Link
            key={s}
            href={`/admin/vendors?status=${s}`}
            className={`rounded-full px-3.5 py-2 font-medium capitalize ${status === s ? "bg-lagoon-100 text-ocean-900" : "text-neutral-600 hover:bg-neutral-100"}`}
          >
            {s}
          </Link>
        ))}
      </nav>

      {results.items.length === 0 ? (
        <div className="mt-8">
          <EmptyState title="No partner requests yet" />
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {results.items.map((r) => (
            <li key={r.id} className="rounded-2xl border border-neutral-200 bg-white p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge tone={STATUS_TONE[r.status]}>{r.status}</Badge>
                    <span className="text-sm font-medium text-ocean-900">{partnerTypeLabel(r.partnerType)}</span>
                    <span className="text-sm text-neutral-500">{new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="mt-2 text-sm text-neutral-900">
                    {r.name} — {r.email}
                    {r.phone ? ` — ${r.phone}` : ""}
                  </p>
                  {r.companyName && <p className="text-sm text-neutral-700">{r.companyName}</p>}
                  {r.message && <p className="mt-2 whitespace-pre-wrap text-sm text-neutral-700">{r.message}</p>}
                </div>
                <PartnerRequestStatusButtons requestId={r.id} status={r.status} />
              </div>
            </li>
          ))}
        </ul>
      )}

      <Pagination page={page} totalPages={totalPages} basePath="/admin/vendors" baseQuery={status ? `status=${status}` : undefined} />
    </div>
  );
}
