"use client";

import { Button } from "@/components/ui/button";
import type { ActivityItineraryStep } from "@/lib/activities/types";

/**
 * A deliberately simple repeatable-row editor — unlike
 * PackageItineraryEditor's stage/item model (its own relational tables,
 * one server action per row), an activity's itinerary is just an
 * ordered jsonb array on the activity itself, so the whole list lives
 * in the parent form's local state and is saved in one request with
 * everything else.
 */
export function ActivityItineraryEditor({ value, onChange }: { value: ActivityItineraryStep[]; onChange: (next: ActivityItineraryStep[]) => void }) {
  function update(index: number, patch: Partial<ActivityItineraryStep>) {
    onChange(value.map((step, i) => (i === index ? { ...step, ...patch } : step)));
  }
  function remove(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }
  function add() {
    onChange([...value, { time: null, title: "", description: null }]);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="block text-sm font-medium text-neutral-700">Itinerary</span>
        <Button type="button" size="sm" onClick={add}>
          + Add step
        </Button>
      </div>
      {value.length === 0 && <p className="text-sm text-neutral-500">No itinerary steps yet — shown on the public page only once at least one exists.</p>}
      <div className="space-y-2">
        {value.map((step, i) => (
          <div key={i} className="rounded-xl border border-neutral-200 p-3">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-[120px_1fr_auto]">
              <input
                value={step.time ?? ""}
                onChange={(e) => update(i, { time: e.target.value || null })}
                placeholder="Time (e.g. 08:00)"
                className="rounded-lg border border-neutral-300 px-2.5 py-1.5 text-sm focus:border-maldives-500 focus:outline-none"
              />
              <input
                value={step.title}
                onChange={(e) => update(i, { title: e.target.value })}
                placeholder="Step title"
                className="rounded-lg border border-neutral-300 px-2.5 py-1.5 text-sm focus:border-maldives-500 focus:outline-none"
              />
              <button type="button" onClick={() => remove(i)} className="justify-self-end text-xs font-medium text-red-600 hover:underline">
                Remove
              </button>
            </div>
            <textarea
              value={step.description ?? ""}
              onChange={(e) => update(i, { description: e.target.value || null })}
              placeholder="Details (optional)"
              rows={2}
              className="mt-2 w-full rounded-lg border border-neutral-300 px-2.5 py-1.5 text-sm focus:border-maldives-500 focus:outline-none"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
