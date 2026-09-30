import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { getPackagesAdmin } from "@/lib/admin/packages-repository";

const STATUS_TONE: Record<string, "neutral" | "maldives" | "aqua" | "outline"> = {
  draft: "outline",
  published: "maldives",
  archived: "neutral",
};

export default async function AdminPackagesPage({ searchParams }: { searchParams: Promise<{ q?: string; page?: string }> }) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const results = await getPackagesAdmin({ search: sp.q, page });
  const totalPages = Math.max(1, Math.ceil(results.total / results.pageSize));

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-ocean-900">Packages ({results.total})</h1>
        <Button href="/admin/packages/new" size="sm">
          New package
        </Button>
      </div>
      <p className="mt-1 text-sm text-neutral-500">
        This manages the real, database-backed packages only. The additional curated packages shown on the public site are defined in code
        (src/lib/packages/demo.ts) and aren&rsquo;t editable here.
      </p>

      <form method="get" className="mt-4 flex gap-3">
        <input
          name="q"
          defaultValue={sp.q ?? ""}
          placeholder="Search by title"
          className="w-72 rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:border-maldives-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-maldives-500 focus-visible:ring-offset-1"
        />
        <button type="submit" className="rounded-full bg-maldives-600 px-4 py-2 text-sm font-medium text-white hover:bg-ocean-800">
          Search
        </button>
        {sp.q && (
          <Link href="/admin/packages" className="self-center text-sm text-neutral-600 underline">
            Clear
          </Link>
        )}
      </form>

      {results.items.length === 0 ? (
        <div className="mt-8">
          <EmptyState title="No packages match this search" />
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50 text-xs font-semibold uppercase tracking-wide text-neutral-500">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Duration</th>
                <th className="px-4 py-3">Price from</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {results.items.map((p) => (
                <tr key={p.id} className="hover:bg-neutral-50">
                  <td className="px-4 py-3">
                    <Link href={`/admin/packages/${p.id}`} className="font-medium text-maldives-600 hover:underline">
                      {p.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-neutral-600">{p.fields.durationNights ? `${p.fields.durationNights} nights` : "—"}</td>
                  <td className="px-4 py-3 text-neutral-600">{p.fields.priceFrom ? `${p.fields.currency ?? ""} ${p.fields.priceFrom}` : "—"}</td>
                  <td className="px-4 py-3">
                    <Badge tone={STATUS_TONE[p.status]}>{p.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} basePath="/admin/packages" baseQuery={sp.q ? `q=${encodeURIComponent(sp.q)}` : undefined} />
    </div>
  );
}
