"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { createRedirect } from "@/lib/admin/redirects-actions";

const INPUT_CLASS =
  "w-full rounded-xl border border-neutral-300 px-3 py-2 font-mono text-xs focus:border-maldives-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-maldives-500 focus-visible:ring-offset-1";

export function RedirectCreateForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  return (
    <form
      className="mt-6 rounded-2xl border border-neutral-200 bg-white p-5"
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        const form = e.currentTarget;
        const data = new FormData(form);
        const source = String(data.get("source") ?? "");
        const target = String(data.get("target") ?? "");

        startTransition(async () => {
          const result = await createRedirect({
            source,
            target,
            statusCode: Number(data.get("statusCode") ?? 301),
            notes: String(data.get("notes") ?? ""),
          });
          if (!result.ok) {
            setError(result.error ?? "Failed to create the redirect.");
            return;
          }
          const repointed = result.repointed ?? [];
          setSuccess(
            `Redirect added — live on the site within about a minute.${
              repointed.length > 0 ? ` Also repointed ${repointed.length} older redirect${repointed.length === 1 ? "" : "s"} (${repointed.join(", ")}) straight to the new URL, to avoid a redirect chain.` : ""
            }`,
          );
          form.reset();
          router.refresh();
        });
      }}
    >
      <h2 className="text-base font-semibold text-ocean-900">Add a redirect</h2>
      <p className="mt-1 text-xs text-neutral-500">Paste a path or a full URL on this site for each — e.g. /maldives/transfers/old-slug/</p>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <label className="text-sm">
          <span className="mb-1 block font-medium text-neutral-700">From (old URL)</span>
          <input name="source" required placeholder="/maldives/transfers/old-slug/" className={INPUT_CLASS} />
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-medium text-neutral-700">To (new URL)</span>
          <input name="target" required placeholder="/maldives/transfers/new-slug/" className={INPUT_CLASS} />
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Type</span>
          <select name="statusCode" defaultValue="301" className="rounded-xl border border-neutral-300 px-3 py-2 text-sm">
            <option value="301">301 — permanent (recommended)</option>
            <option value="302">302 — temporary</option>
            <option value="308">308 — permanent, keeps method</option>
          </select>
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Notes (optional)</span>
          <input name="notes" placeholder="Why this redirect exists" className={INPUT_CLASS.replace("font-mono text-xs", "text-sm")} />
        </label>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <Button type="submit" size="sm" disabled={isPending}>
          {isPending ? "Adding…" : "Add redirect"}
        </Button>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && <p className="text-sm text-maldives-600">{success}</p>}
      </div>
    </form>
  );
}
