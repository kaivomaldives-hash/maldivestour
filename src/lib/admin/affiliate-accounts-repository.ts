import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { AffiliateStatus } from "@/lib/affiliate/types";

/** Admin-only reads for the affiliate application queue — governed by
 * the `affiliate_accounts_staff_all` RLS policy. Same shape as
 * agent-accounts-repository.ts. */

const PAGE_SIZE = 25;

export interface AdminAffiliateAccountListItem {
  id: string;
  businessName: string;
  contactEmail: string;
  referralCode: string;
  status: AffiliateStatus;
  createdAt: string;
}

interface AffiliateAccountListRow {
  id: string;
  business_name: string;
  contact_email: string;
  referral_code: string;
  status: AffiliateStatus;
  created_at: string;
}

export interface AdminAffiliateAccountListResult {
  items: AdminAffiliateAccountListItem[];
  total: number;
  page: number;
  pageSize: number;
}

export async function getAffiliateAccountsAdmin(filters: { status?: AffiliateStatus; page?: number } = {}): Promise<AdminAffiliateAccountListResult> {
  const page = Math.max(1, filters.page ?? 1);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const supabase = await createClient();
  let query = supabase
    .from("affiliate_accounts")
    .select("id, business_name, contact_email, referral_code, status, created_at", { count: "exact" })
    .order("created_at", { ascending: false });
  if (filters.status) query = query.eq("status", filters.status);

  const { data, error, count } = await query.range(from, to).returns<AffiliateAccountListRow[]>();
  if (error || !data) return { items: [], total: 0, page, pageSize: PAGE_SIZE };

  return {
    items: data.map((row) => ({
      id: row.id,
      businessName: row.business_name,
      contactEmail: row.contact_email,
      referralCode: row.referral_code,
      status: row.status,
      createdAt: row.created_at,
    })),
    total: count ?? data.length,
    page,
    pageSize: PAGE_SIZE,
  };
}

export interface AdminAffiliateAccountDetail {
  id: string;
  businessName: string;
  contactEmail: string;
  contactPhone: string | null;
  whatsapp: string | null;
  country: string | null;
  paypalEmail: string | null;
  referralCode: string;
  status: AffiliateStatus;
  rejectionReason: string | null;
  reviewedAt: string | null;
  createdAt: string;
}

interface AffiliateAccountDetailRow {
  id: string;
  business_name: string;
  contact_email: string;
  contact_phone: string | null;
  whatsapp: string | null;
  country: string | null;
  paypal_email: string | null;
  referral_code: string;
  status: AffiliateStatus;
  rejection_reason: string | null;
  reviewed_at: string | null;
  created_at: string;
}

export async function getAffiliateAccountByIdAdmin(id: string): Promise<AdminAffiliateAccountDetail | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("affiliate_accounts").select("*").eq("id", id).maybeSingle<AffiliateAccountDetailRow>();
  if (error || !data) return null;

  return {
    id: data.id,
    businessName: data.business_name,
    contactEmail: data.contact_email,
    contactPhone: data.contact_phone,
    whatsapp: data.whatsapp,
    country: data.country,
    paypalEmail: data.paypal_email,
    referralCode: data.referral_code,
    status: data.status,
    rejectionReason: data.rejection_reason,
    reviewedAt: data.reviewed_at,
    createdAt: data.created_at,
  };
}

export interface AdminAffiliateCommissionBooking {
  id: string;
  bookingReference: string;
  customerName: string;
  productTitle: string;
  commissionAmount: number | null;
  commissionStatus: "pending" | "payable" | "void";
  createdAt: string;
}

export interface AdminAffiliatePayout {
  id: string;
  amount: number;
  currency: string;
  method: string | null;
  note: string | null;
  paidAt: string;
}

export interface AdminAffiliateEarnings {
  pendingAmount: number;
  payableAmount: number;
  paidAmount: number;
  balanceDue: number;
  currency: string;
  bookings: AdminAffiliateCommissionBooking[];
  payouts: AdminAffiliatePayout[];
}

