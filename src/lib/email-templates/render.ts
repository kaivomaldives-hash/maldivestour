// Turns an email template (subject + simple-markup body, see
// definitions.ts) into the email's subject line and HTML. Plain module:
// used by the senders and by the admin form's live preview.

export interface EmailTemplateValues {
  /** Plain-text values; escaped. */
  text?: Record<string, string | null | undefined>;
  /** Ready-made HTML sections; inserted as is. */
  html?: Record<string, string | null | undefined>;
}

function escape(value: string): string {
  const map: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  return value.replace(/[&<>"']/g, (c) => map[c]);
}

const PLACEHOLDER = /\{\{\s*([a-z_]+)\s*\}\}/g;

function fill(escapedText: string, values: EmailTemplateValues): string {
  return escapedText.replace(PLACEHOLDER, (whole, name: string) => {
    if (values.html && name in values.html) return values.html[name] ?? "";
    if (values.text && name in values.text) return escape(values.text[name] ?? "");
    return whole;
  });
}

function inline(line: string): string {
  return escape(line)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\[([^\]]+)\]\(((?:https?:\/\/|mailto:|\{\{)[^)\s]+)\)/g, '<a href="$2" style="color:#0e7aa4">$1</a>');
}

export function renderEmailSubject(subject: string, values: EmailTemplateValues): string {
  return subject.replace(PLACEHOLDER, (whole, name: string) => {
    if (values.text && name in values.text) return values.text[name] ?? "";
    return whole;
  });
}

export function renderEmailBody(body: string, values: EmailTemplateValues): string {
  const blocks = body.replace(/\r\n?/g, "\n").split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  const html = blocks.map((block) => {
    const only = /^\{\{\s*([a-z_]+)\s*\}\}$/.exec(block);
    if (only && values.html && only[1] in values.html) return values.html[only[1]] ?? "";

    const lines = block.split("\n");
    let heading = "";
    if (lines[0].startsWith("## ")) heading = `<h3 style="margin:20px 0 4px;font-size:17px;color:#0a2e42">${fill(inline(lines.shift()!.slice(3)), values)}</h3>`;
    const paragraph = lines.length ? `<p style="margin:0 0 14px">${lines.map((l) => fill(inline(l), values)).join("<br/>")}</p>` : "";
    return heading + paragraph;
  });
  return `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#0a2e42;max-width:600px">${html.join("\n")}</div>`;
}

export function renderEmail(template: { subject: string; body: string }, values: EmailTemplateValues): { subject: string; html: string } {
  return { subject: renderEmailSubject(template.subject, values), html: renderEmailBody(template.body, values) };
}
