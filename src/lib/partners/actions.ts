"use server";

import { sendPartnerRequestNotification } from "@/lib/partners/notifications";
import type { PartnerType } from "@/lib/partners/types";
import { PARTNER_TYPES } from "@/lib/partners/types";
import { createClient } from "@/lib/supabase/server";

/**
 * "Become a Partner" footer form. Calls the guest-safe
 * submit_partner_request() RPC (supabase/migrations/
 * 20261001005200_partner_requests.sql), same honeypot convention as
 * src/lib/bookings/actions.ts and src/lib/customers/actions.ts.
 */

function isSpam(honeypot: string | undefined): boolean {
  return Boolean(honeypot && honeypot.trim().length > 0);
}

const GENERIC_ERROR = "Something went wrong. Please try again.";

export interface PartnerRequestInput {
  partnerType: string;
  name: string;
  email: string;
  phone: string;
  companyName: string;
  message: string;
  /** Hidden honeypot field — must always be empty for a real submission. */
  honeypot?: string;
}

export interface PartnerRequestResult {
  ok: boolean;
  error?: string;
}

export async function submitPartnerRequest(input: PartnerRequestInput): Promise<PartnerRequestResult> {
  if (isSpam(input.honeypot)) return { ok: false, error: GENERIC_ERROR };

  const name = input.name.trim();
  const email = input.email.trim();
  const partnerType = input.partnerType.trim();

  if (!PARTNER_TYPES.some((t) => t.value === partnerType)) return { ok: false, error: "Please select a partner type." };
  if (!name) return { ok: false, error: "Please enter your name." };
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { ok: false, error: "Please enter a valid email address." };

  const supabase = await createClient();
  // src/types/database.ts is a placeholder — same unknown-cast convention
  // as every other RPC call in this codebase (see src/lib/bookings/
  // actions.ts's own comment on the same pattern).
  const { error } = await supabase.rpc("submit_partner_request" as unknown as never, {
    p_partner_type: partnerType as PartnerType,
    p_name: name,
    p_email: email,
    p_phone: input.phone.trim() || null,
    p_company_name: input.companyName.trim() || null,
    p_message: input.message.trim() || null,
  } as unknown as undefined);

  if (error) {
    return { ok: false, error: GENERIC_ERROR };
  }

  await sendPartnerRequestNotification({
    partnerType,
    name,
    email,
    phone: input.phone.trim() || null,
    companyName: input.companyName.trim() || null,
    message: input.message.trim() || null,
  });

  return { ok: true };
}
