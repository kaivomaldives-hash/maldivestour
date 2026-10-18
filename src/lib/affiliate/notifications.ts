import "server-only";

import { escapeHtml, getAdminNotificationEmail, sendResendEmail } from "@/lib/notifications/email";
import { getSiteUrl } from "@/lib/seo/site";
import { createAdminClient } from "@/lib/supabase/admin";

export interface AffiliateApplicationNotificationInput {
  businessName: string;
  contactEmail: string;
}

/**
 * Admin alert fired right after an affiliate account is created
 * (createAffiliateAccount() in ./actions.ts) — same "account creation
 * IS the application" shape as the travel agent programme, landing
 * straight in status "pending". The affiliate_accounts row already
 * exists by the time this runs, so a delivery failure here never loses
 * the application.
 */
export async function sendAffiliateApplicationNotification(input: AffiliateApplicationNotificationInput): Promise<void> {
  try {
    const admin = createAdminClient();
    const adminEmail = await getAdminNotificationEmail(admin);

    const html = `
      <p>New affiliate application.</p>
      <p><strong>Business:</strong> ${escapeHtml(input.businessName)}<br/>
      <strong>Contact email:</strong> ${escapeHtml(input.contactEmail)}</p>
      <p>Review it in <a href="${getSiteUrl()}/admin/affiliates?status=pending">Admin &rarr; Affiliates</a>.</p>
    `;

    const result = await sendResendEmail(adminEmail, `New affiliate application — ${input.businessName}`, html);
    if (!result.ok) {
      console.error("[affiliate] failed to send affiliate application notification email:", result.error);
    }
  } catch (err) {
    console.error("[affiliate] sendAffiliateApplicationNotification threw unexpectedly:", err instanceof Error ? err.message : String(err));
  }
}
