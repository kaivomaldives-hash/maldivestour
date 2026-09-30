"use server";

import { revalidatePath } from "next/cache";

import { requireStaff } from "@/lib/admin/auth";
import type { AdminActionResult } from "@/lib/admin/node-actions";
import { createNode, deleteOrphanedNode, updateNodeCore, type NodeCoreInput } from "@/lib/admin/node-actions";
import type { ActivityFieldsAdmin } from "@/lib/admin/activities-repository";
import { createClient } from "@/lib/supabase/server";

function activityRow(fields: ActivityFieldsAdmin) {
  return {
    activity_category: fields.activityCategory,
    operated_by_provider_id: fields.operatedByProviderId,
    duration_minutes: fields.durationMinutes,
    min_age: fields.minAge,
    difficulty: fields.difficulty,
    price_from: fields.priceFrom,
    currency: fields.currency?.trim() || "USD",
    max_participants: fields.maxParticipants,
  };
}

export async function createActivity(core: NodeCoreInput, fields: ActivityFieldsAdmin): Promise<AdminActionResult & { id?: string }> {
  await requireStaff();

  const created = await createNode({ ...core, nodeType: "activity" });
  if (!created.ok) return created;

  const supabase = await createClient();
  const { error } = await supabase.from("activities").insert({ id: created.id, ...activityRow(fields) } as unknown as never);
  if (error) {
    await deleteOrphanedNode(created.id);
    return { ok: false, error: error.message };
  }

  revalidatePath("/admin/activities");
  revalidatePath("/admin");
  return { ok: true, id: created.id };
}

export async function updateActivity(id: string, core: NodeCoreInput, fields: ActivityFieldsAdmin): Promise<AdminActionResult> {
  await requireStaff();

  const coreResult = await updateNodeCore(id, core);
  if (!coreResult.ok) return coreResult;

  const supabase = await createClient();
  const { error } = await supabase
    .from("activities")
    .update(activityRow(fields) as unknown as never)
    .eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/activities");
  revalidatePath(`/admin/activities/${id}`);
  revalidatePath("/admin");
  return { ok: true };
}
