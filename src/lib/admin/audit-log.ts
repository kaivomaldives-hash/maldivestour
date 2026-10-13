import "server-only";

import { createClient } from "@/lib/supabase/server";

/** Thin wrapper over the `log_admin_action` RPC (supabase/migrations/
 * 20261013000100_agent_affiliate_programme_foundation.sql) — the only
 * way an admin_audit_log row can be written. `actor_id` is never passed
 * in: the RPC reads auth.uid() itself, so a caller can't forge who
 * performed the action. Failures are logged, never thrown — an audit
 * log write failing should not block the approval/rejection it's
 * recording. */
export async function logAdminAction(action: string, targetType: string, targetId: string, details?: Record<string, unknown>): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.rpc(
    "log_admin_action" as unknown as never,
    { p_action: action, p_target_type: targetType, p_target_id: targetId, p_details: details ?? null } as unknown as never,
  );
  if (error) {
    console.error(`[logAdminAction] failed to write audit log entry (${action} on ${targetType}:${targetId}):`, error.message);
  }
}
