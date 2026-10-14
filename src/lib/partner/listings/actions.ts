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
  nodeType: ListingNodeType;
  submissionKind: ListingSubmissionKind;
  nodeId: string | null; // required when submissionKind === "update"
  payload: ListingPayload;
}

/**
 * Inserts a `listing_submissions` row — the only thing this function
 * does; it never writes to accommodations/activities/packages/
 * transfer_routes itself (see the migration's own header comment for
 * why). `listing_submissions_self_insert` RLS re-checks partner_id/
 * approval/node ownership, but NOT node_type against the partner's
 * kinds (it has no way to), so this is the one real gate for "is this
 * partner actually allowed to submit this kind of listing" — not just
 * the friendly-error layer.
 */
export async function submitListing(input: SubmitListingInput): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in." };

  const { data: partner } = await supabase
    .from("partner_accounts")
    .select("partner_kinds, onboarding_status")
    .eq("id", user.id)
    .maybeSingle<{ partner_kinds: PartnerKind[]; onboarding_status: string }>();
  if (!partner) return { ok: false, error: "No partner account found." };
  if (partner.onboarding_status !== "approved") return { ok: false, error: "Your partner profile must be approved before you can submit a listing." };

  const allowedNodeTypes = partner.partner_kinds.map((kind) => NODE_TYPE_BY_PARTNER_KIND[kind]);
  if (!allowedNodeTypes.includes(input.nodeType)) {
    return { ok: false, error: "Your partner account isn't registered for this listing type." };
  }
  const nodeType = input.nodeType;

  if (input.submissionKind === "update") {
    if (!input.nodeId) return { ok: false, error: "Missing listing to update." };
    const { data: node } = await supabase.from("nodes").select("created_by, node_type").eq("id", input.nodeId).maybeSingle<{ created_by: string | null; node_type: string }>();
    if (!node || node.created_by !== user.id) return { ok: false, error: "That listing isn't yours to edit." };
    if (node.node_type !== nodeType) return { ok: false, error: "Listing type mismatch." };
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
