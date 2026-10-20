"use server";

import { sendAffiliateApplicationNotification } from "@/lib/affiliate/notifications";
import { createClient } from "@/lib/supabase/server";

export interface ActionResult {
  ok: boolean;
  error?: string;
}

export interface CreateAffiliateAccountInput {
  businessName: string;
  contactEmail: string;
  contactPhone: string | null;
  whatsapp: string | null;
  country: string | null;
  paypalEmail: string | null;
  agreedToTerms: boolean;
}

/** Called by AffiliateSignupForm right after `supabase.auth.signUp()`
 * succeeds client-side. Thin wrapper over the `create_affiliate_account`
 * RPC — all validation (including referral_code generation) lives
 * there. */
export async function createAffiliateAccount(input: CreateAffiliateAccountInput): Promise<ActionResult> {
  if (!input.agreedToTerms) return { ok: false, error: "Please agree to the Terms and Conditions to continue." };

  const supabase = await createClient();
  const { error } = await supabase.rpc(
    "create_affiliate_account" as unknown as never,
    {
      p_business_name: input.businessName,
      p_contact_email: input.contactEmail,
      p_contact_phone: input.contactPhone,
      p_whatsapp: input.whatsapp,
      p_country: input.country,
      p_paypal_email: input.paypalEmail,
      p_agreed_to_terms: true,
    } as unknown as never,
  );
  if (error) return { ok: false, error: error.message };
  await sendAffiliateApplicationNotification({ businessName: input.businessName, contactEmail: input.contactEmail });
  return { ok: true };
}

export interface UpdateAffiliateProfileInput {
  businessName: string;
  contactPhone: string | null;
  whatsapp: string | null;
  country: string | null;
  paypalEmail: string | null;
}

/** Updates the affiliate's own profile fields — never `status`,
 * `referral_code`, or any review field, all blocked a second time at
 * the database layer by prevent_affiliate_self_review(). */
export async function updateAffiliateProfile(input: UpdateAffiliateProfileInput): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in." };

  const businessName = input.businessName.trim();
  if (!businessName) return { ok: false, error: "Business name is required." };

  const { error } = await supabase
    .from("affiliate_accounts")
    .update({
      business_name: businessName,
      contact_phone: input.contactPhone?.trim() || null,
      whatsapp: input.whatsapp?.trim() || null,
      country: input.country?.trim() || null,
      paypal_email: input.paypalEmail?.trim() || null,
    } as unknown as never)
    .eq("id", user.id);

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

/** Thin wrapper over the `request_affiliate_payout` RPC (supabase/
 * migrations/20261101000100_payout_requests.sql) — the minimum-amount and
 * one-pending-request-at-a-time checks live there, not here, same
 * reasoning as createAffiliateAccount() above. Surfaces on the admin
 * Payments tab for staff to action; resolves automatically once staff
 * records the matching payout via recordAffiliatePayout(). */
export async function requestAffiliateWithdrawal(amount: number, note: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("request_affiliate_payout" as unknown as never, {
    p_amount: amount,
    p_note: note,
  } as unknown as never);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
