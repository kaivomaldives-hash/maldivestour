"use client";

import { useMemo, useRef, useState, useTransition } from "react";

import { resetEmailTemplate, saveEmailTemplate } from "@/lib/admin/email-templates-actions";
import type { AdminEmailTemplateRow } from "@/lib/admin/email-templates-repository";
import type { EmailTemplateDefinition } from "@/lib/email-templates/definitions";
import { renderEmail } from "@/lib/email-templates/render";

const INPUT_CLASS =
  "w-full rounded-lg border border-neutral-300 px-2.5 py-1.5 text-sm focus:border-maldives-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-maldives-500 focus-visible:ring-offset-1";

export function EmailTemplateForm({ definition, row }: { definition: EmailTemplateDefinition; row: AdminEmailTemplateRow }) {
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState(row.subject);
  const [body, setBody] = useState(row.body);
  const [saved, setSaved] = useState(row.saved);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  const preview = useMemo(() => {
    const text: Record<string, string> = {};
    const html: Record<string, string> = {};
    for (const p of definition.placeholders) (p.block ? html : text)[p.name] = p.sample;
    return renderEmail({ subject, body }, { text, html });
  }, [definition, subject, body]);

  function insert(name: string, block?: boolean) {
    const area = bodyRef.current;
    const token = block ? `\n\n{{${name}}}\n\n` : `{{${name}}}`;
    const start = area?.selectionStart ?? body.length;
    const end = area?.selectionEnd ?? body.length;
    setBody(body.slice(0, start) + token + body.slice(end));
    requestAnimationFrame(() => {
      area?.focus();
      area?.setSelectionRange(start + token.length, start + token.length);
    });
  }

  function run(action: () => Promise<{ ok: boolean; error?: string }>, done: string, after?: () => void) {
    setError(null);
    setMessage(null);
    startTransition(async () => {
      const result = await action();
      if (!result.ok) return setError(result.error ?? "Failed.");
      after?.();
      setMessage(done);
    });
  }

  return (
    <div className="rounded-xl border border-neutral-200">
      <button type="button" onClick={() => setOpen(!open)} className="flex w-full items-start justify-between gap-3 p-4 text-left">
        <span>
          <span className="block text-sm font-semibold text-ocean-900">{definition.label}</span>
          <span className="mt-0.5 block text-xs text-neutral-500">{definition.description}</span>
        </span>
        <span className="shrink-0 text-xs text-neutral-500">{saved ? "Edited" : "Default"} {open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="grid gap-4 border-t border-neutral-200 p-4 lg:grid-cols-2">
          <div className="space-y-3">
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-neutral-500">Subject</span>
              <input value={subject} onChange={(e) => setSubject(e.target.value)} className={INPUT_CLASS} />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-neutral-500">Email text</span>
              <textarea ref={bodyRef} value={body} onChange={(e) => setBody(e.target.value)} rows={18} className={`${INPUT_CLASS} font-mono text-xs leading-5`} />
            </label>
            <p className="text-xs text-neutral-500">
              Leave a blank line between paragraphs. <code>## </code> at the start of a line makes a heading, <code>**text**</code> is bold, and{" "}
              <code>[text](https://…)</code> is a link.
            </p>
            <div>
              <span className="mb-1 block text-xs font-medium text-neutral-500">Insert a value (click)</span>
              <div className="flex flex-wrap gap-1.5">
                {definition.placeholders.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    title={p.description}
                    onClick={() => insert(p.name, p.block)}
                    className="rounded-full border border-neutral-300 px-2.5 py-1 font-mono text-xs text-neutral-700 hover:border-maldives-500 hover:text-maldives-600"
                  >
                    {`{{${p.name}}}`}
                  </button>
                ))}
              </div>
              <ul className="mt-2 space-y-0.5 text-xs text-neutral-500">
                {definition.placeholders.map((p) => (
                  <li key={p.name}>
                    <code>{`{{${p.name}}}`}</code>: {p.description}
                    {p.block ? " (on its own line)" : ""}
                  </li>
                ))}
              </ul>
            </div>

            {error && (
              <p role="alert" className="text-sm text-red-600">
                {error}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                disabled={isPending}
                onClick={() => run(() => saveEmailTemplate(definition.key, subject, body), "Saved — the next email uses this text.", () => setSaved(true))}
                className="rounded-full bg-maldives-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-ocean-800 disabled:opacity-50"
              >
                {isPending ? "Saving…" : "Save"}
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={() => {
                  if (!window.confirm("Go back to the original text for this email?")) return;
                  run(() => resetEmailTemplate(definition.key), "Back to the original text.", () => {
                    setSubject(definition.subject);
                    setBody(definition.body);
                    setSaved(false);
                  });
                }}
                className="rounded-full border border-neutral-300 px-4 py-1.5 text-sm text-neutral-700 hover:border-maldives-500 disabled:opacity-50"
              >
                Reset to original
              </button>
              {message && !isPending && <span className="text-xs text-neutral-500">{message}</span>}
            </div>
          </div>

          <div>
            <span className="mb-1 block text-xs font-medium text-neutral-500">Preview (sample details)</span>
            <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3">
              <p className="mb-2 text-sm">
                <span className="text-neutral-500">Subject:</span> <strong>{preview.subject}</strong>
              </p>
              <iframe title={`${definition.label} preview`} srcDoc={preview.html} sandbox="" className="h-[560px] w-full rounded-md border border-neutral-200 bg-white" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
