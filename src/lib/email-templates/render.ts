/**
 * Turns an editable email body (plain text) into email HTML.
 *
 * Writing rules, shown to staff on the editor page:
 *   - A blank line starts a new paragraph; a single line break stays a line break.
 *   - A line starting with "## " is a heading.
 *   - A paragraph starting with "> " is a small grey note.
 *   - **text** is bold. Web addresses become links.
 *   - {{placeholder}} is replaced with the booking's details. Placeholders
 *     marked as blocks (boat details, buttons...) must sit on their own line.
 *
 * Pure and dependency-free, so the admin editor can preview with it too.
 */

export type TemplateValues = Record<string, string | null | undefined>;

const ESCAPES: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
export function escapeText(value: string): string {
  return value.replace(/[&<>"']/g, (c) => ESCAPES[c]);
}

const PLACEHOLDER = /\{\{\s*([a-z0-9_]+)\s*\}\}/g;

/** Subjects are plain text: placeholders filled in, nothing else. */
export function renderSubject(subject: string, values: TemplateValues): string {
  return subject.replace(PLACEHOLDER, (match, name: string) => (name in values ? (values[name] ?? "") : match)).replace(/\s+/g, " ").trim();
}

function inline(text: string, values: TemplateValues): string {
  let html = escapeText(text);
  html = html.replace(PLACEHOLDER, (match, name: string) => (name in values ? escapeText(values[name] ?? "") : match));
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/(^|[\s(])(https?:\/\/[^\s<)]+[^\s<).,!?;:])/g, '$1<a href="$2" style="color:#0e7aa4">$2</a>');
  return html.replace(/\n/g, "<br/>");
}

/**
 * `blocks` are ready-made HTML pieces (boat details, buttons) for
 * placeholders that sit alone on a line; an empty block drops the line.
 */
export function renderBody(body: string, values: TemplateValues, blocks: Record<string, string> = {}): string {
  const paragraphs = body.replace(/\r\n?/g, "\n").split(/\n\s*\n/);
  const out: string[] = [];

  for (const raw of paragraphs) {
    // Block placeholders inside a paragraph split it, so each block stands alone.
    const pieces = raw.split(/^[ \t]*(\{\{\s*[a-z0-9_]+\s*\}\})[ \t]*$/m);
    for (const piece of pieces) {
      const text = piece.replace(/^\n+|\n+$/g, "");
      if (!text.trim()) continue;
      const blockName = /^\{\{\s*([a-z0-9_]+)\s*\}\}$/.exec(text.trim())?.[1];
      if (blockName && blockName in blocks) {
        if (blocks[blockName]) out.push(blocks[blockName]);
        continue;
      }
      if (text.startsWith("## ")) {
        // Only the first line is the heading; lines under it are a paragraph.
        const [heading, ...rest] = text.split("\n");
        out.push(`<h3 style="margin:20px 0 4px;font-size:16px">${inline(heading.slice(3), values)}</h3>`);
        if (rest.join("").trim()) out.push(`<p>${inline(rest.join("\n"), values)}</p>`);
      } else if (text.startsWith("> ")) {
        out.push(`<p style="font-size:13px;color:#555">${inline(text.replace(/^> ?/gm, ""), values)}</p>`);
      } else {
        out.push(`<p>${inline(text, values)}</p>`);
      }
    }
  }

  return `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#0a2e42;max-width:560px">\n${out.join("\n")}\n</div>`;
}

/** A rounded link button, for block placeholders. */
export function buttonHtml(href: string, label: string, color = "#0e7aa4"): string {
  return `<a href="${escapeText(href)}" style="display:inline-block;margin:4px 8px 4px 0;padding:12px 20px;border-radius:999px;background:${color};color:#ffffff;font-weight:600;text-decoration:none">${escapeText(label)}</a>`;
}
