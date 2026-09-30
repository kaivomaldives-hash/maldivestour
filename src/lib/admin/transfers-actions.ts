"use server";

import { revalidatePath } from "next/cache";

import { requireStaff } from "@/lib/admin/auth";
import { createNode, deleteOrphanedNode, updateNodeCore, type AdminActionResult, type NodeCoreInput } from "@/lib/admin/node-actions";
import type { TransferRouteFieldsAdmin } from "@/lib/admin/transfers-repository";
import { createClient } from "@/lib/supabase/server";
import type { SharedOrPrivate, TransferServiceStatus, TransferType } from "@/lib/transfers/types";

function routeRow(fields: TransferRouteFieldsAdmin) {
  return {
    origin_location_id: fields.originLocationId,
    destination_location_id: fields.destinationLocationId,
    distance_km: fields.distanceKm,
    typical_duration_minutes: fields.typicalDurationMinutes,
  };
}

export async function createTransferRoute(core: NodeCoreInput, fields: TransferRouteFieldsAdmin): Promise<AdminActionResult & { id?: string }> {
  await requireStaff();
  if (!fields.originLocationId || !fields.destinationLocationId) {
    return { ok: false, error: "Origin and destination are both required." };
  }
  if (fields.originLocationId === fields.destinationLocationId) {
    return { ok: false, error: "Origin and destination must be different locations." };
  }

  const created = await createNode({ ...core, nodeType: "transfer_route" });
  if (!created.ok) return created;

  const supabase = await createClient();
  const { error } = await supabase.from("transfer_routes").insert({ id: created.id, ...routeRow(fields) } as unknown as never);
  if (error) {
    await deleteOrphanedNode(created.id);
    if (error.code === "23505") return { ok: false, error: "A route between these two locations already exists." };
    return { ok: false, error: error.message };
  }

  revalidatePath("/admin/transfers");
  revalidatePath("/admin");
  return { ok: true, id: created.id };
}

export async function updateTransferRoute(id: string, core: NodeCoreInput, fields: TransferRouteFieldsAdmin): Promise<AdminActionResult> {
  await requireStaff();
  if (!fields.originLocationId || !fields.destinationLocationId) {
    return { ok: false, error: "Origin and destination are both required." };
  }
  if (fields.originLocationId === fields.destinationLocationId) {
    return { ok: false, error: "Origin and destination must be different locations." };
  }

  const coreResult = await updateNodeCore(id, core);
  if (!coreResult.ok) return coreResult;

  const supabase = await createClient();
  const { error } = await supabase
    .from("transfer_routes")
    .update(routeRow(fields) as unknown as never)
    .eq("id", id);
  if (error) {
    if (error.code === "23505") return { ok: false, error: "A route between these two locations already exists." };
    return { ok: false, error: error.message };
  }

  revalidatePath("/admin/transfers");
  revalidatePath(`/admin/transfers/${id}`);
  revalidatePath("/admin");
  return { ok: true };
}

export interface TransferServiceInput {
  providerId: string | null;
  transferType: TransferType;
  vehicleType: string | null;
  sharedOrPrivate: SharedOrPrivate;
  durationMinutes: number | null;
  price: number;
  currency: string;
  capacity: number | null;
  luggageAllowance: string | null;
  status: TransferServiceStatus;
  pickupInstructions: string | null;
  dropoffInstructions: string | null;
  bookingRequirements: string | null;
  cancellationPolicy: string | null;
  description: string | null;
  isBookable: boolean;
  facilities: string[];
}

function serviceRow(input: TransferServiceInput) {
  return {
    provider_id: input.providerId,
    transfer_type: input.transferType,
    vehicle_type: input.vehicleType?.trim() || null,
    shared_or_private: input.sharedOrPrivate,
    duration_minutes: input.durationMinutes,
    price: input.price,
    currency: input.currency.trim().toUpperCase() || "USD",
    capacity: input.capacity,
    luggage_allowance: input.luggageAllowance?.trim() || null,
    status: input.status,
    pickup_instructions: input.pickupInstructions?.trim() || null,
    dropoff_instructions: input.dropoffInstructions?.trim() || null,
    booking_requirements: input.bookingRequirements?.trim() || null,
    cancellation_policy: input.cancellationPolicy?.trim() || null,
    description: input.description?.trim() || null,
    is_bookable: input.isBookable,
    facilities: input.facilities,
  };
}

export async function createTransferService(routeId: string, input: TransferServiceInput): Promise<AdminActionResult & { id?: string }> {
  await requireStaff();
  if (!input.price || input.price <= 0) return { ok: false, error: "Price must be greater than zero." };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("transfer_services")
    .insert({ route_id: routeId, ...serviceRow(input) } as unknown as never)
    .select("id")
    .single<{ id: string }>();
  if (error || !data) return { ok: false, error: error?.message ?? "Failed to create." };

  revalidatePath(`/admin/transfers/${routeId}`);
  return { ok: true, id: data.id };
}

export async function updateTransferService(id: string, routeId: string, input: TransferServiceInput): Promise<AdminActionResult> {
  await requireStaff();
  if (!input.price || input.price <= 0) return { ok: false, error: "Price must be greater than zero." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("transfer_services")
    .update(serviceRow(input) as unknown as never)
    .eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath(`/admin/transfers/${routeId}`);
  return { ok: true };
}

/** `bookings.transfer_service_id` and `package_itinerary_items.transfer_service_id`
 * both reference this table without `on delete cascade` (deliberate RESTRICT
 * default, same reasoning as bookings.product_node_id in node-actions.ts) —
 * Postgres itself refuses the delete when either still points here; this
 * just surfaces that as a friendly message instead of a raw 23503. */
export async function deleteTransferService(id: string, routeId: string): Promise<AdminActionResult> {
  await requireStaff();
  const supabase = await createClient();
  const { error } = await supabase.from("transfer_services").delete().eq("id", id);
  if (error) {
    if (error.code === "23503") return { ok: false, error: "This can't be deleted because bookings or package itineraries still reference it. Set it to Discontinued instead." };
    return { ok: false, error: error.message };
  }
  revalidatePath(`/admin/transfers/${routeId}`);
  return { ok: true };
}
