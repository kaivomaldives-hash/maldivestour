import "server-only";

import { emailTemplateDefinition, type EmailTemplateKey } from "@/lib/email-templates/definitions";
import { renderEmail, type EmailTemplateValues } from "@/lib/email-templates/render";
import { createAdminClient } from "@/lib/supabase/admin";

export interface StoredEmailTemplate {
  subject: string;
  body: string;
  updatedAt: string | null;
}

/**
 * The saved wording for a template (email_templates, edited at
 * /admin/email-templates), or its default from definitions.ts when it has
 * never been saved or the table can't be read. Read uncached so an edit
 * applies to the next email sent.
 */
export async function getEmailTemplate(key: EmailTemplateKey): Promise<StoredEmailTemplate> {
  const definition = emailTemplateDefinition(key);
  try {
    const { data } = await createAdminClient()
      .from("email_templates")
      .select("subject, body, updated_at")
      .eq("key", key)
      .maybeSingle<{ subject: string; body: string; updated_at: string }>();
    if (data?.subject?.trim() && data.body?.trim()) return { subject: data.subject, body: data.body, updatedAt: data.updated_at };
  } catch {
    // fall through to the default
  }
  return { subject: definition.subject, body: definition.body, updatedAt: null };
}

export async function renderEmailTemplate(key: EmailTemplateKey, values: EmailTemplateValues): Promise<{ subject: string; html: string }> {
  return renderEmail(await getEmailTemplate(key), values);
}
