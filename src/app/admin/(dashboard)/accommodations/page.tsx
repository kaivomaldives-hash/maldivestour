import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { getAccommodationsAdmin } from "@/lib/admin/accommodations-repository";
import type { AccommodationType } from "@/lib/accommodations/types";

const STATUS_TONE: Record<string, "neutral" | "maldives" | "aqua" | "outline"> = {
  draft: "outline",
  published: "maldives",
  archived: "neutral",
};

const TYPE_FILTERS: Array<{ value: AccommodationType | ""; label: string }> = [
  { value: "", label: "All types" },
  { value: "hotel", label: "Hotels" },
  { value: "resort", label: "Resorts" },
  { value: "guesthouse", label: "Guesthouses" },
  { value: "villa", label: "Villas" },
  { value: "liveaboard", label: "Liveaboards" },
];

export default async function AdminAccommodationsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const accommodationType = (sp.type as AccommodationType | undefined) || undefined;
  const results = await getAccommodationsAdmin({ search: sp.q, accommodationType, page });
  const totalPages = Math.max(1, Math.ceil(results.total / results.pageSize));

  const baseQueryParts = [sp.q ? `q=${encodeURIComponent(sp.q)}` : null, sp.type ? `type=${encodeURIComponent(sp.type)}` : null].filter(Boolean);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-ocean-900">Hotels, Resorts & Guesthouses ({results.total})</h1>
        <Button href="/admin/accommodations/new" size="sm">
          New accommodation
        </Button>
      </div>

      <form method="get" className="mt-4 flex flex-wrap gap-3">
        <input
          name="q"
          defaultValue={sp.q ?? ""}
          placeholder="Search by name"
          className="w-64 rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:border-maldives-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-maldives-500 focus-visible:ring-offset-1"
        />
        <select name="type" defaultValue={sp.type ?? ""} className="rounded-xl border border-neutral-300 px-3 py-2 text-sm">
          {TYPE_FILTERS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
        <button type="submit" className="rounded-full bg-maldives-600 px-4 py-2 text-sm font-medium text-white hover:bg-ocean-800">
          Filter
        </button>
        {(sp.q || sp.type) && (
          <Link href="/admin/accommodations" className="self-center text-sm text-neutral-600 underline">
            Clear
          </Link>
        )}
      </form>

      {results.items.length === 0 ? (
        <div className="mt-8">
          <EmptyState title="No accommodations match this search" />
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50 text-xs font-semibold uppercase tracking-wide text-neutral-500">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Price tier</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {results.items.map((a) => (
                <tr key={a.id} className="hover:bg-neutral-50">
                  <td className="px-4 py-3">
                    <Link href={`/admin/accommodations/${a.id}`} className="font-medium text-maldives-600 hover:underline">
                      {a.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 capitalize text-neutral-600">{a.fields.accommodationType}</td>
                  <td className="px-4 py-3 text-neutral-600">{a.fields.priceTier ?? "—"}</td>
                  <td className="px-4 py-3">
                    <Badge tone={STATUS_TONE[a.status]}>{a.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} basePath="/admin/accommodations" baseQuery={baseQueryParts.length > 0 ? baseQueryParts.join("&") : undefined} />
    </div>
  );
}
