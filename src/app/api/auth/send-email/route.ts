import { createHmac, timingSafeEqual } from "node:crypto";

import { NextResponse } from "next/server";

import type { EmailTemplateKey } from "@/lib/email-templates/definitions";
import { renderEmailTemplate } from "@/lib/email-templates/repository";
import { escapeHtml, sendResendEmail } from "@/lib/notifications/email";
import { getSiteUrl } from "@/lib/seo/site";

/**
 * Supabase Auth "Send Email" hook: Supabase calls this instead of sending
 * its own sign-up, invite, password-reset, sign-in-link and email-change
 * emails, so they use the wording edited at /admin/email-templates and go
 * out through Resend like every other site email. Off until the hook is
 * turned on in Supabase with SEND_EMAIL_HOOK_SECRET set here
 * (docs/email-templates.md).
 *
 * Requests are signed (Standard Webhooks): the secret is "v1,whsec_<base64>"
 * and the signature is HMAC-SHA256 of "<id>.<timestamp>.<body>".
 */

interface HookPayload {
  user: { email: string; new_email?: string };
  email_data: {
    token: string;
    token_hash: string;
    redirect_to: string;
    email_action_type: string;
    site_url: string;
    token_new?: string;
    token_hash_new?: string;
  };
}

const TEMPLATE_BY_ACTION: Record<string, { key: EmailTemplateKey; otpType: string; button: string }> = {
  signup: { key: "auth_signup", otpType: "email", button: "Confirm my email" },
  invite: { key: "auth_invite", otpType: "invite", button: "Accept the invitation" },
  recovery: { key: "auth_recovery", otpType: "recovery", button: "Choose a new password" },
  magiclink: { key: "auth_magic_link", otpType: "magiclink", button: "Sign in" },
  email_change: { key: "auth_email_change", otpType: "email_change", button: "Confirm my new email" },
};

const MAX_AGE_SECONDS = 5 * 60;

function hookError(status: number, message: string) {
  return NextResponse.json({ error: { http_code: status, message } }, { status });
}

function verifySignature(body: string, headers: Headers, secret: string): boolean {
  const id = headers.get("webhook-id");
  const timestamp = headers.get("webhook-timestamp");
  const signatures = headers.get("webhook-signature");
  if (!id || !timestamp || !signatures) return false;
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > MAX_AGE_SECONDS) return false;

  const key = Buffer.from(secret.replace(/^v1,/, "").replace(/^whsec_/, ""), "base64");
  const expected = createHmac("sha256", key).update(`${id}.${timestamp}.${body}`).digest();
  return signatures.split(" ").some((entry) => {
    const [version, value] = entry.split(",");
    if (version !== "v1" || !value) return false;
    const given = Buffer.from(value, "base64");
    return given.length === expected.length && timingSafeEqual(given, expected);
  });
}

/** The link the email's button opens: the site's /auth/confirm route,
 * which verifies the token and then goes on to `redirect_to`. */
function actionLink(data: HookPayload["email_data"], tokenHash: string, otpType: string): string {
  const site = getSiteUrl();
  const redirect = data.redirect_to || data.site_url || site;
  let target: URL;
  try {
    target = new URL(redirect);
  } catch {
    target = new URL(site);
  }
  const link = target.pathname.startsWith("/auth/confirm") ? target : new URL("/auth/confirm", target.origin);
  if (!target.pathname.startsWith("/auth/confirm") && target.pathname !== "/") link.searchParams.set("next", target.pathname + target.search);
  link.searchParams.set("token_hash", tokenHash);
  link.searchParams.set("type", otpType);
  return link.toString();
}

export async function POST(request: Request) {
  const secret = process.env.SEND_EMAIL_HOOK_SECRET;
  if (!secret) return hookError(500, "Send email hook is not configured on the website.");

  const body = await request.text();
  if (!verifySignature(body, request.headers, secret)) return hookError(401, "Invalid signature.");

  let payload: HookPayload;
  try {
    payload = JSON.parse(body) as HookPayload;
  } catch {
    return hookError(400, "Invalid payload.");
  }

  const data = payload.email_data;
  const action = TEMPLATE_BY_ACTION[data?.email_action_type];

  // Reauthentication (and anything newer) is a one-time code without a link.
  if (!action) {
    const code = escapeHtml(data?.token ?? "");
    const result = await sendResendEmail(
      payload.user.email,
      "Your Maldives Tour Guide verification code",
      `<p>Your verification code is <strong style="font-size:20px">${code}</strong>.</p><p>If you didn't ask for it, you can ignore this email.</p>`,
    );
    return result.ok ? NextResponse.json({}) : hookError(500, result.error ?? "Email not sent.");
  }

  // An email change goes to the new address (Supabase's single-confirmation
  // flow); with "secure email change" on, Supabase sends a second request
  // for the current address.
  const to = data.email_action_type === "email_change" ? (payload.user.new_email ?? payload.user.email) : payload.user.email;
  const link = actionLink(data, data.token_hash, action.otpType);
  const email = await renderEmailTemplate(action.key, {
    text: { email: to, action_link: link, code: data.token },
    html: {
      action_button: `<p style="margin:24px 0"><a href="${escapeHtml(link)}" style="display:inline-block;padding:12px 22px;border-radius:999px;background:#0e7aa4;color:#ffffff;font-weight:600;text-decoration:none">${action.button}</a></p>`,
    },
  });

  const result = await sendResendEmail(to, email.subject, email.html);
  return result.ok ? NextResponse.json({}) : hookError(500, result.error ?? "Email not sent.");
}
