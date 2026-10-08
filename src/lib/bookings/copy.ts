/**
 * Structured booking source + the CTA copy shown for each vertical (MTG
 * roadmap Task 13 §15/§18). `BookingSource` matches the `bookings.source`
 * check constraint exactly (see supabase/migrations/20250130000100_
 * booking_source_and_throttle.sql) — this is the single place both are
 * defined, so a new vertical can't drift out of sync between the two.
 *
 * Speedboat and vehicle charters aren't their own source value — they're
 * boat/car transfer products, not a separate vertical the site owner asked
 * to track, so they're grouped under "transfer".
 */
export type BookingSource = "accommodation" | "activity" | "fishing" | "diving" | "surfing" | "transfer" | "package";

export interface BookingCta {
  toggleLabel: string;
  submitLabel: string;
}

const BOOKING_CTA: Record<BookingSource, BookingCta> = {
  accommodation: { toggleLabel: "Request Accommodation", submitLabel: "Request Accommodation" },
  activity: { toggleLabel: "Request Booking", submitLabel: "Request Booking" },
  // Phase 9 of the Maldives Fishing growth plan: lead with what the angler
  // wants to catch rather than a generic "request" verb — the same enquiry
  // pipeline (createNodeInquiry, source="fishing") handles it either way.
  fishing: { toggleLabel: "Tell Us What You Want to Catch", submitLabel: "Find My Fishing Trip" },
  diving: { toggleLabel: "Request Diving Experience", submitLabel: "Request Diving Experience" },
  surfing: { toggleLabel: "Request Surfing Experience", submitLabel: "Request Surfing Experience" },
  transfer: { toggleLabel: "Request Transfer", submitLabel: "Request Transfer" },
  package: { toggleLabel: "Request This Package", submitLabel: "Request This Package" },
};

export function bookingCta(source: BookingSource): BookingCta {
  return BOOKING_CTA[source];
}

/** Fishing packages get more specific copy than a generic package. */
export const FISHING_PACKAGE_CTA: BookingCta = { toggleLabel: "Request Fishing Package", submitLabel: "Request Fishing Package" };

/** Every booking form must link to the site owner's real Terms and
 * Conditions (/terms-and-conditions/) before a guest can submit — transfer
 * bookings get the transfer-specific terms (boat/departure/no-show
 * policy), everything else gets the general terms. */
export function termsUrl(source: BookingSource): string {
  return source === "transfer" ? "/terms-and-conditions/transfers/" : "/terms-and-conditions/";
}
