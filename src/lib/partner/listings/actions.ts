"use server";

import { createClient } from "@/lib/supabase/server";
import type { ListingNodeType, ListingPayload, ListingSubmissionKind } from "@/lib/partner/listings/types";
import type { PartnerKind } from "@/lib/partner/types";

export interface ActionResult {
  ok: boolean;
  error?: string;
}

const NODE_TYPE_BY_PARTNER_KIND: Record<PartnerKind, ListingNodeType> = {
  property: "accommodation",
  activity: "activity",
  package: "package",
  transfer: "transfer_route",
};

export interface SubmitListingInput {
  submissionKind: ListingSubmissionKind;
  nodeId: string | null; // required when submissionKind === "update"
  payload: ListingPayload;
}

/**
 * Inserts a `listing_submissions` row — the only thing this function
 * does; it never writes to accommodations/activities/packages/
 * transfer_routes itself (see the migration's own header comment for
 * why). `listing_submissions_self_insert` RLS re-checks everything this
 * function checks, independently — this is the friendly-error layer, not
 * the real gate.
 */
export async function submitListing(input: SubmitListingInput): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in." };

  const { data: partner } = await supabase
    .from("partner_accounts")
    .select("partner_kind, onboarding_status")
    .eq("id", user.id)
    .maybeSingle<{ partner_kind: PartnerKind; onboarding_status: string }>();
  if (!partner) return { ok: false, error: "No partner account found." };
  if (partner.onboarding_status !== "approved") return { ok: false, error: "Your partner profile must be approved before you can submit a listing." };

  const nodeType = NODE_TYPE_BY_PARTNER_KIND[partner.partner_kind];

  if (input.submissionKind === "update") {
    if (!input.nodeId) return { ok: false, error: "Missing listing to update." };
    const { data: node } = await supabase.from("nodes").select("created_by").eq("id", input.nodeId).maybeSingle<{ created_by: string | null }>();
    if (!node || node.created_by !== user.id) return { ok: false, error: "That listing isn't yours to edit." };
  }

  const title = input.payload.title.trim();
  if (!title) return { ok: false, error: "Title is required." };

  const { error } = await supabase.from("listing_submissions").insert({
    partner_id: user.id,
    node_id: input.submissionKind === "update" ? input.nodeId : null,
    node_type: nodeType,
    submission_kind: input.submissionKind,
    title,
    payload: input.payload,
  } as unknown as never);

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
