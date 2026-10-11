import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { HolidaySelection, PriceBreakdown } from "@/lib/holiday-builder/types";
import type { HolidayRequestStatus } from "@/lib/admin/holiday-request-status";

/**
 * Admin-only reads of holiday_quote_requests — governed by the
 * `holiday_quote_requests_staff_read` RLS policy (supabase/migrations/
 * 20261001007000_holiday_builder_schema.sql). Same list/detail shape as
 * src/lib/admin/bookings-repository.ts.
 */

const PAGE_SIZE = 25;

export type { HolidayRequestStatus };

export interface AdminHolidayRequestListItem {
  id: string;
  reference: string;
  customerName: string;
  customerEmail: string;
  arrivalDate: string;
  nights: number;
  adults: number;
  children: number;
  estimatedTotal: number;
  currency: string;
  status: HolidayRequestStatus;
  createdAt: string;
}

export interface AdminHolidayRequestDetail extends AdminHolidayRequestListItem {
  customerWhatsapp: string;
  additionalRequests: string | null;
  rooms: number;
  itinerary: HolidaySelection;
  priceBreakdown: PriceBreakdown;
  internalNotes: string | null;
  confirmationEmailSentAt: string | null;
  updatedAt: string;
}

interface HolidayRequestRow {
  id: string;
  reference: string;
  customer_name: string;
  customer_email: string;
  customer_whatsapp: string;
  additional_requests: string | null;
  arrival_date: string;
  nights: number;
  adults: number;
  children: number;
  rooms: number;
  itinerary: HolidaySelection;
  price_breakdown: PriceBreakdown;
  currency: string;
  estimated_total: number;
  status: HolidayRequestStatus;
  internal_notes: string | null;
  confirmation_email_sent_at: string | null;
  created_at: string;
  updated_at: string;
}

function toListItem(row: HolidayRequestRow): AdminHolidayRequestListItem {
  return {
    id: row.id,
    reference: row.reference,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    arrivalDate: row.arrival_date,
    nights: row.nights,
    adults: row.adults,
    children: row.children,
    estimatedTotal: Number(row.estimated_total),
    currency: row.currency,
    status: row.status,
    createdAt: row.created_at,
  };
}

export interface AdminHolidayRequestFilters {
  status?: HolidayRequestStatus;
  page?: number;
}

export interface AdminHolidayRequestListResult {
  items: AdminHolidayRequestListItem[];
  total: number;
  page: number;
  pageSize: number;
}

export async function getHolidayRequestsAdmin(filters: AdminHolidayRequestFilters = {}): Promise<AdminHolidayRequestListResult> {
  const page = Math.max(1, filters.page ?? 1);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const supabase = await createClient();
  let query = supabase.from("holiday_quote_requests").select("*", { count: "exact" }).order("created_at", { ascending: false });
  if (filters.status) query = query.eq("status", filters.status);

  const { data, error, count } = await query.range(from, to).returns<HolidayRequestRow[]>();
  if (error || !data) return { items: [], total: 0, page, pageSize: PAGE_SIZE };

  return { items: data.map(toListItem), total: count ?? data.length, page, pageSize: PAGE_SIZE };
}

export async function getHolidayRequestByIdAdmin(id: string): Promise<AdminHolidayRequestDetail | null> {
  const supabase = await createClient();
  const { data: row, error } = await supabase.from("holiday_quote_requests").select("*").eq("id", id).maybeSingle<HolidayRequestRow>();
  if (error || !row) return null;

  return {
    ...toListItem(row),
    customerWhatsapp: row.customer_whatsapp,
    additionalRequests: row.additional_requests,
    rooms: row.rooms,
    itinerary: row.itinerary,
    priceBreakdown: row.price_breakdown,
    internalNotes: row.internal_notes,
    confirmationEmailSentAt: row.confirmation_email_sent_at,
    updatedAt: row.updated_at,
  };
}
