"use server";

import { revalidatePath } from "next/cache";

import { requireStaff } from "@/lib/admin/auth";
import type { AdminActionResult } from "@/lib/admin/node-actions";
import { createClient } from "@/lib/supabase/server";

/** Clears a request without recording any payout/payment — for a
 * mistaken or duplicate submission. A request tied to a real payout/
 * payment instead resolves automatically when staff records that via
 * recordAffiliatePayout()/recordPartnerPayment() (see each's own
 * comment), not through this action. */
export async function dismissPayoutRequest(requestId: string, resolutionNote: string): Promise<AdminActionResult> {
  const { userId } = await requireStaff();
  const supabase = await createClient();
  const { error } = await supabase
    .from("payout_requests")
    .update({
      status: "dismissed",
      resolved_at: new Date().toISOString(),
      resolved_by: userId,
      resolution_note: resolutionNote.trim() || null,
    } as unknown as never)
    .eq("id", requestId)
    .eq("status", "pending");
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/payments");
  return { ok: true };
}
