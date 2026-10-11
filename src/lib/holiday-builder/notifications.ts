import "server-only";

import { escapeHtml, sendResendEmail, getAdminNotificationEmail } from "@/lib/notifications/email";
import { createAdminClient } from "@/lib/supabase/admin";
import type { PriceBreakdown } from "@/lib/holiday-builder/types";

const SITE_NAME = "Maldives Tour Guide (MTG)";
const WHATSAPP_NUMBER = "9607794332";

function lineItemsHtmlOf(breakdown: PriceBreakdown): string {
  return breakdown.lines.map((line) => `<li>${escapeHtml(line.label)} — USD ${line.amount.toFixed(2)}</li>`).join("");
}

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
      ${lineItemsHtmlOf(input.breakdown) ? `<p><strong>Selected:</strong></p><ul>${lineItemsHtmlOf(input.breakdown)}</ul>` : ""}
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

/** Customer-facing confirmation, sent once when staff move a request from
 * pending/contacted into 'confirmed' — gated by holiday_quote_requests.
 * confirmation_email_sent_at (same single-column gate bookings.
 * confirmation_email_sent_at uses), checked by the caller
 * (updateHolidayRequestStatus) before this ever runs. This is still only
 * a confirmed OFFER, not a ticketed booking — the copy says so plainly. */
export interface HolidayRequestConfirmedEmailInput {
  requestId: string;
  reference: string;
  customerName: string;
  customerEmail: string;
  arrivalDate: string;
  nights: number;
  adults: number;
  children: number;
  breakdown: PriceBreakdown;
}

export async function sendHolidayRequestConfirmedEmail(input: HolidayRequestConfirmedEmailInput): Promise<void> {
  try {
    const admin = createAdminClient();

    const html = `
      <p>Hi ${escapeHtml(input.customerName)},</p>
      <p>Good news — we&rsquo;ve confirmed availability for your custom holiday request.</p>
      <p><strong>Reference:</strong> ${escapeHtml(input.reference)}<br/>
      <strong>Arrival:</strong> ${escapeHtml(input.arrivalDate)}<br/>
      <strong>Nights:</strong> ${input.nights}<br/>
      <strong>Guests:</strong> ${input.adults} adult${input.adults === 1 ? "" : "s"}${input.children > 0 ? `, ${input.children} child${input.children === 1 ? "" : "ren"}` : ""}</p>
      ${lineItemsHtmlOf(input.breakdown) ? `<p><strong>Your itinerary:</strong></p><ul>${lineItemsHtmlOf(input.breakdown)}</ul>` : ""}
      <p><strong>Confirmed estimated total: USD ${input.breakdown.grandTotal.toFixed(2)}</strong></p>
      <p>This confirms availability at this price — our team will follow up with final booking and payment details.</p>
      <p>Questions in the meantime? WhatsApp us on +${WHATSAPP_NUMBER} or reply to this email.</p>
      <p>— ${SITE_NAME}</p>
    `;

    const result = await sendResendEmail(input.customerEmail, `Your custom holiday is confirmed — ${input.reference}`, html);
    if (!result.ok) {
      console.error("[holiday-builder] failed to send confirmation email:", result.error);
      return;
    }

    const { error } = await admin
      .from("holiday_quote_requests")
      .update({ confirmation_email_sent_at: new Date().toISOString() } as unknown as never)
      .eq("id", input.requestId);
    if (error) {
      console.error("[holiday-builder] failed to set confirmation_email_sent_at:", error.message);
    }
  } catch (err) {
    console.error("[holiday-builder] sendHolidayRequestConfirmedEmail threw unexpectedly:", err instanceof Error ? err.message : String(err));
  }
}
