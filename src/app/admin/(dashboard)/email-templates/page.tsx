import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { requireStaff } from "@/lib/admin/auth";
import { EMAIL_TEMPLATES } from "@/lib/email-templates/registry";
import { getAllEmailTemplateRows } from "@/lib/email-templates/repository";

export default async function AdminEmailTemplatesPage() {
  await requireStaff();
  const saved = await getAllEmailTemplateRows();
  const groups = ["Bookings", "Accounts"] as const;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-ocean-900">Email Templates</h1>
      <p className="mt-1 text-sm text-neutral-600">Change the wording of the emails customers and partners receive. Changes apply to new emails straight away.</p>

      {groups.map((group) => (
        <section key={group} className="mt-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">{group === "Bookings" ? "Booking emails" : "Account emails"}</h2>
          <ul className="mt-2 space-y-3">
            {EMAIL_TEMPLATES.filter((t) => t.group === group).map((t) => {
              const row = saved.get(t.key);
              return (
                <li key={t.key}>
                  <Link href={`/admin/email-templates/${t.key}`} className="block rounded-2xl border border-neutral-200 bg-white p-4 hover:border-maldives-300">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-medium text-ocean-900">{t.name}</span>
                      {row ? <Badge tone="maldives">Edited {new Date(row.updatedAt).toLocaleDateString()}</Badge> : <Badge tone="neutral">Original text</Badge>}
                    </div>
                    <p className="mt-1 text-sm text-neutral-600">{t.description}</p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      <p className="mt-8 text-xs text-neutral-500">Emails sent only to you (new booking alerts, partner applications and similar) aren&rsquo;t listed here.</p>
    </div>
  );
}