interface CommissionBookingAdminRow {
  id: string;
  booking_reference: string;
  customer_name: string;
  product_type: "node" | "transfer_service";
  product_node_id: string | null;
  transfer_service_id: string | null;
  commission_amount: number | null;
  commission_status: "pending" | "payable" | "void";
  created_at: string;
}

/** Staff already has unrestricted RLS access to `bookings` (unlike an
 * affiliate — see get_my_affiliate_commission_bookings' own comment), so
 * this queries the table directly rather than going through that RPC. */
export async function getAffiliateEarningsAdmin(affiliateId: string): Promise<AdminAffiliateEarnings> {
  const supabase = await createClient();

  const [bookingsResult, payoutsResult] = await Promise.all([
    supabase
      .from("bookings")
      .select("id, booking_reference, customer_name, product_type, product_node_id, transfer_service_id, commission_amount, commission_status, created_at")
      .eq("affiliate_id", affiliateId)
      .neq("commission_status", "none")
      .order("created_at", { ascending: false })
      .returns<CommissionBookingAdminRow[]>(),
    supabase
      .from("affiliate_payouts")
      .select("id, amount, currency, method, note, paid_at")
      .eq("affiliate_id", affiliateId)
      .order("paid_at", { ascending: false })
      .returns<Array<{ id: string; amount: number; currency: string; method: string | null; note: string | null; paid_at: string }>>(),
  ]);

  const bookingRows = bookingsResult.data ?? [];
  const payoutRows = payoutsResult.data ?? [];

  const nodeIds = [...new Set(bookingRows.filter((r) => r.product_type === "node" && r.product_node_id).map((r) => r.product_node_id as string))];
  const serviceIds = [
    ...new Set(bookingRows.filter((r) => r.product_type === "transfer_service" && r.transfer_service_id).map((r) => r.transfer_service_id as string)),
  ];
  const titles = new Map<string, string>();
  if (nodeIds.length > 0) {
    const { data } = await supabase.from("nodes").select("id, title").in("id", nodeIds).returns<Array<{ id: string; title: string }>>();
    for (const n of data ?? []) titles.set(`node:${n.id}`, n.title);
  }
  if (serviceIds.length > 0) {
    const { data } = await supabase
      .from("transfer_services")
      .select("id, route_id")
      .in("id", serviceIds)
      .returns<Array<{ id: string; route_id: string }>>();
    const routeIds = [...new Set((data ?? []).map((s) => s.route_id))];
    const { data: routeNodes } =
      routeIds.length > 0
        ? await supabase.from("nodes").select("id, title").in("id", routeIds).returns<Array<{ id: string; title: string }>>()
        : { data: [] as Array<{ id: string; title: string }> };
    const routeTitleById = new Map((routeNodes ?? []).map((n) => [n.id, n.title]));
    for (const s of data ?? []) titles.set(`service:${s.id}`, routeTitleById.get(s.route_id) ?? "Transfer route");
  }

  const bookings = bookingRows.map((row) => {
    const key = row.product_type === "node" ? `node:${row.product_node_id}` : `service:${row.transfer_service_id}`;
    return {
      id: row.id,
      bookingReference: row.booking_reference,
      customerName: row.customer_name,
      productTitle: titles.get(key) ?? "(product not found)",
      commissionAmount: row.commission_amount,
      commissionStatus: row.commission_status,
      createdAt: row.created_at,
    };
  });

  const pendingAmount = bookings.filter((b) => b.commissionStatus === "pending").reduce((sum, b) => sum + (b.commissionAmount ?? 0), 0);
  const payableAmount = bookings.filter((b) => b.commissionStatus === "payable").reduce((sum, b) => sum + (b.commissionAmount ?? 0), 0);
  const paidAmount = payoutRows.reduce((sum, p) => sum + p.amount, 0);

  return {
    pendingAmount,
    payableAmount,
    paidAmount,
    balanceDue: payableAmount - paidAmount,
    currency: "USD",
    bookings,
    payouts: payoutRows.map((p) => ({ id: p.id, amount: p.amount, currency: p.currency, method: p.method, note: p.note, paidAt: p.paid_at })),
  };
}
