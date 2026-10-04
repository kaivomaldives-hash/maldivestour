import "server-only";

import { escapeHtml, sendResendEmail, getAdminNotificationEmail } from "@/lib/notifications/email";
import { partnerTypeLabel } from "@/lib/partners/types";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Site owner's explicit scope for "Become a Partner" (footer form): just
 * get the request recorded and emailed to the admin inbox for now — no
 * vendor account, no self-service listing management (that's a later,
 * separate build). This is the email half; the request itself is already
 * durably stored by submit_partner_request() before this ever runs, so a
 * delivery failure here never loses the request.
 */
export interface PartnerRequestNotificationInput {
  partnerType: string;
  name: string;
  email: string;
  phone: string | null;
  companyName: string | null;
  message: string | null;
}

export async function sendPartnerRequestNotification(input: PartnerRequestNotificationInput): Promise<void> {
  try {
    const admin = createAdminClient();
    const adminEmail = await getAdminNotificationEmail(admin);

    const html = `
      <p>New partner request — <strong>${escapeHtml(partnerTypeLabel(input.partnerType))}</strong>.</p>
      <p><strong>Name:</strong> ${escapeHtml(input.name)}<br/>
      <strong>Email:</strong> ${escapeHtml(input.email)}${input.phone ? `<br/><strong>Phone:</strong> ${escapeHtml(input.phone)}` : ""}${
        input.companyName ? `<br/><strong>Company:</strong> ${escapeHtml(input.companyName)}` : ""
      }</p>
      ${input.message ? `<p><strong>Message:</strong><br/>${escapeHtml(input.message).replace(/\n/g, "<br/>")}</p>` : ""}
    `;

    const result = await sendResendEmail(adminEmail, `New partner request — ${partnerTypeLabel(input.partnerType)}`, html);
    if (!result.ok) {
      console.error("[partners] failed to send partner request notification email:", result.error);
    }
  } catch (err) {
    // Same belt-and-braces as sendBookingNotifications() — the request row
    // already exists, so a notification problem here is never a failure
    // to surface back to the submitter.
    console.error("[partners] sendPartnerRequestNotification threw unexpectedly:", err instanceof Error ? err.message : String(err));
  }
}
