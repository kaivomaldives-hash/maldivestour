import "server-only";

import { escapeHtml, getAdminNotificationEmail, sendResendEmail } from "@/lib/notifications/email";
import { getSiteUrl } from "@/lib/seo/site";
import { createAdminClient } from "@/lib/supabase/admin";

export interface AgentApplicationNotificationInput {
  businessName: string;
  contactEmail: string;
}

/**
 * Admin alert fired right after a travel agent account is created
 * (createAgentAccount() in ./actions.ts) — unlike the partner portal,
 * there's no separate "submit for review" step here: account creation
 * IS the application, landing straight in status "pending". The
 * agent_accounts row already exists by the time this runs, so a
 * delivery failure here never loses the application.
 */
export async function sendAgentApplicationNotification(input: AgentApplicationNotificationInput): Promise<void> {
  try {
    const admin = createAdminClient();
    const adminEmail = await getAdminNotificationEmail(admin);

    const html = `
      <p>New travel agent application.</p>
      <p><strong>Business:</strong> ${escapeHtml(input.businessName)}<br/>
      <strong>Contact email:</strong> ${escapeHtml(input.contactEmail)}</p>
      <p>Review it in <a href="${getSiteUrl()}/admin/agents?status=pending">Admin &rarr; Travel Agents</a>.</p>
    `;

    const result = await sendResendEmail(adminEmail, `New travel agent application — ${input.businessName}`, html);
    if (!result.ok) {
      console.error("[agent] failed to send agent application notification email:", result.error);
    }
  } catch (err) {
    console.error("[agent] sendAgentApplicationNotification threw unexpectedly:", err instanceof Error ? err.message : String(err));
  }
}
