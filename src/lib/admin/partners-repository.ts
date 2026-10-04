import "server-only";

import { createClient } from "@/lib/supabase/server";

/**
 * Admin-only partner-request reads. Governed by the `partner_requests_
 * staff_read` RLS policy (supabase/migrations/20261001005200_
 * partner_requests.sql) — this file adds no new access path.
 *
 * Deliberately minimal (list + status only) to match the site owner's
 * explicit scope: "Vendors" today is just triage of inbound partner
 * requests, not the full vendor-account/listing-management feature
 * (adding and managing activities/properties as a vendor), which is a
 * separate, later build.
 */

const PAGE_SIZE = 25;

export type PartnerRequestStatus = "new" | "contacted" | "archived";
export const PARTNER_REQUEST_STATUSES: readonly PartnerRequestStatus[] = ["new", "contacted", "archived"];

export interface AdminPartnerRequestItem {
  id: string;
  partnerType: string;
  name: string;
  email: string;
  phone: string | null;
  companyName: string | null;
  message: string | null;
  status: PartnerRequestStatus;
  createdAt: string;
}

export interface AdminPartnerRequestFilters {
  status?: PartnerRequestStatus;
  page?: number;
}

export interface AdminPartnerRequestListResult {
  items: AdminPartnerRequestItem[];
  total: number;
  page: number;
  pageSize: number;
}

interface PartnerRequestRow {
  id: string;
  partner_type: string;
  name: string;
  email: string;
  phone: string | null;
  company_name: string | null;
  message: string | null;
  status: PartnerRequestStatus;
  created_at: string;
}

function toItem(row: PartnerRequestRow): AdminPartnerRequestItem {
  return {
    id: row.id,
    partnerType: row.partner_type,
    name: row.name,
    email: row.email,
    phone: row.phone,
    companyName: row.company_name,
    message: row.message,
    status: row.status,
    createdAt: row.created_at,
  };
}

export async function getPartnerRequestsAdmin(filters: AdminPartnerRequestFilters = {}): Promise<AdminPartnerRequestListResult> {
  const page = Math.max(1, filters.page ?? 1);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const supabase = await createClient();
  let query = supabase.from("partner_requests").select("*", { count: "exact" }).order("created_at", { ascending: false });
  if (filters.status) query = query.eq("status", filters.status);

  const { data, error, count } = await query.range(from, to).returns<PartnerRequestRow[]>();
  if (error || !data) return { items: [], total: 0, page, pageSize: PAGE_SIZE };

  return { items: data.map(toItem), total: count ?? data.length, page, pageSize: PAGE_SIZE };
}
