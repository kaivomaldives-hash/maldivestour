"use server";

import { createClient } from "@/lib/supabase/server";

/**
 * Footer newsletter "Subscribe" form. Calls the guest-safe
 * subscribe_to_updates() RPC (supabase/migrations/
 * 20261001004700_customers_and_newsletter.sql), which upserts into the same
 * `customers` table a booking creates a row in — deduplicated by
 * lower(email), so a visitor who subscribes and later books (or vice versa)
 * is one row, not two. Same honeypot spam-trap convention as
 * src/lib/bookings/actions.ts.
 */

function isSpam(honeypot: string | undefined): boolean {
  return Boolean(honeypot && honeypot.trim().length > 0);
}

const GENERIC_ERROR = "Something went wrong. Please try again.";

export interface SubscribeInput {
  name: string;
  email: string;
  /** Hidden honeypot field — must always be empty for a real submission. */
  honeypot?: string;
}

export interface SubscribeResult {
  ok: boolean;
  error?: string;
}

export async function subscribeToUpdates(input: SubscribeInput): Promise<SubscribeResult> {
  if (isSpam(input.honeypot)) return { ok: false, error: GENERIC_ERROR };

  const name = input.name.trim();
  const email = input.email.trim();

  if (!name) return { ok: false, error: "Please enter your name." };
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { ok: false, error: "Please enter a valid email address." };

  const supabase = await createClient();
  // src/types/database.ts is a placeholder (see src/lib/bookings/actions.ts's
  // own comment on the same pattern) — the unknown-cast is contained to
  // exactly this one call.
  const { error } = await supabase.rpc("subscribe_to_updates" as unknown as never, {
    p_name: name,
    p_email: email,
  } as unknown as undefined);

  if (error) {
    return { ok: false, error: GENERIC_ERROR };
  }

  return { ok: true };
}
