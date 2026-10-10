"use client";

import { useState, useTransition } from "react";

import { searchLocationOptions } from "@/lib/admin/node-relations-actions";
import type { LocationOption } from "@/lib/admin/node-relations-repository";

/**
 * Multi-select counterpart to LocationPicker — for a node (e.g. a charter
 * activity) that genuinely operates across more than one atoll/island.
 * Combines LocationPicker's search-as-you-type with CategoryPicker's
 * removable-pill list: search adds to the list rather than replacing a
 * single value. The first entry in `value` is saved as this node's
 * 'primary' location by setNodeLocations() — every other reader in the
 * codebase that resolves "the" location for a node still gets exactly one
 * answer, unchanged.
 */
export function MultiLocationPicker({
  value,
  onChange,
  label = "Destinations",
}: {
  value: LocationOption[];
  onChange: (locations: LocationOption[]) => void;
  label?: string;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<LocationOption[]>([]);
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function search(next: string) {
    setQuery(next);
    if (next.trim().length < 2) {
      setResults([]);
      return;
    }
    startTransition(async () => {
      const found = await searchLocationOptions(next);
      setResults(found);
    });
  }

  function add(option: LocationOption) {
    if (!value.some((v) => v.id === option.id)) onChange([...value, option]);
    setQuery("");
    setResults([]);
    setOpen(false);
  }

  function remove(id: string) {
    onChange(value.filter((v) => v.id !== id));
  }

  function makePrimary(id: string) {
    const target = value.find((v) => v.id === id);
    if (!target) return;
    onChange([target, ...value.filter((v) => v.id !== id)]);
  }

  return (
    <div>
      <span className="mb-1 block text-sm font-medium text-neutral-700">{label}</span>
      <p className="mb-2 text-xs text-neutral-500">
        Add every atoll/island this activity genuinely operates in or from — the first one is used as its main location everywhere a single
        location is shown (SEO, breadcrumbs); add more than one only when it&apos;s genuinely true.
      </p>

      {value.length > 0 && (
        <ul className="mb-2 space-y-1">
          {value.map((location, index) => (
            <li
              key={location.id}
              className="flex items-center gap-2 rounded-xl border border-neutral-300 px-3 py-2 text-sm"
            >
              <span className="flex-1">
                {location.title} <span className="text-neutral-400">({location.locationType})</span>
                {index === 0 && <span className="ml-2 rounded-full bg-lagoon-100 px-2 py-0.5 text-xs font-medium text-ocean-900">Primary</span>}
              </span>
              {index !== 0 && (
                <button type="button" onClick={() => makePrimary(location.id)} className="text-xs font-medium text-neutral-500 hover:text-maldives-600">
                  Make primary
                </button>
              )}
              <button type="button" onClick={() => remove(location.id)} className="text-xs font-medium text-neutral-500 hover:text-red-600">
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="relative">
        <input
          value={query}
          onChange={(e) => search(e.target.value)}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder="Search islands, atolls to add…"
          className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:border-maldives-500 focus:outline-none"
        />
        {open && (isPending || results.length > 0) && (
          <ul className="absolute z-10 mt-1 max-h-56 w-full overflow-y-auto rounded-xl border border-neutral-200 bg-white py-1 shadow-lg">
            {isPending && <li className="px-3 py-2 text-sm text-neutral-400">Searching…</li>}
            {!isPending &&
              results.map((option) => (
                <li key={option.id}>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => add(option)}
                    className="block w-full px-3 py-2 text-left text-sm hover:bg-neutral-50"
                  >
                    {option.title} <span className="text-neutral-400">({option.locationType})</span>
                  </button>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
}
