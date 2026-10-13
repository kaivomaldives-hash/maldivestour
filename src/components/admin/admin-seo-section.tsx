"use client";

import type { Dispatch, SetStateAction } from "react";

import type { NodeCoreInput } from "@/lib/admin/node-actions";

const FIELD_CLASS =
  "w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:border-maldives-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-maldives-500 focus-visible:ring-offset-1";

/** Shared by every node-editing admin form: the meta title/description
 * fields that feed the public page's <title> and <meta name="description">
 * (see each node type's generateMetadata). */
export function AdminSeoSection({ core, setCore }: { core: NodeCoreInput; setCore: Dispatch<SetStateAction<NodeCoreInput>> }) {
  return (
    <section className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-4">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">SEO</h2>
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-neutral-700">Meta title</span>
        <input value={core.metaTitle ?? ""} onChange={(e) => setCore((c) => ({ ...c, metaTitle: e.target.value }))} className={FIELD_CLASS} />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-neutral-700">Meta description</span>
        <textarea
          value={core.metaDescription ?? ""}
          onChange={(e) => setCore((c) => ({ ...c, metaDescription: e.target.value }))}
          rows={2}
          className={FIELD_CLASS}
        />
      </label>
    </section>
  );
}
