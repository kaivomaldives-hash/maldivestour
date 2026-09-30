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
 */
export async function updateBookingStatus(id: string, status: string): Promise<AdminActionResult> {
  await requireStaff();
  if (!(BOOKING_STATUSES as readonly string[]).includes(status)) return { ok: false, error: "Invalid status." };

  const supabase = await createClient();

  const { data: before } = await supabase
    .from("bookings")
    .select("status, confirmation_email_sent_at")
    .eq("id", id)
    .maybeSingle<{ status: BookingStatus; confirmation_email_sent_at: string | null }>();

  const { error } = await supabase
    .from("bookings")
    .update({ status } as unknown as never)
    .eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath(`/admin/bookings/${id}`);
  revalidatePath("/admin/bookings");
  revalidatePath("/admin");

  const shouldSendConfirmation = status === "confirmed" && before?.status !== "confirmed" && !before?.confirmation_email_sent_at;
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
