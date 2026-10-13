import Link from "next/link";

import { AdminSearchField } from "@/components/admin/admin-search-field";
import { AdminTableHead } from "@/components/admin/admin-table-head";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { getTransferRoutesAdmin } from "@/lib/admin/transfers-repository";

const STATUS_TONE: Record<string, "neutral" | "maldives" | "aqua" | "outline"> = {
  draft: "outline",
  published: "maldives",
  archived: "neutral",
};

export default async function AdminTransfersPage({ searchParams }: { searchParams: Promise<{ q?: string; page?: string }> }) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const results = await getTransferRoutesAdmin({ search: sp.q, page });
  const totalPages = Math.max(1, Math.ceil(results.total / results.pageSize));

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-ocean-900">Transfer routes ({results.total})</h1>
        <Button href="/admin/transfers/new" size="sm">
          New route
        </Button>
      </div>

      <form method="get" className="mt-4 flex items-end gap-3">
        <AdminSearchField label="Search" name="q" defaultValue={sp.q} placeholder="Search by title" className="w-72" />
        <button type="submit" className="rounded-full bg-maldives-600 px-4 py-2 text-sm font-medium text-white hover:bg-ocean-800">
          Search
        </button>
        {sp.q && (
          <Link href="/admin/transfers" className="self-center text-sm text-neutral-600 underline">
            Clear
          </Link>
        )}
      </form>

      {results.items.length === 0 ? (
        <div className="mt-8">
          <EmptyState title="No transfer routes match this search" />
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
          <table className="w-full min-w-[700px] text-left text-sm">
            <AdminTableHead columns={["Title", "Origin", "Destination", "Status"]} />
            <tbody className="divide-y divide-neutral-100">
              {results.items.map((r) => (
                <tr key={r.id} className="hover:bg-neutral-50">
                  <td className="px-4 py-3">
                    <Link href={`/admin/transfers/${r.id}`} className="font-medium text-maldives-600 hover:underline">
                      {r.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-neutral-600">{r.originTitle ?? "—"}</td>
                  <td className="px-4 py-3 text-neutral-600">{r.destinationTitle ?? "—"}</td>
                  <td className="px-4 py-3">
                    <Badge tone={STATUS_TONE[r.status]}>{r.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} basePath="/admin/transfers" baseQuery={sp.q ? `q=${encodeURIComponent(sp.q)}` : undefined} />
    </div>
  );
}
