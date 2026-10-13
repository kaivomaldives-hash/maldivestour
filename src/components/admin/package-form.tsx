"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { AdminBasicsSection } from "@/components/admin/admin-basics-section";
import { AdminSeoSection } from "@/components/admin/admin-seo-section";
import { CategoryPicker } from "@/components/admin/category-picker";
import { DeleteNodeButton } from "@/components/admin/delete-node-button";
import { LocationPicker } from "@/components/admin/location-picker";
import { NodeMediaManager } from "@/components/admin/node-media-manager";
import { PackageItineraryEditor } from "@/components/admin/package-itinerary-editor";
import { Button } from "@/components/ui/button";
import type { NodeCoreInput } from "@/lib/admin/node-actions";
import { setNodeCategories, setPrimaryLocation } from "@/lib/admin/node-relations-actions";
import type { CategoryOption, LocationOption } from "@/lib/admin/node-relations-repository";
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
  primaryLocation: LocationOption | null;
  travelerTypeIds: string[];
  styleIds: string[];
  themeIds: string[];
}

export interface PackageCategoryOptions {
  travelerType: CategoryOption[];
  style: CategoryOption[];
  theme: CategoryOption[];
}

const EMPTY_CORE: NodeCoreInput = { title: "", slug: "", summary: null, status: "draft", metaTitle: null, metaDescription: null };
const EMPTY_FIELDS: PackageFieldsAdmin = { durationNights: null, priceFrom: null, currency: "USD", operatedByProviderId: null, videoYoutubeId: null };

export function PackageForm({
  initial,
  providerOptions,
  categoryOptions,
}: {
  initial?: PackageFormInitial;
  providerOptions: ProviderOption[];
  categoryOptions: PackageCategoryOptions;
}) {
  const router = useRouter();
  const [core, setCore] = useState<NodeCoreInput>(initial?.core ?? EMPTY_CORE);
  const [fields, setFields] = useState<PackageFieldsAdmin>(initial?.fields ?? EMPTY_FIELDS);
  const [location, setLocation] = useState<LocationOption | null>(initial?.primaryLocation ?? null);
  const [travelerTypeIds, setTravelerTypeIds] = useState<string[]>(initial?.travelerTypeIds ?? []);
  const [styleIds, setStyleIds] = useState<string[]>(initial?.styleIds ?? []);
  const [themeIds, setThemeIds] = useState<string[]>(initial?.themeIds ?? []);
  const [slugTouched, setSlugTouched] = useState(Boolean(initial));
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  // Set the instant a fresh create succeeds, so Images/Itinerary can appear
  // in place without waiting on navigation to the edit page (Task 23).
  const [createdId, setCreatedId] = useState<string | null>(null);
  const nodeId = initial?.id ?? createdId;

  const wasPublished = initial?.core.status === "published";
  const slugChanged = initial ? core.slug !== initial.core.slug : false;

  function save() {
    setError(null);
    startTransition(async () => {
      const result = nodeId ? await updatePackage(nodeId, core, fields) : await createPackage(core, fields);
      if (!result.ok) {
        setError(result.error ?? "Something went wrong.");
        return;
      }
      const id = nodeId ?? (result as { id?: string }).id;
      if (id) {
        const revalidateAt = `/admin/packages/${id}`;
        await setPrimaryLocation(id, location?.id ?? null, revalidateAt);
        // setNodeCategories() is a no-op on an empty array (it can't tell
        // which group to clear with nothing to resolve it from — see its
        // own comment), so a group the admin has cleared to zero tags
        // simply keeps whatever it last had. Acceptable here: clearing a
        // package's last traveler-type/style/theme tag entirely is rare,
        // and this matches every other per-group picker in this codebase.
        await Promise.all([
          setNodeCategories(id, travelerTypeIds, revalidateAt),
          setNodeCategories(id, styleIds, revalidateAt),
          setNodeCategories(id, themeIds, revalidateAt),
        ]);
      }
      if (id && !nodeId) {
        setCreatedId(id);
        router.replace(`/admin/packages/${id}`);
      } else {
        router.push("/admin/packages");
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
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Destination & categories</h2>
        <p className="text-xs text-neutral-500">
          These drive the public filters (location, category chips) on the package directory — a package with none of these set won&rsquo;t show up when
          a visitor filters by atoll or category. The itinerary below can add further destinations automatically; this primary location is the one used
          for the atoll filter.
        </p>

        <LocationPicker value={location} onChange={setLocation} />
        <CategoryPicker label="Traveler type" options={categoryOptions.travelerType} selectedIds={travelerTypeIds} onChange={setTravelerTypeIds} />
        <CategoryPicker label="Style" options={categoryOptions.style} selectedIds={styleIds} onChange={setStyleIds} />
        <CategoryPicker label="Theme" options={categoryOptions.theme} selectedIds={themeIds} onChange={setThemeIds} />
      </section>

      <section className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Pricing & operator</h2>

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

      <AdminSeoSection core={core} setCore={setCore} />

      {nodeId ? (
        <NodeMediaManager nodeId={nodeId} items={initial?.media ?? []} revalidatePath={`/admin/packages/${nodeId}`} />
      ) : (
        <p className="text-sm text-neutral-500">Save the package first — you can add images right after.</p>
      )}

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <Button onClick={save} disabled={isPending}>
          {isPending ? "Saving…" : nodeId ? "Save changes" : "Create package"}
        </Button>
        {nodeId && <DeleteNodeButton nodeId={nodeId} redirectTo="/admin/packages" />}
      </div>

      {nodeId && <PackageItineraryEditor packageId={nodeId} stages={initial?.itineraryStages ?? []} />}
    </div>
  );
}
