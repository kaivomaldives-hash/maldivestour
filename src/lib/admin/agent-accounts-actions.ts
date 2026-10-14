"use server";

import { requireStaff } from "@/lib/admin/auth";
import { logAdminAction } from "@/lib/admin/audit-log";
import type { AdminActionResult } from "@/lib/admin/node-actions";
import { createClient } from "@/lib/supabase/server";

export async function approveAgentAccount(agentId: string): Promise<AdminActionResult> {
  const { userId } = await requireStaff();
  const supabase = await createClient();
  const { error } = await supabase
    .from("agent_accounts")
    .update({ status: "approved", reviewed_by: userId, reviewed_at: new Date().toISOString(), rejection_reason: null } as unknown as never)
    .eq("id", agentId);
  if (error) return { ok: false, error: error.message };
  await logAdminAction("approve_agent", "agent_account", agentId);
  return { ok: true };
}

export async function rejectAgentAccount(agentId: string, reason: string): Promise<AdminActionResult> {
  const { userId } = await requireStaff();
  if (!reason.trim()) return { ok: false, error: "A reason is required so the applicant knows why." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("agent_accounts")
    .update({ status: "rejected", reviewed_by: userId, reviewed_at: new Date().toISOString(), rejection_reason: reason.trim() } as unknown as never)
    .eq("id", agentId);
  if (error) return { ok: false, error: error.message };
  await logAdminAction("reject_agent", "agent_account", agentId, { reason: reason.trim() });
  return { ok: true };
}

export async function suspendAgentAccount(agentId: string, reason: string): Promise<AdminActionResult> {
  const { userId } = await requireStaff();
  const supabase = await createClient();
  const { error } = await supabase
    .from("agent_accounts")
    .update({ status: "suspended", reviewed_by: userId, reviewed_at: new Date().toISOString(), rejection_reason: reason.trim() || null } as unknown as never)
    .eq("id", agentId);
  if (error) return { ok: false, error: error.message };
  await logAdminAction("suspend_agent", "agent_account", agentId, { reason: reason.trim() || null });
  return { ok: true };
}

/** Moves a rejected or suspended account back to 'pending' so it can be
 * reconsidered — e.g. the applicant fixed what was wrong and asked staff
 * (outside the app) to take another look. Distinct from "approve" so
 * the decision to actually approve is always its own explicit action. */
export async function reconsiderAgentAccount(agentId: string): Promise<AdminActionResult> {
  const { userId } = await requireStaff();
  const supabase = await createClient();
  const { error } = await supabase
    .from("agent_accounts")
    .update({ status: "pending", reviewed_by: userId, reviewed_at: new Date().toISOString(), rejection_reason: null } as unknown as never)
    .eq("id", agentId);
  if (error) return { ok: false, error: error.message };
  await logAdminAction("reconsider_agent", "agent_account", agentId);
  return { ok: true };
}
