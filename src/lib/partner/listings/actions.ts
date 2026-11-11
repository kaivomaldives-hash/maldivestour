"use server";

import { revalidatePath } from "next/cache";

import { uploadOptimizedImage } from "@/lib/media/compress-image";
import { sendListingSubmissionNotification } from "@/lib/partner/listings/notifications";
import { createClient } from "@/lib/supabase/server";
import type {
  AccommodationListingPayload,
  ActivityListingPayload,
  ListingNodeType,
  ListingPayload,
  ListingSubmissionKind,
  PackageListingPayload,
  TransferRouteListingPayload,
} from "@/lib/partner/listings/types";
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

const MAX_PHOTOS = 15;
// Under next.config's 10mb server-action body limit. The uploader shrinks
// photos in the browser first, so this only catches the rare one it can't.
const MAX_PHOTO_BYTES = 9 * 1024 * 1024;
const ALLOWED_PHOTO_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif", "image/heic", "image/heif"]);

export interface SubmitListingInput {
  nodeType: ListingNodeType;
  submissionKind: ListingSubmissionKind;
  nodeId: string | null; // required when submissionKind === "update"
  payload: ListingPayload;
  /** The draft this came from, if any: it becomes the submission. */
  draftId?: string | null;
}

interface PartnerRow {
  partner_kinds: PartnerKind[];
  onboarding_status: string;
  business_name: string;
}

type Supabase = Awaited<ReturnType<typeof createClient>>;

/** Shared checks for drafts and submissions: signed-in partner, allowed
 * listing type, ownership of the listing being edited, and photos that
 * live in this partner's own upload folder. */
async function checkListingInput(
  supabase: Supabase,
  input: Pick<SubmitListingInput, "nodeType" | "submissionKind" | "nodeId" | "payload">,
): Promise<{ ok: true; userId: string; partner: PartnerRow } | { ok: false; error: string }> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in." };

  const { data: partner } = await supabase
    .from("partner_accounts")
    .select("partner_kinds, onboarding_status, business_name")
    .eq("id", user.id)
    .maybeSingle<PartnerRow>();
  if (!partner) return { ok: false, error: "No partner account found." };

  const allowedNodeTypes = partner.partner_kinds.map((kind) => NODE_TYPE_BY_PARTNER_KIND[kind]);
  if (!allowedNodeTypes.includes(input.nodeType)) {
    return { ok: false, error: "Your partner account isn't registered for this listing type." };
  }

  if (input.submissionKind === "update") {
    if (!input.nodeId) return { ok: false, error: "Missing listing to update." };
    const { data: node } = await supabase.from("nodes").select("created_by, node_type").eq("id", input.nodeId).maybeSingle<{ created_by: string | null; node_type: string }>();
    if (!node || node.created_by !== user.id) return { ok: false, error: "That listing isn't yours to edit." };
    if (node.node_type !== input.nodeType) return { ok: false, error: "Listing type mismatch." };
  }

  const photos = input.payload.photos ?? [];
  if (photos.length > MAX_PHOTOS) return { ok: false, error: `Up to ${MAX_PHOTOS} photos per listing.` };
  const ownFolder = `opt/partner-uploads/${user.id}/`;
  if (photos.some((p) => typeof p !== "string" || !p.startsWith(ownFolder) || p.includes(".."))) {
    return { ok: false, error: "One of the photos isn't valid. Remove it and upload it again." };
  }

  return { ok: true, userId: user.id, partner };
}

/**
 * Saves (creates or updates) a draft. Any partner can keep drafts, even
 * before their profile is approved; nothing reaches the review queue until
 * submitListing. Returns the draft id so the form keeps saving into the
 * same row.
 */
export async function saveListingDraft(input: SubmitListingInput): Promise<ActionResult & { draftId?: string }> {
  const supabase = await createClient();
  const checked = await checkListingInput(supabase, input);
  if (!checked.ok) return checked;

  const row = {
    partner_id: checked.userId,
    node_id: input.submissionKind === "update" ? input.nodeId : null,
    node_type: input.nodeType,
    submission_kind: input.submissionKind,
    title: input.payload.title.trim() || "Untitled listing",
    payload: input.payload,
    status: "draft",
    updated_at: new Date().toISOString(),
  };

  if (input.draftId) {
    const { data, error } = await supabase
      .from("listing_submissions")
      .update(row as unknown as never)
      .eq("id", input.draftId)
      .eq("status", "draft")
      .select("id")
      .maybeSingle<{ id: string }>();
    if (error) return { ok: false, error: error.message };
    if (data) return { ok: true, draftId: data.id };
    // The draft was submitted or deleted elsewhere: start a new one.
  }

  const { data, error } = await supabase.from("listing_submissions").insert(row as unknown as never).select("id").single<{ id: string }>();
  if (error || !data) return { ok: false, error: error?.message ?? "Couldn't save the draft." };
  revalidatePath("/partner/listings");
  return { ok: true, draftId: data.id };
}

