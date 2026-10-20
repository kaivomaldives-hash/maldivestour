import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { AffiliateAccount, AffiliateEarningsSummary, AffiliateStatus } from "@/lib/affiliate/types";

interface AffiliateAccountRow {
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

function fromRow(row: AffiliateAccountRow): AffiliateAccount {
  return {
    id: row.id,
    businessName: row.business_name,
    contactEmail: row.contact_email,
    contactPhone: row.contact_phone,
    whatsapp: row.whatsapp,
    country: row.country,
    paypalEmail: row.paypal_email,
    referralCode: row.referral_code,
    status: row.status,
    rejectionReason: row.rejection_reason,
    reviewedAt: row.reviewed_at,
    createdAt: row.created_at,
  };
}

/** The signed-in affiliate's own account — governed by the
 * `affiliate_accounts_self_select` RLS policy, same reasoning as
 * getMyAgentAccount() (src/lib/agent/repository.ts). */
export async function getMyAffiliateAccount(): Promise<AffiliateAccount | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase.from("affiliate_accounts").select("*").eq("id", user.id).maybeSingle<AffiliateAccountRow>();
  return data ? fromRow(data) : null;
}

interface CommissionBookingRow {
  id: string;
  booking_reference: string;
  product_type: "node" | "transfer_service";
  product_node_id: string | null;
  transfer_service_id: string | null;
  commission_amount: number | null;
  commission_status: "pending" | "payable" | "void";
  created_at: string;
}

interface PayoutRow {
  id: string;
  amount: number;
  currency: string;
  method: string | null;
  note: string | null;
  paid_at: string;
}

/** The signed-in affiliate's own commission-bearing bookings (via the
 * get_my_affiliate_commission_bookings RPC — bookings has no RLS policy
 * for an affiliate at all, deliberately, so the customer's own contact
 * details are never exposed; see that RPC's own comment) plus their
 * payout history (affiliate_payouts_self_select RLS, a plain table read),
 * reduced into the one summary the earnings page needs. */
export async function getMyAffiliateEarnings(): Promise<AffiliateEarningsSummary | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [bookingsResult, payoutsResult] = await Promise.all([
    supabase.rpc("get_my_affiliate_commission_bookings" as unknown as never, {} as unknown as undefined) as unknown as Promise<{
      data: CommissionBookingRow[] | null;
    }>,
    supabase.from("affiliate_payouts").select("id, amount, currency, method, note, paid_at").eq("affiliate_id", user.id).order("paid_at", { ascending: false }).returns<PayoutRow[]>(),
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
    payouts: payoutRows.map((p) => ({
      id: p.id,
      amount: p.amount,
      currency: p.currency,
      method: p.method,
      note: p.note,
      paidAt: p.paid_at,
    })),
  };
}
