"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { CategoryPicker } from "@/components/admin/category-picker";
import { DeleteNodeButton } from "@/components/admin/delete-node-button";
import { LocationPicker } from "@/components/admin/location-picker";
import { NodeMediaManager } from "@/components/admin/node-media-manager";
import { TransferServicesManager } from "@/components/admin/transfer-services-manager";
import { Button } from "@/components/ui/button";
import type { NodeCoreInput, NodeStatus } from "@/lib/admin/node-actions";
import { NODE_STATUSES } from "@/lib/admin/node-status";
import { setNodeCategories } from "@/lib/admin/node-relations-actions";
import type { CategoryOption, LocationOption } from "@/lib/admin/node-relations-repository";
import type { AdminTransferServiceItem } from "@/lib/admin/transfers-repository";
import { createTransferRoute, updateTransferRoute } from "@/lib/admin/transfers-actions";
import type { TransferRouteFieldsAdmin } from "@/lib/admin/transfers-repository";
import type { NodeMediaItem } from "@/lib/media/types";
import type { ProviderOption } from "@/lib/admin/providers-repository";

export interface TransferRouteFormInitial {
  id: string;
  core: NodeCoreInput;
  fields: TransferRouteFieldsAdmin;
  originLocation: LocationOption | null;
  destinationLocation: LocationOption | null;
  media: NodeMediaItem[];
  services: AdminTransferServiceItem[];
  categoryIds: string[];
}

const EMPTY_CORE: NodeCoreInput = { title: "", slug: "", summary: null, status: "draft", metaTitle: null, metaDescription: null };
const EMPTY_FIELDS: TransferRouteFieldsAdmin = {
  originLocationId: "",
  destinationLocationId: "",
  distanceKm: null,
  typicalDurationMinutes: null,
  videoYoutubeId: null,
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function TransferRouteForm({
  initial,
  providerOptions,
  categoryOptions,
}: {
  initial?: TransferRouteFormInitial;
  providerOptions: ProviderOption[];
  categoryOptions: CategoryOption[];
}) {
  const router = useRouter();
  const [core, setCore] = useState<NodeCoreInput>(initial?.core ?? EMPTY_CORE);
  const [fields, setFields] = useState<TransferRouteFieldsAdmin>(initial?.fields ?? EMPTY_FIELDS);
  const [origin, setOrigin] = useState<LocationOption | null>(initial?.originLocation ?? null);
  const [destination, setDestination] = useState<LocationOption | null>(initial?.destinationLocation ?? null);
  const [categoryIds, setCategoryIds] = useState<string[]>(initial?.categoryIds ?? []);
  const [slugTouched, setSlugTouched] = useState(Boolean(initial));
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const wasPublished = initial?.core.status === "published";
  const slugChanged = initial ? core.slug !== initial.core.slug : false;

  function save() {
    setError(null);
    if (!origin || !destination) {
      setError("Origin and destination are both required.");
      return;
    }
    const mergedFields: TransferRouteFieldsAdmin = { ...fields, originLocationId: origin.id, destinationLocationId: destination.id };
    startTransition(async () => {
      const result = initial ? await updateTransferRoute(initial.id, core, mergedFields) : await createTransferRoute(core, mergedFields);
      if (!result.ok) {
        setError(result.error ?? "Something went wrong.");
        return;
      }
      const id = initial?.id ?? (result as { id?: string }).id;
      if (id) {
        await setNodeCategories(id, categoryIds, `/admin/transfers/${id}`);
      }
      if (initial) {
        router.push("/admin/transfers");
        router.refresh();
      } else {
        router.push(id ? `/admin/transfers/${id}` : "/admin/transfers");
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
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Route</h2>
        <p className="text-xs text-neutral-500">This is the directional origin → destination pair (a return trip is a separate route, never inferred).</p>

        <LocationPicker value={origin} onChange={setOrigin} label="Origin *" />
        <LocationPicker value={destination} onChange={setDestination} label="Destination *" />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-neutral-700">Distance (km)</span>
            <input
              type="number"
              min={0}
              step="0.01"
              value={fields.distanceKm ?? ""}
              onChange={(e) => setFields((f) => ({ ...f, distanceKm: e.target.value ? Number(e.target.value) : null }))}
              className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-neutral-700">Typical duration (minutes)</span>
            <input
              type="number"
              min={0}
              value={fields.typicalDurationMinutes ?? ""}
              onChange={(e) => setFields((f) => ({ ...f, typicalDurationMinutes: e.target.value ? Number(e.target.value) : null }))}
              className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-sm sm:col-span-2">
            <span className="mb-1 block font-medium text-neutral-700">YouTube video ID</span>
            <input
              value={fields.videoYoutubeId ?? ""}
              onChange={(e) => setFields((f) => ({ ...f, videoYoutubeId: e.target.value || null }))}
              placeholder="e.g. CZGxcfCXJz0"
              className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
            />
          </label>
        </div>

        <CategoryPicker label="Category (drives the airport/resort/hotel/island directory filters)" options={categoryOptions} selectedIds={categoryIds} onChange={setCategoryIds} />
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

      {initial && <NodeMediaManager nodeId={initial.id} items={initial.media} revalidatePath={`/admin/transfers/${initial.id}`} />}

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <Button onClick={save} disabled={isPending}>
          {isPending ? "Saving…" : initial ? "Save changes" : "Create route"}
        </Button>
        {initial && <DeleteNodeButton nodeId={initial.id} redirectTo="/admin/transfers" />}
      </div>

      {initial && <TransferServicesManager routeId={initial.id} services={initial.services} providerOptions={providerOptions} />}
    </div>
  );
}
