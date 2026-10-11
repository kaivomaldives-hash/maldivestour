"use server";

import { revalidatePath } from "next/cache";

import { requireStaff } from "@/lib/admin/auth";
import { HOLIDAY_REQUEST_STATUSES } from "@/lib/admin/holiday-request-status";
import { getHolidayRequestByIdAdmin } from "@/lib/admin/holiday-requests-repository";
import { sendHolidayRequestConfirmedEmail } from "@/lib/holiday-builder/notifications";
import { createClient } from "@/lib/supabase/server";
import type { HolidayRequestStatus } from "@/lib/admin/holiday-request-status";

export interface AdminActionResult {
  ok: boolean;
  error?: string;
}

/** A transition INTO 'confirmed' fires the customer confirmation email
 * exactly once, same gated pattern as updateBookingStatus() in
 * src/lib/admin/bookings-actions.ts — the previous status/sent-at are
 * read before the update so re-saving an already-confirmed request
 * (e.g. only editing internal notes) never re-sends it. */
export async function updateHolidayRequestStatus(id: string, status: string, internalNotes: string): Promise<AdminActionResult> {
  await requireStaff();
  if (!(HOLIDAY_REQUEST_STATUSES as readonly string[]).includes(status)) return { ok: false, error: "Invalid status." };

  const supabase = await createClient();

  const { data: before } = await supabase
    .from("holiday_quote_requests")
    .select("status, confirmation_email_sent_at")
    .eq("id", id)
    .maybeSingle<{ status: HolidayRequestStatus; confirmation_email_sent_at: string | null }>();

  const { error } = await supabase
    .from("holiday_quote_requests")
    .update({ status, internal_notes: internalNotes.trim() || null } as unknown as never)
    .eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/holiday-requests");
  revalidatePath(`/admin/holiday-requests/${id}`);

  const shouldSendConfirmation = status === "confirmed" && before?.status !== "confirmed" && !before?.confirmation_email_sent_at;
  if (shouldSendConfirmation) {
    const request = await getHolidayRequestByIdAdmin(id);
    if (request) {
      await sendHolidayRequestConfirmedEmail({
        requestId: request.id,
        reference: request.reference,
        customerName: request.customerName,
        customerEmail: request.customerEmail,
        arrivalDate: request.arrivalDate,
        nights: request.nights,
        adults: request.adults,
        children: request.children,
        breakdown: request.priceBreakdown,
      });
    }
  }

  return { ok: true };
}
