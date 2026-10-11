import { PartnerBookingActions } from "@/components/partner/partner-booking-actions";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { getMyPartnerBookings } from "@/lib/partner/bookings/repository";
import type { PartnerBookingStatus } from "@/lib/partner/bookings/repository";

const STATUS_TONE: Record<PartnerBookingStatus, "neutral" | "maldives" | "aqua" | "outline"> = {
  new: "aqua",
  contacted: "aqua",
  pending: "aqua",
  confirmed: "maldives",
  cancelled: "outline",
  completed: "neutral",
};

export default async function PartnerBookingsPage() {
  const bookings = await getMyPartnerBookings();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-ocean-900">Bookings</h1>
      <p className="mt-1 text-sm text-neutral-600">Requests for your listings. Confirming sends the guest a confirmation email.</p>

      {bookings.length === 0 ? (
        <div className="mt-8">
          <EmptyState title="No bookings yet" />
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {bookings.map((b) => (
            <li key={b.id} className="rounded-2xl border border-neutral-200 bg-white p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge tone={STATUS_TONE[b.status]}>{b.status}</Badge>
                    <span className="font-mono text-sm text-neutral-500">{b.bookingReference}</span>
                  </div>
                  <p className="mt-2 text-sm font-medium text-neutral-900">{b.productTitle}</p>
                  <p className="text-sm text-neutral-600">
                    {b.customerName} — {b.customerEmail}
                  </p>
                  <p className="mt-1 text-sm text-neutral-600">
                    {b.travelDate ?? "No date given"} · {b.adults} adult{b.adults === 1 ? "" : "s"}
                    {b.children ? `, ${b.children} child${b.children === 1 ? "" : "ren"}` : ""}
                    {(b.quotedPrice ?? b.estimatedPrice) != null ? ` · ${b.currency} ${b.quotedPrice ?? b.estimatedPrice}` : ""}
                  </p>
                </div>
                <PartnerBookingActions bookingId={b.id} status={b.status} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
