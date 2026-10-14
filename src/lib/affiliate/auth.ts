import "server-only";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

/**
 * Single choke point for Affiliate authorization — same shape as
 * requireAgent() (src/lib/agent/auth.ts) and requirePartner()
 * (src/lib/partner/auth.ts): a second, independent enforcement layer on
 * top of the `is_affiliate()`/`is_approved_affiliate()`-gated RLS
 * policies on affiliate_accounts, not a replacement for them.
 */

export interface AffiliateContext {
  userId: string;
  email: string | null;
}

interface AffiliateSignupMetadata {
  affiliateApplication?: boolean;
  businessName?: string;
  contactPhone?: string | null;
  whatsapp?: string | null;
  country?: string | null;
  paypalEmail?: string | null;
  agreedToTerms?: boolean;
}

/** Redirects to /affiliate/login if unauthenticated, or to
 * /affiliate/signup if authenticated but no affiliate_accounts row
 * exists at all. Self-heals the same email-confirmation gap
 * requireAgent() (src/lib/agent/auth.ts) does, for the same reason. */
export async function requireAffiliate(): Promise<AffiliateContext> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/affiliate/login");

  let { data: isAffiliateResult } = await supabase.rpc("is_affiliate" as unknown as never);
  if (!isAffiliateResult) {
    const metadata = user.user_metadata as AffiliateSignupMetadata | null;
    if (metadata?.affiliateApplication && metadata?.businessName) {
      const { error: healError } = await supabase.rpc("create_affiliate_account" as unknown as never, {
        p_business_name: metadata.businessName,
        p_contact_email: user.email,
        p_contact_phone: metadata.contactPhone ?? null,
        p_whatsapp: metadata.whatsapp ?? null,
        p_country: metadata.country ?? null,
        p_paypal_email: metadata.paypalEmail ?? null,
        p_agreed_to_terms: metadata.agreedToTerms === true,
      } as unknown as never);
      if (healError) {
        console.error(`[requireAffiliate] self-heal create_affiliate_account failed for user ${user.id}:`, healError.message);
      }
      ({ data: isAffiliateResult } = await supabase.rpc("is_affiliate" as unknown as never));
    }
  }
  if (!isAffiliateResult) redirect("/affiliate/signup");

  return { userId: user.id, email: user.email ?? null };
}
