"use server";

import { createClient } from "@/lib/supabase/server";

export interface ActionResult {
  ok: boolean;
  error?: string;
}

export interface CreateAgentAccountInput {
  businessName: string;
  contactEmail: string;
  contactPhone: string | null;
  whatsapp: string | null;
  country: string | null;
  paypalEmail: string | null;
  agreedToTerms: boolean;
}

/** Called by AgentSignupForm right after `supabase.auth.signUp()`
 * succeeds client-side. Thin wrapper over the `create_agent_account` RPC
 * (supabase/migrations/20261013000100_agent_affiliate_programme_
 * foundation.sql) — all validation lives there, since that RPC is also
 * the one and only place an agent_accounts row can be created. */
export async function createAgentAccount(input: CreateAgentAccountInput): Promise<ActionResult> {
  if (!input.agreedToTerms) return { ok: false, error: "Please agree to the Terms and Conditions to continue." };

  const supabase = await createClient();
  const { error } = await supabase.rpc(
    "create_agent_account" as unknown as never,
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
  return { ok: true };
}

export interface UpdateAgentProfileInput {
  businessName: string;
  contactPhone: string | null;
  whatsapp: string | null;
  country: string | null;
  paypalEmail: string | null;
}

/** Updates the agent's own profile fields — never `status` or any
 * review field, both blocked a second time at the database layer by
 * prevent_agent_self_review() regardless of what this function sends. */
export async function updateAgentProfile(input: UpdateAgentProfileInput): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in." };

  const businessName = input.businessName.trim();
  if (!businessName) return { ok: false, error: "Business name is required." };

  const { error } = await supabase
    .from("agent_accounts")
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
