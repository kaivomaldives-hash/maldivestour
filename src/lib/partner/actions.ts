"use server";

import { createClient } from "@/lib/supabase/server";
import type { PartnerKind, PropertyType } from "@/lib/partner/types";

export interface ActionResult {
  ok: boolean;
  error?: string;
}

export interface CreatePartnerAccountInput {
  partnerKind: PartnerKind;
  propertyType: PropertyType | null;
  businessName: string;
  contactEmail: string;
  contactPhone: string | null;
  agreedToTerms: boolean;
}

/**
 * Called by the signup form right after `supabase.auth.signUp()` succeeds
 * client-side (so the session cookie this server action reads via
 * `createClient()` is already the brand-new user's). Thin wrapper over the
 * `create_partner_account` RPC (supabase/migrations/20261011000100_
 * partner_portal_foundation.sql) — all validation lives there, since that
 * RPC is also the one and only place a partner_accounts row can be
 * created, so duplicating checks here would just be a second copy to keep
 * in sync.
 */
export async function createPartnerAccount(input: CreatePartnerAccountInput): Promise<ActionResult> {
  if (!input.agreedToTerms) return { ok: false, error: "Please agree to the Terms and Conditions to continue." };

  const supabase = await createClient();
  const { error } = await supabase.rpc(
    "create_partner_account" as unknown as never,
    {
      p_partner_kind: input.partnerKind,
      p_property_type: input.propertyType,
      p_business_name: input.businessName,
      p_contact_email: input.contactEmail,
      p_contact_phone: input.contactPhone,
      p_agreed_to_terms: true,
    } as unknown as never,
  );
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export interface UpdatePartnerProfileInput {
  businessName: string;
  contactEmail: string;
  contactPhone: string | null;
  whatsapp: string | null;
  country: string | null;
  address: string | null;
  description: string | null;
}

/** Updates the partner's own profile fields — never onboarding_status or
 * any review field, both blocked a second time at the database layer by
 * prevent_partner_self_review() regardless of what this function sends. */
export async function updatePartnerProfile(input: UpdatePartnerProfileInput): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in." };

  const businessName = input.businessName.trim();
  if (!businessName) return { ok: false, error: "Business name is required." };

  const { error } = await supabase
    .from("partner_accounts")
    .update({
      business_name: businessName,
      contact_email: input.contactEmail.trim(),
      contact_phone: input.contactPhone?.trim() || null,
      whatsapp: input.whatsapp?.trim() || null,
      country: input.country?.trim() || null,
      address: input.address?.trim() || null,
      description: input.description?.trim() || null,
    } as unknown as never)
    .eq("id", user.id);

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export interface UpdatePartnerBankDetailsInput {
  accountHolderName: string | null;
  bankName: string | null;
  accountNumber: string | null;
  ibanOrSwift: string | null;
  branchAddress: string | null;
  currency: string;
}

export async function updatePartnerBankDetails(input: UpdatePartnerBankDetailsInput): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in." };

  const { error } = await supabase
    .from("partner_bank_details")
    .upsert(
      {
        partner_id: user.id,
        account_holder_name: input.accountHolderName?.trim() || null,
        bank_name: input.bankName?.trim() || null,
        account_number: input.accountNumber?.trim() || null,
        iban_or_swift: input.ibanOrSwift?.trim() || null,
        branch_address: input.branchAddress?.trim() || null,
        currency: input.currency.trim() || "USD",
      } as unknown as never,
      { onConflict: "partner_id" },
    );

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

/** "Submit for Review" — thin wrapper over submit_partner_profile_for_
 * review(), which validates the current onboarding_status allows it. */
export async function submitPartnerProfileForReview(): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("submit_partner_profile_for_review" as unknown as never);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
