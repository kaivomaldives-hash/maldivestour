import "server-only";

import { requireStaff } from "@/lib/admin/auth";
import { getProviderOptions } from "@/lib/admin/providers-repository";
import type { NodeStatus } from "@/lib/admin/node-actions";
import { createClient } from "@/lib/supabase/server";
import type { SharedOrPrivate, TransferServiceStatus, TransferType } from "@/lib/transfers/types";

/**
 * Admin-only transfer reads. `transfer_routes` is node-backed (like
 * providers/accommodations/activities), so it follows the same
 * `nodes` + `!inner` child-table pattern as those repositories, governed
 * by `transfer_routes_staff_all` RLS instead of `transfer_routes_public_read`.
 * `transfer_services` is NOT node-backed (see the schema's own top-of-file
 * comment in supabase/migrations/20250101000600_transfers.sql) — it is read
 * and written directly, scoped by `route_id`, under `transfer_services_staff_all`.
 */

const PAGE_SIZE = 30;

const NODE_TRANSFER_ROUTE_SELECT =
  "id, slug, title, summary, status, meta_title, meta_description, transfer_routes!inner(origin_location_id, destination_location_id, distance_km, typical_duration_minutes)";

type TransferRouteFieldsRow = {
  origin_location_id: string;
  destination_location_id: string;
  distance_km: number | null;
  typical_duration_minutes: number | null;
};

type NodeTransferRouteRow = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  status: NodeStatus;
  meta_title: string | null;
  meta_description: string | null;
  transfer_routes: TransferRouteFieldsRow | TransferRouteFieldsRow[] | null;
};

export interface TransferRouteFieldsAdmin {
  originLocationId: string;
  destinationLocationId: string;
  distanceKm: number | null;
  typicalDurationMinutes: number | null;
}

interface BareTransferRoute {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  status: NodeStatus;
  metaTitle: string | null;
  metaDescription: string | null;
  fields: TransferRouteFieldsAdmin;
}

export interface AdminTransferRouteItem extends BareTransferRoute {
  originTitle: string | null;
  destinationTitle: string | null;
}

function bareRouteOf(row: NodeTransferRouteRow): BareTransferRoute | null {
  const r = Array.isArray(row.transfer_routes) ? row.transfer_routes[0] : row.transfer_routes;
  if (!r) return null;
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    status: row.status,
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
    fields: {
      originLocationId: r.origin_location_id,
      destinationLocationId: r.destination_location_id,
      distanceKm: r.distance_km,
      typicalDurationMinutes: r.typical_duration_minutes,
    },
  };
}

/** Admin-scoped (any status) batch title lookup for location ids — separate
 * from src/lib/locations/repository.ts's getLocationSummariesByIds, which
 * is the public, published-only reader; staff need origin/destination
 * titles even for a route whose endpoint location is somehow unpublished. */
async function getLocationTitlesByIds(ids: string[]): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  const uniqueIds = Array.from(new Set(ids));
  if (uniqueIds.length === 0) return map;
  const supabase = await createClient();
  const { data } = await supabase.from("nodes").select("id, title").in("id", uniqueIds).returns<Array<{ id: string; title: string }>>();
  for (const row of data ?? []) map.set(row.id, row.title);
  return map;
}

async function attachLocationTitles(bares: BareTransferRoute[]): Promise<AdminTransferRouteItem[]> {
  const titlesById = await getLocationTitlesByIds(bares.flatMap((b) => [b.fields.originLocationId, b.fields.destinationLocationId]));
  return bares.map((b) => ({
    ...b,
    originTitle: titlesById.get(b.fields.originLocationId) ?? null,
    destinationTitle: titlesById.get(b.fields.destinationLocationId) ?? null,
  }));
}

export interface AdminTransferRouteListResult {
  items: AdminTransferRouteItem[];
  total: number;
  page: number;
  pageSize: number;
}

