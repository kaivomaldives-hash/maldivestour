"use server";

import { revalidatePath } from "next/cache";

import { requireStaff } from "@/lib/admin/auth";
import { createNode, deleteOrphanedNode, updateNodeCore, type AdminActionResult, type NodeCoreInput } from "@/lib/admin/node-actions";
import type { ArticleFieldsAdmin } from "@/lib/admin/articles-repository";
import { createClient } from "@/lib/supabase/server";

function articleRow(fields: ArticleFieldsAdmin) {
  return {
    body: fields.body,
    reading_time_minutes: fields.readingTimeMinutes,
    video_youtube_id: fields.videoYoutubeId?.trim() || null,
  };
}

export async function createArticle(core: NodeCoreInput, fields: ArticleFieldsAdmin): Promise<AdminActionResult & { id?: string }> {
  await requireStaff();
  if (!fields.body.trim()) return { ok: false, error: "Body is required." };

  const created = await createNode({ ...core, nodeType: "article" });
  if (!created.ok) return created;

  const supabase = await createClient();
  const { error } = await supabase.from("articles").insert({ id: created.id, ...articleRow(fields) } as unknown as never);
  if (error) {
    await deleteOrphanedNode(created.id);
    return { ok: false, error: error.message };
  }

  revalidatePath("/admin/articles");
  revalidatePath("/admin");
  return { ok: true, id: created.id };
}

export async function updateArticle(id: string, core: NodeCoreInput, fields: ArticleFieldsAdmin): Promise<AdminActionResult> {
  await requireStaff();
  if (!fields.body.trim()) return { ok: false, error: "Body is required." };

  const coreResult = await updateNodeCore(id, core);
  if (!coreResult.ok) return coreResult;

  const supabase = await createClient();
  const { error } = await supabase
    .from("articles")
    .update(articleRow(fields) as unknown as never)
    .eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/articles");
  revalidatePath(`/admin/articles/${id}`);
  revalidatePath("/admin");
  return { ok: true };
}
