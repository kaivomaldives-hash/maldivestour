"use server";

import { revalidatePath } from "next/cache";

import { logAdminAction } from "@/lib/admin/audit-log";
import { requireStaff } from "@/lib/admin/auth";
import { isEmailTemplateKey } from "@/lib/email-templates/definitions";
import { createClient } from "@/lib/supabase/server";

/**
 * requireStaff() is defense in depth; the primary guard is the
 * `email_templates_staff_all` RLS policy. Same pattern as
 * src/lib/admin/fishing-calculator-actions.ts.
 */
export interface AdminActionResult {
  ok: boolean;
  error?: string;
}

const missingTable = (code?: string) => code === "42P01" || code === "PGRST205";
const MISSING_TABLE_ERROR = "The email_templates table doesn't exist yet — run the SQL file first.";

export async function saveEmailTemplate(key: string, subject: string, body: string): Promise<AdminActionResult> {
  await requireStaff();
  if (!isEmailTemplateKey(key)) return { ok: false, error: "Unknown email." };
  if (!subject.trim()) return { ok: false, error: "The subject can't be empty." };
  if (!body.trim()) return { ok: false, error: "The email text can't be empty." };
  if (subject.length > 200) return { ok: false, error: "The subject must be at most 200 characters." };
  if (body.length > 20000) return { ok: false, error: "The email text is too long." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("email_templates")
    .upsert({ key, subject: subject.trim(), body: body.trim() } as unknown as never, { onConflict: "key" });
  if (error) return { ok: false, error: missingTable(error.code) ? MISSING_TABLE_ERROR : error.message };

  await logAdminAction("email_template.update", "email_templates", key);
  revalidatePath("/admin/email-templates");
  return { ok: true };
}

/** Deletes the saved wording, so the built-in default applies again. */
export async function resetEmailTemplate(key: string): Promise<AdminActionResult> {
  await requireStaff();
  if (!isEmailTemplateKey(key)) return { ok: false, error: "Unknown email." };

  const supabase = await createClient();
  const { error } = await supabase.from("email_templates").delete().eq("key", key);
  if (error) return { ok: false, error: missingTable(error.code) ? MISSING_TABLE_ERROR : error.message };

  await logAdminAction("email_template.reset", "email_templates", key);
  revalidatePath("/admin/email-templates");
  return { ok: true };
}
