import Link from "next/link";
import { notFound } from "next/navigation";

import { HolidayRequestStatusForm } from "@/components/admin/holiday-request-status-form";
import { STAY_TYPE_LABELS, MEAL_PLAN_LABELS } from "@/lib/holiday-builder/types";
import { requireStaff } from "@/lib/admin/auth";
import { getHolidayRequestByIdAdmin } from "@/lib/admin/holiday-requests-repository";

function Field({ label, value }: { label: string; value: string | number | null | undefined }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-500">{label}</dt>
      <dd className="mt-0.5 text-sm text-neutral-900">{value}</dd>
    </div>
  );
}

export default async function AdminHolidayRequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireStaff();
  const { id } = await params;
  const request = await getHolidayRequestByIdAdmin(id);
  if (!request) notFound();

  const { itinerary, priceBreakdown } = request;

  return (
    <div className="max-w-4xl">
      <Link href="/admin/holiday-requests" className="text-sm text-maldives-600 hover:underline">
        ← All offer requests
      </Link>

      <h1 className="mt-2 font-mono text-2xl font-semibold text-ocean-900">{request.reference}</h1>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-2xl border border-neutral-200 bg-white p-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Customer</h2>
            <dl className="mt-3 grid grid-cols-2 gap-4">
              <Field label="Name" value={request.customerName} />
              <Field label="Email" value={request.customerEmail} />
              <Field label="WhatsApp" value={request.customerWhatsapp} />
              <Field label="Submitted" value={new Date(request.createdAt).toLocaleString()} />
            </dl>
            {request.additionalRequests && (
              <div className="mt-4">
                <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Additional requests</dt>
                <dd className="mt-0.5 whitespace-pre-wrap text-sm text-neutral-900">{request.additionalRequests}</dd>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-neutral-200 bg-white p-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Trip</h2>
            <dl className="mt-3 grid grid-cols-2 gap-4">
              <Field label="Arrival date" value={request.arrivalDate} />
              <Field label="Nights" value={request.nights} />
              <Field label="Adults" value={request.adults} />
              <Field label="Children" value={request.children} />
              <Field label="Rooms" value={request.rooms} />
              <Field label="Destination" value={itinerary.destinationLabel ?? (itinerary.isMultiIsland ? "Multiple Islands" : "Single Island (unspecified)")} />
              <Field label="Transfer" value={itinerary.transfer === "private_speedboat" ? "Private Speedboat (entire boat)" : "Shared Speedboat"} />
            </dl>
          </section>

          <section className="rounded-2xl border border-neutral-200 bg-white p-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Stay segments</h2>
            <ul className="mt-3 space-y-3">
              {itinerary.segments.map((segment) => (
                <li key={segment.id} className="rounded-xl border border-neutral-200 p-3 text-sm">
                  <p className="font-medium text-ocean-900">
                    {STAY_TYPE_LABELS[segment.stayType]} — {segment.nights} night{segment.nights === 1 ? "" : "s"}
                  </p>
                  <p className="mt-1 text-neutral-600">
                    Room: {segment.roomKey} &middot; Bed: {segment.bedPreference} &middot; Meal plan: {MEAL_PLAN_LABELS[segment.mealPlan]}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          {itinerary.dayActivities.length > 0 && (
            <section className="rounded-2xl border border-neutral-200 bg-white p-4">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Day-by-day activities</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {itinerary.dayActivities
                  .sort((a, b) => a.day - b.day)
                  .map((d, i) => (
                    <li key={`${d.day}-${d.activity.nodeId}-${i}`} className="flex items-center justify-between rounded-xl border border-neutral-200 px-3 py-2">
                      <span>
                        Day {d.day}: {d.activity.title}
                      </span>
                      <span className="text-neutral-500">{d.activity.priceFrom != null ? `${d.activity.currency ?? "USD"} ${d.activity.priceFrom}/person` : ""}</span>
                    </li>
                  ))}
              </ul>
            </section>
          )}

          <section className="rounded-2xl border border-neutral-200 bg-white p-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Price breakdown (as quoted)</h2>
            <dl className="mt-3 space-y-1.5 text-sm">
              {priceBreakdown.lines.map((line, i) => (
                <div key={i} className="flex justify-between">
                  <dt className="text-neutral-600">{line.label}</dt>
                  <dd className="text-neutral-900">
                    {priceBreakdown.currency} {line.amount.toFixed(2)}
                  </dd>
                </div>
              ))}
              <div className="mt-2 flex justify-between border-t border-neutral-200 pt-2 font-semibold text-ocean-900">
                <dt>Estimated total</dt>
                <dd>
                  {priceBreakdown.currency} {priceBreakdown.grandTotal.toFixed(2)}
                </dd>
              </div>
            </dl>
          </section>
        </div>

        <div>
          <HolidayRequestStatusForm requestId={request.id} currentStatus={request.status} currentNotes={request.internalNotes ?? ""} />
        </div>
      </div>
    </div>
  );
}
