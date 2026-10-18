import Link from "next/link";

import { AdminSearchField } from "@/components/admin/admin-search-field";
import { AdminTableHead } from "@/components/admin/admin-table-head";
import { ContentSortForm } from "@/components/admin/content-sort-form";
import { DeleteNodeButton } from "@/components/admin/delete-node-button";
import { SortOrderInput } from "@/components/admin/sort-order-input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { getActivitiesAdmin } from "@/lib/admin/activities-repository";
import { NODE_STATUSES, type NodeStatus } from "@/lib/admin/node-status";
import { getProviderOptions } from "@/lib/admin/providers-repository";
import type { ActivityCategory } from "@/lib/activities/types";
import { getContentSortSetting } from "@/lib/content-sort/repository";
import { getAtolls } from "@/lib/locations/repository";

const STATUS_TONE: Record<string, "neutral" | "maldives" | "aqua" | "outline"> = {
  draft: "outline",
  published: "maldives",
  archived: "neutral",
};

const CATEGORY_FILTERS: Array<{ value: ActivityCategory | ""; label: string }> = [
  { value: "", label: "All categories" },
  { value: "fishing", label: "Fishing" },
  { value: "diving", label: "Diving" },
  { value: "surfing", label: "Surfing" },
  { value: "general", label: "General" },
  { value: "watersports", label: "Watersports" },
  { value: "excursion", label: "Excursion" },
  { value: "island_hopping", label: "Island hopping" },
  { value: "spa", label: "Spa" },
  { value: "culture", label: "Culture" },
];

export default async function AdminActivitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; status?: string; provider?: string; atoll?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const activityCategory = (sp.category as ActivityCategory | undefined) || undefined;
  const status = NODE_STATUSES.includes(sp.status as NodeStatus) ? (sp.status as NodeStatus) : undefined;
  const [results, providers, atolls, sortMode] = await Promise.all([
    getActivitiesAdmin({ search: sp.q, activityCategory, status, providerId: sp.provider || undefined, atollId: sp.atoll || undefined, page }),
    getProviderOptions(),
    getAtolls(),
    getContentSortSetting("activity"),
  ]);
  const totalPages = Math.max(1, Math.ceil(results.total / results.pageSize));

  const baseQueryParts = [
    sp.q ? `q=${encodeURIComponent(sp.q)}` : null,
    sp.category ? `category=${encodeURIComponent(sp.category)}` : null,
    sp.status ? `status=${encodeURIComponent(sp.status)}` : null,
    sp.provider ? `provider=${encodeURIComponent(sp.provider)}` : null,
    sp.atoll ? `atoll=${encodeURIComponent(sp.atoll)}` : null,
  ].filter(Boolean);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-ocean-900">Activities, Fishing, Diving & Surfing ({results.total})</h1>
        <Button href="/admin/activities/new" size="sm">
          New activity
        </Button>
      </div>

      <div className="mt-4">
        <ContentSortForm nodeType="activity" currentMode={sortMode} />
      </div>

      <form method="get" className="mt-4 flex flex-wrap items-end gap-3">
        <AdminSearchField label="Search" name="q" defaultValue={sp.q} placeholder="Search by name" className="w-64" />
        <select name="category" defaultValue={sp.category ?? ""} className="rounded-xl border border-neutral-300 px-3 py-2 text-sm">
          {CATEGORY_FILTERS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
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
        {(sp.q || sp.category || sp.status || sp.provider || sp.atoll) && (
          <Link href="/admin/activities" className="self-center text-sm text-neutral-600 underline">
            Clear
          </Link>
        )}
      </form>

      {results.items.length === 0 ? (
        <div className="mt-8">
          <EmptyState title="No activities match this search" />
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
          <table className="w-full min-w-[700px] text-left text-sm">
            <AdminTableHead columns={["Name", "Category", "Price from", "Status", "Position", ""]} />
            <tbody className="divide-y divide-neutral-100">
              {results.items.map((a) => (
                <tr key={a.id} className="hover:bg-neutral-50">
                  <td className="px-4 py-3">
                    <Link href={`/admin/activities/${a.id}`} className="font-medium text-maldives-600 hover:underline">
                      {a.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 capitalize text-neutral-600">{a.fields.activityCategory.replace("_", " ")}</td>
                  <td className="px-4 py-3 text-neutral-600">{a.fields.priceFrom !== null ? `${a.fields.currency} ${a.fields.priceFrom}` : "—"}</td>
                  <td className="px-4 py-3">
                    <Badge tone={STATUS_TONE[a.status]}>{a.status}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <SortOrderInput nodeId={a.id} defaultValue={a.sortOrder} nodeType="activity" />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <DeleteNodeButton nodeId={a.id} redirectTo="/admin/activities" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} basePath="/admin/activities" baseQuery={baseQueryParts.length > 0 ? baseQueryParts.join("&") : undefined} />
    </div>
  );
}
