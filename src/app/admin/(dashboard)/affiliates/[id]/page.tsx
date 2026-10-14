import Link from "next/link";
import { notFound } from "next/navigation";

import { AffiliateAccountReviewForm } from "@/components/admin/affiliate-account-review-form";
import { requireStaff } from "@/lib/admin/auth";
import { getAffiliateAccountByIdAdmin } from "@/lib/admin/affiliate-accounts-repository";

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-500">{label}</dt>
      <dd className="mt-0.5 text-sm text-neutral-900">{value}</dd>
    </div>
  );
}

export default async function AdminAffiliateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireStaff();
  const { id } = await params;
  const affiliate = await getAffiliateAccountByIdAdmin(id);
  if (!affiliate) notFound();

  return (
    <div className="max-w-4xl">
      <Link href="/admin/affiliates" className="text-sm text-maldives-600 hover:underline">
        ← All affiliate applications
      </Link>

      <h1 className="mt-2 text-2xl font-semibold text-ocean-900">{affiliate.businessName}</h1>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-2xl border border-neutral-200 bg-white p-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Profile</h2>
            <dl className="mt-3 grid grid-cols-2 gap-4">
              <Field label="Contact email" value={affiliate.contactEmail} />
              <Field label="Phone" value={affiliate.contactPhone} />
              <Field label="WhatsApp" value={affiliate.whatsapp} />
              <Field label="Country" value={affiliate.country} />
              <Field label="PayPal email" value={affiliate.paypalEmail} />
              <Field label="Referral code" value={affiliate.referralCode} />
              <Field label="Applied" value={new Date(affiliate.createdAt).toLocaleString()} />
              <Field label="Last reviewed" value={affiliate.reviewedAt ? new Date(affiliate.reviewedAt).toLocaleString() : null} />
            </dl>
            {affiliate.rejectionReason && (
              <div className="mt-4">
                <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Last review note</dt>
                <dd className="mt-0.5 whitespace-pre-wrap text-sm text-neutral-900">{affiliate.rejectionReason}</dd>
              </div>
            )}
          </section>
        </div>

        <div>
          <AffiliateAccountReviewForm affiliateId={affiliate.id} status={affiliate.status} />
        </div>
      </div>
    </div>
  );
}
