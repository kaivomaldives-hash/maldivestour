"use server";

import { revalidatePath } from "next/cache";

import { requireStaff } from "@/lib/admin/auth";
import type { AdminActionResult } from "@/lib/admin/node-actions";
import type { PartnerDocumentStatus } from "@/lib/partner/types";
import { createClient } from "@/lib/supabase/server";

/** Approves a partner's submitted profile: flips onboarding_status to
 * 'approved', records who/when, and — since the provider/node row created
 * at signup (create_partner_account RPC) starts as a 'draft' node with no
 * is_verified flag — also publishes the provider node and marks it
 * verified, so the public provider page and any future listing this
 * partner creates both reflect a vetted operator. Three sequential
 * updates, not one transaction: same "no cross-table transaction through
 * PostgREST" convention as createNode()/updateNodeCore()
 * (src/lib/admin/node-actions.ts). */
export async function approvePartnerAccount(partnerId: string, providerId: string | null): Promise<AdminActionResult> {
  const { userId } = await requireStaff();
  const supabase = await createClient();

  const { error: accountError } = await supabase
    .from("partner_accounts")
    .update({ onboarding_status: "approved", reviewed_by: userId, reviewed_at: new Date().toISOString(), rejection_reason: null } as unknown as never)
    .eq("id", partnerId);
  if (accountError) return { ok: false, error: accountError.message };

  if (providerId) {
    await supabase.from("providers").update({ is_verified: true } as unknown as never).eq("id", providerId);
    await supabase.from("nodes").update({ status: "published", published_at: new Date().toISOString() } as unknown as never).eq("id", providerId);
  }

  return { ok: true };
}

export async function rejectPartnerAccount(partnerId: string, reason: string): Promise<AdminActionResult> {
  const { userId } = await requireStaff();
  if (!reason.trim()) return { ok: false, error: "A reason is required so the partner knows what to fix." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("partner_accounts")
    .update({ onboarding_status: "rejected", reviewed_by: userId, reviewed_at: new Date().toISOString(), rejection_reason: reason.trim() } as unknown as never)
    .eq("id", partnerId);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function suspendPartnerAccount(partnerId: string, reason: string): Promise<AdminActionResult> {
  const { userId } = await requireStaff();
  const supabase = await createClient();
  const { error } = await supabase
    .from("partner_accounts")
    .update({ onboarding_status: "suspended", reviewed_by: userId, reviewed_at: new Date().toISOString(), rejection_reason: reason.trim() || null } as unknown as never)
    .eq("id", partnerId);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

/** Records a manual payment received from a partner, against their
 * accrued commission — mirrors recordAffiliatePayout (src/lib/admin/
 * affiliate-accounts-actions.ts), direction reversed: the partner pays
 * MTG, staff just logs that it happened. Never tied to one specific
 * booking, same "running balance, not reconciled line by line" reasoning. */
export async function recordPartnerPayment(partnerId: string, amount: number, method: string, note: string): Promise<AdminActionResult> {
  const { userId } = await requireStaff();
  if (!Number.isFinite(amount) || amount <= 0) return { ok: false, error: "Enter a payment amount greater than 0." };

  const supabase = await createClient();
  const { error } = await supabase.from("partner_payments").insert({
    partner_id: partnerId,
    amount,
    method: method.trim() || null,
    note: note.trim() || null,
    recorded_by: userId,
  } as unknown as never);
  if (error) return { ok: false, error: error.message };

  // Clears any outstanding "Notify Payment Sent" for this partner now
  // that staff has actually recorded the payment — same reasoning as
  // recordAffiliatePayout's own payout_requests update.
  await supabase
    .from("payout_requests")
    .update({ status: "resolved", resolved_at: new Date().toISOString(), resolved_by: userId } as unknown as never)
    .eq("partner_id", partnerId)
    .eq("status", "pending");

  revalidatePath(`/admin/partners/${partnerId}`);
  revalidatePath("/admin/payments");
  return { ok: true };
}

export async function updatePartnerDocumentStatus(documentId: string, status: PartnerDocumentStatus, adminNote: string | null): Promise<AdminActionResult> {
  await requireStaff();
  const supabase = await createClient();
  const { error } = await supabase
    .from("partner_documents")
    .update({ status, admin_note: adminNote?.trim() || null } as unknown as never)
    .eq("id", documentId);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

/** Short-lived signed URL for a private verification document — staff's
 * own authenticated client, governed by the `partner_documents_bucket_
 * staff_select` Storage policy, same reasoning as every other repository
 * in this codebase for reserving the service-role client for what RLS
 * genuinely can't express (src/lib/supabase/admin.ts's own doc comment). */
export async function getPartnerDocumentSignedUrl(storagePath: string): Promise<{ url: string | null; error?: string }> {
  await requireStaff();
  const supabase = await createClient();
  // 120s, not 60s: the signed URL is only requested once the admin clicks
  // "View document" (not pre-generated), and a too-short TTL meant it
  // could expire between the click and the browser actually finishing the
  // navigation — especially once window.open() is made synchronous (see
  // partner-document-review-list.tsx) and a popup-blocked prompt adds
  // extra delay before the tab actually loads.
  const { data, error } = await supabase.storage.from("partner-documents").createSignedUrl(storagePath, 120);
  if (error || !data) return { url: null, error: error?.message };
  return { url: data.signedUrl };
}
