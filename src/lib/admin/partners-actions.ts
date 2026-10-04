"use server";

import { revalidatePath } from "next/cache";

import { requireStaff } from "@/lib/admin/auth";
import { PARTNER_REQUEST_STATUSES } from "@/lib/admin/partners-repository";
import { createClient } from "@/lib/supabase/server";

/**
 * requireStaff() here is defense in depth, not the primary guard — the
 * primary guard is `partner_requests_staff_update` RLS (supabase/
 * migrations/20261001005200_partner_requests.sql). Same pattern as
 * src/lib/admin/bookings-actions.ts.
 */
export interface AdminActionResult {
  ok: boolean;
  error?: string;
}

export async function updatePartnerRequestStatus(id: string, status: string): Promise<AdminActionResult> {
  await requireStaff();
  if (!(PARTNER_REQUEST_STATUSES as readonly string[]).includes(status)) return { ok: false, error: "Invalid status." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("partner_requests")
    .update({ status } as unknown as never)
    .eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/vendors");
  return { ok: true };
}
