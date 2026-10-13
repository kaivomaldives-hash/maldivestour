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
