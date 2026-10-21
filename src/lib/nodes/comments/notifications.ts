import "server-only";

import { escapeHtml, getAdminNotificationEmail, sendResendEmail } from "@/lib/notifications/email";
import { getSiteUrl } from "@/lib/seo/site";
import { createAdminClient } from "@/lib/supabase/admin";

export interface NodeCommentNotificationInput {
  nodeTitle: string;
  commenterName: string;
  body: string;
}

/**
 * Admin alert fired whenever a guest submits a comment on a category/hub
 * page (submitNodeComment() in ./actions.ts) — same belt-and-braces shape
 * as sendListingSubmissionNotification() (src/lib/partner/listings/
 * notifications.ts): the node_comments row already exists by the time
 * this runs, so a delivery failure here never loses the comment, and it
 * never throws back into the caller.
 */
export async function sendNodeCommentNotification(input: NodeCommentNotificationInput): Promise<void> {
  try {
    const admin = createAdminClient();
    const adminEmail = await getAdminNotificationEmail(admin);

    const html = `
      <p>${escapeHtml(input.commenterName)} left a comment on <strong>${escapeHtml(input.nodeTitle)}</strong>.</p>
      <p>"${escapeHtml(input.body)}"</p>
      <p>Nothing shows publicly until approved in <a href="${getSiteUrl()}/admin/node-comments?status=pending">Admin &rarr; Page Comments</a>.</p>
    `;

    const result = await sendResendEmail(adminEmail, `New page comment — ${input.nodeTitle}`, html);
    if (!result.ok) {
      console.error("[nodes/comments] failed to send comment notification email:", result.error);
    }
  } catch (err) {
    console.error("[nodes/comments] sendNodeCommentNotification threw unexpectedly:", err instanceof Error ? err.message : String(err));
  }
}
