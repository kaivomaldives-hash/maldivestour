import Link from "next/link";
import { notFound } from "next/navigation";

import { PartnerAccountReviewForm } from "@/components/admin/partner-account-review-form";
import { PartnerDocumentReviewList } from "@/components/admin/partner-document-review-list";
import { requireStaff } from "@/lib/admin/auth";
import { getPartnerAccountByIdAdmin } from "@/lib/admin/partner-accounts-repository";
import { PARTNER_KINDS, PROPERTY_TYPES } from "@/lib/partner/types";

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
  const partner = await getPartnerAccountByIdAdmin(id);
  if (!partner) notFound();

  return (
    <div className="max-w-4xl">
      <Link href="/admin/partners" className="text-sm text-maldives-600 hover:underline">
        ← All partner applications
      </Link>

      <h1 className="mt-2 text-2xl font-semibold text-ocean-900">{partner.businessName}</h1>
      <p className="mt-1 text-neutral-700">
        {PARTNER_KINDS.find((k) => k.value === partner.partnerKind)?.label ?? partner.partnerKind}
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
        </div>

        <div>
          <PartnerAccountReviewForm partnerId={partner.id} providerId={partner.providerId} status={partner.onboardingStatus} />
        </div>
      </div>
    </div>
  );
}
