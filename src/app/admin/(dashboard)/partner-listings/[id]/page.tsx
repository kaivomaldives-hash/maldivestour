import Link from "next/link";
import { notFound } from "next/navigation";

import { ListingSubmissionReviewForm } from "@/components/admin/listing-submission-review-form";
import { requireStaff } from "@/lib/admin/auth";
import { getListingSubmissionByIdAdmin } from "@/lib/admin/listing-submissions-repository";
import type {
  AccommodationListingPayload,
  ActivityListingPayload,
  PackageListingPayload,
  TransferRouteListingPayload,
} from "@/lib/partner/listings/types";

function Field({ label, value }: { label: string; value: string | number | null | undefined }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-500">{label}</dt>
      <dd className="mt-0.5 text-sm text-neutral-900">{value}</dd>
    </div>
  );
}

export default async function AdminPartnerListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireStaff();
  const { id } = await params;
  const submission = await getListingSubmissionByIdAdmin(id);
  if (!submission) notFound();

  return (
    <div className="max-w-4xl">
      <Link href="/admin/partner-listings" className="text-sm text-maldives-600 hover:underline">
        ← All partner listings
      </Link>

      <h1 className="mt-2 text-2xl font-semibold text-ocean-900">{submission.title}</h1>
      <p className="mt-1 text-neutral-700">
        {submission.submissionKind === "create" ? "New listing" : "Edit"} from {submission.partnerBusinessName}
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-2xl border border-neutral-200 bg-white p-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Proposed Details</h2>
            {submission.nodeType === "accommodation" && <AccommodationFields payload={submission.payload as AccommodationListingPayload} />}
            {submission.nodeType === "activity" && <ActivityFields payload={submission.payload as ActivityListingPayload} />}
            {submission.nodeType === "package" && <PackageFields payload={submission.payload as PackageListingPayload} />}
            {submission.nodeType === "transfer_route" && <TransferFields payload={submission.payload as TransferRouteListingPayload} />}
          </section>
        </div>

        <div>
          <ListingSubmissionReviewForm submissionId={submission.id} status={submission.status} />
        </div>
      </div>
    </div>
  );
}

function AccommodationFields({ payload }: { payload: AccommodationListingPayload }) {
  return (
    <>
      <dl className="mt-3 grid grid-cols-2 gap-4">
        <Field label="Title" value={payload.title} />
        <Field label="Type" value={payload.accommodationType} />
        <Field label="Star rating" value={payload.starRating} />
        <Field label="Price tier" value={payload.priceTier} />
        <Field label="Room count" value={payload.roomCount} />
        <Field label="Check-in" value={payload.checkInTime} />
        <Field label="Check-out" value={payload.checkOutTime} />
        <Field label="From price" value={payload.priceFrom != null ? `${payload.currency} ${payload.priceFrom}` : null} />
        <Field label="All-inclusive" value={payload.allInclusive ? "Yes" : "No"} />
        <Field label="Overwater villas" value={payload.overwaterVillas ? "Yes" : "No"} />
      </dl>
      {payload.summary && <p className="mt-4 whitespace-pre-wrap text-sm text-neutral-900">{payload.summary}</p>}
      {payload.rooms.length > 0 && (
        <div className="mt-4">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Room types</h3>
          <ul className="mt-2 space-y-1 text-sm text-neutral-900">
            {payload.rooms.map((r, i) => (
              <li key={i}>
                {r.name} — {r.priceFrom ? `${r.priceCurrency} ${r.priceFrom}/night` : "price not set"}
                {r.bedType ? `, ${r.bedType}` : ""}
                {r.maxOccupancy ? `, up to ${r.maxOccupancy} guests` : ""}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

function ActivityFields({ payload }: { payload: ActivityListingPayload }) {
  return (
    <>
      <dl className="mt-3 grid grid-cols-2 gap-4">
        <Field label="Title" value={payload.title} />
        <Field label="Category" value={payload.activityCategory} />
        <Field label="Difficulty" value={payload.difficulty} />
        <Field label="Duration (minutes)" value={payload.durationMinutes} />
        <Field label="Minimum age" value={payload.minAge} />
        <Field label="Max participants" value={payload.maxParticipants} />
        <Field label="From price" value={payload.priceFrom != null ? `${payload.currency} ${payload.priceFrom}` : null} />
      </dl>
      {payload.summary && <p className="mt-4 whitespace-pre-wrap text-sm text-neutral-900">{payload.summary}</p>}
    </>
  );
}

function PackageFields({ payload }: { payload: PackageListingPayload }) {
  return (
    <>
      <dl className="mt-3 grid grid-cols-2 gap-4">
        <Field label="Title" value={payload.title} />
        <Field label="Duration (nights)" value={payload.durationNights} />
        <Field label="From price" value={payload.priceFrom != null ? `${payload.currency} ${payload.priceFrom}` : null} />
      </dl>
      {payload.summary && <p className="mt-4 whitespace-pre-wrap text-sm text-neutral-900">{payload.summary}</p>}
    </>
  );
}

function TransferFields({ payload }: { payload: TransferRouteListingPayload }) {
  return (
    <>
      <dl className="mt-3 grid grid-cols-2 gap-4">
        <Field label="Title" value={payload.title} />
        <Field label="Distance (km)" value={payload.distanceKm} />
        <Field label="Typical duration (minutes)" value={payload.typicalDurationMinutes} />
        <Field label="Transfer type" value={payload.service.transferType} />
        <Field label="Shared/private" value={payload.service.sharedOrPrivate} />
        <Field label="Vehicle/boat" value={payload.service.vehicleType} />
        <Field label="Price" value={`${payload.service.currency} ${payload.service.price}`} />
        <Field label="Capacity" value={payload.service.capacity} />
        <Field label="Luggage allowance" value={payload.service.luggageAllowance} />
      </dl>
      {payload.summary && <p className="mt-4 whitespace-pre-wrap text-sm text-neutral-900">{payload.summary}</p>}
      {payload.service.description && <p className="mt-2 whitespace-pre-wrap text-sm text-neutral-700">{payload.service.description}</p>}
    </>
  );
}
