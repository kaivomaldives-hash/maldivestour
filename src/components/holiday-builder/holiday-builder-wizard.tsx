"use client";

import { useEffect, useMemo, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
  getHolidayBuilderActivities,
  getLiveHolidayPrice,
  searchHolidayDestinations,
  submitHolidayRequest,
} from "@/lib/holiday-builder/actions";
import {
  MEAL_PLAN_LABELS,
  STAY_TYPE_LABELS,
  type BedPreference,
  type DayActivitySelection,
  type HolidayActivityOption,
  type HolidaySelection,
  type MealPlanKey,
  type PriceBreakdown,
  type PricingConfigRow,
  type RoomTypeOption,
  type StaySegment,
  type StayType,
  type TransferKey,
} from "@/lib/holiday-builder/types";

const INPUT_CLASS =
  "w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:border-maldives-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-maldives-500 focus-visible:ring-offset-1";
const LABEL_CLASS = "mb-1 block text-sm font-medium text-neutral-700";

const STEPS = ["Trip basics", "Stay type", "Rooms & meals", "Activities", "Transfer", "Review & submit"] as const;

function newSegmentId(): string {
  return `seg-${Math.random().toString(36).slice(2, 10)}`;
}

function roomOptionsFor(pricing: PricingConfigRow[], stayType: StayType): RoomTypeOption[] {
  const category = stayType === "resort" ? "resort_room" : stayType === "local_island" ? "local_island_room" : "safari_cabin";
  return pricing
    .filter((r) => r.category === category && r.stayType === stayType)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((r) => ({ key: r.key, label: r.label, priceUsd: r.priceUsd, unit: r.unit }));
}

function mealPlanOptionsFor(pricing: PricingConfigRow[], stayType: StayType): { key: MealPlanKey; label: string }[] {
  if (stayType === "safari") return [];
  const category = stayType === "resort" ? "meal_plan_resort" : "meal_plan_local_island";
  return pricing
    .filter((r) => r.category === category && r.stayType === stayType)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((r) => ({ key: r.key as MealPlanKey, label: r.label }));
}

function defaultSegment(stayType: StayType, pricing: PricingConfigRow[], nights: number): StaySegment {
  const rooms = roomOptionsFor(pricing, stayType);
  const meals = mealPlanOptionsFor(pricing, stayType);
  return {
    id: newSegmentId(),
    stayType,
    roomKey: rooms[0]?.key ?? "",
    bedPreference: "double",
    mealPlan: meals[0]?.key ?? "breakfast",
    nights,
  };
}

