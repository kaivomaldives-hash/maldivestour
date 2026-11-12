import { EmailTemplateForm } from "@/components/admin/email-template-form";
import { getEmailTemplatesAdmin } from "@/lib/admin/email-templates-repository";
import { EMAIL_TEMPLATES } from "@/lib/email-templates/definitions";

export default async function AdminEmailTemplatesPage() {
  const { rows, missingTable } = await getEmailTemplatesAdmin();
  const groups = [...new Set(EMAIL_TEMPLATES.map((t) => t.group))];

  return (
    <div className="max-w-6xl">
      <h1 className="text-2xl font-semibold text-ocean-900">Email Templates</h1>
      <p className="mt-1 text-sm text-neutral-600">
        The wording of the emails customers and new users receive. Saved changes apply to the next email sent. Admin alert emails (new
        booking, new application) are not listed here.
      </p>

      {missingTable && (
        <p role="alert" className="mt-4 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
          The email templates table doesn&rsquo;t exist yet. Run <code>supabase/manual/2026-11-12_email_templates.sql</code> in the Supabase SQL
          editor, then reload this page. Until then every email uses the original text shown below.
        </p>
      )}

      {groups.map((group) => (
        <section key={group} className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">{group}</h2>
          {group === "Account (sign-up) emails" && (
            <p className="mt-1 text-xs text-neutral-500">
              These are sent by Supabase. They use the text here once Supabase&rsquo;s &ldquo;Send Email&rdquo; hook points at this website (see
              docs/email-templates.md); until then Supabase sends its own wording.
            </p>
          )}
          <div className="mt-3 space-y-3">
            {EMAIL_TEMPLATES.filter((t) => t.group === group).map((definition) => (
              <EmailTemplateForm key={definition.key} definition={definition} row={rows.find((r) => r.key === definition.key)!} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
