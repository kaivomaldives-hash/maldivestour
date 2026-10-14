import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import type { AgentStatus } from "@/lib/agent/types";
import { getAgentAccountsAdmin } from "@/lib/admin/agent-accounts-repository";

const STATUSES: readonly AgentStatus[] = ["pending", "approved", "rejected", "suspended"];

const STATUS_TONE: Record<AgentStatus, "neutral" | "maldives" | "aqua" | "outline"> = {
  pending: "aqua",
  approved: "maldives",
  rejected: "outline",
  suspended: "outline",
};

export default async function AdminAgentsPage({ searchParams }: { searchParams: Promise<{ status?: string; page?: string }> }) {
  const sp = await searchParams;
  const status = sp.status && (STATUSES as readonly string[]).includes(sp.status) ? (sp.status as AgentStatus) : undefined;
  const page = Math.max(1, Number(sp.page) || 1);

  const results = await getAgentAccountsAdmin({ status, page });
  const totalPages = Math.max(1, Math.ceil(results.total / results.pageSize));

  return (
    <div>
      <h1 className="text-2xl font-semibold text-ocean-900">Travel Agent Applications ({results.total})</h1>
      <p className="mt-1 text-sm text-neutral-600">
        Self-service agent accounts from /agent/signup. Once approved, a signed-in agent gets a 10% discount on eligible rates — this is
        never agent commission or payable earnings.
      </p>

      <nav className="mt-4 flex flex-wrap gap-2 text-sm">
        <Link href="/admin/agents" className={`rounded-full px-3.5 py-2 font-medium ${!status ? "bg-lagoon-100 text-ocean-900" : "text-neutral-600 hover:bg-neutral-100"}`}>
          All
        </Link>
        {STATUSES.map((s) => (
          <Link
            key={s}
            href={`/admin/agents?status=${s}`}
            className={`rounded-full px-3.5 py-2 font-medium capitalize ${status === s ? "bg-lagoon-100 text-ocean-900" : "text-neutral-600 hover:bg-neutral-100"}`}
          >
            {s}
          </Link>
        ))}
      </nav>

      {results.items.length === 0 ? (
        <div className="mt-8">
          <EmptyState title="No agent applications yet" />
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {results.items.map((a) => (
            <li key={a.id}>
              <Link href={`/admin/agents/${a.id}`} className="block rounded-2xl border border-neutral-200 bg-white p-4 hover:border-maldives-300">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <Badge tone={STATUS_TONE[a.status]}>{a.status}</Badge>
                    <p className="mt-2 text-sm font-medium text-neutral-900">{a.businessName}</p>
                    <p className="text-sm text-neutral-600">{a.contactEmail}</p>
                  </div>
                  <span className="text-sm text-neutral-500">Applied {new Date(a.createdAt).toLocaleDateString()}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <Pagination page={page} totalPages={totalPages} basePath="/admin/agents" baseQuery={status ? `status=${status}` : undefined} />
    </div>
  );
}
