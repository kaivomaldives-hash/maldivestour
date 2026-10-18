import "server-only";

import { escapeHtml, getAdminNotificationEmail, sendResendEmail } from "@/lib/notifications/email";
import { PARTNER_KINDS, type PartnerKind } from "@/lib/partner/types";
import { getSiteUrl } from "@/lib/seo/site";
import { createAdminClient } from "@/lib/supabase/admin";

function partnerKindLabel(kind: PartnerKind): string {
  return PARTNER_KINDS.find((k) => k.value === kind)?.label ?? kind;
}

export interface PartnerApplicationNotificationInput {
  businessName: string;
  contactEmail: string;
  partnerKinds: PartnerKind[];
}

/**
 * Admin alert fired when a self-service partner account (property/
 * activity/package/transfer operator, /partner/signup) is actually
 * submitted for review — not at account creation, since a partner can
 * sit in the "profile" draft state indefinitely before choosing to
 * submit. The partner_accounts row already exists by the time this
 * runs (submitPartnerProfileForReview's RPC call), so a delivery
 * failure here never loses the application, same belt-and-braces as
 * sendPartnerRequestNotification in src/lib/partners/notifications.ts.
 */
export async function sendPartnerApplicationNotification(input: PartnerApplicationNotificationInput): Promise<void> {
  try {
    const admin = createAdminClient();
    const adminEmail = await getAdminNotificationEmail(admin);
    const kindsLabel = input.partnerKinds.map(partnerKindLabel).join(", ");

    const html = `
      <p>New partner application submitted for review.</p>
      <p><strong>Business:</strong> ${escapeHtml(input.businessName)}<br/>
      <strong>Contact email:</strong> ${escapeHtml(input.contactEmail)}<br/>
      <strong>Partner type(s):</strong> ${escapeHtml(kindsLabel)}</p>
      <p>Review it in <a href="${getSiteUrl()}/admin/partners?status=submitted">Admin &rarr; Partner Applications</a>.</p>
    `;

    const result = await sendResendEmail(adminEmail, `New partner application — ${input.businessName}`, html);
    if (!result.ok) {
      console.error("[partner] failed to send partner application notification email:", result.error);
    }
  } catch (err) {
    console.error("[partner] sendPartnerApplicationNotification threw unexpectedly:", err instanceof Error ? err.message : String(err));
  }
}
