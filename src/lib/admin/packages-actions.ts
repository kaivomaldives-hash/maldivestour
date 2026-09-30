"use server";

import { revalidatePath } from "next/cache";

import { requireStaff } from "@/lib/admin/auth";
import { createNode, deleteOrphanedNode, updateNodeCore, type AdminActionResult, type NodeCoreInput } from "@/lib/admin/node-actions";
import type { PackageFieldsAdmin } from "@/lib/admin/packages-repository";
import { createClient } from "@/lib/supabase/server";
import type { PackageItineraryComponentRole } from "@/lib/packages/types";

function packageRow(fields: PackageFieldsAdmin) {
  return {
    duration_nights: fields.durationNights,
    price_from: fields.priceFrom,
    currency: fields.currency?.trim() || null,
    operated_by_provider_id: fields.operatedByProviderId,
  };
}

export async function createPackage(core: NodeCoreInput, fields: PackageFieldsAdmin): Promise<AdminActionResult & { id?: string }> {
  await requireStaff();

  const created = await createNode({ ...core, nodeType: "package" });
  if (!created.ok) return created;

  const supabase = await createClient();
  const { error } = await supabase.from("packages").insert({ id: created.id, ...packageRow(fields) } as unknown as never);
  if (error) {
    await deleteOrphanedNode(created.id);
    return { ok: false, error: error.message };
  }

  revalidatePath("/admin/packages");
  revalidatePath("/admin");
  return { ok: true, id: created.id };
}

export async function updatePackage(id: string, core: NodeCoreInput, fields: PackageFieldsAdmin): Promise<AdminActionResult> {
  await requireStaff();

  const coreResult = await updateNodeCore(id, core);
  if (!coreResult.ok) return coreResult;

  const supabase = await createClient();
  const { error } = await supabase
    .from("packages")
    .update(packageRow(fields) as unknown as never)
    .eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/packages");
  revalidatePath(`/admin/packages/${id}`);
  revalidatePath("/admin");
  return { ok: true };
}

// ── Itinerary search-as-you-type ────────────────────────────────────

export interface ItineraryNodeOption {
  id: string;
  title: string;
  nodeType: string;
}

const ITINERARY_NODE_TYPES = ["accommodation", "activity", "package", "speedboat", "vehicle", "transfer_route"];

/** Search across the content types an itinerary item can reference — a
 * broader search than LocationPicker's (locations only), since an
 * itinerary item can point at an accommodation, activity, another
 * package, or a fleet node. Any status (staff can plan around a draft
 * entry before it publishes). */
export async function searchItineraryNodeOptions(query: string): Promise<ItineraryNodeOption[]> {
  await requireStaff();
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("nodes")
    .select("id, title, node_type")
    .in("node_type", ITINERARY_NODE_TYPES)
    .ilike("title", `%${trimmed}%`)
    .order("title", { ascending: true })
    .limit(15)
    .returns<Array<{ id: string; title: string; node_type: string }>>();
  if (error || !data) return [];
  return data.map((n) => ({ id: n.id, title: n.title, nodeType: n.node_type }));
}

export interface TransferServiceOption {
  id: string;
  label: string;
}

/** Search transfer_services by their route's title (transfer_services has
 * no title of its own) — matches searchLocationOptions's search-then-
 * resolve shape, just with the route/service relationship flipped. */
export async function searchTransferServiceOptions(query: string): Promise<TransferServiceOption[]> {
  await requireStaff();
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const supabase = await createClient();
  const { data: routeNodes } = await supabase
    .from("nodes")
    .select("id, title")
    .eq("node_type", "transfer_route")
    .ilike("title", `%${trimmed}%`)
    .limit(10)
    .returns<Array<{ id: string; title: string }>>();
  if (!routeNodes || routeNodes.length === 0) return [];

  const titleByRouteId = new Map(routeNodes.map((n) => [n.id, n.title]));
  const { data: services, error } = await supabase
    .from("transfer_services")
    .select("id, route_id, transfer_type, shared_or_private")
    .in(
      "route_id",
      routeNodes.map((n) => n.id),
    )
    .limit(20)
    .returns<Array<{ id: string; route_id: string; transfer_type: string; shared_or_private: string }>>();
  if (error || !services) return [];

  return services.map((s) => ({
    id: s.id,
    label: `${titleByRouteId.get(s.route_id) ?? "Unknown route"} · ${s.transfer_type.replace("_", " ")} · ${s.shared_or_private}`,
  }));
}

// ── Itinerary stage CRUD ────────────────────────────────────────────

export interface ItineraryStageInput {
  stageNumber: number;
  dayStart: number;
  dayEnd: number;
  nightCount: number;
  title: string | null;
  description: string | null;
  sortOrder: number;
}

