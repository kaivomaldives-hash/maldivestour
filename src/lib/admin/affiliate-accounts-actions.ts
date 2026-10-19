"use server";

import { revalidatePath } from "next/cache";

import { requireStaff } from "@/lib/admin/auth";
import { logAdminAction } from "@/lib/admin/audit-log";
import type { AdminActionResult } from "@/lib/admin/node-actions";
import { createClient } from "@/lib/supabase/server";

export async function approveAffiliateAccount(affiliateId: string): Promise<AdminActionResult> {
  const { userId } = await requireStaff();
  const supabase = await createClient();
  const { error } = await supabase
    .from("affiliate_accounts")
    .update({ status: "approved", reviewed_by: userId, reviewed_at: new Date().toISOString(), rejection_reason: null } as unknown as never)
    .eq("id", affiliateId);
  if (error) return { ok: false, error: error.message };
  await logAdminAction("approve_affiliate", "affiliate_account", affiliateId);
  return { ok: true };
}

export async function rejectAffiliateAccount(affiliateId: string, reason: string): Promise<AdminActionResult> {
  const { userId } = await requireStaff();
  if (!reason.trim()) return { ok: false, error: "A reason is required so the applicant knows why." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("affiliate_accounts")
    .update({ status: "rejected", reviewed_by: userId, reviewed_at: new Date().toISOString(), rejection_reason: reason.trim() } as unknown as never)
    .eq("id", affiliateId);
  if (error) return { ok: false, error: error.message };
  await logAdminAction("reject_affiliate", "affiliate_account", affiliateId, { reason: reason.trim() });
  return { ok: true };
}

export async function suspendAffiliateAccount(affiliateId: string, reason: string): Promise<AdminActionResult> {
  const { userId } = await requireStaff();
  const supabase = await createClient();
  const { error } = await supabase
    .from("affiliate_accounts")
    .update({ status: "suspended", reviewed_by: userId, reviewed_at: new Date().toISOString(), rejection_reason: reason.trim() || null } as unknown as never)
    .eq("id", affiliateId);
  if (error) return { ok: false, error: error.message };
  await logAdminAction("suspend_affiliate", "affiliate_account", affiliateId, { reason: reason.trim() || null });
  return { ok: true };
}

/** Moves a rejected or suspended account back to 'pending' — same
 * reasoning as reconsiderAgentAccount() (src/lib/admin/
 * agent-accounts-actions.ts). Deliberately never regenerates
 * referral_code, so any links already shared before a suspension keep
 * working once the account is reapproved. */
export async function reconsiderAffiliateAccount(affiliateId: string): Promise<AdminActionResult> {
  const { userId } = await requireStaff();
  const supabase = await createClient();
  const { error } = await supabase
    .from("affiliate_accounts")
    .update({ status: "pending", reviewed_by: userId, reviewed_at: new Date().toISOString(), rejection_reason: null } as unknown as never)
    .eq("id", affiliateId);
  if (error) return { ok: false, error: error.message };
  await logAdminAction("reconsider_affiliate", "affiliate_account", affiliateId);
  return { ok: true };
}

/** Records a manual payout against an affiliate's accrued commission —
 * this platform never moves money itself (see the migration this
 * belongs to, 20261030000100), so this is purely a bookkeeping entry:
 * "staff paid this affiliate $X outside the platform, on this date."
 * Never tied to one specific booking — an affiliate is paid their
 * running balance, not reconciled booking by booking. */
export async function recordAffiliatePayout(
  affiliateId: string,
  amount: number,
  method: string,
  note: string,
): Promise<AdminActionResult> {
  const { userId } = await requireStaff();
  if (!Number.isFinite(amount) || amount <= 0) return { ok: false, error: "Enter a payout amount greater than 0." };

  const supabase = await createClient();
  const { error } = await supabase.from("affiliate_payouts").insert({
    affiliate_id: affiliateId,
    amount,
    method: method.trim() || null,
    note: note.trim() || null,
    paid_by: userId,
  } as unknown as never);
  if (error) return { ok: false, error: error.message };

  await logAdminAction("record_affiliate_payout", "affiliate_account", affiliateId, { amount, method: method.trim() || null });
  revalidatePath(`/admin/affiliates/${affiliateId}`);
  return { ok: true };
}