export async function deleteListingDraft(draftId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: draft } = await supabase
    .from("listing_submissions")
    .select("payload")
    .eq("id", draftId)
    .eq("status", "draft")
    .maybeSingle<{ payload: ListingPayload }>();
  if (!draft) return { ok: false, error: "Draft not found." };

  const { error } = await supabase.from("listing_submissions").delete().eq("id", draftId).eq("status", "draft");
  if (error) return { ok: false, error: error.message };
  // Photos used only by this draft are left in storage on purpose: a
  // duplicate of the draft or listing may share them.
  revalidatePath("/partner/listings");
  return { ok: true };
}

/**
 * Sends a listing to the review queue: turns its draft into the
 * submission (or inserts a new row when there is no draft).
 * `listing_submissions` RLS re-checks partner/approval/ownership, but NOT
 * node_type against the partner's kinds (it has no way to), so the checks
 * here are the one real gate for "is this partner allowed to submit this
 * kind of listing" — not just the friendly-error layer.
 */
export async function submitListing(input: SubmitListingInput): Promise<ActionResult> {
  const supabase = await createClient();
  const checked = await checkListingInput(supabase, input);
  if (!checked.ok) return checked;
  const { userId, partner } = checked;
  if (partner.onboarding_status !== "approved") {
    return { ok: false, error: "Your draft is saved. You can send it for review once your partner profile is approved." };
  }
  const nodeType = input.nodeType;

  const title = input.payload.title.trim();
  if (!title) return { ok: false, error: "Title is required." };

  // The real floor: a transfer_route payload's commission lives on its
  // nested `service`, every other node type carries it directly — see
  // ListingPayload's own per-type shape. Re-checked here regardless of
  // what the client sent/validated.
  const submittedCommission =
    nodeType === "transfer_route"
      ? (input.payload as TransferRouteListingPayload).service.commissionPercent
      : (input.payload as AccommodationListingPayload | ActivityListingPayload | PackageListingPayload).commissionPercent;
  if (!Number.isFinite(submittedCommission) || submittedCommission < 15) {
    return { ok: false, error: "Commission must be at least 15%." };
  }
  if (nodeType === "transfer_route") {
    const transfer = input.payload as TransferRouteListingPayload;
    // Drafts may leave these empty; a submission may not.
    if (!transfer.originLocationId || !transfer.destinationLocationId) return { ok: false, error: "Origin and destination are both required." };
    if (!(transfer.service.price > 0)) return { ok: false, error: "Price must be greater than zero." };
  }

  const row = {
    partner_id: userId,
    node_id: input.submissionKind === "update" ? input.nodeId : null,
    node_type: nodeType,
    submission_kind: input.submissionKind,
    title,
    payload: input.payload,
    status: "pending",
    updated_at: new Date().toISOString(),
  };

  let saved = false;
  if (input.draftId) {
    const { data, error } = await supabase
      .from("listing_submissions")
      .update({ ...row, created_at: new Date().toISOString() } as unknown as never)
      .eq("id", input.draftId)
      .eq("status", "draft")
      .select("id")
      .maybeSingle<{ id: string }>();
    if (error) return { ok: false, error: error.message };
    saved = Boolean(data);
  }
  if (!saved) {
    const { error } = await supabase.from("listing_submissions").insert(row as unknown as never);
    if (error) return { ok: false, error: error.message };
  }

  await sendListingSubmissionNotification({
    businessName: partner.business_name,
    title,
    nodeType,
    submissionKind: input.submissionKind,
  });
  revalidatePath("/partner/listings");
  return { ok: true };
}

/**
 * Uploads one listing photo: resized and converted to WebP (plus the
 * responsive sizes the site's image loader expects), into this partner's
 * own folder of the public media bucket. Returns the storage path the form
 * keeps in the payload's `photos`.
 */
export async function uploadListingPhoto(formData: FormData): Promise<ActionResult & { storagePath?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in." };
  const { data: partner } = await supabase.from("partner_accounts").select("id").eq("id", user.id).maybeSingle<{ id: string }>();
  if (!partner) return { ok: false, error: "No partner account found." };

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { ok: false, error: "Choose a photo to upload." };
  if (file.size > MAX_PHOTO_BYTES) return { ok: false, error: `${file.name} is too large: the limit is 9 MB.` };
  if (file.type && !ALLOWED_PHOTO_TYPES.has(file.type)) return { ok: false, error: `${file.name} isn't a photo. Use JPG, PNG or WebP.` };

  try {
    const uploaded = await uploadOptimizedImage(supabase, `partner-uploads/${user.id}`, await file.arrayBuffer());
    if (uploaded.error !== undefined) return { ok: false, error: uploaded.error };
    return { ok: true, storagePath: uploaded.storagePath };
  } catch {
    return { ok: false, error: `${file.name} couldn't be read as a photo. Try a JPG or PNG.` };
  }
}
