"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { resetEmailTemplate, saveEmailTemplate, sendTestEmail, type TemplateActionResult } from "@/lib/email-templates/actions";
import { getTemplateDef } from "@/lib/email-templates/registry";
import { renderBody, renderSubject } from "@/lib/email-templates/render";

const INPUT_CLASS =
  "w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:border-maldives-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-maldives-500 focus-visible:ring-offset-1";

export function EmailTemplateEditor({
  templateKey,
  initialSubject,
  initialBody,
  customized,
}: {
  templateKey: string;
  initialSubject: string;
  initialBody: string;
  customized: boolean;
}) {
  const def = getTemplateDef(templateKey)!;
  const router = useRouter();
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const [subject, setSubject] = useState(initialSubject);
  const [body, setBody] = useState(initialBody);
  const [result, setResult] = useState<TemplateActionResult | null>(null);
  const [isPending, startTransition] = useTransition();
  const subjectEditable = def.defaultSubject !== null;
  const dirty = subject !== initialSubject || body !== initialBody;

  function run(action: () => Promise<TemplateActionResult>, refresh = false) {
    setResult(null);
    startTransition(async () => {
      const r = await action();
      setResult(r);
      if (r.ok && refresh) router.refresh();
    });
  }

  function insert(name: string, block?: boolean) {
    const el = bodyRef.current;
    const token = `{{${name}}}`;
    if (!el) return setBody((b) => `${b}${token}`);
    const start = el.selectionStart ?? body.length;
    const end = el.selectionEnd ?? body.length;
    const text = block ? `\n\n${token}\n\n` : token;
    const next = body.slice(0, start) + text + body.slice(end);
    setBody(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + text.length, start + text.length);
    });
  }

  const previewSubject = renderSubject(subjectEditable ? subject : (def.fixedSubject ?? ""), def.sample);
  const previewHtml = renderBody(body, def.sample, def.sampleBlocks);

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <div className="space-y-4">
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Subject</span>
          {subjectEditable ? (
            <input value={subject} onChange={(e) => setSubject(e.target.value)} maxLength={300} className={INPUT_CLASS} />
          ) : (
            <>
              <input value={def.fixedSubject ?? ""} disabled className={`${INPUT_CLASS} bg-neutral-50 text-neutral-500`} />
              <span className="mt-1 block text-xs text-neutral-500">The subject of sign-in emails is set on the server. Ask your developer to change it.</span>
            </>
          )}
        </label>

        <label className="block text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Email text</span>
          <textarea ref={bodyRef} value={body} onChange={(e) => setBody(e.target.value)} rows={22} className={`${INPUT_CLASS} font-mono text-[13px] leading-relaxed`} />
        </label>

        <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-xs text-neutral-600">
          <p className="font-medium text-neutral-800">Details you can insert (click to add)</p>
          <ul className="mt-2 space-y-1">
            {def.placeholders.map((p) => (
              <li key={p.name}>
                <button type="button" onClick={() => insert(p.name, p.block)} className="rounded bg-white px-1.5 py-0.5 font-mono text-maldives-700 ring-1 ring-neutral-200 hover:ring-maldives-400">
                  {`{{${p.name}}}`}
                </button>{" "}
                {p.description}
                {p.block && <span className="text-neutral-400"> (keep on its own line)</span>}
              </li>
            ))}
          </ul>
          <p className="mt-3 font-medium text-neutral-800">Formatting</p>
          <p className="mt-1">
            Leave a blank line between paragraphs. <code>**bold**</code> for bold. A line starting with <code>## </code> is a heading, and a paragraph starting with <code>&gt; </code>{" "}
            is small grey text. Web addresses become links automatically.
          </p>
        </div>

        {result && (
          <p role={result.ok ? "status" : "alert"} className={`text-sm ${result.ok ? "text-maldives-700" : "text-red-600"}`}>
            {result.ok ? result.message : result.error}
          </p>
        )}

        <div className="flex flex-wrap gap-3">
          <Button type="button" disabled={isPending || !dirty} onClick={() => run(() => saveEmailTemplate({ key: templateKey, subject: subjectEditable ? subject : null, body }), true)}>
            {isPending ? "Working…" : "Save"}
          </Button>
          <Button type="button" variant="secondary" disabled={isPending} onClick={() => run(() => sendTestEmail({ key: templateKey, subject: subjectEditable ? subject : null, body }))}>
            Send me a test email
          </Button>
          {customized && (
            <Button
              type="button"
              variant="secondary"
              disabled={isPending}
              onClick={() => {
                if (!window.confirm("Go back to the original text? Your changes to this email will be lost.")) return;
                setSubject(def.defaultSubject ?? def.fixedSubject ?? "");
                setBody(def.defaultBody);
                run(() => resetEmailTemplate(templateKey), true);
              }}
            >
              Reset to original
            </Button>
          )}
          {!customized && dirty && (
            <Button
              type="button"
              variant="secondary"
              disabled={isPending}
              onClick={() => {
                setSubject(initialSubject);
                setBody(initialBody);
              }}
            >
              Undo changes
            </Button>
          )}
        </div>
      </div>

      <div>
        <p className="mb-1 text-sm font-medium text-neutral-700">Preview (with example details)</p>
        <div className="rounded-2xl border border-neutral-200 bg-white">
          <p className="border-b border-neutral-200 px-4 py-3 text-sm">
            <span className="text-neutral-500">Subject:</span> <span className="font-medium text-neutral-900">{previewSubject}</span>
          </p>
          <iframe title="Email preview" srcDoc={previewHtml} sandbox="" className="h-[640px] w-full rounded-b-2xl" />
        </div>
      </div>
    </div>
  );
}