export async function getTransferRoutesAdmin(options: { search?: string; page?: number } = {}): Promise<AdminTransferRouteListResult> {
  await requireStaff();
  const page = Math.max(1, options.page ?? 1);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const supabase = await createClient();
  let query = supabase.from("nodes").select(NODE_TRANSFER_ROUTE_SELECT, { count: "exact" }).eq("node_type", "transfer_route").order("title", { ascending: true });
  if (options.search?.trim()) query = query.ilike("title", `%${options.search.trim()}%`);

  const { data, error, count } = await query.range(from, to).returns<NodeTransferRouteRow[]>();
  if (error || !data) return { items: [], total: 0, page, pageSize: PAGE_SIZE };

  const bares = data.map(bareRouteOf).filter((b): b is BareTransferRoute => b !== null);
  const items = await attachLocationTitles(bares);
  return { items, total: count ?? items.length, page, pageSize: PAGE_SIZE };
}

export async function getTransferRouteByIdAdmin(id: string): Promise<AdminTransferRouteItem | null> {
  await requireStaff();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("nodes")
    .select(NODE_TRANSFER_ROUTE_SELECT)
    .eq("node_type", "transfer_route")
    .eq("id", id)
    .maybeSingle<NodeTransferRouteRow>();
  if (error || !data) return null;
  const bare = bareRouteOf(data);
  if (!bare) return null;
  const [item] = await attachLocationTitles([bare]);
  return item;
}

const SERVICE_COLUMNS =
  "id, route_id, provider_id, transfer_type, vehicle_type, shared_or_private, duration_minutes, price, currency, capacity, luggage_allowance, status, pickup_instructions, dropoff_instructions, booking_requirements, cancellation_policy, description, is_bookable, facilities";

type TransferServiceRow = {
  id: string;
  route_id: string;
  provider_id: string | null;
  transfer_type: TransferType;
  vehicle_type: string | null;
  shared_or_private: SharedOrPrivate;
  duration_minutes: number | null;
  price: number;
  currency: string;
  capacity: number | null;
  luggage_allowance: string | null;
  status: TransferServiceStatus;
  pickup_instructions: string | null;
  dropoff_instructions: string | null;
  booking_requirements: string | null;
  cancellation_policy: string | null;
  description: string | null;
  is_bookable: boolean;
  facilities: string[];
};

export interface AdminTransferServiceItem {
  id: string;
  routeId: string;
  providerId: string | null;
  providerName: string | null;
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

function serviceOf(row: TransferServiceRow, providerNameById: Map<string, string>): AdminTransferServiceItem {
  return {
    id: row.id,
    routeId: row.route_id,
    providerId: row.provider_id,
    providerName: row.provider_id ? providerNameById.get(row.provider_id) ?? null : null,
    transferType: row.transfer_type,
    vehicleType: row.vehicle_type,
    sharedOrPrivate: row.shared_or_private,
    durationMinutes: row.duration_minutes,
    price: row.price,
    currency: row.currency,
    capacity: row.capacity,
    luggageAllowance: row.luggage_allowance,
    status: row.status,
    pickupInstructions: row.pickup_instructions,
    dropoffInstructions: row.dropoff_instructions,
    bookingRequirements: row.booking_requirements,
    cancellationPolicy: row.cancellation_policy,
    description: row.description,
    isBookable: row.is_bookable,
    facilities: row.facilities ?? [],
  };
}

/** Every service belonging to one route, any status — used by the route
 * edit page's services table. Providers are resolved via the same small,
 * bounded getProviderOptions() list already used by accommodation/activity
 * forms rather than a second per-id lookup. */
export async function getTransferServicesForRouteAdmin(routeId: string): Promise<AdminTransferServiceItem[]> {
  await requireStaff();
  const supabase = await createClient();
  const [{ data, error }, providerOptions] = await Promise.all([
    supabase.from("transfer_services").select(SERVICE_COLUMNS).eq("route_id", routeId).order("price", { ascending: true }).returns<TransferServiceRow[]>(),
    getProviderOptions(),
  ]);
  if (error || !data) return [];
  const providerNameById = new Map(providerOptions.map((p) => [p.id, p.title]));
  return data.map((row) => serviceOf(row, providerNameById));
}
