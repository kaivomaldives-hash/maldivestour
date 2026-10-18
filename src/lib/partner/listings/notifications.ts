import "server-only";

import { escapeHtml, getAdminNotificationEmail, sendResendEmail } from "@/lib/notifications/email";
import type { ListingNodeType, ListingSubmissionKind } from "@/lib/partner/listings/types";
import { getSiteUrl } from "@/lib/seo/site";
import { createAdminClient } from "@/lib/supabase/admin";

const NODE_TYPE_LABEL: Record<ListingNodeType, string> = {
  accommodation: "Property",
  activity: "Activity",
  package: "Package",
  transfer_route: "Transfer",
};

export interface ListingSubmissionNotificationInput {
  businessName: string;
  title: string;
  nodeType: ListingNodeType;
  submissionKind: ListingSubmissionKind;
}

/**
 * Admin alert fired whenever an approved partner submits a new listing
 * or an edit to one of their own for moderation (submitListing() in
 * ./actions.ts). The listing_submissions row already exists by the time
 * this runs, so a delivery failure here never loses the submission,
 * same belt-and-braces as every other notifications.ts in this codebase.
 */
export async function sendListingSubmissionNotification(input: ListingSubmissionNotificationInput): Promise<void> {
  try {
    const admin = createAdminClient();
    const adminEmail = await getAdminNotificationEmail(admin);
    const kindLabel = input.submissionKind === "update" ? "edit to an existing listing" : "new listing";

    const html = `
      <p>${escapeHtml(input.businessName)} submitted a ${kindLabel} for approval.</p>
      <p><strong>Type:</strong> ${escapeHtml(NODE_TYPE_LABEL[input.nodeType])}<br/>
      <strong>Title:</strong> ${escapeHtml(input.title)}</p>
      <p>Nothing goes live until approved in <a href="${getSiteUrl()}/admin/partner-listings?status=pending">Admin &rarr; Partner Listings</a>.</p>
    `;

    const result = await sendResendEmail(adminEmail, `New listing submission — ${input.businessName}`, html);
    if (!result.ok) {
      console.error("[partner/listings] failed to send listing submission notification email:", result.error);
    }
  } catch (err) {
    console.error("[partner/listings] sendListingSubmissionNotification threw unexpectedly:", err instanceof Error ? err.message : String(err));
  }
}
