"use client";

import { useEffect, useId, useRef, useState, useTransition } from "react";

import { searchListingEmbedOptions } from "@/lib/admin/listing-embed-actions";
import { LISTING_EMBED_TYPE_LABEL, type ListingEmbedOption } from "@/lib/admin/listing-embed-types";

/**
 * "+ Insert real listing" button + search popover for the article body
 * editor — unlike EntityPicker (a controlled single-value field), this
 * fires one-shot `onInsert` calls so the article writer can drop in as
 * many listings as they like, anywhere the textarea cursor currently is
 * (ArticleForm does the actual splicing, since only it holds the
 * textarea ref/selection).
 */
export function ListingInsertPicker({ onInsert }: { onInsert: (option: ListingEmbedOption) => void }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ListingEmbedOption[]>([]);
  const [isPending, startTransition] = useTransition();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  function search(next: string) {
    setQuery(next);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (next.trim().length < 2) {
      setResults([]);
      return;
    }
    debounceRef.current = setTimeout(() => {
      startTransition(async () => {
        setResults(await searchListingEmbedOptions(next));
      });
    }, 250);
  }

  function close() {
    setOpen(false);
    setQuery("");
    setResults([]);
  }

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="rounded-full border border-maldives-300 bg-maldives-50 px-3 py-1.5 text-xs font-medium text-maldives-700 hover:bg-maldives-100"
      >
        + Insert real listing
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={close} aria-hidden="true" />
          <div className="absolute z-20 mt-1 w-80 rounded-xl border border-neutral-200 bg-white p-3 shadow-lg">
            <label htmlFor={id} className="mb-1 block text-xs font-medium text-neutral-600">
              Search activities, properties, packages, transfers…
            </label>
            <input
              id={id}
              autoFocus
              value={query}
              onChange={(e) => search(e.target.value)}
              placeholder="e.g. dolphin cruise"
              className="w-full rounded-lg border border-neutral-300 px-2.5 py-1.5 text-sm focus:border-maldives-500 focus:outline-none"
            />
            <ul className="mt-2 max-h-56 overflow-y-auto">
              {isPending && <li className="px-2 py-1.5 text-sm text-neutral-400">Searching…</li>}
              {!isPending && query.trim().length >= 2 && results.length === 0 && (
                <li className="px-2 py-1.5 text-sm text-neutral-400">No published listing matches.</li>
              )}
              {!isPending &&
                results.map((option) => (
                  <li key={`${option.nodeType}:${option.slug}`}>
                    <button
                      type="button"
                      onClick={() => {
                        onInsert(option);
                        close();
                      }}
                      className="block w-full rounded-lg px-2 py-1.5 text-left text-sm hover:bg-neutral-50"
                    >
                      {option.title} <span className="text-neutral-400">({LISTING_EMBED_TYPE_LABEL[option.nodeType]})</span>
                    </button>
                  </li>
                ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
