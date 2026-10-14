import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { AffiliateAccount, AffiliateStatus } from "@/lib/affiliate/types";

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
