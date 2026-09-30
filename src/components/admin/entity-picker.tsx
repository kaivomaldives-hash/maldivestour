"use client";

import { useState, useTransition } from "react";

import { searchItineraryNodeOptions, searchTransferServiceOptions, type ItineraryNodeOption, type TransferServiceOption } from "@/lib/admin/packages-actions";

/** Search-and-select picker for an itinerary item's referenced entity —
 * same controlled value/onChange shape as LocationPicker, but backed by
 * searchItineraryNodeOptions() (any accommodation/activity/package/
 * speedboat/vehicle/transfer_route node) instead of locations only. */
export function EntityPicker({
  value,
  onChange,
  placeholder = "Search accommodations, activities, packages…",
}: {
  value: ItineraryNodeOption | null;
  onChange: (option: ItineraryNodeOption | null) => void;
  placeholder?: string;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ItineraryNodeOption[]>([]);
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function search(next: string) {
    setQuery(next);
    if (next.trim().length < 2) {
      setResults([]);
      return;
    }
    startTransition(async () => {
      setResults(await searchItineraryNodeOptions(next));
    });
  }

  if (value) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-neutral-300 px-3 py-2 text-sm">
        <span className="flex-1">
          {value.title} <span className="text-neutral-400">({value.nodeType})</span>
        </span>
        <button type="button" onClick={() => onChange(null)} className="text-xs font-medium text-neutral-500 hover:text-red-600">
          Clear
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <input
        value={query}
        onChange={(e) => search(e.target.value)}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder={placeholder}
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
                  {option.title} <span className="text-neutral-400">({option.nodeType})</span>
                </button>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}

/** Same pattern, backed by searchTransferServiceOptions() for the
 * component_type='transfer_service' case — transfer_services has no title
 * of its own, so the picker shows a resolved label instead. */
export function TransferServicePicker({ value, onChange }: { value: TransferServiceOption | null; onChange: (option: TransferServiceOption | null) => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TransferServiceOption[]>([]);
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function search(next: string) {
    setQuery(next);
    if (next.trim().length < 2) {
      setResults([]);
      return;
    }
    startTransition(async () => {
      setResults(await searchTransferServiceOptions(next));
    });
  }

  if (value) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-neutral-300 px-3 py-2 text-sm">
        <span className="flex-1">{value.label}</span>
        <button type="button" onClick={() => onChange(null)} className="text-xs font-medium text-neutral-500 hover:text-red-600">
          Clear
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <input
        value={query}
        onChange={(e) => search(e.target.value)}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder="Search by route title…"
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
                  {option.label}
                </button>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
