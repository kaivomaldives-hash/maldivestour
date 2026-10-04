import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { getCustomersAdmin } from "@/lib/admin/customers-repository";

interface SearchParams {
  q?: string;
  page?: string;
}

export default async function AdminCustomersPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);

  const results = await getCustomersAdmin({ search: sp.q, page });
  const totalPages = Math.max(1, Math.ceil(results.total / results.pageSize));

  const baseParams = new URLSearchParams();
  if (sp.q) baseParams.set("q", sp.q);
  const baseQuery = baseParams.toString() || undefined;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-ocean-900">Customers ({results.total})</h1>
      <p className="mt-1 text-sm text-neutral-500">
        One row per unique email address, built automatically from bookings and footer newsletter sign-ups.
      </p>

      <form method="get" className="mt-4 flex flex-wrap items-end gap-3">
        <label className="text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Search</span>
          <input
            name="q"
            defaultValue={sp.q ?? ""}
            placeholder="Name, email, or phone"
            className="w-64 rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:border-maldives-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-maldives-500 focus-visible:ring-offset-1"
          />
        </label>
        <button type="submit" className="rounded-full bg-maldives-600 px-4 py-2 text-sm font-medium text-white hover:bg-ocean-800">
          Filter
        </button>
        {sp.q && (
          <Link href="/admin/customers" className="text-sm text-neutral-600 underline">
            Clear
          </Link>
        )}
      </form>

      {results.items.length === 0 ? (
        <div className="mt-8">
          <EmptyState title="No customers match these filters" />
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50 text-xs font-semibold uppercase tracking-wide text-neutral-500">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Bookings</th>
                <th className="px-4 py-3">Newsletter</th>
                <th className="px-4 py-3">Last seen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {results.items.map((c) => (
                <tr key={c.id} className="hover:bg-neutral-50">
                  <td className="px-4 py-3">{c.name ?? "—"}</td>
                  <td className="px-4 py-3">{c.email}</td>
                  <td className="px-4 py-3">{c.phone ?? c.whatsapp ?? "—"}</td>
                  <td className="px-4 py-3">{c.bookingCount}</td>
                  <td className="px-4 py-3">
                    <Badge tone={c.subscribed ? "maldives" : "neutral"}>{c.subscribed ? "Subscribed" : "Not subscribed"}</Badge>
                  </td>
                  <td className="px-4 py-3 text-neutral-500">{new Date(c.lastSeenAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} basePath="/admin/customers" baseQuery={baseQuery} />
    </div>
  );
}
