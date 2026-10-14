"use server";

import { revalidatePath } from "next/cache";

import { requireStaff } from "@/lib/admin/auth";
import { LOCATION_COMMENT_STATUSES, type LocationCommentStatus } from "@/lib/admin/location-comments-repository";
import { createClient } from "@/lib/supabase/server";

export interface AdminActionResult {
  ok: boolean;
  error?: string;
}

export async function updateLocationCommentStatus(id: string, status: string): Promise<AdminActionResult> {
  await requireStaff();
  if (!(LOCATION_COMMENT_STATUSES as readonly string[]).includes(status)) return { ok: false, error: "Invalid status." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("location_comments")
    .update({ status: status as LocationCommentStatus } as unknown as never)
    .eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/location-comments");
  revalidatePath("/admin");
  return { ok: true };
}
