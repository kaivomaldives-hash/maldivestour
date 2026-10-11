import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";

/**
 * Email confirmation landing route — the link Supabase emails after
 * `supabase.auth.signUp()` points here (see `emailRedirectTo` in
 * PartnerSignupForm), not at the app's root. `@supabase/ssr`'s supported
 * pattern for this is a `verifyOtp({ type, token_hash })` call in a Route
 * Handler (not client-side, since this needs to set the session cookie
 * via the server client before redirecting) — see
 * https://supabase.com/docs/guides/auth/server-side/nextjs.
 *
 * If the Supabase project requires email confirmation, `create_partner_
 * account` (called by PartnerSignupForm right after signUp()) never ran
 * at signup time — there was no session yet for the RPC's auth.uid() to
 * resolve. The signup form instead stashes the submitted fields in the
 * new user's own `user_metadata` (signUp()'s `options.data`, persisted
 * regardless of confirmation status), and THIS route creates the
 * partner_accounts row from that metadata once the session actually
 * exists — the one point after signup that's guaranteed to run exactly
 * once per confirmed account.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/partner";

  if (tokenHash && type) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });

    if (!error && data.user) {
      const metadata = data.user.user_metadata as {
        partnerKind?: string;
        propertyType?: string | null;
        businessName?: string;
        contactPhone?: string | null;
      } | null;

      if (metadata?.partnerKind && metadata?.businessName) {
        const { data: alreadyPartner } = await supabase.rpc("is_partner" as unknown as never);
        if (!alreadyPartner) {
          await supabase.rpc("create_partner_account" as unknown as never, {
            p_partner_kind: metadata.partnerKind,
            p_property_type: metadata.propertyType ?? null,
            p_business_name: metadata.businessName,
            p_contact_email: data.user.email,
            p_contact_phone: metadata.contactPhone ?? null,
          } as unknown as never);
        }
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/partner/login?error=confirmation_failed`);
}
