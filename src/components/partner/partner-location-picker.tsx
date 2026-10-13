"use client";

import { useId, useState, useTransition } from "react";

import { searchLocationOptionsForPartner, type PartnerLocationOption } from "@/lib/partner/location-search-actions";

/** Same shape as the staff LocationPicker (src/components/admin/location-
 * picker.tsx), backed by the partner-safe search action instead. */
export function PartnerLocationPicker({
  value,
  onChange,
  label = "Location",
}: {
  value: PartnerLocationOption | null;
  onChange: (location: PartnerLocationOption | null) => void;
  label?: string;
}) {
  const id = useId();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PartnerLocationOption[]>([]);
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function search(next: string) {
    setQuery(next);
    if (next.trim().length < 2) {
      setResults([]);
      return;
    }
    startTransition(async () => {
      const found = await searchLocationOptionsForPartner(next);
      setResults(found);
    });
  }

  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-neutral-700">
        {label}
      </label>
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
            id={id}
            value={query}
            onChange={(e) => search(e.target.value)}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 150)}
            placeholder="Search islands, atolls…"
            className="min-touch-target w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:border-maldives-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-maldives-500 focus-visible:ring-offset-1"
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
