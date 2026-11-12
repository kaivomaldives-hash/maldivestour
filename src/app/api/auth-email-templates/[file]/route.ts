import { AUTH_TEMPLATE_FILES } from "@/lib/email-templates/registry";
import { buttonHtml, renderBody } from "@/lib/email-templates/render";
import { getEmailTemplate } from "@/lib/email-templates/repository";

/**
 * The sign-up, password-reset and invitation emails are sent by the
 * Supabase auth service, which loads each email's HTML from a URL
 * (GOTRUE_MAILER_TEMPLATES_* in deploy/supabase/docker-compose.mtg.yml,
 * through the templates-server proxy). This serves the wording staff
 * edit in Admin -> Email Templates as a Go template: the only template
 * actions in the output are the button's link, which auth fills in.
 * If this can't be reached, the proxy falls back to the static files in
 * deploy/supabase/templates/.
 */
export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const auth = AUTH_TEMPLATE_FILES[file];
  if (!auth) return new Response("Not found", { status: 404 });

  const template = await getEmailTemplate(auth.key);
  const marker = "MTG_AUTH_BUTTON_7f3c";
  const html = renderBody(template.body, {}, { [auth.button]: marker })
    // Nothing staff typed may become a template action.
    .replace(/\{\{/g, "&#123;&#123;")
    .replace(/\}\}/g, "&#125;&#125;")
    .replace(marker, `<p style="margin:28px 0">${buttonHtml("HREF_MARKER", auth.label, "#0284c7")}</p>`)
    .replace("HREF_MARKER", auth.href);

  return new Response(html, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" } });
}
