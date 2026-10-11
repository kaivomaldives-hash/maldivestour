import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { getHolidayRequestsAdmin } from "@/lib/admin/holiday-requests-repository";
import { HOLIDAY_REQUEST_STATUSES, type HolidayRequestStatus } from "@/lib/admin/holiday-request-status";

const STATUS_TONE: Record<string, "neutral" | "maldives" | "aqua" | "outline"> = {
  pending: "aqua",
  contacted: "maldives",
  confirmed: "maldives",
  cancelled: "neutral",
};

export default async function AdminHolidayRequestsPage({ searchParams }: { searchParams: Promise<{ status?: string; page?: string }> }) {
  const sp = await searchParams;
  const status = sp.status && (HOLIDAY_REQUEST_STATUSES as readonly string[]).includes(sp.status) ? (sp.status as HolidayRequestStatus) : undefined;
  const page = Math.max(1, Number(sp.page) || 1);

  const results = await getHolidayRequestsAdmin({ status, page });
  const totalPages = Math.max(1, Math.ceil(results.total / results.pageSize));

  return (
    <div>
      <h1 className="text-2xl font-semibold text-ocean-900">Custom Holiday Requests ({results.total})</h1>
      <p className="mt-1 text-sm text-neutral-600">Submitted through the &ldquo;Customize Your Holiday&rdquo; planner on the Packages page.</p>

      <nav className="mt-4 flex flex-wrap gap-2 text-sm">
        <Link href="/admin/holiday-requests" className={`rounded-full px-3.5 py-2 font-medium ${!status ? "bg-lagoon-100 text-ocean-900" : "text-neutral-600 hover:bg-neutral-100"}`}>
          All
        </Link>
        {HOLIDAY_REQUEST_STATUSES.map((s) => (
          <Link
            key={s}
            href={`/admin/holiday-requests?status=${s}`}
            className={`rounded-full px-3.5 py-2 font-medium ${status === s ? "bg-lagoon-100 text-ocean-900" : "text-neutral-600 hover:bg-neutral-100"}`}
          >
            {s[0].toUpperCase() + s.slice(1)}
          </Link>
        ))}
      </nav>

      {results.items.length === 0 ? (
        <EmptyState title="No requests found." description="Nothing matches this filter yet." />
      ) : (
        <div className="mt-4 overflow-x-auto rounded-2xl border border-neutral-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 text-xs font-semibold uppercase tracking-wide text-neutral-500">
              <tr>
                <th className="px-4 py-3">Reference</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Arrival</th>
                <th className="px-4 py-3">Nights</th>
                <th className="px-4 py-3">Guests</th>
                <th className="px-4 py-3">Estimate</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {results.items.map((item) => (
                <tr key={item.id} className="hover:bg-neutral-50">
                  <td className="px-4 py-3">
                    <Link href={`/admin/holiday-requests/${item.id}`} className="font-mono text-maldives-600 hover:underline">
                      {item.reference}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-ocean-900">{item.customerName}</p>
                    <p className="text-xs text-neutral-500">{item.customerEmail}</p>
                  </td>
                  <td className="px-4 py-3">{item.arrivalDate}</td>
                  <td className="px-4 py-3">{item.nights}</td>
                  <td className="px-4 py-3">
                    {item.adults} adult{item.adults === 1 ? "" : "s"}
                    {item.children > 0 ? `, ${item.children} child${item.children === 1 ? "" : "ren"}` : ""}
                  </td>
                  <td className="px-4 py-3">
                    {item.currency} {item.estimatedTotal.toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={STATUS_TONE[item.status] ?? "neutral"}>{item.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} basePath="/admin/holiday-requests" baseQuery={status ? `status=${status}` : ""} />
    </div>
  );
}
