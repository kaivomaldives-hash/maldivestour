"use client";

import type { Dispatch, ReactNode, SetStateAction } from "react";

import { extractYoutubeId } from "@/lib/youtube";

interface PricingVideoFields {
  priceFrom: number | null;
  currency: string;
  videoYoutubeId: string | null;
}

/** Shared by AccommodationForm and ActivityForm: the "price from" +
 * currency + YouTube video ID trio. `note` lets a form add type-specific
 * context above the fields (e.g. AccommodationForm's "From price" caveat). */
export function AdminPricingVideoSection<T extends PricingVideoFields>({
  fields,
  setFields,
  note,
}: {
  fields: T;
  setFields: Dispatch<SetStateAction<T>>;
  note?: ReactNode;
}) {
  return (
    <section className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-4">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Pricing & video</h2>
      {note}
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
          <span className="mb-1 block font-medium text-neutral-700">YouTube video ID or URL</span>
          <input
            value={fields.videoYoutubeId ?? ""}
            onChange={(e) => setFields((f) => ({ ...f, videoYoutubeId: e.target.value ? extractYoutubeId(e.target.value) ?? e.target.value : null }))}
            placeholder="e.g. CZGxcfCXJz0 or a youtube.com/watch?v= link"
            className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
          />
        </label>
      </div>
    </section>
  );
}
