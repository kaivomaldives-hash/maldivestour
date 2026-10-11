"use server";

import { revalidatePath } from "next/cache";

import { requireStaff } from "@/lib/admin/auth";
import { HOLIDAY_REQUEST_STATUSES } from "@/lib/admin/holiday-request-status";
import { createClient } from "@/lib/supabase/server";

export interface AdminActionResult {
  ok: boolean;
  error?: string;
}

export async function updateHolidayRequestStatus(id: string, status: string, internalNotes: string): Promise<AdminActionResult> {
  await requireStaff();
  if (!(HOLIDAY_REQUEST_STATUSES as readonly string[]).includes(status)) return { ok: false, error: "Invalid status." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("holiday_quote_requests")
    .update({ status, internal_notes: internalNotes.trim() || null } as unknown as never)
    .eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/holiday-requests");
  revalidatePath(`/admin/holiday-requests/${id}`);
  return { ok: true };
}
