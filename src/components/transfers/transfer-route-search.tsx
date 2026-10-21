"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

import type { TransferRouteSummary } from "@/lib/transfers/types";

const DEBOUNCE_MS = 200;
const MIN_QUERY_LENGTH = 2;

/**
 * Inline "search this list" box for transfer routes — complements
 * TransferFinder (From/To route matching) rather than replacing it: this
 * is for a visitor who already knows the resort/hotel/island name (e.g.
 * "Centara") and just wants to jump straight to its route page, instead
 * of scanning a long card grid by eye. Same debounced-fetch-and-dropdown
 * shape as LocationCombobox, backed by the real searchTransferRoutes()
 * title match (via /api/transfers/route-search) rather than a client-side
 * filter of whatever page happens to be loaded, so a route it can find
 * regardless of which category page it's searched from.
 */
export function TransferRouteSearch({ placeholder = "Search by resort, hotel, or island name…" }: { placeholder?: string }) {
  const listId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestIdRef = useRef(0);

  const [value, setValue] = useState("");
  const [results, setResults] = useState<TransferRouteSummary[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const next = event.target.value;
    setValue(next);
    setOpen(true);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    const query = next.trim();
    if (query.length < MIN_QUERY_LENGTH) {
      requestIdRef.current++;
      setResults([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      const requestId = ++requestIdRef.current;
      try {
        const res = await fetch(`/api/transfers/route-search?q=${encodeURIComponent(query)}`);
        if (!res.ok) return;
        const data = (await res.json()) as { results: TransferRouteSummary[] };
        if (requestId === requestIdRef.current) {
          setResults(data.results);
          setActiveIndex(-1);
        }
      } catch {
        // leave existing results on a network hiccup
      }
    }, DEBOUNCE_MS);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!open) setOpen(true);
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  const showDropdown = open && value.trim().length >= MIN_QUERY_LENGTH;

  return (
    <div ref={containerRef} className="relative max-w-md">
      <label htmlFor={`${listId}-input`} className="mb-1 block text-sm font-medium text-neutral-700">
        Search transfer routes by name
      </label>
      <input
        id={`${listId}-input`}
        type="text"
        role="combobox"
        aria-expanded={showDropdown}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={activeIndex >= 0 ? `${listId}-option-${activeIndex}` : undefined}
        autoComplete="off"
        value={value}
        onChange={handleChange}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="min-touch-target w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:border-maldives-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-maldives-500 focus-visible:ring-offset-1"
      />

      {showDropdown && (
        <div
          id={listId}
          role="listbox"
          aria-label="Matching transfer routes"
          className="absolute left-0 right-0 z-50 mt-2 max-h-80 overflow-y-auto rounded-2xl border border-neutral-200 bg-white py-2 shadow-lg"
        >
          {results.length === 0 ? (
            <p className="px-4 py-2.5 text-sm text-neutral-500">No route found for &ldquo;{value.trim()}&rdquo;.</p>
          ) : (
            results.map((route, index) => (
              <Link
                key={route.id}
                id={`${listId}-option-${index}`}
                role="option"
                aria-selected={index === activeIndex}
                href={`/maldives/transfers/${route.slug}/`}
                onMouseDown={(event) => event.preventDefault()}
                onMouseEnter={() => setActiveIndex(index)}
                className={`block px-4 py-2.5 text-left text-sm transition-colors ${
                  index === activeIndex ? "bg-lagoon-100" : "hover:bg-neutral-50"
                }`}
              >
                <span className="block truncate font-medium text-ocean-900">{route.title}</span>
                {route.priceFrom !== null && (
                  <span className="block truncate text-xs text-neutral-500">
                    From {route.currency ?? "USD"} {route.priceFrom}
                  </span>
                )}
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
