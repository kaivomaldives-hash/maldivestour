"use client";

import { Button } from "@/components/ui/button";
import type { ActivityRate } from "@/lib/activities/types";

/** Same simple local-state array editor as ActivityItineraryEditor, for
 * the separate "Rates" breakdown (adult/child/private-charter etc.) —
 * distinct from the single `priceFrom` headline figure. */
export function ActivityRatesEditor({ value, onChange }: { value: ActivityRate[]; onChange: (next: ActivityRate[]) => void }) {
  function update(index: number, patch: Partial<ActivityRate>) {
    onChange(value.map((rate, i) => (i === index ? { ...rate, ...patch } : rate)));
  }
  function remove(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }
  function add() {
    onChange([...value, { label: "", price: null, currency: "USD", note: null }]);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="block text-sm font-medium text-neutral-700">Rates</span>
        <Button type="button" size="sm" onClick={add}>
          + Add rate
        </Button>
      </div>
      {value.length === 0 && <p className="text-sm text-neutral-500">No rate breakdown yet — shown on the public page only once at least one exists.</p>}
      <div className="space-y-2">
        {value.map((rate, i) => (
          <div key={i} className="rounded-xl border border-neutral-200 p-3">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_100px_80px_auto]">
              <input
                value={rate.label}
                onChange={(e) => update(i, { label: e.target.value })}
                placeholder="e.g. Adult"
                className="rounded-lg border border-neutral-300 px-2.5 py-1.5 text-sm focus:border-maldives-500 focus:outline-none"
              />
              <input
                type="number"
                min={0}
                step="0.01"
                value={rate.price ?? ""}
                onChange={(e) => update(i, { price: e.target.value ? Number(e.target.value) : null })}
                placeholder="Price"
                className="rounded-lg border border-neutral-300 px-2.5 py-1.5 text-sm focus:border-maldives-500 focus:outline-none"
              />
              <input
                value={rate.currency ?? ""}
                onChange={(e) => update(i, { currency: e.target.value || null })}
                placeholder="USD"
                className="rounded-lg border border-neutral-300 px-2.5 py-1.5 text-sm focus:border-maldives-500 focus:outline-none"
              />
              <button type="button" onClick={() => remove(i)} className="justify-self-end text-xs font-medium text-red-600 hover:underline">
                Remove
              </button>
            </div>
            <input
              value={rate.note ?? ""}
              onChange={(e) => update(i, { note: e.target.value || null })}
              placeholder="Note (optional, e.g. 'ages 5-12')"
              className="mt-2 w-full rounded-lg border border-neutral-300 px-2.5 py-1.5 text-sm focus:border-maldives-500 focus:outline-none"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
