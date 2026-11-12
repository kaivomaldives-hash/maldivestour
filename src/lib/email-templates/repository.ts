import "server-only";

import { getTemplateDef, type EmailTemplateKey } from "@/lib/email-templates/registry";
import { renderBody, renderSubject, type TemplateValues } from "@/lib/email-templates/render";
import { createAdminClient } from "@/lib/supabase/admin";

export interface StoredTemplate {
  subject: string;
  body: string;
  customized: boolean;
  updatedAt: string | null;
}

/** The saved wording for a template, or its built-in default. Never throws:
 * if the database can't be read, emails still go out with the default. */
export async function getEmailTemplate(key: EmailTemplateKey): Promise<StoredTemplate> {
  const def = getTemplateDef(key);
  if (!def) throw new Error(`Unknown email template: ${key}`);
  const fallback: StoredTemplate = { subject: def.defaultSubject ?? def.fixedSubject ?? "", body: def.defaultBody, customized: false, updatedAt: null };
  try {
    const admin = createAdminClient();
    const { data } = await admin.from("email_templates").select("subject, body, updated_at").eq("key", key).maybeSingle<{ subject: string | null; body: string; updated_at: string }>();
    if (!data) return fallback;
    return { subject: def.defaultSubject === null ? fallback.subject : data.subject || fallback.subject, body: data.body, customized: true, updatedAt: data.updated_at };
  } catch (err) {
    console.error("[email-templates] falling back to default for", key, err instanceof Error ? err.message : String(err));
    return fallback;
  }
}

/** Subject and HTML for one email, ready for sendResendEmail(). */
export async function renderEmail(key: EmailTemplateKey, values: TemplateValues, blocks: Record<string, string> = {}): Promise<{ subject: string; html: string }> {
  const template = await getEmailTemplate(key);
  return { subject: renderSubject(template.subject, values), html: renderBody(template.body, values, blocks) };
}

export async function getAllEmailTemplateRows(): Promise<Map<string, { updatedAt: string }>> {
  const admin = createAdminClient();
  const { data } = await admin.from("email_templates").select("key, updated_at").returns<{ key: string; updated_at: string }[]>();
  return new Map((data ?? []).map((r) => [r.key, { updatedAt: r.updated_at }]));
}
