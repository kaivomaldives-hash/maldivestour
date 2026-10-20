import "server-only";

import { createClient } from "@/lib/supabase/server";

/** One request from an affiliate ("Request Withdrawal") or a partner
 * ("Notify Payment Sent") — see supabase/migrations/20261101000100_
 * payout_requests.sql for why the two are opposite directions sharing
 * one table. `partyType` plus `partyName`/`partyHref` let the admin
 * Payments tab render and link both kinds the same way. */
export interface AdminPayoutRequest {
  id: string;
  partyType: "affiliate" | "partner";
  partyId: string;
  partyName: string;
  partyHref: string;
  requestedAmount: number;
  currency: string;
  note: string | null;
  requestedAt: string;
}

interface PayoutRequestRow {
  id: string;
  affiliate_id: string | null;
  partner_id: string | null;
  requested_amount: number;
  currency: string;
  note: string | null;
  requested_at: string;
}

/** Every pending request from either side, newest first — the admin
 * Payments tab's whole reason to exist: one place to see every manual
 * payout/payment action currently waiting, instead of having to already
 * know which affiliate/partner to go check. */
export async function getPendingPayoutRequestsAdmin(): Promise<AdminPayoutRequest[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("payout_requests")
    .select("id, affiliate_id, partner_id, requested_amount, currency, note, requested_at")
    .eq("status", "pending")
    .order("requested_at", { ascending: true })
    .returns<PayoutRequestRow[]>();
  if (error || !data || data.length === 0) return [];

  const affiliateIds = [...new Set(data.filter((r) => r.affiliate_id).map((r) => r.affiliate_id as string))];
  const partnerIds = [...new Set(data.filter((r) => r.partner_id).map((r) => r.partner_id as string))];

  const [affiliateNames, partnerNames] = await Promise.all([
    affiliateIds.length > 0
      ? supabase.from("affiliate_accounts").select("id, business_name").in("id", affiliateIds).returns<Array<{ id: string; business_name: string }>>()
      : Promise.resolve({ data: [] as Array<{ id: string; business_name: string }> }),
    partnerIds.length > 0
      ? supabase.from("partner_accounts").select("id, business_name").in("id", partnerIds).returns<Array<{ id: string; business_name: string }>>()
      : Promise.resolve({ data: [] as Array<{ id: string; business_name: string }> }),
  ]);

  const affiliateNameById = new Map((affiliateNames.data ?? []).map((a) => [a.id, a.business_name]));
  const partnerNameById = new Map((partnerNames.data ?? []).map((p) => [p.id, p.business_name]));

  return data.map((row) => {
    if (row.affiliate_id) {
      return {
        id: row.id,
        partyType: "affiliate" as const,
        partyId: row.affiliate_id,
        partyName: affiliateNameById.get(row.affiliate_id) ?? "(affiliate not found)",
        partyHref: `/admin/affiliates/${row.affiliate_id}`,
        requestedAmount: row.requested_amount,
        currency: row.currency,
        note: row.note,
        requestedAt: row.requested_at,
      };
    }
    const partnerId = row.partner_id as string;
    return {
      id: row.id,
      partyType: "partner" as const,
      partyId: partnerId,
      partyName: partnerNameById.get(partnerId) ?? "(partner not found)",
      partyHref: `/admin/partners/${partnerId}`,
      requestedAmount: row.requested_amount,
      currency: row.currency,
      note: row.note,
      requestedAt: row.requested_at,
    };
  });
}
