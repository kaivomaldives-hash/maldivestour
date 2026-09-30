"use server";

import { revalidatePath } from "next/cache";

import { requireStaff } from "@/lib/admin/auth";
import type { AdminActionResult } from "@/lib/admin/node-actions";
import { createNode, deleteOrphanedNode, updateNodeCore, type NodeCoreInput } from "@/lib/admin/node-actions";
import type { AccommodationFieldsAdmin } from "@/lib/admin/accommodations-repository";
import { createClient } from "@/lib/supabase/server";

function accommodationRow(fields: AccommodationFieldsAdmin) {
  return {
    accommodation_type: fields.accommodationType,
    star_rating: fields.starRating,
    price_tier: fields.priceTier,
    room_count: fields.roomCount,
    all_inclusive: fields.allInclusive,
    overwater_villas: fields.overwaterVillas,
    check_in_time: fields.checkInTime?.trim() || null,
    check_out_time: fields.checkOutTime?.trim() || null,
    currency: fields.currency?.trim() || "USD",
    operated_by_provider_id: fields.operatedByProviderId,
    price_from: fields.priceFrom,
    video_youtube_id: fields.videoYoutubeId?.trim() || null,
  };
}

export async function createAccommodation(core: NodeCoreInput, fields: AccommodationFieldsAdmin): Promise<AdminActionResult & { id?: string }> {
  await requireStaff();

  const created = await createNode({ ...core, nodeType: "accommodation" });
  if (!created.ok) return created;

  const supabase = await createClient();
  const { error } = await supabase.from("accommodations").insert({ id: created.id, ...accommodationRow(fields) } as unknown as never);
  if (error) {
    await deleteOrphanedNode(created.id);
    return { ok: false, error: error.message };
  }

  revalidatePath("/admin/accommodations");
  revalidatePath("/admin");
  return { ok: true, id: created.id };
}

export async function updateAccommodation(id: string, core: NodeCoreInput, fields: AccommodationFieldsAdmin): Promise<AdminActionResult> {
  await requireStaff();

  const coreResult = await updateNodeCore(id, core);
  if (!coreResult.ok) return coreResult;

  const supabase = await createClient();
  const { error } = await supabase
    .from("accommodations")
    .update(accommodationRow(fields) as unknown as never)
    .eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/accommodations");
  revalidatePath(`/admin/accommodations/${id}`);
  revalidatePath("/admin");
  return { ok: true };
}
