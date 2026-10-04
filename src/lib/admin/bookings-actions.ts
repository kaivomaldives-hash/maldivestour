"use server";

import { revalidatePath } from "next/cache";

import { requireStaff } from "@/lib/admin/auth";
import { BOOKING_STATUSES, type BookingStatus } from "@/lib/admin/booking-status";
import { getBookingByIdAdmin } from "@/lib/admin/bookings-repository";
import { sendBookingConfirmedEmail } from "@/lib/bookings/notifications";
import { createClient } from "@/lib/supabase/server";

/**
 * requireStaff() here is defense in depth, not the primary guard — the
 * primary guard is `bookings_staff_update` RLS (supabase/migrations/
 * 20250101001400_rls_policies.sql), which blocks a non-staff write at the
 * database layer regardless of what this function does. Both checks use
 * the same RLS-respecting `createClient()`, never the service-role client
 * — a booking status change is exactly the kind of write RLS already
 * governs correctly, so there's no reason to bypass it.
 */

export interface AdminActionResult {
  ok: boolean;
  error?: string;
}

export interface TransferBoatDetailsInput {
  boatName: string | null;
  boatSize: string | null;
  boatContact: string | null;
  captainName: string | null;
  captainLicense: string | null;
  registrationNumber: string | null;
}

export interface UpdateBookingStatusInput {
  status: string;
  /** Staff-editable at the same time as the status, so a discount applied
   * right before confirming is guaranteed to be the price the confirmation
   * email actually quotes (see the single `.update()` call below — price
   * and status are written together, not as two separate racing actions). */
  quotedPrice?: number | null;
  currency?: string;
  paymentNote?: string | null;
  outboundBoat?: TransferBoatDetailsInput;
  returnBoat?: TransferBoatDetailsInput;
}

/**
 * A transition INTO 'confirmed' (from any other status) fires the customer
 * confirmation email exactly once, gated by `confirmation_email_sent_at`
 * (see sendBookingConfirmedEmail()'s own comment for why that's a separate
 * column from the inquiry-received email's tracking). The previous status
 * is read before the update specifically so that re-saving an
 * already-confirmed booking (e.g. only editing internal notes elsewhere,
 * or toggling confirmed -> completed -> confirmed) never re-sends it —
 * "every transition into confirmed" would double-fire on that last case,
 * so this checks `confirmation_email_sent_at is null` too, not just the
 * status change itself.
 *
 * Price and the transfer boat/captain details are written in this SAME
 * update call, before the confirmed-email is built from a fresh read —
 * never as a separate parallel action — specifically so a discount or a
 * boat assignment entered in the same save as "Confirmed" is guaranteed to
 * already be committed by the time the email is composed.
 */
export async function updateBookingStatus(id: string, input: UpdateBookingStatusInput): Promise<AdminActionResult> {
  await requireStaff();
  if (!(BOOKING_STATUSES as readonly string[]).includes(input.status)) return { ok: false, error: "Invalid status." };

  const supabase = await createClient();

  const { data: before } = await supabase
    .from("bookings")
    .select("status, confirmation_email_sent_at")
    .eq("id", id)
    .maybeSingle<{ status: BookingStatus; confirmation_email_sent_at: string | null }>();

  const updatePayload: Record<string, unknown> = { status: input.status };
  if (input.quotedPrice !== undefined) updatePayload.quoted_price = input.quotedPrice;
  if (input.currency !== undefined) updatePayload.currency = input.currency;
  if (input.paymentNote !== undefined) updatePayload.payment_note = input.paymentNote?.trim() || null;
  if (input.outboundBoat) {
    updatePayload.transfer_outbound_boat_name = input.outboundBoat.boatName?.trim() || null;
    updatePayload.transfer_outbound_boat_size = input.outboundBoat.boatSize?.trim() || null;
    updatePayload.transfer_outbound_boat_contact = input.outboundBoat.boatContact?.trim() || null;
    updatePayload.transfer_outbound_captain_name = input.outboundBoat.captainName?.trim() || null;
    updatePayload.transfer_outbound_captain_license = input.outboundBoat.captainLicense?.trim() || null;
    updatePayload.transfer_outbound_registration_number = input.outboundBoat.registrationNumber?.trim() || null;
  }
  if (input.returnBoat) {
    updatePayload.transfer_return_boat_name = input.returnBoat.boatName?.trim() || null;
    updatePayload.transfer_return_boat_size = input.returnBoat.boatSize?.trim() || null;
    updatePayload.transfer_return_boat_contact = input.returnBoat.boatContact?.trim() || null;
    updatePayload.transfer_return_captain_name = input.returnBoat.captainName?.trim() || null;
    updatePayload.transfer_return_captain_license = input.returnBoat.captainLicense?.trim() || null;
    updatePayload.transfer_return_registration_number = input.returnBoat.registrationNumber?.trim() || null;
  }

  const { error } = await supabase
    .from("bookings")
    .update(updatePayload as unknown as never)
    .eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath(`/admin/bookings/${id}`);
  revalidatePath("/admin/bookings");
  revalidatePath("/admin");

  const shouldSendConfirmation = input.status === "confirmed" && before?.status !== "confirmed" && !before?.confirmation_email_sent_at;
  if (shouldSendConfirmation) {
    const booking = await getBookingByIdAdmin(id);
    if (booking) {
      await sendBookingConfirmedEmail({
        bookingId: booking.id,
        bookingReference: booking.bookingReference,
        customerName: booking.customerName,
        customerEmail: booking.customerEmail,
        productTitle: booking.productTitle,
        originTitle: booking.originTitle,
        destinationTitle: booking.destinationTitle,
        travelDate: booking.travelDate,
        travelTime: booking.travelTime,
        source: booking.source,
        returnDate: booking.returnDate,
        returnTime: booking.returnTime,
        quotedPrice: booking.quotedPrice,
        currency: booking.currency,
        paymentNote: booking.paymentNote,
        outboundBoat: booking.transferOutboundBoatName
          ? {
              boatName: booking.transferOutboundBoatName,
              boatSize: booking.transferOutboundBoatSize,
              boatContact: booking.transferOutboundBoatContact,
              captainName: booking.transferOutboundCaptainName,
              captainLicense: booking.transferOutboundCaptainLicense,
              registrationNumber: booking.transferOutboundRegistrationNumber,
            }
          : null,
        returnBoat: booking.transferReturnBoatName
          ? {
              boatName: booking.transferReturnBoatName,
              boatSize: booking.transferReturnBoatSize,
              boatContact: booking.transferReturnBoatContact,
              captainName: booking.transferReturnCaptainName,
              captainLicense: booking.transferReturnCaptainLicense,
              registrationNumber: booking.transferReturnRegistrationNumber,
            }
          : null,
      });
    }
  }

  return { ok: true };
}

export async function updateBookingNotes(id: string, internalNotes: string): Promise<AdminActionResult> {
  await requireStaff();

  const supabase = await createClient();
  const { error } = await supabase
    .from("bookings")
    .update({ internal_notes: internalNotes.trim() || null } as unknown as never)
    .eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath(`/admin/bookings/${id}`);
  return { ok: true };
}

export type { BookingStatus };
