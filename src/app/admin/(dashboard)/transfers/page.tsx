import Link from "next/link";

import { AdminSearchField } from "@/components/admin/admin-search-field";
import { AdminTableHead } from "@/components/admin/admin-table-head";
import { BulkApplyRouteMediaForm } from "@/components/admin/bulk-apply-route-media-form";
import { ContentSortForm } from "@/components/admin/content-sort-form";
import { DeleteNodeButton } from "@/components/admin/delete-node-button";
import { SortOrderInput } from "@/components/admin/sort-order-input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { NODE_STATUSES, type NodeStatus } from "@/lib/admin/node-status";
import { getProviderOptions } from "@/lib/admin/providers-repository";
import { getTransferRoutesAdmin } from "@/lib/admin/transfers-repository";
import { getTransferRoutesWithMedia } from "@/lib/admin/transfer-media-bulk-actions";
import { getContentSortSetting } from "@/lib/content-sort/repository";
import { getAtolls } from "@/lib/locations/repository";

const STATUS_TONE: Record<string, "neutral" | "maldives" | "aqua" | "outline"> = {
  draft: "outline",
  published: "maldives",
  archived: "neutral",
};

export default async function AdminTransfersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; provider?: string; atoll?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const status = NODE_STATUSES.includes(sp.status as NodeStatus) ? (sp.status as NodeStatus) : undefined;
  const [results, providers, atolls, sortMode, routesWithMedia] = await Promise.all([
    getTransferRoutesAdmin({ search: sp.q, status, providerId: sp.provider || undefined, atollId: sp.atoll || undefined, page }),
    getProviderOptions(),
    getAtolls(),
    getContentSortSetting("transfer_route"),
    getTransferRoutesWithMedia(),
  ]);
  const totalPages = Math.max(1, Math.ceil(results.total / results.pageSize));

  const baseQueryParts = [
    sp.q ? `q=${encodeURIComponent(sp.q)}` : null,
    sp.status ? `status=${encodeURIComponent(sp.status)}` : null,
    sp.provider ? `provider=${encodeURIComponent(sp.provider)}` : null,
    sp.atoll ? `atoll=${encodeURIComponent(sp.atoll)}` : null,
  ].filter(Boolean);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-ocean-900">Transfer routes ({results.total})</h1>
        <Button href="/admin/transfers/new" size="sm">
          New route
        </Button>
      </div>
      <p className="mt-1 text-sm text-neutral-500">
        The atoll filter matches a route&rsquo;s origin or destination. The provider filter matches a route with at least one service from that
        provider &mdash; a route itself has no single operator, since several providers can offer services on the same route.
      </p>

      <div className="mt-4">
        <ContentSortForm nodeType="transfer_route" currentMode={sortMode} />
      </div>

      <BulkApplyRouteMediaForm routesWithMedia={routesWithMedia} />

      <form method="get" className="mt-4 flex flex-wrap items-end gap-3">
        <AdminSearchField label="Search" name="q" defaultValue={sp.q} placeholder="Search by title" className="w-64" />
        <select name="status" defaultValue={sp.status ?? ""} className="rounded-xl border border-neutral-300 px-3 py-2 text-sm capitalize">
          <option value="">All statuses</option>
          {NODE_STATUSES.map((s) => (
            <option key={s} value={s} className="capitalize">
              {s}
            </option>
          ))}
        </select>
        <select name="provider" defaultValue={sp.provider ?? ""} className="rounded-xl border border-neutral-300 px-3 py-2 text-sm">
          <option value="">All providers</option>
          {providers.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
            </option>
          ))}
        </select>
        <select name="atoll" defaultValue={sp.atoll ?? ""} className="rounded-xl border border-neutral-300 px-3 py-2 text-sm">
          <option value="">All atolls</option>
          {atolls.map((a) => (
            <option key={a.id} value={a.id}>
              {a.title}
            </option>
          ))}
        </select>
        <button type="submit" className="rounded-full bg-maldives-600 px-4 py-2 text-sm font-medium text-white hover:bg-ocean-800">
          Filter
        </button>
        {(sp.q || sp.status || sp.provider || sp.atoll) && (
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
            <AdminTableHead columns={["Title", "Origin", "Destination", "Status", "Position", ""]} />
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
                  <td className="px-4 py-3">
                    <SortOrderInput nodeId={r.id} defaultValue={r.sortOrder} nodeType="transfer_route" />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <DeleteNodeButton nodeId={r.id} redirectTo="/admin/transfers" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} basePath="/admin/transfers" baseQuery={baseQueryParts.length > 0 ? baseQueryParts.join("&") : undefined} />
    </div>
  );
}
