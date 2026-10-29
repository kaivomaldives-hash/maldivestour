"use client";

import { useState, useTransition } from "react";

import { saveFishingCalculatorConfig } from "@/lib/admin/fishing-calculator-actions";
import {
  DEFAULT_FISHING_CALCULATOR_CONFIG,
  packageKeyFromLabel,
  quoteFishingPackage,
  type FishingCalculatorConfig,
  type FishingCalculatorPackage,
} from "@/lib/fishing/package-calculator-rates";

const INPUT_CLASS =
  "w-full rounded-lg border border-neutral-300 px-2.5 py-1.5 text-sm focus:border-maldives-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-maldives-500 focus-visible:ring-offset-1";
const SMALL_BUTTON = "rounded-full border border-neutral-300 px-3 py-1 text-xs font-medium text-neutral-700 hover:border-maldives-500 hover:text-maldives-600";
const REMOVE_BUTTON = "rounded-full px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50";

const toPercent = (fraction: number) => Math.round(fraction * 10000) / 100;
const fromPercent = (percent: number) => Math.round(percent * 100) / 10000;
const numberValue = (value: string) => (value === "" ? 0 : Number(value));

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block min-w-0 ${className}`}>
      <span className="mb-1 block text-xs font-medium text-neutral-500">{label}</span>
      {children}
    </label>
  );
}

function uniqueKey(base: string, taken: string[]): string {
  let candidate = base;
  for (let i = 2; taken.includes(candidate); i++) candidate = `${base}-${i}`;
  return candidate;
}

export function FishingCalculatorForm({ initialConfig }: { initialConfig: FishingCalculatorConfig }) {
  const [config, setConfig] = useState(initialConfig);
  const [isPending, startTransition] = useTransition();
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  function update(patch: Partial<FishingCalculatorConfig>) {
    setConfig((current) => ({ ...current, ...patch }));
    setSavedAt(null);
  }
  function updatePackage(index: number, patch: Partial<FishingCalculatorPackage>) {
    update({ packages: config.packages.map((pkg, i) => (i === index ? { ...pkg, ...patch } : pkg)) });
  }
  function setPublishedRate(index: number, days: number, guestIndex: number, value: number) {
    const pkg = config.packages[index];
    if (!pkg.publishedRates) return;
    const row = [...(pkg.publishedRates.perPersonByDays[String(days)] ?? [])];
    while (row.length < config.maxGuests) row.push(0);
    row[guestIndex] = value;
    updatePackage(index, { publishedRates: { ...pkg.publishedRates, perPersonByDays: { ...pkg.publishedRates.perPersonByDays, [days]: row } } });
  }

  function save() {
    setError(null);
    startTransition(async () => {
      const result = await saveFishingCalculatorConfig(config);
      if (!result.ok) {
        setError(result.error ?? "Failed to save.");
        return;
      }
      setSavedAt(Date.now());
    });
  }

  const sampleLocation = config.locations[0]?.key;
  const sampleDays = config.durations[0]?.days;

  return (
    <div className="space-y-8">
      {/* General */}
      <section className="rounded-xl border border-neutral-200 p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">General</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <Field label="Package markup on cost (%)">
            <input
              type="number"
              step="0.1"
              min="0"
              value={toPercent(config.markup - 1)}
              onChange={(e) => update({ markup: 1 + fromPercent(numberValue(e.target.value)) })}
              className={INPUT_CLASS}
            />
          </Field>
          <Field label="Maximum guests">
            <input
              type="number"
              min="1"
              max="20"
              value={config.maxGuests}
              onChange={(e) => update({ maxGuests: Math.max(1, Math.round(numberValue(e.target.value))) })}
              className={INPUT_CLASS}
            />
          </Field>
        </div>
        <p className="mt-2 text-xs text-neutral-500">
          Standard package price = (fishing days × rate per day + nights × rooms × room rate + guests × transfer) × (1 + markup) × (1 − long-stay
          saving). Nights = fishing days + 1; rooms = one per two guests.
        </p>
      </section>

      {/* Package lengths */}
      <section className="rounded-xl border border-neutral-200 p-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Package lengths and long-stay savings</h2>
          <button
            type="button"
            className={SMALL_BUTTON}
            onClick={() => {
              const nextDays = Math.max(0, ...config.durations.map((d) => d.days)) + 1;
              update({ durations: [...config.durations, { days: nextDays, discount: config.durations[config.durations.length - 1]?.discount ?? 0 }] });
            }}
          >
            + Add length
          </button>
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {config.durations.map((duration, index) => (
            <div key={index} className="flex items-end gap-2 rounded-lg bg-neutral-50 p-2">
              <Field label="Fishing days" className="flex-1">
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={duration.days}
                  onChange={(e) =>
                    update({ durations: config.durations.map((d, i) => (i === index ? { ...d, days: Math.round(numberValue(e.target.value)) } : d)) })
                  }
                  className={INPUT_CLASS}
                />
              </Field>
              <Field label="Saving (%)" className="flex-1">
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="90"
                  value={toPercent(duration.discount)}
                  onChange={(e) =>
                    update({ durations: config.durations.map((d, i) => (i === index ? { ...d, discount: fromPercent(numberValue(e.target.value)) } : d)) })
                  }
                  className={INPUT_CLASS}
                />
              </Field>
              <button
                type="button"
                className={REMOVE_BUTTON}
                disabled={config.durations.length === 1}
                onClick={() => update({ durations: config.durations.filter((_, i) => i !== index) })}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Atolls */}
      <section className="rounded-xl border border-neutral-200 p-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Atolls</h2>
          <button
            type="button"
            className={SMALL_BUTTON}
            onClick={() =>
              update({
                locations: [
                  ...config.locations,
                  { key: uniqueKey("new-atoll", config.locations.map((l) => l.key)), label: "New atoll", transferUsd: 0, roomUsd: 0, transferLabel: "speedboat" },
                ],
              })
            }
          >
            + Add atoll
          </button>
        </div>
        <div className="mt-3 space-y-2">
          {config.locations.map((location, index) => {
            const set = (patch: Partial<typeof location>) => update({ locations: config.locations.map((l, i) => (i === index ? { ...l, ...patch } : l)) });
            const inUse = config.packages.some((p) => p.publishedRates?.locationKey === location.key);
            return (
              <div key={index} className="grid items-end gap-2 rounded-lg bg-neutral-50 p-2 sm:grid-cols-[2fr_1fr_1fr_1fr_1.2fr_auto]">
                <Field label="Name">
                  <input value={location.label} onChange={(e) => set({ label: e.target.value })} className={INPUT_CLASS} />
                </Field>
                <Field label="Key">
                  <input value={location.key} onChange={(e) => set({ key: e.target.value })} className={`${INPUT_CLASS} font-mono`} disabled={inUse} />
                </Field>
                <Field label="Transfer USD / person">
                  <input type="number" step="0.01" min="0" value={location.transferUsd} onChange={(e) => set({ transferUsd: numberValue(e.target.value) })} className={INPUT_CLASS} />
                </Field>
                <Field label="Room USD / night">
                  <input type="number" step="0.01" min="0" value={location.roomUsd} onChange={(e) => set({ roomUsd: numberValue(e.target.value) })} className={INPUT_CLASS} />
                </Field>
                <Field label="Transfer type">
                  <input value={location.transferLabel} onChange={(e) => set({ transferLabel: e.target.value })} className={INPUT_CLASS} />
                </Field>
                <button
                  type="button"
                  className={REMOVE_BUTTON}
                  disabled={config.locations.length === 1 || inUse}
                  title={inUse ? "A package's published rates use this atoll" : undefined}
                  onClick={() => update({ locations: config.locations.filter((_, i) => i !== index) })}
                >
                  Remove
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Fishing packages */}
      <section className="rounded-xl border border-neutral-200 p-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Fishing packages</h2>
          <button
            type="button"
            className={SMALL_BUTTON}
            onClick={() =>
              update({
                packages: [
                  ...config.packages,
                  { key: uniqueKey("new-package", config.packages.map((p) => p.key)), label: "New fishing package", pricePerDay: 0, active: true, publishedRates: null },
                ],
              })
            }
          >
            + Add package
          </button>
        </div>
        <div className="mt-3 space-y-3">
          {config.packages.map((pkg, index) => {
            const sample = sampleLocation && sampleDays ? quoteFishingPackage(config, sampleLocation, pkg.key, sampleDays, Math.min(2, config.maxGuests)) : null;
            return (
              <div key={index} className="rounded-lg border border-neutral-200 bg-neutral-50 p-3">
                <div className="grid items-end gap-2 sm:grid-cols-[2fr_1fr_1fr_auto_auto]">
                  <Field label="Name">
                    <input
                      value={pkg.label}
                      onChange={(e) => {
                        const label = e.target.value;
                        // New packages take their key from the name until saved.
                        const autoKey = pkg.key.startsWith("new-package")
                          ? uniqueKey(packageKeyFromLabel(label), config.packages.filter((_, i) => i !== index).map((p) => p.key))
                          : pkg.key;
                        updatePackage(index, { label, key: autoKey });
                      }}
                      className={INPUT_CLASS}
                    />
                  </Field>
                  <Field label="Key">
                    <input value={pkg.key} onChange={(e) => updatePackage(index, { key: e.target.value })} className={`${INPUT_CLASS} font-mono`} />
                  </Field>
                  <Field label="Charter USD / boat / day">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={pkg.pricePerDay}
                      onChange={(e) => updatePackage(index, { pricePerDay: numberValue(e.target.value) })}
                      className={INPUT_CLASS}
                    />
                  </Field>
                  <label className="flex items-center gap-1.5 pb-2 text-xs text-neutral-600">
                    <input type="checkbox" checked={pkg.active} onChange={(e) => updatePackage(index, { active: e.target.checked })} className="h-4 w-4 rounded border-neutral-300" />
                    Active
                  </label>
                  <button
                    type="button"
                    className={`${REMOVE_BUTTON} pb-2`}
                    disabled={config.packages.length === 1}
                    onClick={() => {
                      if (window.confirm(`Remove "${pkg.label}"?`)) update({ packages: config.packages.filter((_, i) => i !== index) });
                    }}
                  >
                    Remove
                  </button>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-neutral-600">
                  <label className="flex items-center gap-1.5">
                    <input
                      type="checkbox"
                      checked={pkg.publishedRates !== null}
                      onChange={(e) =>
                        updatePackage(index, {
                          publishedRates: e.target.checked ? { locationKey: config.locations[0].key, perPersonByDays: {} } : null,
                        })
                      }
                      className="h-4 w-4 rounded border-neutral-300"
                    />
                    Fixed per-person rates (replace the formula at one atoll)
                  </label>
                  {pkg.publishedRates && (
                    <select
                      value={pkg.publishedRates.locationKey}
                      onChange={(e) => pkg.publishedRates && updatePackage(index, { publishedRates: { ...pkg.publishedRates, locationKey: e.target.value } })}
                      className="rounded-lg border border-neutral-300 px-2 py-1 text-xs"
                    >
                      {config.locations.map((l) => (
                        <option key={l.key} value={l.key}>
                          {l.label}
                        </option>
                      ))}
                    </select>
                  )}
                  {sample && (
                    <span className="ml-auto text-neutral-500">
                      Preview: {config.locations[0].label}, {sampleDays} days, {Math.min(2, config.maxGuests)} guests → USD {Math.round(sample.total).toLocaleString("en-US")} total
                    </span>
                  )}
                </div>

                {pkg.publishedRates && (
                  <div className="mt-2 overflow-x-auto">
                    <table className="text-xs">
                      <thead>
                        <tr className="text-neutral-500">
                          <th className="px-1 py-1 text-left font-medium">USD per person</th>
                          {Array.from({ length: config.maxGuests }, (_, g) => (
                            <th key={g} className="px-1 py-1 font-medium">
                              {g + 1} {g === 0 ? "guest" : "guests"}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {config.durations.map(({ days }) => (
                          <tr key={days}>
                            <td className="whitespace-nowrap px-1 py-0.5 text-neutral-600">{days} days</td>
                            {Array.from({ length: config.maxGuests }, (_, g) => (
                              <td key={g} className="px-1 py-0.5">
                                <input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  value={pkg.publishedRates?.perPersonByDays[String(days)]?.[g] ?? 0}
                                  onChange={(e) => setPublishedRate(index, days, g, numberValue(e.target.value))}
                                  className="w-24 rounded border border-neutral-300 px-1.5 py-1 text-xs"
                                />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <p className="mt-1 text-xs text-neutral-500">Leave 0 where there is no fixed rate — the standard formula is used there.</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Fleet */}
      <section className="rounded-xl border border-neutral-200 p-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Boats shown under the calculator</h2>
          <button type="button" className={SMALL_BUTTON} onClick={() => update({ fleet: [...config.fleet, { name: "New boat", detail: "", facts: "" }] })}>
            + Add boat
          </button>
        </div>
        <div className="mt-3 space-y-2">
          {config.fleet.map((boat, index) => {
            const set = (patch: Partial<typeof boat>) => update({ fleet: config.fleet.map((b, i) => (i === index ? { ...b, ...patch } : b)) });
            return (
              <div key={index} className="grid items-end gap-2 rounded-lg bg-neutral-50 p-2 sm:grid-cols-[1fr_2fr_2fr_auto]">
                <Field label="Name">
                  <input value={boat.name} onChange={(e) => set({ name: e.target.value })} className={INPUT_CLASS} />
                </Field>
                <Field label="Details">
                  <input value={boat.detail} onChange={(e) => set({ detail: e.target.value })} className={INPUT_CLASS} />
                </Field>
                <Field label="Facts">
                  <input value={boat.facts} onChange={(e) => set({ facts: e.target.value })} className={INPUT_CLASS} />
                </Field>
                <button type="button" className={REMOVE_BUTTON} onClick={() => update({ fleet: config.fleet.filter((_, i) => i !== index) })}>
                  Remove
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="sticky bottom-0 flex flex-wrap items-center gap-3 border-t border-neutral-200 bg-white py-3">
        <button
          type="button"
          onClick={save}
          disabled={isPending}
          className="rounded-full bg-maldives-600 px-5 py-2 text-sm font-medium text-white hover:bg-ocean-800 disabled:opacity-50"
        >
          {isPending ? "Saving…" : "Save calculator settings"}
        </button>
        <button
          type="button"
          className={SMALL_BUTTON}
          onClick={() => {
            if (window.confirm("Replace the form with the built-in default rates? Nothing is saved until you click Save.")) update(DEFAULT_FISHING_CALCULATOR_CONFIG);
          }}
        >
          Reset form to defaults
        </button>
        {savedAt && !isPending && <span className="text-xs text-neutral-500">Saved — the public calculator now uses these rates.</span>}
      </div>
    </div>
  );
}
