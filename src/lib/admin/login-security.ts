"use server";

import { headers } from "next/headers";

import { escapeHtml, getAdminNotificationEmail, sendResendEmail } from "@/lib/notifications/email";
import { createAdminClient } from "@/lib/supabase/admin";

/** How many failed attempts for the same email, within WINDOW_MINUTES,
 * before an alert fires. Re-alerts every ALERT_THRESHOLD attempts after
 * that (3, 6, 9, ...) rather than on every single failure, so a sustained
 * attempt doesn't flood the inbox. */
const ALERT_THRESHOLD = 3;
const WINDOW_MINUTES = 10;
const RETENTION_HOURS = 24;

async function sendTelegramAlert(text: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
    });
  } catch (err) {
    console.error("[admin-login-security] failed to send Telegram alert:", err instanceof Error ? err.message : String(err));
  }
}

/**
 * Called by the admin login form after Supabase Auth rejects a sign-in
 * attempt (see src/components/admin/login-form.tsx). Records the failure
 * and, once ALERT_THRESHOLD failures for the same email land within
 * WINDOW_MINUTES, emails/Telegrams the site's admin inbox with the email,
 * count, and source IP (when available) — so a cluster of failed logins
 * is surfaced immediately instead of only being discoverable later by
 * pulling raw Supabase Auth logs.
 *
 * Deliberately only catches attempts made through this site's own login
 * form — it cannot see an attempt made directly against Supabase's
 * /auth/v1/token endpoint, bypassing this UI entirely. That matches the
 * actual incident this was built for (a real browser hitting the real
 * login page) without adding a new public write surface to any table:
 * this writes via the service-role client, never via an RLS-bound
 * anon/authenticated path.
 *
 * Never throws — a failed sign-in must always still show the user
 * "Incorrect email or password", regardless of whether this tracking
 * step itself succeeds.
 */
export async function recordFailedAdminLogin(email: string): Promise<void> {
  try {
    const normalizedEmail = email.trim().toLowerCase().slice(0, 320);
    if (!normalizedEmail) return;

    const admin = createAdminClient();
    const forwardedFor = (await headers()).get("x-forwarded-for");
    const ip = forwardedFor?.split(",")[0]?.trim() || null;

    const { error: insertError } = await admin.from("admin_login_failures").insert({ email: normalizedEmail, ip } as unknown as never);
    if (insertError) {
      console.error("[admin-login-security] failed to record login failure:", insertError.message);
      return;
    }

    const windowStart = new Date(Date.now() - WINDOW_MINUTES * 60 * 1000).toISOString();
    const { count, error: countError } = await admin
      .from("admin_login_failures")
      .select("id", { count: "exact", head: true })
      .eq("email", normalizedEmail)
      .gte("attempted_at", windowStart);
    if (countError || count === null) {
      console.error("[admin-login-security] failed to count recent login failures:", countError?.message);
      return;
    }

    // Opportunistic cleanup — this table exists only to support the count
    // above, so nothing past RETENTION_HOURS is worth keeping.
    await admin.from("admin_login_failures").delete().lt("attempted_at", new Date(Date.now() - RETENTION_HOURS * 60 * 60 * 1000).toISOString());

    if (count === 0 || count % ALERT_THRESHOLD !== 0) return;

    const adminEmail = await getAdminNotificationEmail(admin);
    const html = `
      <p><strong>${count}</strong> failed admin login attempt${count === 1 ? "" : "s"} for <strong>${escapeHtml(normalizedEmail)}</strong> in the last ${WINDOW_MINUTES} minutes.</p>
      ${ip ? `<p><strong>Source IP:</strong> ${escapeHtml(ip)}</p>` : ""}
      <p>If this wasn't you or another staff member, consider resetting that account's password.</p>
    `;
    const telegramText = [
      `<b>Repeated failed admin login attempts</b>`,
      `Email: ${escapeHtml(normalizedEmail)}`,
      `Count: ${count} in ${WINDOW_MINUTES} min`,
      ip ? `IP: ${escapeHtml(ip)}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const [emailResult] = await Promise.all([
      sendResendEmail(adminEmail, `Repeated failed admin login attempts — ${normalizedEmail}`, html),
      sendTelegramAlert(telegramText),
    ]);
    if (!emailResult.ok) {
      console.error("[admin-login-security] failed to send login-failure alert email:", emailResult.error);
    }
  } catch (err) {
    console.error("[admin-login-security] recordFailedAdminLogin threw unexpectedly:", err instanceof Error ? err.message : String(err));
  }
}
