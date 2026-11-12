import Link from "next/link";
import { notFound } from "next/navigation";

import { EmailTemplateEditor } from "@/components/admin/email-template-editor";
import { requireStaff } from "@/lib/admin/auth";
import { getTemplateDef } from "@/lib/email-templates/registry";
import { getEmailTemplate } from "@/lib/email-templates/repository";

export default async function AdminEmailTemplatePage({ params }: { params: Promise<{ key: string }> }) {
  await requireStaff();
  const { key } = await params;
  const def = getTemplateDef(key);
  if (!def) notFound();
  const current = await getEmailTemplate(def.key);

  return (
    <div>
      <Link href="/admin/email-templates" className="text-sm text-maldives-700 hover:underline">
        ← All email templates
      </Link>
      <h1 className="mt-2 text-2xl font-semibold text-ocean-900">{def.name}</h1>
      <p className="mt-1 text-sm text-neutral-600">{def.description}</p>
      <div className="mt-6">
        <EmailTemplateEditor templateKey={def.key} initialSubject={current.subject} initialBody={current.body} customized={current.customized} />
      </div>
    </div>
  );
}
