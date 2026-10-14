"use server";

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
