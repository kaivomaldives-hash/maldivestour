"use client";

import { useState, useTransition } from "react";

import { searchLocationOptions } from "@/lib/admin/node-relations-actions";
import type { LocationOption } from "@/lib/admin/node-relations-repository";

/** Controlled search-and-select picker for a node's primary location
 * (island/atoll/etc.). The parent form owns `value` and saves it via
 * setPrimaryLocation() alongside its own submit, same two-step pattern
 * node-actions.ts already uses for create (core row, then type row). */
export function LocationPicker({
  value,
  onChange,
  label = "Primary location",
}: {
  value: LocationOption | null;
  onChange: (location: LocationOption | null) => void;
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

  return (
    <div>
      <span className="mb-1 block text-sm font-medium text-neutral-700">{label}</span>
      {value ? (
        <div className="flex items-center gap-2 rounded-xl border border-neutral-300 px-3 py-2 text-sm">
          <span className="flex-1">
            {value.title} <span className="text-neutral-400">({value.locationType})</span>
          </span>
          <button type="button" onClick={() => onChange(null)} className="text-xs font-medium text-neutral-500 hover:text-red-600">
            Clear
          </button>
        </div>
      ) : (
        <div className="relative">
          <input
            value={query}
            onChange={(e) => search(e.target.value)}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 150)}
            placeholder="Search islands, atolls…"
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
                      onClick={() => {
                        onChange(option);
                        setQuery("");
                        setResults([]);
                        setOpen(false);
                      }}
                      className="block w-full px-3 py-2 text-left text-sm hover:bg-neutral-50"
                    >
                      {option.title} <span className="text-neutral-400">({option.locationType})</span>
                    </button>
                  </li>
                ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
