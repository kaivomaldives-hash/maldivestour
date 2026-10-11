import "server-only";

import { escapeHtml, sendResendEmail, getAdminNotificationEmail } from "@/lib/notifications/email";
import { createAdminClient } from "@/lib/supabase/admin";
import type { PriceBreakdown } from "@/lib/holiday-builder/types";

/** Admin alert for a new Custom Holiday Builder quote request — the
 * request row already exists (submit_holiday_quote_request() persists it
 * before this ever runs), so a delivery failure here never loses the
 * request itself, same belt-and-braces as sendPartnerRequestNotification. */
export interface HolidayRequestNotificationInput {
  reference: string;
  customerName: string;
  customerEmail: string;
  customerWhatsapp: string;
  arrivalDate: string;
  nights: number;
  adults: number;
  children: number;
  breakdown: PriceBreakdown;
}

export async function sendHolidayRequestNotification(input: HolidayRequestNotificationInput): Promise<void> {
  try {
    const admin = createAdminClient();
    const adminEmail = await getAdminNotificationEmail(admin);

    const html = `
      <p>New Custom Holiday request — <strong>${escapeHtml(input.reference)}</strong>.</p>
      <p><strong>Name:</strong> ${escapeHtml(input.customerName)}<br/>
      <strong>Email:</strong> ${escapeHtml(input.customerEmail)}<br/>
      <strong>WhatsApp:</strong> ${escapeHtml(input.customerWhatsapp)}</p>
      <p><strong>Arrival:</strong> ${escapeHtml(input.arrivalDate)}<br/>
      <strong>Nights:</strong> ${input.nights}<br/>
      <strong>Guests:</strong> ${input.adults} adult${input.adults === 1 ? "" : "s"}${input.children > 0 ? `, ${input.children} child${input.children === 1 ? "" : "ren"}` : ""}</p>
      <p><strong>Estimated total: USD ${input.breakdown.grandTotal.toFixed(2)}</strong></p>
      <p>See the full itinerary in <a href="/admin/holiday-requests">Admin &rarr; Holiday Requests</a>.</p>
    `;

    const result = await sendResendEmail(adminEmail, `New Custom Holiday request — ${input.reference}`, html);
    if (!result.ok) {
      console.error("[holiday-builder] failed to send request notification email:", result.error);
    }
  } catch (err) {
    console.error("[holiday-builder] sendHolidayRequestNotification threw unexpectedly:", err instanceof Error ? err.message : String(err));
  }
}