function stageRow(input: ItineraryStageInput) {
  return {
    stage_number: input.stageNumber,
    day_start: input.dayStart,
    day_end: input.dayEnd,
    night_count: input.nightCount,
    title: input.title?.trim() || null,
    description: input.description?.trim() || null,
    sort_order: input.sortOrder,
  };
}

function validateStage(input: ItineraryStageInput): string | null {
  if (input.dayEnd < input.dayStart) return "End day can't be before the start day.";
  return null;
}

export async function createItineraryStage(packageId: string, input: ItineraryStageInput): Promise<AdminActionResult & { id?: string }> {
  await requireStaff();
  const validationError = validateStage(input);
  if (validationError) return { ok: false, error: validationError };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("package_itinerary_stages")
    .insert({ package_id: packageId, ...stageRow(input) } as unknown as never)
    .select("id")
    .single<{ id: string }>();
  if (error || !data) {
    if (error?.code === "23505") return { ok: false, error: "A stage with that stage number already exists." };
    return { ok: false, error: error?.message ?? "Failed to create." };
  }

  revalidatePath(`/admin/packages/${packageId}`);
  return { ok: true, id: data.id };
}

export async function updateItineraryStage(id: string, packageId: string, input: ItineraryStageInput): Promise<AdminActionResult> {
  await requireStaff();
  const validationError = validateStage(input);
  if (validationError) return { ok: false, error: validationError };

  const supabase = await createClient();
  const { error } = await supabase
    .from("package_itinerary_stages")
    .update(stageRow(input) as unknown as never)
    .eq("id", id);
  if (error) {
    if (error.code === "23505") return { ok: false, error: "A stage with that stage number already exists." };
    return { ok: false, error: error.message };
  }

  revalidatePath(`/admin/packages/${packageId}`);
  return { ok: true };
}

/** Cascades to its items (package_itinerary_items.stage_id has
 * on delete cascade), so no pre-flight check is needed here — unlike
 * deleteNode(), nothing else in the schema references a stage. */
export async function deleteItineraryStage(id: string, packageId: string): Promise<AdminActionResult> {
  await requireStaff();
  const supabase = await createClient();
  const { error } = await supabase.from("package_itinerary_stages").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath(`/admin/packages/${packageId}`);
  return { ok: true };
}

// ── Itinerary item CRUD ─────────────────────────────────────────────

export interface ItineraryItemInput {
  componentType: "node" | "transfer_service";
  componentNodeId: string | null;
  transferServiceId: string | null;
  componentRole: PackageItineraryComponentRole;
  quantity: number;
  notes: string | null;
  sortOrder: number;
}

function validateItem(input: ItineraryItemInput): string | null {
  if (input.componentType === "node" && !input.componentNodeId) return "Pick an entity for this item.";
  if (input.componentType === "transfer_service" && !input.transferServiceId) return "Pick a transfer service for this item.";
  return null;
}

function itemRow(input: ItineraryItemInput) {
  return {
    component_type: input.componentType,
    component_node_id: input.componentType === "node" ? input.componentNodeId : null,
    transfer_service_id: input.componentType === "transfer_service" ? input.transferServiceId : null,
    component_role: input.componentRole,
    quantity: input.quantity,
    notes: input.notes?.trim() || null,
    sort_order: input.sortOrder,
  };
}

export async function createItineraryItem(stageId: string, packageId: string, input: ItineraryItemInput): Promise<AdminActionResult & { id?: string }> {
  await requireStaff();
  const validationError = validateItem(input);
  if (validationError) return { ok: false, error: validationError };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("package_itinerary_items")
    .insert({ stage_id: stageId, ...itemRow(input) } as unknown as never)
    .select("id")
    .single<{ id: string }>();
  if (error || !data) return { ok: false, error: error?.message ?? "Failed to create." };

  revalidatePath(`/admin/packages/${packageId}`);
  return { ok: true, id: data.id };
}

export async function updateItineraryItem(id: string, packageId: string, input: ItineraryItemInput): Promise<AdminActionResult> {
  await requireStaff();
  const validationError = validateItem(input);
  if (validationError) return { ok: false, error: validationError };

  const supabase = await createClient();
  const { error } = await supabase
    .from("package_itinerary_items")
    .update(itemRow(input) as unknown as never)
    .eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath(`/admin/packages/${packageId}`);
  return { ok: true };
}

export async function deleteItineraryItem(id: string, packageId: string): Promise<AdminActionResult> {
  await requireStaff();
  const supabase = await createClient();
  const { error } = await supabase.from("package_itinerary_items").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath(`/admin/packages/${packageId}`);
  return { ok: true };
}
