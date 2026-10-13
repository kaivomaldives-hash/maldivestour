"use client";

import { useId, useState, useTransition } from "react";

import { updateHolidayPricingConfig } from "@/lib/admin/holiday-pricing-actions";
import type { AdminPricingConfigRow } from "@/lib/admin/holiday-pricing-repository";

const INPUT_CLASS =
  "w-full rounded-lg border border-neutral-300 px-2.5 py-1.5 text-sm focus:border-maldives-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-maldives-500 focus-visible:ring-offset-1";

export function HolidayPricingRowForm({ row }: { row: AdminPricingConfigRow }) {
  const sourceUrlId = useId();
  const [priceUsd, setPriceUsd] = useState(String(row.priceUsd));
  const [sourceNote, setSourceNote] = useState(row.sourceNote);
  const [sourceUrl, setSourceUrl] = useState(row.sourceUrl ?? "");
  const [isActive, setIsActive] = useState(row.isActive);
  const [isPending, startTransition] = useTransition();
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  function save() {
    setError(null);
    startTransition(async () => {
      const parsed = Number(priceUsd);
      const result = await updateHolidayPricingConfig(row.id, {
        priceUsd: parsed,
        sourceNote,
        sourceUrl: sourceUrl.trim() || null,
        isActive,
      });
      if (!result.ok) {
        setError(result.error ?? "Failed to save.");
        return;
      }
      setSavedAt(Date.now());
    });
  }

  return (
    <div className="rounded-xl border border-neutral-200 p-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-ocean-900">{row.label}</p>
          <p className="text-xs text-neutral-500">
            key: <code className="font-mono">{row.key}</code> &middot; {row.unit.replace(/_/g, " ")}
          </p>
        </div>
        <label className="flex shrink-0 items-center gap-1.5 text-xs text-neutral-600">
          <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="h-4 w-4 rounded border-neutral-300" />
          Active
        </label>
      </div>

      <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-[120px_1fr]">
        <div>
          <span className="mb-1 block text-xs font-medium text-neutral-500">USD price</span>
          <input type="number" step="0.01" min="0" value={priceUsd} onChange={(e) => setPriceUsd(e.target.value)} className={INPUT_CLASS} />
        </div>
        <div>
          <span className="mb-1 block text-xs font-medium text-neutral-500">Source note (required — never leave a rate unexplained)</span>
          <textarea value={sourceNote} onChange={(e) => setSourceNote(e.target.value)} rows={2} className={INPUT_CLASS} />
        </div>
      </div>
      <div className="mt-2">
        <label htmlFor={sourceUrlId} className="mb-1 block text-xs font-medium text-neutral-500">
          Source URL (optional)
        </label>
        <input id={sourceUrlId} type="url" value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)} placeholder="https://" className={INPUT_CLASS} />
      </div>

      {error && (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="mt-3 flex items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={isPending}
          className="rounded-full bg-maldives-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-ocean-800 disabled:opacity-50"
        >
          {isPending ? "Saving…" : "Save"}
        </button>
        {savedAt && !isPending && <span className="text-xs text-neutral-500">Saved</span>}
      </div>
    </div>
  );
}
