import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { getMyAffiliateEarnings } from "@/lib/affiliate/repository";
import type { AffiliateCommissionStatus } from "@/lib/affiliate/types";

export const metadata: Metadata = {
  title: "Earnings | Affiliate Dashboard | MTG",
  robots: { index: false, follow: false },
};

const STATUS_LABEL: Record<AffiliateCommissionStatus, string> = {
  pending: "Pending",
  payable: "Owed to you",
  void: "Cancelled",
};

const STATUS_TONE: Record<AffiliateCommissionStatus, "neutral" | "maldives" | "aqua" | "outline"> = {
  pending: "aqua",
  payable: "maldives",
  void: "outline",
};

function money(amount: number, currency: string): string {
  return `${currency} ${amount.toFixed(2)}`;
}

export default async function AffiliateEarningsPage() {
  const earnings = await getMyAffiliateEarnings();
  if (!earnings) notFound();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-ocean-900">Earnings</h1>
      <p className="mt-1 text-sm text-neutral-600">
        Commission from bookings made with your referral code — paid out manually by our team, never automatically.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-neutral-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Owed to you</p>
          <p className="mt-1 text-2xl font-semibold text-ocean-900">{money(earnings.balanceDue, earnings.currency)}</p>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Pending (not yet completed)</p>
          <p className="mt-1 text-2xl font-semibold text-ocean-900">{money(earnings.pendingAmount, earnings.currency)}</p>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Paid to date</p>
          <p className="mt-1 text-2xl font-semibold text-ocean-900">{money(earnings.paidAmount, earnings.currency)}</p>
        </div>
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-ocean-900">Commission-earning bookings</h2>
        {earnings.bookings.length === 0 ? (
          <p className="mt-2 text-sm text-neutral-600">No bookings have used your referral code yet.</p>
        ) : (
          <div className="mt-3 overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
            <table className="w-full min-w-[500px] text-left text-sm">
              <thead className="border-b border-neutral-200 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                <tr>
                  <th className="px-4 py-3">Reference</th>
                  <th className="px-4 py-3">Booking</th>
                  <th className="px-4 py-3">Commission</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {earnings.bookings.map((b) => (
                  <tr key={b.id}>
                    <td className="px-4 py-3 font-mono text-xs">{b.bookingReference}</td>
                    <td className="px-4 py-3">{b.productTitle}</td>
                    <td className="px-4 py-3">{b.commissionAmount != null ? money(b.commissionAmount, earnings.currency) : "—"}</td>
                    <td className="px-4 py-3">
                      <Badge tone={STATUS_TONE[b.commissionStatus]}>{STATUS_LABEL[b.commissionStatus]}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-ocean-900">Payout history</h2>
        {earnings.payouts.length === 0 ? (
          <p className="mt-2 text-sm text-neutral-600">No payouts recorded yet.</p>
        ) : (
          <div className="mt-3 overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
            <table className="w-full min-w-[500px] text-left text-sm">
              <thead className="border-b border-neutral-200 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Method</th>
                  <th className="px-4 py-3">Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {earnings.payouts.map((p) => (
                  <tr key={p.id}>
                    <td className="px-4 py-3">{new Date(p.paidAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">{money(p.amount, p.currency)}</td>
                    <td className="px-4 py-3">{p.method ?? "—"}</td>
                    <td className="px-4 py-3">{p.note ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
