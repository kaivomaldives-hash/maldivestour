"use server";

import { revalidatePath } from "next/cache";

import { requireStaff } from "@/lib/admin/auth";
import { getTemplateDef } from "@/lib/email-templates/registry";
import { renderBody, renderSubject } from "@/lib/email-templates/render";
import { sendResendEmail } from "@/lib/notifications/email";
import { createClient } from "@/lib/supabase/server";

export interface TemplateActionResult {
  ok: boolean;
  error?: string;
  message?: string;
}

function check(key: string, subject: string | null, body: string): string | null {
  const def = getTemplateDef(key);
  if (!def) return "Unknown email.";
  if (!body.trim()) return "The email text can't be empty.";
  if (body.length > 20000) return "The email text is too long.";
  if (def.defaultSubject !== null && !subject?.trim()) return "The subject can't be empty.";
  if (subject && subject.length > 300) return "The subject is too long.";
  // Sign-in emails are useless without their button.
  if (def.group === "Accounts") {
    const button = def.placeholders.find((p) => p.block)?.name;
    if (button && !new RegExp(`\\{\\{\\s*${button}\\s*\\}\\}`).test(body)) return `Keep {{${button}}} in the text: it's the link the person clicks.`;
  }
  return null;
}

export async function saveEmailTemplate(input: { key: string; subject: string | null; body: string }): Promise<TemplateActionResult> {
  const staff = await requireStaff();
  const def = getTemplateDef(input.key);
  const subject = def?.defaultSubject === null ? null : (input.subject ?? "").trim();
  const problem = check(input.key, subject, input.body);
  if (problem) return { ok: false, error: problem };

  const supabase = await createClient();
  const { error } = await supabase.from("email_templates").upsert({
    key: input.key,
    subject,
    body: input.body.replace(/\r\n?/g, "\n"),
    updated_at: new Date().toISOString(),
    updated_by: staff.userId,
  } as unknown as never);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/email-templates");
  return { ok: true, message: "Saved. New emails use this text from now on." };
}

export async function resetEmailTemplate(key: string): Promise<TemplateActionResult> {
  await requireStaff();
  if (!getTemplateDef(key)) return { ok: false, error: "Unknown email." };
  const supabase = await createClient();
  const { error } = await supabase.from("email_templates").delete().eq("key", key);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/email-templates");
  return { ok: true, message: "Back to the original text." };
}

/** Sends the text in the editor (saved or not) with example details to the signed-in staff member. */
export async function sendTestEmail(input: { key: string; subject: string | null; body: string }): Promise<TemplateActionResult> {
  const staff = await requireStaff();
  const def = getTemplateDef(input.key);
  if (!def) return { ok: false, error: "Unknown email." };
  if (!staff.email) return { ok: false, error: "Your account has no email address." };
  const subject = renderSubject(def.defaultSubject === null ? (def.fixedSubject ?? "") : (input.subject ?? ""), def.sample);
  const html = renderBody(input.body, def.sample, def.sampleBlocks);
  const result = await sendResendEmail(staff.email, `[Test] ${subject}`, html);
  return result.ok ? { ok: true, message: `Test email sent to ${staff.email}.` } : { ok: false, error: result.error ?? "Couldn't send the test email." };
}