export function HolidayBuilderWizard({ pricing }: { pricing: PricingConfigRow[] }) {
  const [step, setStep] = useState(0);

  // Step 1: trip basics
  const [arrivalDate, setArrivalDate] = useState("");
  const [nights, setNights] = useState(5);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [destinationQuery, setDestinationQuery] = useState("");
  const [destination, setDestination] = useState<{ id: string; title: string } | null>(null);
  const [destinationResults, setDestinationResults] = useState<{ id: string; title: string; locationType: string }[]>([]);
  const [isMultiIsland, setIsMultiIsland] = useState(false);

  // Step 2: stay type / split stay
  const [isSplitStay, setIsSplitStay] = useState(false);
  const [stayType, setStayType] = useState<StayType>("local_island");

  // Step 3: segments
  const [segments, setSegments] = useState<StaySegment[]>(() => [defaultSegment("local_island", pricing, 5)]);

  // Step 4: activities
  const [activities, setActivities] = useState<HolidayActivityOption[]>([]);
  const [dayActivities, setDayActivities] = useState<DayActivitySelection[]>([]);
  const [activityDay, setActivityDay] = useState(1);

  // Step 5: transfer
  const [transfer, setTransfer] = useState<TransferKey>("shared_speedboat");

  // Step 6: submit
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerWhatsapp, setCustomerWhatsapp] = useState("");
  const [additionalRequests, setAdditionalRequests] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const [breakdown, setBreakdown] = useState<PriceBreakdown | null>(null);
  const [priceError, setPriceError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);

  // Destination search (debounced) — the short-query clear happens directly
  // in the input's onChange so no setState runs synchronously in the effect.
  useEffect(() => {
    const trimmed = destinationQuery.trim();
    if (trimmed.length < 2) return;
    const handle = setTimeout(() => {
      searchHolidayDestinations(trimmed).then(setDestinationResults);
    }, 250);
    return () => clearTimeout(handle);
  }, [destinationQuery]);

  // Load activities once a destination (or lack thereof) is settled, when
  // entering the activities step.
  useEffect(() => {
    if (step !== 3) return;
    getHolidayBuilderActivities(destination?.id ?? null).then(setActivities);
  }, [step, destination]);

  const selection: HolidaySelection = useMemo(
    () => ({
      arrivalDate,
      nights,
      adults,
      children,
      rooms,
      destinationLabel: destination?.title ?? null,
      destinationLocationId: destination?.id ?? null,
      isMultiIsland,
      segments,
      dayActivities,
      transfer,
    }),
    [arrivalDate, nights, adults, children, rooms, destination, isMultiIsland, segments, dayActivities, transfer],
  );

  const segmentNightsTotal = segments.reduce((sum, s) => sum + s.nights, 0);
  const segmentNightsOk = segmentNightsTotal === nights;

  // Live price preview — recomputed (server-side, authoritative) whenever
  // the selection changes. While segment nights don't add up, the stale
  // breakdown/error are simply not shown (see displayBreakdown below)
  // rather than cleared here, so no setState runs synchronously in the effect.
  useEffect(() => {
    if (!segmentNightsOk) return;
    getLiveHolidayPrice(selection).then((result) => {
      setBreakdown(result.breakdown);
      setPriceError(result.ok ? null : (result.error ?? null));
    });
  }, [selection, segmentNightsOk]);

  const displayBreakdown = segmentNightsOk ? breakdown : null;
  const displayPriceError = segmentNightsOk ? priceError : null;

  function addSplitSegment() {
    setSegments((prev) => [...prev, defaultSegment("local_island", pricing, 1)]);
  }

  function removeSegment(id: string) {
    setSegments((prev) => (prev.length > 1 ? prev.filter((s) => s.id !== id) : prev));
  }

  function updateSegment(id: string, patch: Partial<StaySegment>) {
    setSegments((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }

  function addDayActivity(activity: HolidayActivityOption) {
    setDayActivities((prev) => [...prev, { day: activityDay, activity }]);
  }

  function removeDayActivity(index: number) {
    setDayActivities((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSubmit() {
    setSubmitError(null);
    startTransition(async () => {
      const result = await submitHolidayRequest({
        selection,
        customerName,
        customerEmail,
        customerWhatsapp,
        additionalRequests,
        honeypot,
      });
      if (!result.ok) {
        setSubmitError(result.error ?? "Something went wrong. Please try again.");
        return;
      }
      setReference(result.reference ?? null);
    });
  }

  if (reference) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-neutral-200 bg-white p-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-maldives-600">Request submitted</p>
        <h2 className="mt-2 text-2xl font-semibold text-ocean-900">Thank you, {customerName.split(" ")[0]}!</h2>
        <p className="mt-3 text-neutral-600">
          Your custom holiday request has been received. Reference: <span className="font-mono font-semibold text-ocean-900">{reference}</span>
        </p>
        <p className="mt-2 text-sm text-neutral-500">
          This is a request, not a confirmed booking — our team will review availability and get back to you by email or WhatsApp with a final
          quote.
        </p>
        <Button href="/maldives/packages/" variant="secondary" className="mt-6">
          Back to Packages
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <ol className="mb-6 flex flex-wrap gap-2 text-xs font-medium text-neutral-500">
        {STEPS.map((label, i) => (
          <li key={label} className={`rounded-full px-3 py-1.5 ${i === step ? "bg-maldives-600 text-white" : i < step ? "bg-lagoon-100 text-ocean-900" : "bg-neutral-100"}`}>
            {i + 1}. {label}
          </li>
        ))}
      </ol>

      <div className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6">
        {step === 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-ocean-900">Trip basics</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={LABEL_CLASS} htmlFor="hb-arrival">
                  Arrival date
                </label>
                <input id="hb-arrival" type="date" value={arrivalDate} onChange={(e) => setArrivalDate(e.target.value)} className={INPUT_CLASS} />
              </div>
              <div>
                <label className={LABEL_CLASS} htmlFor="hb-nights">
                  Number of nights
                </label>
                <input
                  id="hb-nights"
                  type="number"
                  min={1}
                  value={nights}
                  onChange={(e) => {
                    const v = Math.max(1, Number(e.target.value) || 1);
                    setNights(v);
                    if (!isSplitStay) {
                      setSegments((prev) => (prev.length === 1 ? [{ ...prev[0], nights: v }] : prev));
                    }
                  }}
                  className={INPUT_CLASS}
                />
              </div>
              <div>
                <label className={LABEL_CLASS} htmlFor="hb-adults">
                  Adults
                </label>
                <input id="hb-adults" type="number" min={1} value={adults} onChange={(e) => setAdults(Math.max(1, Number(e.target.value) || 1))} className={INPUT_CLASS} />
              </div>
              <div>
                <label className={LABEL_CLASS} htmlFor="hb-children">
                  Children
                </label>
                <input id="hb-children" type="number" min={0} value={children} onChange={(e) => setChildren(Math.max(0, Number(e.target.value) || 0))} className={INPUT_CLASS} />
              </div>
              <div>
                <label className={LABEL_CLASS} htmlFor="hb-rooms">
                  Number of rooms
                </label>
                <input id="hb-rooms" type="number" min={1} value={rooms} onChange={(e) => setRooms(Math.max(1, Number(e.target.value) || 1))} className={INPUT_CLASS} />
              </div>
            </div>

            <div>
              <span className={LABEL_CLASS}>Destination (optional)</span>
              <div className="flex flex-wrap gap-2 text-sm">
                <button
                  type="button"
                  onClick={() => setIsMultiIsland(false)}
                  className={`rounded-full px-3.5 py-1.5 font-medium ${!isMultiIsland ? "bg-lagoon-100 text-ocean-900" : "border border-neutral-300 text-neutral-600"}`}
                >
                  Single Island
                </button>
                <button
                  type="button"
                  onClick={() => setIsMultiIsland(true)}
                  className={`rounded-full px-3.5 py-1.5 font-medium ${isMultiIsland ? "bg-lagoon-100 text-ocean-900" : "border border-neutral-300 text-neutral-600"}`}
                >
                  Multiple Islands
                </button>
              </div>
              <div className="relative mt-2">
                <input
                  value={destination ? destination.title : destinationQuery}
                  onChange={(e) => {
                    setDestination(null);
                    setDestinationQuery(e.target.value);
                    if (e.target.value.trim().length < 2) setDestinationResults([]);
                  }}
                  placeholder="Search an atoll or island…"
                  className={INPUT_CLASS}
                />
                {!destination && destinationResults.length > 0 && (
                  <ul className="absolute z-10 mt-1 w-full overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-lg">
                    {destinationResults.map((d) => (
                      <li key={d.id}>
                        <button
                          type="button"
                          onClick={() => {
                            setDestination({ id: d.id, title: d.title });
                            setDestinationQuery("");
                            setDestinationResults([]);
                          }}
                          className="block w-full px-3 py-2 text-left text-sm hover:bg-neutral-50"
                        >
                          {d.title} <span className="text-neutral-400">({d.locationType})</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-ocean-900">Stay type</h2>
            <div>
              <label className="flex items-center gap-2 text-sm text-neutral-700">
                <input
                  type="checkbox"
                  checked={isSplitStay}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setIsSplitStay(checked);
                    if (!checked) setSegments([defaultSegment(stayType, pricing, nights)]);
                  }}
                  className="h-4 w-4 rounded border-neutral-300"
                />
                Split Stay — combine more than one stay type across your trip
              </label>
            </div>

            {!isSplitStay ? (
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {(["resort", "local_island", "safari"] as StayType[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      setStayType(t);
                      setSegments([defaultSegment(t, pricing, nights)]);
                    }}
                    className={`rounded-xl border p-4 text-left text-sm font-medium ${
                      stayType === t ? "border-maldives-500 bg-maldives-50 text-ocean-900" : "border-neutral-300 text-neutral-600 hover:border-maldives-500"
                    }`}
                  >
                    {STAY_TYPE_LABELS[t]}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-neutral-600">Set each stay segment&apos;s type, room and nights on the next step.</p>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-ocean-900">Rooms &amp; meal plans</h2>
            {!segmentNightsOk && (
              <p role="alert" className="rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-800">
                Segment nights ({segmentNightsTotal}) must add up to your total of {nights} night{nights === 1 ? "" : "s"}.
              </p>
            )}
            <div className="space-y-4">
              {segments.map((segment, index) => (
                <div key={segment.id} className="rounded-xl border border-neutral-200 p-4">
                  {isSplitStay && (
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-sm font-semibold text-ocean-900">Segment {index + 1}</p>
                      {segments.length > 1 && (
                        <button type="button" onClick={() => removeSegment(segment.id)} className="text-xs font-medium text-neutral-500 hover:text-red-600">
                          Remove
                        </button>
                      )}
                    </div>
                  )}
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {isSplitStay && (
                      <div>
                        <span className={LABEL_CLASS}>Stay type</span>
                        <select
                          value={segment.stayType}
                          onChange={(e) => {
                            const newStayType = e.target.value as StayType;
                            const rooms2 = roomOptionsFor(pricing, newStayType);
                            const meals2 = mealPlanOptionsFor(pricing, newStayType);
                            updateSegment(segment.id, { stayType: newStayType, roomKey: rooms2[0]?.key ?? "", mealPlan: meals2[0]?.key ?? "breakfast" });
                          }}
                          className={INPUT_CLASS}
                        >
                          {(["resort", "local_island", "safari"] as StayType[]).map((t) => (
                            <option key={t} value={t}>
                              {STAY_TYPE_LABELS[t]}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    <div>
                      <span className={LABEL_CLASS}>Room / cabin type</span>
                      <select value={segment.roomKey} onChange={(e) => updateSegment(segment.id, { roomKey: e.target.value })} className={INPUT_CLASS}>
                        {roomOptionsFor(pricing, segment.stayType).map((r) => (
                          <option key={r.key} value={r.key}>
                            {r.label} — USD {r.priceUsd}/{r.unit === "per_person_per_night" ? "person" : "room"}/night
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <span className={LABEL_CLASS}>Bed preference</span>
                      <select value={segment.bedPreference} onChange={(e) => updateSegment(segment.id, { bedPreference: e.target.value as BedPreference })} className={INPUT_CLASS}>
                        <option value="double">Double</option>
                        <option value="twin">Twin</option>
                        <option value="single">Single</option>
                      </select>
                    </div>
                    {mealPlanOptionsFor(pricing, segment.stayType).length > 0 && (
                      <div>
                        <span className={LABEL_CLASS}>Meal plan</span>
                        <select value={segment.mealPlan} onChange={(e) => updateSegment(segment.id, { mealPlan: e.target.value as MealPlanKey })} className={INPUT_CLASS}>
                          {mealPlanOptionsFor(pricing, segment.stayType).map((m) => (
                            <option key={m.key} value={m.key}>
                              {MEAL_PLAN_LABELS[m.key]}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    {segment.stayType === "safari" && <p className="text-xs text-neutral-500 sm:col-span-2">Safari cabin rates include full board.</p>}
                    {isSplitStay && (
                      <div>
                        <span className={LABEL_CLASS}>Nights</span>
                        <input
                          type="number"
                          min={1}
                          value={segment.nights}
                          onChange={(e) => updateSegment(segment.id, { nights: Math.max(1, Number(e.target.value) || 1) })}
                          className={INPUT_CLASS}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {isSplitStay && (
              <button type="button" onClick={addSplitSegment} className="text-sm font-medium text-maldives-600 hover:underline">
                + Add another stay segment
              </button>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-ocean-900">Activities</h2>
            <p className="text-sm text-neutral-600">Add diving, fishing, surfing, watersports or excursions to specific days of your holiday — all optional.</p>

            <div className="flex items-center gap-3">
              <span className={LABEL_CLASS}>Day</span>
              <select value={activityDay} onChange={(e) => setActivityDay(Number(e.target.value))} className={`${INPUT_CLASS} w-28`}>
                {Array.from({ length: nights }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={d}>
                    Day {d}
                  </option>
                ))}
              </select>
            </div>

            {activities.length === 0 ? (
              <p className="text-sm text-neutral-500">
                {destination ? "No matching activities found for this destination yet." : "Loading activities…"}
              </p>
            ) : (
              <ul className="grid max-h-96 grid-cols-1 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
                {activities.map((a) => (
                  <li key={a.nodeId} className="flex items-center justify-between rounded-xl border border-neutral-200 p-3 text-sm">
                    <div>
                      <p className="font-medium text-ocean-900">{a.title}</p>
                      <p className="text-xs text-neutral-500">
                        {a.category} {a.priceFrom != null ? `· From ${a.currency ?? "USD"} ${a.priceFrom}/person` : ""}
                      </p>
                    </div>
                    <button type="button" onClick={() => addDayActivity(a)} className="shrink-0 rounded-full border border-maldives-500 px-3 py-1 text-xs font-medium text-maldives-600 hover:bg-maldives-50">
                      Add to Day {activityDay}
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {dayActivities.length > 0 && (
              <div className="rounded-xl border border-maldives-200 bg-lagoon-50 p-3">
                <p className="mb-2 text-sm font-semibold text-ocean-900">Your added activities</p>
                <ul className="max-h-48 space-y-1.5 overflow-y-auto pr-1 text-sm">
                  {dayActivities
                    .map((d, i) => ({ ...d, i }))
                    .sort((a, b) => a.day - b.day)
                    .map(({ day, activity, i }) => (
                      <li key={`${activity.nodeId}-${i}`} className="flex items-center justify-between">
                        <span>
                          Day {day}: {activity.title}
                        </span>
                        <button type="button" onClick={() => removeDayActivity(i)} className="text-xs font-medium text-neutral-500 hover:text-red-600">
                          Remove
                        </button>
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-ocean-900">Transfer</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setTransfer("shared_speedboat")}
                className={`rounded-xl border p-4 text-left ${transfer === "shared_speedboat" ? "border-maldives-500 bg-maldives-50" : "border-neutral-300 hover:border-maldives-500"}`}
              >
                <p className="font-medium text-ocean-900">Shared Speedboat</p>
                <p className="mt-1 text-sm text-neutral-600">Priced per person, each way.</p>
              </button>
              <button
                type="button"
                onClick={() => setTransfer("private_speedboat")}
                className={`rounded-xl border p-4 text-left ${transfer === "private_speedboat" ? "border-maldives-500 bg-maldives-50" : "border-neutral-300 hover:border-maldives-500"}`}
              >
                <p className="font-medium text-ocean-900">Private Speedboat</p>
                <p className="mt-1 text-sm text-neutral-600">USD 250 each way for the entire boat (not per person).</p>
              </button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-ocean-900">Review &amp; submit</h2>

            {displayBreakdown && (
              <div className="rounded-xl border border-neutral-200 p-4">
                <p className="mb-2 text-sm font-semibold text-ocean-900">Estimated price breakdown</p>
                <dl className="space-y-1 text-sm">
                  {displayBreakdown.lines.map((line, i) => (
                    <div key={i} className="flex justify-between">
                      <dt className="text-neutral-600">{line.label}</dt>
                      <dd className="text-neutral-900">USD {line.amount.toFixed(2)}</dd>
                    </div>
                  ))}
                  <div className="mt-2 flex justify-between border-t border-neutral-200 pt-2 font-semibold text-ocean-900">
                    <dt>Estimated total</dt>
                    <dd>USD {displayBreakdown.grandTotal.toFixed(2)}</dd>
                  </div>
                </dl>
                <p className="mt-2 text-xs text-neutral-500">
                  This is an estimate pending availability and supplier confirmation — not a confirmed price or booking.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={LABEL_CLASS} htmlFor="hb-name">
                  Full name
                </label>
                <input id="hb-name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className={INPUT_CLASS} />
              </div>
              <div>
                <label className={LABEL_CLASS} htmlFor="hb-email">
                  Email address
                </label>
                <input id="hb-email" type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} className={INPUT_CLASS} />
              </div>
              <div className="sm:col-span-2">
                <label className={LABEL_CLASS} htmlFor="hb-whatsapp">
                  WhatsApp number (with country code)
                </label>
                <input id="hb-whatsapp" value={customerWhatsapp} onChange={(e) => setCustomerWhatsapp(e.target.value)} placeholder="+960…" className={INPUT_CLASS} />
              </div>
              <div className="sm:col-span-2">
                <label className={LABEL_CLASS} htmlFor="hb-notes">
                  Additional requests or preferences
                </label>
                <textarea id="hb-notes" value={additionalRequests} onChange={(e) => setAdditionalRequests(e.target.value)} rows={3} className={INPUT_CLASS} />
              </div>
            </div>

            <input
              type="text"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="hidden"
            />

            {submitError && (
              <p role="alert" className="text-sm text-red-600">
                {submitError}
              </p>
            )}

            <Button onClick={handleSubmit} disabled={isPending || !segmentNightsOk}>
              {isPending ? "Submitting…" : "Submit Holiday Request"}
            </Button>
          </div>
        )}
      </div>

      {displayBreakdown && step < 5 && (
        <div className="mt-4 flex items-center justify-between rounded-xl border border-neutral-200 bg-lagoon-50 px-4 py-3 text-sm">
          <span className="font-medium text-ocean-900">Live estimate</span>
          <span className="font-semibold text-ocean-900">USD {displayBreakdown.grandTotal.toFixed(2)}</span>
        </div>
      )}
      {displayPriceError && step < 5 && (
        <p role="alert" className="mt-2 text-xs text-amber-700">
          {displayPriceError}
        </p>
      )}

      <div className="mt-6 flex items-center justify-between">
        <Button variant="secondary" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
          Back
        </Button>
        {step < STEPS.length - 1 && (
          <Button onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))} disabled={step === 2 && !segmentNightsOk}>
            Next
          </Button>
        )}
      </div>
    </div>
  );
}
