"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { AdminBasicsSection } from "@/components/admin/admin-basics-section";
import { AdminPricingVideoSection } from "@/components/admin/admin-pricing-video-section";
import { AdminSeoSection } from "@/components/admin/admin-seo-section";
import { DeleteNodeButton } from "@/components/admin/delete-node-button";
import { LocationPicker } from "@/components/admin/location-picker";
import { NodeMediaManager } from "@/components/admin/node-media-manager";
import { Button } from "@/components/ui/button";
import type { AccommodationFieldsAdmin } from "@/lib/admin/accommodations-repository";
import { createAccommodation, updateAccommodation } from "@/lib/admin/accommodations-actions";
import type { NodeCoreInput } from "@/lib/admin/node-actions";
import { setPrimaryLocation } from "@/lib/admin/node-relations-actions";
import type { LocationOption } from "@/lib/admin/node-relations-repository";
import type { AccommodationType, PriceTier } from "@/lib/accommodations/types";
import type { NodeMediaItem } from "@/lib/media/types";
import type { ProviderOption } from "@/lib/admin/providers-repository";

const ACCOMMODATION_TYPES: AccommodationType[] = ["hotel", "resort", "guesthouse", "villa", "liveaboard", "other"];
const PRICE_TIERS: PriceTier[] = ["budget", "mid", "luxury", "ultra_luxury"];

export interface AccommodationFormInitial {
  id: string;
  core: NodeCoreInput;
  fields: AccommodationFieldsAdmin;
  primaryLocation: LocationOption | null;
  media: NodeMediaItem[];
}

const EMPTY_CORE: NodeCoreInput = { title: "", slug: "", summary: null, status: "draft", metaTitle: null, metaDescription: null };
const EMPTY_FIELDS: AccommodationFieldsAdmin = {
  accommodationType: "resort",
  starRating: null,
  priceTier: null,
  roomCount: null,
  allInclusive: false,
  overwaterVillas: false,
  checkInTime: null,
  checkOutTime: null,
  currency: "USD",
  operatedByProviderId: null,
  priceFrom: null,
  videoYoutubeId: null,
};

export function AccommodationForm({ initial, providerOptions }: { initial?: AccommodationFormInitial; providerOptions: ProviderOption[] }) {
  const router = useRouter();
  const [core, setCore] = useState<NodeCoreInput>(initial?.core ?? EMPTY_CORE);
  const [fields, setFields] = useState<AccommodationFieldsAdmin>(initial?.fields ?? EMPTY_FIELDS);
  const [location, setLocation] = useState<LocationOption | null>(initial?.primaryLocation ?? null);
  const [slugTouched, setSlugTouched] = useState(Boolean(initial));
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  // Set the instant a fresh create succeeds, so Images can appear in place
  // without waiting on navigation to the edit page (Task 23).
  const [createdId, setCreatedId] = useState<string | null>(null);
  const nodeId = initial?.id ?? createdId;

  const wasPublished = initial?.core.status === "published";
  const slugChanged = initial ? core.slug !== initial.core.slug : false;

  function save() {
    setError(null);
    startTransition(async () => {
      const result = nodeId ? await updateAccommodation(nodeId, core, fields) : await createAccommodation(core, fields);
      if (!result.ok) {
        setError(result.error ?? "Something went wrong.");
        return;
      }
      const id = nodeId ?? (result as { id?: string }).id;
      if (id) {
        await setPrimaryLocation(id, location?.id ?? null, `/admin/accommodations/${id}`);
      }
      if (id && !nodeId) {
        setCreatedId(id);
        router.replace(`/admin/accommodations/${id}`);
      } else {
        router.push("/admin/accommodations");
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
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Type & details</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-neutral-700">Type</span>
            <select
              value={fields.accommodationType}
              onChange={(e) => setFields((f) => ({ ...f, accommodationType: e.target.value as AccommodationType }))}
              className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
            >
              {ACCOMMODATION_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm">
            <span className="mb-1 block font-medium text-neutral-700">Operated by</span>
            <select
              value={fields.operatedByProviderId ?? ""}
              onChange={(e) => setFields((f) => ({ ...f, operatedByProviderId: e.target.value || null }))}
              className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
            >
              <option value="">— None —</option>
              {providerOptions.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm">
            <span className="mb-1 block font-medium text-neutral-700">Star rating</span>
            <select
              value={fields.starRating ?? ""}
              onChange={(e) => setFields((f) => ({ ...f, starRating: e.target.value ? Number(e.target.value) : null }))}
              className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
            >
              <option value="">—</option>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}★
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm">
            <span className="mb-1 block font-medium text-neutral-700">Price tier</span>
            <select
              value={fields.priceTier ?? ""}
              onChange={(e) => setFields((f) => ({ ...f, priceTier: (e.target.value || null) as PriceTier | null }))}
              className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
            >
              <option value="">—</option>
              {PRICE_TIERS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm">
            <span className="mb-1 block font-medium text-neutral-700">Room count</span>
            <input
              type="number"
              min={0}
              value={fields.roomCount ?? ""}
              onChange={(e) => setFields((f) => ({ ...f, roomCount: e.target.value ? Number(e.target.value) : null }))}
              className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
            />
          </label>

          <label className="block text-sm">
            <span className="mb-1 block font-medium text-neutral-700">Check-in time</span>
            <input
              type="time"
              value={fields.checkInTime ?? ""}
              onChange={(e) => setFields((f) => ({ ...f, checkInTime: e.target.value || null }))}
              className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
            />
          </label>

          <label className="block text-sm">
            <span className="mb-1 block font-medium text-neutral-700">Check-out time</span>
            <input
              type="time"
              value={fields.checkOutTime ?? ""}
              onChange={(e) => setFields((f) => ({ ...f, checkOutTime: e.target.value || null }))}
              className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
            />
          </label>
        </div>

        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={fields.allInclusive} onChange={(e) => setFields((f) => ({ ...f, allInclusive: e.target.checked }))} />
            <span className="font-medium text-neutral-700">All-inclusive</span>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={fields.overwaterVillas} onChange={(e) => setFields((f) => ({ ...f, overwaterVillas: e.target.checked }))} />
            <span className="font-medium text-neutral-700">Overwater villas</span>
          </label>
        </div>

        <LocationPicker value={location} onChange={setLocation} />
      </section>

      <AdminPricingVideoSection
        fields={fields}
        setFields={setFields}
        note={
          <p className="text-xs text-neutral-500">
            &ldquo;From&rdquo; price shown on listing cards only — never a guaranteed live rate on the property&rsquo;s own page. Individual room/villa
            rates aren&rsquo;t editable here yet; that&rsquo;s a separate follow-up.
          </p>
        }
      />

      <AdminSeoSection core={core} setCore={setCore} />

      {nodeId ? (
        <NodeMediaManager nodeId={nodeId} items={initial?.media ?? []} revalidatePath={`/admin/accommodations/${nodeId}`} />
      ) : (
        <p className="text-sm text-neutral-500">Save the accommodation first — you can add images right after.</p>
      )}

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <Button onClick={save} disabled={isPending}>
          {isPending ? "Saving…" : nodeId ? "Save changes" : "Create accommodation"}
        </Button>
        {nodeId && <DeleteNodeButton nodeId={nodeId} redirectTo="/admin/accommodations" />}
      </div>
    </div>
  );
}
