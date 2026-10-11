import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { getPartnerAccountsAdmin } from "@/lib/admin/partner-accounts-repository";
import { PARTNER_KINDS, PROPERTY_TYPES, type OnboardingStatus } from "@/lib/partner/types";

const ONBOARDING_STATUSES: readonly OnboardingStatus[] = ["profile", "submitted", "approved", "rejected", "suspended"];

const STATUS_TONE: Record<OnboardingStatus, "neutral" | "maldives" | "aqua" | "outline"> = {
  profile: "neutral",
  submitted: "aqua",
  approved: "maldives",
  rejected: "outline",
  suspended: "outline",
};

export default async function AdminPartnersPage({ searchParams }: { searchParams: Promise<{ status?: string; page?: string }> }) {
  const sp = await searchParams;
  const status = sp.status && (ONBOARDING_STATUSES as readonly string[]).includes(sp.status) ? (sp.status as OnboardingStatus) : undefined;
  const page = Math.max(1, Number(sp.page) || 1);

  const results = await getPartnerAccountsAdmin({ status, page });
  const totalPages = Math.max(1, Math.ceil(results.total / results.pageSize));

  return (
    <div>
      <h1 className="text-2xl font-semibold text-ocean-900">Partner Applications ({results.total})</h1>
      <p className="mt-1 text-sm text-neutral-600">
        Self-service partner accounts — property, activity, package, and transfer operators who signed up at /partner/signup. Once
        approved here, a partner can manage their own listings and bookings.
      </p>

      <nav className="mt-4 flex flex-wrap gap-2 text-sm">
        <Link href="/admin/partners" className={`rounded-full px-3.5 py-2 font-medium ${!status ? "bg-lagoon-100 text-ocean-900" : "text-neutral-600 hover:bg-neutral-100"}`}>
          All
        </Link>
        {ONBOARDING_STATUSES.map((s) => (
          <Link
            key={s}
            href={`/admin/partners?status=${s}`}
            className={`rounded-full px-3.5 py-2 font-medium capitalize ${status === s ? "bg-lagoon-100 text-ocean-900" : "text-neutral-600 hover:bg-neutral-100"}`}
          >
            {s}
          </Link>
        ))}
      </nav>

      {results.items.length === 0 ? (
        <div className="mt-8">
          <EmptyState title="No partner applications yet" />
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {results.items.map((p) => (
            <li key={p.id}>
              <Link href={`/admin/partners/${p.id}`} className="block rounded-2xl border border-neutral-200 bg-white p-4 hover:border-maldives-300">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge tone={STATUS_TONE[p.onboardingStatus]}>{p.onboardingStatus}</Badge>
                      <span className="text-sm font-medium text-ocean-900">
                        {PARTNER_KINDS.find((k) => k.value === p.partnerKind)?.label ?? p.partnerKind}
                        {p.propertyType ? ` — ${PROPERTY_TYPES.find((t) => t.value === p.propertyType)?.label ?? p.propertyType}` : ""}
                      </span>
                    </div>
                    <p className="mt-2 text-sm font-medium text-neutral-900">{p.businessName}</p>
                    <p className="text-sm text-neutral-600">{p.contactEmail}</p>
                  </div>
                  <span className="text-sm text-neutral-500">
                    {p.submittedAt ? `Submitted ${new Date(p.submittedAt).toLocaleDateString()}` : `Created ${new Date(p.createdAt).toLocaleDateString()}`}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <Pagination page={page} totalPages={totalPages} basePath="/admin/partners" baseQuery={status ? `status=${status}` : undefined} />
    </div>
  );
}
