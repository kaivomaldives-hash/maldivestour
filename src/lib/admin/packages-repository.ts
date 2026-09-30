import "server-only";

import { requireStaff } from "@/lib/admin/auth";
import type { NodeStatus } from "@/lib/admin/node-actions";
import type { PackageItineraryComponentRole } from "@/lib/packages/types";
import { createClient } from "@/lib/supabase/server";

/**
 * Admin-only package reads. `packages` is node-backed (like providers/
 * accommodations/activities/transfer_routes), following the same nodes +
 * `!inner` child-table pattern, governed by `packages_staff_all` RLS.
 *
 * Only real DB-backed packages are covered here — src/lib/packages/demo.ts
 * (~18 of the ~24 packages shown on the public site) is a separate,
 * pre-existing static content system documented in view-repository.ts's own
 * comment ("real DB packages (only 6 exist right now) merged with the demo
 * inventory"). Per the brief's "reuse the existing architecture, don't
 * create a duplicate content system" instruction, this admin section
 * manages the real table; migrating the demo packages into real rows is a
 * separate, larger decision left to the user rather than assumed here.
 */

const PAGE_SIZE = 30;

const NODE_PACKAGE_SELECT =
  "id, slug, title, summary, status, meta_title, meta_description, packages!inner(duration_nights, price_from, currency, operated_by_provider_id)";

type PackageFieldsRow = {
  duration_nights: number | null;
  price_from: number | null;
  currency: string | null;
  operated_by_provider_id: string | null;
};

type NodePackageRow = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  status: NodeStatus;
  meta_title: string | null;
  meta_description: string | null;
  packages: PackageFieldsRow | PackageFieldsRow[] | null;
};

export interface PackageFieldsAdmin {
  durationNights: number | null;
  priceFrom: number | null;
  currency: string | null;
  operatedByProviderId: string | null;
}

export interface AdminPackageItem {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  status: NodeStatus;
  metaTitle: string | null;
  metaDescription: string | null;
  fields: PackageFieldsAdmin;
}

function bareOf(row: NodePackageRow): AdminPackageItem | null {
  const p = Array.isArray(row.packages) ? row.packages[0] : row.packages;
  if (!p) return null;
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    status: row.status,
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
    fields: {
      durationNights: p.duration_nights,
      priceFrom: p.price_from,
      currency: p.currency,
      operatedByProviderId: p.operated_by_provider_id,
    },
  };
}

export interface AdminPackageListResult {
  items: AdminPackageItem[];
  total: number;
  page: number;
  pageSize: number;
}

export async function getPackagesAdmin(options: { search?: string; page?: number } = {}): Promise<AdminPackageListResult> {
  await requireStaff();
  const page = Math.max(1, options.page ?? 1);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const supabase = await createClient();
  let query = supabase.from("nodes").select(NODE_PACKAGE_SELECT, { count: "exact" }).eq("node_type", "package").order("title", { ascending: true });
  if (options.search?.trim()) query = query.ilike("title", `%${options.search.trim()}%`);

  const { data, error, count } = await query.range(from, to).returns<NodePackageRow[]>();
  if (error || !data) return { items: [], total: 0, page, pageSize: PAGE_SIZE };

  const items = data.map(bareOf).filter((p): p is AdminPackageItem => p !== null);
  return { items, total: count ?? items.length, page, pageSize: PAGE_SIZE };
}

export async function getPackageByIdAdmin(id: string): Promise<AdminPackageItem | null> {
  await requireStaff();
  const supabase = await createClient();
  const { data, error } = await supabase.from("nodes").select(NODE_PACKAGE_SELECT).eq("node_type", "package").eq("id", id).maybeSingle<NodePackageRow>();
  if (error || !data) return null;
  return bareOf(data);
}

// ── Itinerary reads ──────────────────────────────────────────────────

type StageRow = {
  id: string;
  stage_number: number;
  day_start: number;
  day_end: number;
  night_count: number;
  title: string | null;
  description: string | null;
  sort_order: number;
};

type ItemRow = {
  id: string;
  stage_id: string;
  component_type: "node" | "transfer_service";
  component_node_id: string | null;
  transfer_service_id: string | null;
  component_role: PackageItineraryComponentRole;
  quantity: number;
  notes: string | null;
  sort_order: number;
};

export interface AdminItineraryItem {
  id: string;
  stageId: string;
  componentType: "node" | "transfer_service";
  componentRole: PackageItineraryComponentRole;
  quantity: number;
  notes: string | null;
  sortOrder: number;
  componentNodeId: string | null;
  componentNodeLabel: string | null;
  transferServiceId: string | null;
  transferServiceLabel: string | null;
}

