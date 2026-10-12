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

interface PartnerSignupMetadata {
  partnerKind?: string;
  propertyType?: string | null;
  businessName?: string;
  contactPhone?: string | null;
}

/** Redirects to /partner/login if unauthenticated, or to /become-a-partner
 * if authenticated but no partner_accounts row exists at all (an ordinary
 * site visitor, never signed up as a partner).
 *
 * Self-heals one specific gap: /auth/confirm (the route that normally
 * creates the partner_accounts row from signup metadata once email
 * confirmation completes) only runs if Supabase's confirmation email
 * actually links to it. If the project's "Confirm signup" email template
 * still uses the default `{{ .ConfirmationURL }}` (Supabase's own hosted
 * verify endpoint, which redirects with the session in a URL hash
 * fragment our server never sees) instead of a custom link pointing at
 * `/auth/confirm?token_hash=...&type=...`, that route never runs at all —
 * the user ends up with a real, confirmed, logged-in session but no
 * partner account, stuck bouncing to /become-a-partner forever with no
 * way back in. Checking here, on every authenticated visit to any
 * /partner page, means the account still gets created regardless of
 * which link format the email used. */
export async function requirePartner(): Promise<PartnerContext> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/partner/login");

  let { data: isPartnerResult } = await supabase.rpc("is_partner" as unknown as never);
  if (!isPartnerResult) {
    const metadata = user.user_metadata as PartnerSignupMetadata | null;
    if (metadata?.partnerKind && metadata?.businessName) {
      await supabase.rpc("create_partner_account" as unknown as never, {
        p_partner_kind: metadata.partnerKind,
        p_property_type: metadata.propertyType ?? null,
        p_business_name: metadata.businessName,
        p_contact_email: user.email,
        p_contact_phone: metadata.contactPhone ?? null,
      } as unknown as never);
      ({ data: isPartnerResult } = await supabase.rpc("is_partner" as unknown as never));
    }
  }
  if (!isPartnerResult) redirect("/become-a-partner");

  return { userId: user.id, email: user.email ?? null };
}
