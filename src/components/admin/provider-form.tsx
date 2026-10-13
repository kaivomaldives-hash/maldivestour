"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { AdminBasicsSection } from "@/components/admin/admin-basics-section";
import { AdminSeoSection } from "@/components/admin/admin-seo-section";
import { Button } from "@/components/ui/button";
import type { NodeCoreInput } from "@/lib/admin/node-actions";
import { createProvider, updateProvider, type ProviderFieldsInput } from "@/lib/admin/providers-actions";

export interface ProviderFormInitial {
  id: string;
  core: NodeCoreInput;
  fields: ProviderFieldsInput;
}

const EMPTY_CORE: NodeCoreInput = { title: "", slug: "", summary: null, status: "draft", metaTitle: null, metaDescription: null };
const EMPTY_FIELDS: ProviderFieldsInput = {
  legalName: null,
  contactEmail: null,
  contactPhone: null,
  websiteUrl: null,
  licenseNumber: null,
  isVerified: false,
};

export function ProviderForm({ initial }: { initial?: ProviderFormInitial }) {
  const router = useRouter();
  const [core, setCore] = useState<NodeCoreInput>(initial?.core ?? EMPTY_CORE);
  const [fields, setFields] = useState<ProviderFieldsInput>(initial?.fields ?? EMPTY_FIELDS);
  const [slugTouched, setSlugTouched] = useState(Boolean(initial));
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const wasPublished = initial?.core.status === "published";
  const slugChanged = initial ? core.slug !== initial.core.slug : false;

  function save() {
    setError(null);
    startTransition(async () => {
      const result = initial ? await updateProvider(initial.id, core, fields) : await createProvider(core, fields);
      if (!result.ok) {
        setError(result.error ?? "Something went wrong.");
        return;
      }
      router.push("/admin/providers");
      router.refresh();
    });
  }

  return (
    <div className="max-w-2xl space-y-6">
      <AdminBasicsSection
        core={core}
        setCore={setCore}
        slugTouched={slugTouched}
        setSlugTouched={setSlugTouched}
        wasPublished={wasPublished}
        slugChanged={slugChanged}
        publishedNoun="This provider"
      />

      <section className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Provider details</h2>

        <label className="block text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Legal name</span>
          <input
            value={fields.legalName ?? ""}
            onChange={(e) => setFields((f) => ({ ...f, legalName: e.target.value }))}
            className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:border-maldives-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-maldives-500 focus-visible:ring-offset-1"
          />
        </label>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-neutral-700">Contact email</span>
            <input
              type="email"
              value={fields.contactEmail ?? ""}
              onChange={(e) => setFields((f) => ({ ...f, contactEmail: e.target.value }))}
              className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:border-maldives-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-maldives-500 focus-visible:ring-offset-1"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-neutral-700">Contact phone</span>
            <input
              value={fields.contactPhone ?? ""}
              onChange={(e) => setFields((f) => ({ ...f, contactPhone: e.target.value }))}
              className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:border-maldives-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-maldives-500 focus-visible:ring-offset-1"
            />
          </label>
        </div>

        <label className="block text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Website URL</span>
          <input
            value={fields.websiteUrl ?? ""}
            onChange={(e) => setFields((f) => ({ ...f, websiteUrl: e.target.value }))}
            className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:border-maldives-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-maldives-500 focus-visible:ring-offset-1"
          />
        </label>

        <label className="block text-sm">
          <span className="mb-1 block font-medium text-neutral-700">License number</span>
          <input
            value={fields.licenseNumber ?? ""}
            onChange={(e) => setFields((f) => ({ ...f, licenseNumber: e.target.value }))}
            className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:border-maldives-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-maldives-500 focus-visible:ring-offset-1"
          />
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={fields.isVerified} onChange={(e) => setFields((f) => ({ ...f, isVerified: e.target.checked }))} />
          <span className="font-medium text-neutral-700">Verified</span>
        </label>
      </section>

      <AdminSeoSection core={core} setCore={setCore} />

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <Button onClick={save} disabled={isPending}>
        {isPending ? "Saving…" : initial ? "Save changes" : "Create provider"}
      </Button>
    </div>
  );
}
