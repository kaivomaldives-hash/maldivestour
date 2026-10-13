import "server-only";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

/**
 * Single choke point for Travel Agent authorization — same shape as
 * requirePartner() (src/lib/partner/auth.ts) and requireStaff()
 * (src/lib/admin/auth.ts): a second, independent enforcement layer on
 * top of the `is_agent()`/`is_approved_agent()`-gated RLS policies on
 * agent_accounts (supabase/migrations/20261013000100_
 * agent_affiliate_programme_foundation.sql), not a replacement for them.
 */

export interface AgentContext {
  userId: string;
  email: string | null;
}

interface AgentSignupMetadata {
  agentApplication?: boolean;
  businessName?: string;
  contactPhone?: string | null;
  whatsapp?: string | null;
  country?: string | null;
  paypalEmail?: string | null;
}

/** Redirects to /agent/login if unauthenticated, or to /agent/signup if
 * authenticated but no agent_accounts row exists at all (an ordinary
 * site visitor, or a user who only ever applied as an affiliate).
 *
 * Self-heals the same gap requirePartner() (src/lib/partner/auth.ts)
 * does: if the Supabase project requires email confirmation,
 * create_agent_account() never ran at signup time (no session yet for
 * its auth.uid() to resolve) — AgentSignupForm stashes the submitted
 * fields in user_metadata instead, and this is the one point after
 * confirmation guaranteed to run on the user's next authenticated visit. */
export async function requireAgent(): Promise<AgentContext> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/agent/login");

  let { data: isAgentResult } = await supabase.rpc("is_agent" as unknown as never);
  if (!isAgentResult) {
    const metadata = user.user_metadata as AgentSignupMetadata | null;
    if (metadata?.agentApplication && metadata?.businessName) {
      const { error: healError } = await supabase.rpc("create_agent_account" as unknown as never, {
        p_business_name: metadata.businessName,
        p_contact_email: user.email,
        p_contact_phone: metadata.contactPhone ?? null,
        p_whatsapp: metadata.whatsapp ?? null,
        p_country: metadata.country ?? null,
        p_paypal_email: metadata.paypalEmail ?? null,
      } as unknown as never);
      if (healError) {
        console.error(`[requireAgent] self-heal create_agent_account failed for user ${user.id}:`, healError.message);
      }
      ({ data: isAgentResult } = await supabase.rpc("is_agent" as unknown as never));
    }
  }
  if (!isAgentResult) redirect("/agent/signup");

  return { userId: user.id, email: user.email ?? null };
}
