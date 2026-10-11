import "server-only";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

/**
 * Single choke point for partner authorization — the exact same shape as
 * requireStaff() (src/lib/admin/auth.ts), just for the separate partner
 * identity (partner_accounts, decoupled from profiles.role — see
 * supabase/migrations/20261011000100_partner_portal_foundation.sql's own
 * header comment for why). Backed by the `is_partner()`/`is_approved_
 * partner()` SECURITY DEFINER RPCs that the RLS policies on partner_
 * accounts/partner_bank_details/partner_documents already trust, so this
 * is a second, independent enforcement layer on top of RLS, not a
 * replacement for it.
 */

export interface PartnerContext {
  userId: string;
  email: string | null;
}

/** Redirects to /partner/login if unauthenticated, or to /become-a-partner
 * if authenticated but no partner_accounts row exists at all (an ordinary
 * site visitor, never signed up as a partner). */
export async function requirePartner(): Promise<PartnerContext> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/partner/login");

  const { data: isPartnerResult } = await supabase.rpc("is_partner" as unknown as never);
  if (!isPartnerResult) redirect("/become-a-partner");

  return { userId: user.id, email: user.email ?? null };
}
