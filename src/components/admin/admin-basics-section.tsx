"use client";

import type { Dispatch, ReactNode, SetStateAction } from "react";

import type { NodeCoreInput, NodeStatus } from "@/lib/admin/node-actions";
import { NODE_STATUSES } from "@/lib/admin/node-status";

const FIELD_CLASS =
  "w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:border-maldives-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-maldives-500 focus-visible:ring-offset-1";

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Shared by every node-editing admin form: title/slug/summary/status,
 * with slug auto-derived from title until the admin edits it directly.
 * `children` lets a form append a type-specific field (e.g. ArticleForm's
 * CategoryPicker) inside the same "Basics" section. */
export function AdminBasicsSection({
  core,
  setCore,
  slugTouched,
  setSlugTouched,
  wasPublished,
  slugChanged,
  publishedNoun = "This",
  children,
}: {
  core: NodeCoreInput;
  setCore: Dispatch<SetStateAction<NodeCoreInput>>;
  slugTouched: boolean;
  setSlugTouched: (touched: boolean) => void;
  wasPublished: boolean | undefined;
  slugChanged: boolean;
  publishedNoun?: string;
  children?: ReactNode;
}) {
  return (
    <section className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-4">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Basics</h2>

      <label className="block text-sm">
        <span className="mb-1 block font-medium text-neutral-700">Title *</span>
        <input
          value={core.title}
          onChange={(e) => {
            const title = e.target.value;
            setCore((c) => ({ ...c, title, slug: slugTouched ? c.slug : slugify(title) }));
          }}
          className={FIELD_CLASS}
        />
      </label>

      <label className="block text-sm">
        <span className="mb-1 block font-medium text-neutral-700">Slug *</span>
        <input
          value={core.slug}
          onChange={(e) => {
            setSlugTouched(true);
            setCore((c) => ({ ...c, slug: e.target.value }));
          }}
          className={`${FIELD_CLASS} font-mono`}
        />
        {wasPublished && slugChanged && (
          <p className="mt-1 text-xs text-amber-600">
            {publishedNoun} published — changing the slug will break its current URL for anyone who already linked to it. No redirect is
            created automatically; add one in Redirects if needed.
          </p>
        )}
      </label>

      <label className="block text-sm">
        <span className="mb-1 block font-medium text-neutral-700">Summary</span>
        <textarea value={core.summary ?? ""} onChange={(e) => setCore((c) => ({ ...c, summary: e.target.value }))} rows={3} className={FIELD_CLASS} />
      </label>

      <label className="block text-sm">
        <span className="mb-1 block font-medium text-neutral-700">Status</span>
        <select
          value={core.status}
          onChange={(e) => setCore((c) => ({ ...c, status: e.target.value as NodeStatus }))}
          className="rounded-xl border border-neutral-300 px-3 py-2 text-sm"
        >
          {NODE_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>

      {children}
    </section>
  );
}
