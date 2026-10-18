import { Price } from "@/components/currency/price";
import { isSupportedCurrency } from "@/lib/currency/types";
import type { ActivityRate } from "@/lib/activities/types";

export function ActivityRatesSection({ rates }: { rates: ActivityRate[] }) {
  if (rates.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold text-ocean-900">Rates</h2>
      <ul className="mt-4 divide-y divide-neutral-200 rounded-2xl border border-neutral-200">
        {rates.map((rate, i) => {
          const currency = rate.currency ?? "USD";
          return (
            <li key={i} className="flex flex-wrap items-baseline justify-between gap-2 px-4 py-3">
              <div>
                <p className="font-medium text-ocean-900">{rate.label}</p>
                {rate.note && <p className="text-sm text-neutral-500">{rate.note}</p>}
              </div>
              {rate.price !== null && (
                <p className="font-semibold text-ocean-900">
                  {isSupportedCurrency(currency) ? <Price baseAmount={rate.price} baseCurrency={currency} /> : `${currency} ${rate.price}`}
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
