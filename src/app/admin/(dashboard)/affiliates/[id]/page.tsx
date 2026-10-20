import Link from "next/link";
import { notFound } from "next/navigation";

import { AffiliateAccountReviewForm } from "@/components/admin/affiliate-account-review-form";
import { AffiliatePayoutForm } from "@/components/admin/affiliate-payout-form";
import { Badge } from "@/components/ui/badge";
import { requireStaff } from "@/lib/admin/auth";
import { getAffiliateAccountByIdAdmin, getAffiliateEarningsAdmin } from "@/lib/admin/affiliate-accounts-repository";
import type { AffiliateCommissionStatus } from "@/lib/affiliate/types";

const COMMISSION_STATUS_LABEL: Record<AffiliateCommissionStatus, string> = {
  pending: "Pending",
  payable: "Payable",
  void: "Cancelled",
};

const COMMISSION_STATUS_TONE: Record<AffiliateCommissionStatus, "neutral" | "maldives" | "aqua" | "outline"> = {
  pending: "aqua",
  payable: "maldives",
  void: "outline",
};

function money(amount: number, currency: string): string {
  return `${currency} ${amount.toFixed(2)}`;
}

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
  const [affiliate, earnings] = await Promise.all([getAffiliateAccountByIdAdmin(id), getAffiliateEarningsAdmin(id)]);
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

          <section className="rounded-2xl border border-neutral-200 bg-white p-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Earnings</h2>
            <dl className="mt-3 grid grid-cols-3 gap-4">
              <div>
                <dt className="text-xs text-neutral-500">Owed</dt>
                <dd className="text-lg font-semibold text-ocean-900">{money(earnings.balanceDue, earnings.currency)}</dd>
              </div>
              <div>
                <dt className="text-xs text-neutral-500">Pending</dt>
                <dd className="text-lg font-semibold text-ocean-900">{money(earnings.pendingAmount, earnings.currency)}</dd>
              </div>
              <div>
                <dt className="text-xs text-neutral-500">Paid to date</dt>
                <dd className="text-lg font-semibold text-ocean-900">{money(earnings.paidAmount, earnings.currency)}</dd>
              </div>
            </dl>

            {earnings.bookings.length > 0 && (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[500px] text-left text-sm">
                  <thead className="border-b border-neutral-200 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                    <tr>
                      <th className="py-2">Reference</th>
                      <th className="py-2">Customer</th>
                      <th className="py-2">Booking</th>
                      <th className="py-2">Commission</th>
                      <th className="py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {earnings.bookings.map((b) => (
                      <tr key={b.id}>
                        <td className="py-2 font-mono text-xs">{b.bookingReference}</td>
                        <td className="py-2">{b.customerName}</td>
                        <td className="py-2">{b.productTitle}</td>
                        <td className="py-2">{b.commissionAmount != null ? money(b.commissionAmount, earnings.currency) : "—"}</td>
                        <td className="py-2">
                          <Badge tone={COMMISSION_STATUS_TONE[b.commissionStatus]}>{COMMISSION_STATUS_LABEL[b.commissionStatus]}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {earnings.payouts.length > 0 && (
              <div className="mt-4">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Payout history</h3>
                <ul className="mt-2 space-y-1 text-sm text-neutral-700">
                  {earnings.payouts.map((p) => (
                    <li key={p.id}>
                      {new Date(p.paidAt).toLocaleDateString()} — {money(p.amount, p.currency)}
                      {p.method ? ` via ${p.method}` : ""}
                      {p.note ? ` — ${p.note}` : ""}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        </div>

        <div className="space-y-6">
          <AffiliateAccountReviewForm affiliateId={affiliate.id} status={affiliate.status} />
          <AffiliatePayoutForm affiliateId={affiliate.id} balanceDue={earnings.balanceDue} currency={earnings.currency} />
        </div>
      </div>
    </div>
  );
}
