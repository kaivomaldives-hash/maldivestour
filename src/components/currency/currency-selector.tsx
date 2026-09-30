"use client";

import { useState } from "react";

import { useCurrency } from "@/components/currency/currency-context";
import { CURRENCY_LABELS, SUPPORTED_CURRENCIES } from "@/lib/currency/types";

export function CurrencySelector() {
  const { currency, setCurrency } = useCurrency();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Currency"
        onClick={() => setOpen((v) => !v)}
        className="min-touch-target inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-ocean-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-maldives-600"
      >
        {currency}
      </button>
      {open && (
        <ul role="listbox" aria-label="Choose currency" className="absolute right-0 z-50 mt-1 max-h-72 min-w-[13rem] overflow-y-auto rounded-lg border border-neutral-200 bg-white py-1 shadow-lg">
          {SUPPORTED_CURRENCIES.map((c) => (
            <li key={c} role="option" aria-selected={c === currency}>
              <button
                type="button"
                onClick={() => {
                  setCurrency(c);
                  setOpen(false);
                }}
                className={`block w-full px-4 py-2 text-left text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-maldives-600 ${
                  c === currency ? "bg-lagoon-100 font-medium text-ocean-900" : "text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                {CURRENCY_LABELS[c]}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