export interface AdminItineraryStage {
  id: string;
  stageNumber: number;
  dayStart: number;
  dayEnd: number;
  nightCount: number;
  title: string | null;
  description: string | null;
  sortOrder: number;
  items: AdminItineraryItem[];
}

/** Batch-resolves transfer_services into a short display label (route
 * title + type + shared/private) — mirrors the node-title batch lookup
 * right below it, same "separate queries, never a nested embed across
 * these tables" reasoning as transfers-repository.ts. */
async function getTransferServiceLabelsByIds(ids: string[]): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  const uniqueIds = Array.from(new Set(ids));
  if (uniqueIds.length === 0) return map;

  const supabase = await createClient();
  const { data: services } = await supabase
    .from("transfer_services")
    .select("id, route_id, transfer_type, shared_or_private")
    .in("id", uniqueIds)
    .returns<Array<{ id: string; route_id: string; transfer_type: string; shared_or_private: string }>>();
  if (!services || services.length === 0) return map;

  const routeIds = Array.from(new Set(services.map((s) => s.route_id)));
  const { data: routeNodes } = await supabase.from("nodes").select("id, title").in("id", routeIds).returns<Array<{ id: string; title: string }>>();
  const titleByRouteId = new Map((routeNodes ?? []).map((n) => [n.id, n.title]));

  for (const s of services) {
    const routeTitle = titleByRouteId.get(s.route_id) ?? "Unknown route";
    map.set(s.id, `${routeTitle} · ${s.transfer_type.replace("_", " ")} · ${s.shared_or_private}`);
  }
  return map;
}

export async function getItineraryForPackageAdmin(packageId: string): Promise<AdminItineraryStage[]> {
  await requireStaff();
  const supabase = await createClient();

  const { data: stages, error } = await supabase
    .from("package_itinerary_stages")
    .select("id, stage_number, day_start, day_end, night_count, title, description, sort_order")
    .eq("package_id", packageId)
    .order("stage_number", { ascending: true })
    .returns<StageRow[]>();
  if (error || !stages || stages.length === 0) return [];

  const stageIds = stages.map((s) => s.id);
  const { data: items } = await supabase
    .from("package_itinerary_items")
    .select("id, stage_id, component_type, component_node_id, transfer_service_id, component_role, quantity, notes, sort_order")
    .in("stage_id", stageIds)
    .order("sort_order", { ascending: true })
    .returns<ItemRow[]>();

  const nodeIds = Array.from(new Set((items ?? []).map((i) => i.component_node_id).filter((id): id is string => Boolean(id))));
  const serviceIds = Array.from(new Set((items ?? []).map((i) => i.transfer_service_id).filter((id): id is string => Boolean(id))));

  const [{ data: nodeRows }, serviceLabelById] = await Promise.all([
    nodeIds.length > 0
      ? supabase.from("nodes").select("id, title, node_type").in("id", nodeIds).returns<Array<{ id: string; title: string; node_type: string }>>()
      : Promise.resolve({ data: [] as Array<{ id: string; title: string; node_type: string }> }),
    getTransferServiceLabelsByIds(serviceIds),
  ]);
  const nodeLabelById = new Map((nodeRows ?? []).map((n) => [n.id, `${n.title} (${n.node_type})`]));

  const itemsByStage = new Map<string, AdminItineraryItem[]>();
  for (const row of items ?? []) {
    const list = itemsByStage.get(row.stage_id) ?? [];
    list.push({
      id: row.id,
      stageId: row.stage_id,
      componentType: row.component_type,
      componentRole: row.component_role,
      quantity: row.quantity,
      notes: row.notes,
      sortOrder: row.sort_order,
      componentNodeId: row.component_node_id,
      componentNodeLabel: row.component_node_id ? nodeLabelById.get(row.component_node_id) ?? null : null,
      transferServiceId: row.transfer_service_id,
      transferServiceLabel: row.transfer_service_id ? serviceLabelById.get(row.transfer_service_id) ?? null : null,
    });
    itemsByStage.set(row.stage_id, list);
  }

  return stages.map((s) => ({
    id: s.id,
    stageNumber: s.stage_number,
    dayStart: s.day_start,
    dayEnd: s.day_end,
    nightCount: s.night_count,
    title: s.title,
    description: s.description,
    sortOrder: s.sort_order,
    items: itemsByStage.get(s.id) ?? [],
  }));
}
