"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { DeleteNodeButton } from "@/components/admin/delete-node-button";
import { NodeMediaManager } from "@/components/admin/node-media-manager";
import { PackageItineraryEditor } from "@/components/admin/package-itinerary-editor";
import { Button } from "@/components/ui/button";
import type { NodeCoreInput, NodeStatus } from "@/lib/admin/node-actions";
import { NODE_STATUSES } from "@/lib/admin/node-status";
import type { AdminItineraryStage, PackageFieldsAdmin } from "@/lib/admin/packages-repository";
import { createPackage, updatePackage } from "@/lib/admin/packages-actions";
import type { NodeMediaItem } from "@/lib/media/types";
import type { ProviderOption } from "@/lib/admin/providers-repository";

export interface PackageFormInitial {
  id: string;
  core: NodeCoreInput;
  fields: PackageFieldsAdmin;
  media: NodeMediaItem[];
  itineraryStages: AdminItineraryStage[];
}

const EMPTY_CORE: NodeCoreInput = { title: "", slug: "", summary: null, status: "draft", metaTitle: null, metaDescription: null };
const EMPTY_FIELDS: PackageFieldsAdmin = { durationNights: null, priceFrom: null, currency: "USD", operatedByProviderId: null, videoYoutubeId: null };

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function PackageForm({ initial, providerOptions }: { initial?: PackageFormInitial; providerOptions: ProviderOption[] }) {
  const router = useRouter();
  const [core, setCore] = useState<NodeCoreInput>(initial?.core ?? EMPTY_CORE);
  const [fields, setFields] = useState<PackageFieldsAdmin>(initial?.fields ?? EMPTY_FIELDS);
  const [slugTouched, setSlugTouched] = useState(Boolean(initial));
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const wasPublished = initial?.core.status === "published";
  const slugChanged = initial ? core.slug !== initial.core.slug : false;

  function save() {
    setError(null);
    startTransition(async () => {
      const result = initial ? await updatePackage(initial.id, core, fields) : await createPackage(core, fields);
      if (!result.ok) {
        setError(result.error ?? "Something went wrong.");
        return;
      }
      if (initial) {
        router.push("/admin/packages");
        router.refresh();
      } else {
        const id = (result as { id?: string }).id;
        router.push(id ? `/admin/packages/${id}` : "/admin/packages");
        router.refresh();
      }
    });
  }

  return (
    <div className="max-w-2xl space-y-6">
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
            className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:border-maldives-500 focus:outline-none"
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
            className="w-full rounded-xl border border-neutral-300 px-3 py-2 font-mono text-sm focus:border-maldives-500 focus:outline-none"
          />
          {wasPublished && slugChanged && (
            <p className="mt-1 text-xs text-amber-600">
              This is published — changing the slug will break its current URL for anyone who already linked to it. No redirect is created
              automatically; add one in Redirects if needed.
            </p>
          )}
        </label>

        <label className="block text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Summary</span>
          <textarea
            value={core.summary ?? ""}
            onChange={(e) => setCore((c) => ({ ...c, summary: e.target.value }))}
            rows={3}
            className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:border-maldives-500 focus:outline-none"
          />
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
      </section>

      <section className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Pricing & operator</h2>
        <p className="text-xs text-neutral-500">
          Destinations shown on the public package card are derived from the itinerary below (which real islands/atolls it touches), not set here.
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-neutral-700">Duration (nights)</span>
            <input
              type="number"
              min={0}
              value={fields.durationNights ?? ""}
              onChange={(e) => setFields((f) => ({ ...f, durationNights: e.target.value ? Number(e.target.value) : null }))}
              className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
            />
          </label>

          <label className="block text-sm">
            <span className="mb-1 block font-medium text-neutral-700">Operated by</span>
            <select
              value={fields.operatedByProviderId ?? ""}
              onChange={(e) => setFields((f) => ({ ...f, operatedByProviderId: e.target.value || null }))}
              className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
            >
              <option value="">— MTG-curated (no operator) —</option>
              {providerOptions.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm">
            <span className="mb-1 block font-medium text-neutral-700">Price from</span>
            <input
              type="number"
              min={0}
              step="0.01"
              value={fields.priceFrom ?? ""}
              onChange={(e) => setFields((f) => ({ ...f, priceFrom: e.target.value ? Number(e.target.value) : null }))}
              className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
            />
          </label>

          <label className="block text-sm">
            <span className="mb-1 block font-medium text-neutral-700">Currency</span>
            <input
              value={fields.currency ?? ""}
              onChange={(e) => setFields((f) => ({ ...f, currency: e.target.value.toUpperCase() }))}
              maxLength={3}
              className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm uppercase"
            />
          </label>

          <label className="block text-sm">
            <span className="mb-1 block font-medium text-neutral-700">YouTube video ID</span>
            <input
              value={fields.videoYoutubeId ?? ""}
              onChange={(e) => setFields((f) => ({ ...f, videoYoutubeId: e.target.value || null }))}
              placeholder="e.g. CZGxcfCXJz0"
              className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
            />
          </label>
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">SEO</h2>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Meta title</span>
          <input
            value={core.metaTitle ?? ""}
            onChange={(e) => setCore((c) => ({ ...c, metaTitle: e.target.value }))}
            className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Meta description</span>
          <textarea
            value={core.metaDescription ?? ""}
            onChange={(e) => setCore((c) => ({ ...c, metaDescription: e.target.value }))}
            rows={2}
            className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
          />
        </label>
      </section>

      {initial && <NodeMediaManager nodeId={initial.id} items={initial.media} revalidatePath={`/admin/packages/${initial.id}`} />}

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <Button onClick={save} disabled={isPending}>
          {isPending ? "Saving…" : initial ? "Save changes" : "Create package"}
        </Button>
        {initial && <DeleteNodeButton nodeId={initial.id} redirectTo="/admin/packages" />}
      </div>

      {initial && <PackageItineraryEditor packageId={initial.id} stages={initial.itineraryStages} />}
    </div>
  );
}
