import "server-only";

import { createClient } from "@/lib/supabase/server";

/**
 * Reads the signed-in partner's own bookings — entirely governed by the
 * `bookings_partner_read` RLS policy (supabase/migrations/20261011000200_
 * partner_listings_and_bookings.sql); this file adds no filtering of its
 * own, it just shapes what that policy already returns. Same product-
 * title resolution pattern as the admin bookings repository
 * (src/lib/admin/bookings-repository.ts's resolveProductTitles) —
 * `internal_notes` is deliberately left off this type, staff-only.
 */

export type PartnerBookingStatus = "new" | "contacted" | "pending" | "confirmed" | "cancelled" | "completed";

export type PartnerCommissionStatus = "none" | "pending" | "payable" | "void";

export interface PartnerBookingItem {
  id: string;
  bookingReference: string;
  productTitle: string;
  customerName: string;
  customerEmail: string;
  travelDate: string | null;
  adults: number;
  children: number;
  estimatedPrice: number | null;
  quotedPrice: number | null;
  currency: string;
  status: PartnerBookingStatus;
  createdAt: string;
  partnerCommissionPercent: number | null;
  partnerCommissionAmount: number | null;
  partnerCommissionStatus: PartnerCommissionStatus;
}

interface BookingRow {
  id: string;
  booking_reference: string;
  product_type: "node" | "transfer_service";
  product_node_id: string | null;
  transfer_service_id: string | null;
  customer_name: string;
  customer_email: string;
  travel_date: string | null;
  adults: number;
  children: number;
  estimated_price: number | null;
  quoted_price: number | null;
  currency: string;
  status: PartnerBookingStatus;
  created_at: string;
  partner_commission_percent: number | null;
  partner_commission_amount: number | null;
  partner_commission_status: PartnerCommissionStatus;
}

export async function getMyPartnerBookings(): Promise<PartnerBookingItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bookings")
    .select(
      "id, booking_reference, product_type, product_node_id, transfer_service_id, customer_name, customer_email, travel_date, adults, children, estimated_price, quoted_price, currency, status, created_at, partner_commission_percent, partner_commission_amount, partner_commission_status",
    )
    .order("created_at", { ascending: false })
    .returns<BookingRow[]>();
  if (error || !data) return [];

  const nodeIds = [...new Set(data.filter((r) => r.product_type === "node" && r.product_node_id).map((r) => r.product_node_id as string))];
  const serviceIds = [...new Set(data.filter((r) => r.product_type === "transfer_service" && r.transfer_service_id).map((r) => r.transfer_service_id as string))];

  const titles = new Map<string, string>();
  if (nodeIds.length > 0) {
    const { data: nodes } = await supabase.from("nodes").select("id, title").in("id", nodeIds).returns<{ id: string; title: string }[]>();
    for (const n of nodes ?? []) titles.set(`node:${n.id}`, n.title);
  }
  if (serviceIds.length > 0) {
    const { data: services } = await supabase
      .from("transfer_services")
      .select("id, route_id")
      .in("id", serviceIds)
      .returns<{ id: string; route_id: string }[]>();
    const routeIds = [...new Set((services ?? []).map((s) => s.route_id))];
    const { data: routes } = routeIds.length > 0 ? await supabase.from("nodes").select("id, title").in("id", routeIds).returns<{ id: string; title: string }[]>() : { data: [] };
    const routeTitleById = new Map((routes ?? []).map((r) => [r.id, r.title]));
    for (const s of services ?? []) {
      const title = routeTitleById.get(s.route_id);
      if (title) titles.set(`service:${s.id}`, title);
    }
  }

  return data.map((row) => {
    const key = row.product_type === "node" ? `node:${row.product_node_id}` : `service:${row.transfer_service_id}`;
    return {
      id: row.id,
      bookingReference: row.booking_reference,
      productTitle: titles.get(key) ?? "(product not found)",
      customerName: row.customer_name,
      customerEmail: row.customer_email,
      travelDate: row.travel_date,
      adults: row.adults,
      children: row.children,
      estimatedPrice: row.estimated_price,
      quotedPrice: row.quoted_price,
      currency: row.currency,
      status: row.status,
      createdAt: row.created_at,
      partnerCommissionPercent: row.partner_commission_percent,
      partnerCommissionAmount: row.partner_commission_amount,
      partnerCommissionStatus: row.partner_commission_status,
    };
  });
}

/** The signed-in partner's own earnings summary — bookings already come
 * from getMyPartnerBookings() (bookings_partner_read RLS, unlike the
 * affiliate case which needed a narrow RPC — partners already see full
 * booking rows for their own listings, including customer contact
 * details, since they need to actually service the booking), reduced
 * into balance-owed/pending/paid. Payment history is a plain table read
 * under partner_payments_self_select RLS. */
export async function getMyPartnerEarnings(): Promise<{
  pendingAmount: number;
  payableAmount: number;
  paidAmount: number;
  balanceDue: number;
  currency: string;
  bookings: PartnerBookingItem[];
  payments: Array<{ id: string; amount: number; currency: string; method: string | null; note: string | null; paidAt: string }>;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { pendingAmount: 0, payableAmount: 0, paidAmount: 0, balanceDue: 0, currency: "USD", bookings: [], payments: [] };

  const [allBookings, paymentsResult] = await Promise.all([
    getMyPartnerBookings(),
    supabase
      .from("partner_payments")
      .select("id, amount, currency, method, note, paid_at")
      .eq("partner_id", user.id)
      .order("paid_at", { ascending: false })
      .returns<Array<{ id: string; amount: number; currency: string; method: string | null; note: string | null; paid_at: string }>>(),
  ]);

  const bookings = allBookings.filter((b) => b.partnerCommissionStatus !== "none");
  const payments = paymentsResult.data ?? [];

  const pendingAmount = bookings.filter((b) => b.partnerCommissionStatus === "pending").reduce((sum, b) => sum + (b.partnerCommissionAmount ?? 0), 0);
  const payableAmount = bookings.filter((b) => b.partnerCommissionStatus === "payable").reduce((sum, b) => sum + (b.partnerCommissionAmount ?? 0), 0);
  const paidAmount = payments.reduce((sum, p) => sum + p.amount, 0);

  return {
    pendingAmount,
    payableAmount,
    paidAmount,
    balanceDue: payableAmount - paidAmount,
    currency: "USD",
    bookings,
    payments: payments.map((p) => ({ id: p.id, amount: p.amount, currency: p.currency, method: p.method, note: p.note, paidAt: p.paid_at })),
  };
}
