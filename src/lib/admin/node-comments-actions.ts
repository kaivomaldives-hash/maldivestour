"use server";

import { revalidatePath, updateTag } from "next/cache";

import { requireStaff } from "@/lib/admin/auth";
import { NODE_COMMENT_STATUSES, type NodeCommentStatus } from "@/lib/admin/node-comments-repository";
import { createClient } from "@/lib/supabase/server";

export interface AdminActionResult {
  ok: boolean;
  error?: string;
}

export async function updateNodeCommentStatus(id: string, status: string): Promise<AdminActionResult> {
  await requireStaff();
  if (!(NODE_COMMENT_STATUSES as readonly string[]).includes(status)) return { ok: false, error: "Invalid status." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("node_comments")
    .update({ status: status as NodeCommentStatus } as unknown as never)
    .eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/node-comments");
  revalidatePath("/admin");

  // getPublishedNodeComments() is a cachedRead() tagged "node-comments" —
  // bust it directly instead of waiting out its TTL, same reasoning as
  // updateLocationCommentStatus(). Unlike a location, a category/hub page
  // has no single lookup from node_id back to its public URL, so the
  // specific page itself still relies on its own ISR interval to pick up
  // a newly-approved comment, same as any other admin-side content edit.
  updateTag("node-comments");

  return { ok: true };
}
