"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { DeleteNodeButton } from "@/components/admin/delete-node-button";
import { LocationPicker } from "@/components/admin/location-picker";
import { NodeMediaManager } from "@/components/admin/node-media-manager";
import { Button } from "@/components/ui/button";
import type { AccommodationFieldsAdmin } from "@/lib/admin/accommodations-repository";
import { createAccommodation, updateAccommodation } from "@/lib/admin/accommodations-actions";
import type { NodeCoreInput, NodeStatus } from "@/lib/admin/node-actions";
import { NODE_STATUSES } from "@/lib/admin/node-status";
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

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function AccommodationForm({ initial, providerOptions }: { initial?: AccommodationFormInitial; providerOptions: ProviderOption[] }) {
  const router = useRouter();
  const [core, setCore] = useState<NodeCoreInput>(initial?.core ?? EMPTY_CORE);
  const [fields, setFields] = useState<AccommodationFieldsAdmin>(initial?.fields ?? EMPTY_FIELDS);
  const [location, setLocation] = useState<LocationOption | null>(initial?.primaryLocation ?? null);
  const [slugTouched, setSlugTouched] = useState(Boolean(initial));
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const wasPublished = initial?.core.status === "published";
  const slugChanged = initial ? core.slug !== initial.core.slug : false;

  function save() {
    setError(null);
    startTransition(async () => {
      const result = initial ? await updateAccommodation(initial.id, core, fields) : await createAccommodation(core, fields);
      if (!result.ok) {
        setError(result.error ?? "Something went wrong.");
        return;
      }
      const id = initial?.id ?? (result as { id?: string }).id;
      if (id) {
        await setPrimaryLocation(id, location?.id ?? null, `/admin/accommodations/${id}`);
      }
      if (initial) {
        router.push("/admin/accommodations");
      } else {
        router.push(id ? `/admin/accommodations/${id}` : "/admin/accommodations");
      }
      router.refresh();
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

      <section className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Pricing & video</h2>
        <p className="text-xs text-neutral-500">
          &ldquo;From&rdquo; price shown on listing cards only — never a guaranteed live rate on the property&rsquo;s own page. Individual room/villa
          rates aren&rsquo;t editable here yet; that&rsquo;s a separate follow-up.
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
              value={fields.currency}
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

      {initial && <NodeMediaManager nodeId={initial.id} items={initial.media} revalidatePath={`/admin/accommodations/${initial.id}`} />}

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <Button onClick={save} disabled={isPending}>
          {isPending ? "Saving…" : initial ? "Save changes" : "Create accommodation"}
        </Button>
        {initial && <DeleteNodeButton nodeId={initial.id} redirectTo="/admin/accommodations" />}
      </div>
    </div>
  );
}
