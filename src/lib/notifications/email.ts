import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Shared Resend email-sending primitives, factored out of
 * src/lib/bookings/notifications.ts (the first and, until now, only
 * caller) so a second, unrelated notification flow (partner/vendor
 * requests) doesn't duplicate the same fetch-to-Resend plumbing. Nothing
 * booking-specific lives here — booking email *content* stays in
 * bookings/notifications.ts, this file only knows how to deliver an email
 * and where the site's one operational inbox is.
 */

// Fallback only — the real recipient is platform_settings.
// booking_notification_email (seeded in
// supabase/migrations/20250101001500_seed_taxonomy.sql), editable without a
// deploy. Named for bookings (the first thing that needed it), but it's
// really just "the site's one operational alert inbox" — reused as-is for
// partner request alerts rather than adding a second settings row for the
// same mailbox.
const DEFAULT_ADMIN_EMAIL = "contact@maldivestour.guide";

export function escapeHtml(value: string): string {
  const map: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  return value.replace(/[&<>"']/g, (c) => map[c]);
}

export async function getAdminNotificationEmail(admin: ReturnType<typeof createAdminClient>): Promise<string> {
  const { data } = await admin.from("platform_settings").select("value").eq("key", "booking_notification_email").maybeSingle();
  return (data as { value: string } | null)?.value ?? DEFAULT_ADMIN_EMAIL;
}

export interface DeliveryResult {
  ok: boolean;
  providerMessageId?: string;
  error?: string;
}

export async function sendResendEmail(to: string, subject: string, html: string): Promise<DeliveryResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, error: "RESEND_API_KEY is not configured" };

  const from = process.env.RESEND_FROM_EMAIL || "MTG Bookings <bookings@maldivestour.guide>";
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to, subject, html }),
    });
    const body = (await res.json().catch(() => null)) as { id?: string; message?: string } | null;
    if (!res.ok) return { ok: false, error: body?.message ?? `Resend responded ${res.status}` };
    return { ok: true, providerMessageId: body?.id };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Unknown error calling Resend" };
  }
}
