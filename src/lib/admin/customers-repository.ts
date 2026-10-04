import "server-only";

import { createClient } from "@/lib/supabase/server";

/**
 * Admin-only customer reads. Governed by the `customers_staff_read` RLS
 * policy (supabase/migrations/20261001004700_customers_and_newsletter.sql)
 * — this file adds no new access path. The `customers` table itself is
 * populated by a bookings AFTER INSERT trigger and the subscribe_to_updates
 * RPC, both deduplicating by lower(email), so one row per real customer is
 * already guaranteed at write time — no dedup logic needed here.
 */

const PAGE_SIZE = 25;

export interface AdminCustomerListItem {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  whatsapp: string | null;
  source: "booking" | "subscribe";
  bookingCount: number;
  subscribed: boolean;
  firstSeenAt: string;
  lastSeenAt: string;
}

export interface AdminCustomerFilters {
  search?: string;
  page?: number;
}

export interface AdminCustomerListResult {
  items: AdminCustomerListItem[];
  total: number;
  page: number;
  pageSize: number;
}

interface CustomerRow {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  whatsapp: string | null;
  source: "booking" | "subscribe";
  booking_count: number;
  subscribed: boolean;
  first_seen_at: string;
  last_seen_at: string;
}

function toListItem(row: CustomerRow): AdminCustomerListItem {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    phone: row.phone,
    whatsapp: row.whatsapp,
    source: row.source,
    bookingCount: row.booking_count,
    subscribed: row.subscribed,
    firstSeenAt: row.first_seen_at,
    lastSeenAt: row.last_seen_at,
  };
}

export async function getCustomersAdmin(filters: AdminCustomerFilters = {}): Promise<AdminCustomerListResult> {
  const page = Math.max(1, filters.page ?? 1);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const supabase = await createClient();
  let query = supabase.from("customers").select("*", { count: "exact" }).order("last_seen_at", { ascending: false });

  if (filters.search?.trim()) {
    const term = filters.search.trim();
    query = query.or(`email.ilike.%${term}%,name.ilike.%${term}%,phone.ilike.%${term}%`);
  }

  const { data, error, count } = await query.range(from, to).returns<CustomerRow[]>();
  if (error || !data) return { items: [], total: 0, page, pageSize: PAGE_SIZE };

  return { items: data.map(toListItem), total: count ?? data.length, page, pageSize: PAGE_SIZE };
}
