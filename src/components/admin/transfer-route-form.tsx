"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { AdminBasicsSection } from "@/components/admin/admin-basics-section";
import { AdminSeoSection } from "@/components/admin/admin-seo-section";
import { CategoryPicker } from "@/components/admin/category-picker";
import { DeleteNodeButton } from "@/components/admin/delete-node-button";
import { LocationPicker } from "@/components/admin/location-picker";
import { NodeMediaManager } from "@/components/admin/node-media-manager";
import { TransferServicesManager } from "@/components/admin/transfer-services-manager";
import { Button } from "@/components/ui/button";
import type { NodeCoreInput } from "@/lib/admin/node-actions";
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
  // Set the instant a fresh create succeeds, so Images/Services can appear
  // in place without waiting on navigation to the edit page (Task 23).
  const [createdId, setCreatedId] = useState<string | null>(null);
  const nodeId = initial?.id ?? createdId;

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
      const result = nodeId ? await updateTransferRoute(nodeId, core, mergedFields) : await createTransferRoute(core, mergedFields);
      if (!result.ok) {
        setError(result.error ?? "Something went wrong.");
        return;
      }
      const id = nodeId ?? (result as { id?: string }).id;
      if (id) {
        await setNodeCategories(id, categoryIds, `/admin/transfers/${id}`);
      }
      if (id && !nodeId) {
        setCreatedId(id);
        router.replace(`/admin/transfers/${id}`);
      } else {
        router.push("/admin/transfers");
      }
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
      />

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

      <AdminSeoSection core={core} setCore={setCore} />

      {nodeId ? (
        <NodeMediaManager nodeId={nodeId} items={initial?.media ?? []} revalidatePath={`/admin/transfers/${nodeId}`} />
      ) : (
        <p className="text-sm text-neutral-500">Save the route first — you can add images right after.</p>
      )}

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <Button onClick={save} disabled={isPending}>
          {isPending ? "Saving…" : nodeId ? "Save changes" : "Create route"}
        </Button>
        {nodeId && <DeleteNodeButton nodeId={nodeId} redirectTo="/admin/transfers" />}
      </div>

      {nodeId && <TransferServicesManager routeId={nodeId} services={initial?.services ?? []} providerOptions={providerOptions} />}
    </div>
  );
}
