import "server-only";

import { EMAIL_TEMPLATES, type EmailTemplateKey } from "@/lib/email-templates/definitions";
import { createClient } from "@/lib/supabase/server";

export interface AdminEmailTemplateRow {
  key: EmailTemplateKey;
  subject: string;
  body: string;
  /** False = showing the built-in default (never saved). */
  saved: boolean;
  updatedAt: string | null;
}

/** Staff read of every template, saved wording or default. */
export async function getEmailTemplatesAdmin(): Promise<{ rows: AdminEmailTemplateRow[]; missingTable: boolean }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("email_templates")
    .select("key, subject, body, updated_at")
    .returns<Array<{ key: string; subject: string; body: string; updated_at: string }>>();
  const saved = new Map((data ?? []).map((r) => [r.key, r]));
  return {
    missingTable: error?.code === "42P01" || error?.code === "PGRST205",
    rows: EMAIL_TEMPLATES.map((t) => {
      const row = saved.get(t.key);
      return row
        ? { key: t.key, subject: row.subject, body: row.body, saved: true, updatedAt: row.updated_at }
        : { key: t.key, subject: t.subject, body: t.body, saved: false, updatedAt: null };
    }),
  };
}
