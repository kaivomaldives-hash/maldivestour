import Link from "next/link";
import { notFound } from "next/navigation";

import { PartnerAccountReviewForm } from "@/components/admin/partner-account-review-form";
import { PartnerDocumentReviewList } from "@/components/admin/partner-document-review-list";
import { PartnerPaymentForm } from "@/components/admin/partner-payment-form";
import { Badge } from "@/components/ui/badge";
import { requireStaff } from "@/lib/admin/auth";
import { getPartnerAccountByIdAdmin, getPartnerEarningsAdmin } from "@/lib/admin/partner-accounts-repository";
import type { PartnerCommissionStatus } from "@/lib/partner/bookings/repository";
import { PARTNER_KINDS, PROPERTY_TYPES } from "@/lib/partner/types";

const COMMISSION_STATUS_LABEL: Record<PartnerCommissionStatus, string> = {
  none: "—",
  pending: "Pending",
  payable: "Payable",
  void: "Cancelled",
};

const COMMISSION_STATUS_TONE: Record<PartnerCommissionStatus, "neutral" | "maldives" | "aqua" | "outline"> = {
  none: "neutral",
  pending: "aqua",
  payable: "maldives",
  void: "outline",
};

function money(amount: number, currency: string): string {
  return `${currency} ${amount.toFixed(2)}`;
}

function Field({ label, value }: { label: string; value: string | number | null | undefined }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-500">{label}</dt>
      <dd className="mt-0.5 text-sm text-neutral-900">{value}</dd>
    </div>
  );
}

export default async function AdminPartnerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireStaff();
  const { id } = await params;
  const [partner, earnings] = await Promise.all([getPartnerAccountByIdAdmin(id), getPartnerEarningsAdmin(id)]);
  if (!partner) notFound();

  return (
    <div className="max-w-4xl">
      <Link href="/admin/partners" className="text-sm text-maldives-600 hover:underline">
        ← All partner applications
      </Link>

      <h1 className="mt-2 text-2xl font-semibold text-ocean-900">{partner.businessName}</h1>
      <p className="mt-1 text-neutral-700">
        {partner.partnerKinds.map((k) => PARTNER_KINDS.find((pk) => pk.value === k)?.label ?? k).join(", ")}
        {partner.propertyType ? ` — ${PROPERTY_TYPES.find((t) => t.value === partner.propertyType)?.label ?? partner.propertyType}` : ""}
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-2xl border border-neutral-200 bg-white p-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Profile</h2>
            <dl className="mt-3 grid grid-cols-2 gap-4">
              <Field label="Contact email" value={partner.contactEmail} />
              <Field label="Phone" value={partner.contactPhone} />
              <Field label="WhatsApp" value={partner.whatsapp} />
              <Field label="Country" value={partner.country} />
              <Field label="Address" value={partner.address} />
              <Field label="Submitted" value={partner.submittedAt ? new Date(partner.submittedAt).toLocaleString() : null} />
              <Field label="Last reviewed" value={partner.reviewedAt ? new Date(partner.reviewedAt).toLocaleString() : null} />
              <Field label="Account created" value={new Date(partner.createdAt).toLocaleString()} />
            </dl>
            {partner.description && (
              <div className="mt-4">
                <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-500">About</dt>
                <dd className="mt-0.5 whitespace-pre-wrap text-sm text-neutral-900">{partner.description}</dd>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-neutral-200 bg-white p-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Bank Details</h2>
            {partner.bankDetails ? (
              <dl className="mt-3 grid grid-cols-2 gap-4">
                <Field label="Account holder" value={partner.bankDetails.accountHolderName} />
                <Field label="Bank" value={partner.bankDetails.bankName} />
                <Field label="Account number" value={partner.bankDetails.accountNumber} />
                <Field label="IBAN / SWIFT" value={partner.bankDetails.ibanOrSwift} />
                <Field label="Branch address" value={partner.bankDetails.branchAddress} />
                <Field label="Currency" value={partner.bankDetails.currency} />
              </dl>
            ) : (
              <p className="mt-2 text-sm text-neutral-500">Not provided yet.</p>
            )}
          </section>

          <section className="rounded-2xl border border-neutral-200 bg-white p-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Verification Documents</h2>
            <div className="mt-3">
              <PartnerDocumentReviewList documents={partner.documents} />
            </div>
          </section>

          <section className="rounded-2xl border border-neutral-200 bg-white p-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Commission Owed</h2>
            <dl className="mt-3 grid grid-cols-3 gap-4">
              <div>
                <dt className="text-xs text-neutral-500">Owed to us</dt>
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

            {earnings.payments.length > 0 && (
              <div className="mt-4">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Payment history</h3>
                <ul className="mt-2 space-y-1 text-sm text-neutral-700">
                  {earnings.payments.map((p) => (
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
          <PartnerAccountReviewForm partnerId={partner.id} providerId={partner.providerId} status={partner.onboardingStatus} />
          <PartnerPaymentForm partnerId={partner.id} balanceDue={earnings.balanceDue} currency={earnings.currency} />
        </div>
      </div>
    </div>
  );
}
