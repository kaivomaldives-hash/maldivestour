"use client";

import Link from "next/link";
import { useState } from "react";

import { Price } from "@/components/currency/price";
import { WhatsAppIcon } from "@/components/ui/icons";
import { quoteFishingPackage, type FishingCalculatorConfig } from "@/lib/fishing/package-calculator-rates";
import { whatsappUrl } from "@/lib/whatsapp";

const SELECT_CLASS = "h-11 w-full min-w-0 rounded-lg border border-neutral-300 bg-white px-3 text-sm font-normal text-neutral-800";

/**
 * Fishing package calculator: one shared boat per fishing day, full-board
 * twin-share rooms and return transfers, priced per group and per person.
 * `config` is the admin-edited settings (getFishingCalculatorConfig()). `showPageLink`
 * adds a link to the standalone /maldives/fishing/calculator/ page (used
 * on the hub embed).
 */
export function FishingPackageCalculator({ config, showPageLink = false }: { config: FishingCalculatorConfig; showPageLink?: boolean }) {
  const packages = config.packages.filter((item) => item.active);
  const [location, setLocation] = useState(config.locations[0].key);
  const [charter, setCharter] = useState((packages.find((item) => item.key === "fullReef") ?? packages[0]).key);
  const [days, setDays] = useState((config.durations.find((item) => item.days === 4) ?? config.durations[0]).days);
  const [guests, setGuests] = useState(Math.min(2, config.maxGuests));

  const destination = config.locations.find((item) => item.key === location) ?? config.locations[0];
  const selectedCharter = packages.find((item) => item.key === charter) ?? packages[0];
  const quote = quoteFishingPackage(config, destination.key, selectedCharter.key, days, guests);
  if (!quote) return null;
  const minSaving = config.durations.find((item) => item.discount > 0);
  const maxSaving = config.durations[config.durations.length - 1];

  const requestMessage = [
    "Hi, I would like to book a fishing package.",
    `Atoll: ${destination.label}`,
    `Fishing type: ${selectedCharter.label}`,
    `Package: ${days} fishing days · ${quote.nights} nights`,
    `Guests: ${guests}`,
    `Calculator quote: USD ${Math.round(quote.total).toLocaleString("en-US")} total (USD ${Math.round(quote.perPerson).toLocaleString("en-US")} per person)`,
    "Dates:",
  ].join("\n");

  return (
    <div className="rounded-2xl border border-neutral-200 bg-[#f4fbfa] p-5 sm:p-7">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-maldives-600">Build your fishing package</p>
          <h2 id="fishing-package-calculator-heading" className="mt-1 text-xl font-semibold text-ocean-900 sm:text-2xl">
            Fishing Package Calculator
          </h2>
        </div>
        {showPageLink && (
          <Link href="/maldives/fishing/calculator/" className="text-sm font-medium text-maldives-600 hover:underline">
            Open the calculator page →
          </Link>
        )}
      </div>
      <p className="mt-2 max-w-3xl text-sm text-neutral-700">
        One shared boat per fishing day, full-board twin-share accommodation and return transfers. Every package includes arrival and
        departure nights, so fishing days + 1 = total nights, with one room for every two guests. Stay longer and the saving grows
        automatically.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="grid min-w-0 gap-2 text-sm font-semibold text-neutral-800">
          Atoll
          <select value={location} onChange={(e) => setLocation(e.target.value)} className={SELECT_CLASS}>
            {config.locations.map((item) => (
              <option key={item.key} value={item.key}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label className="grid min-w-0 gap-2 text-sm font-semibold text-neutral-800">
          Fishing type
          <select value={selectedCharter.key} onChange={(e) => setCharter(e.target.value)} className={SELECT_CLASS}>
            {packages.map((item) => (
              <option key={item.key} value={item.key}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label className="grid min-w-0 gap-2 text-sm font-semibold text-neutral-800">
          Package days
          <select value={days} onChange={(e) => setDays(Number(e.target.value))} className={SELECT_CLASS}>
            {config.durations.map(({ days: value }) => (
              <option key={value} value={value}>
                {value} fishing days · {value + 1} nights
              </option>
            ))}
          </select>
        </label>
        <label className="grid min-w-0 gap-2 text-sm font-semibold text-neutral-800">
          Guests
          <select value={guests} onChange={(e) => setGuests(Number(e.target.value))} className={SELECT_CLASS}>
            {Array.from({ length: config.maxGuests }, (_, i) => i + 1).map((value) => (
              <option key={value} value={value}>
                {value} {value === 1 ? "guest" : "guests"}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3" aria-live="polite">
        <div className="rounded-xl bg-ocean-900 p-5 text-white">
          <p className="text-sm text-white/70">Total group package</p>
          <Price baseAmount={quote.total} className="mt-1 block text-3xl font-semibold" />
          <p className="text-xs text-white/70">
            {quote.rooms} twin-share {quote.rooms === 1 ? "room" : "rooms"} · {quote.nights} nights
          </p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <p className="text-sm text-neutral-600">Per person</p>
          <Price baseAmount={quote.perPerson} className="mt-1 block text-3xl font-semibold text-ocean-900" />
          <p className="text-xs text-neutral-600">
            {guests} {guests === 1 ? "guest" : "guests"} sharing one boat
          </p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <p className="text-sm text-neutral-600">Long-stay benefit</p>
          {quote.usedPublishedRate ? (
            <>
              <p className="mt-1 text-3xl font-semibold text-maldives-600">Fixed rate</p>
              <p className="text-xs text-neutral-600">Published per-person package rate</p>
            </>
          ) : (
            <>
              <p className="mt-1 text-3xl font-semibold text-maldives-600">{Math.round(quote.discount * 100)}% saved</p>
              <p className="text-xs text-neutral-600">Compared with the standard package rate</p>
            </>
          )}
        </div>
      </div>

      <a
        href={whatsappUrl(requestMessage)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-maldives-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-ocean-800"
      >
        <WhatsAppIcon className="h-4 w-4" />
        Request this fishing package
      </a>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {[
          "Shared private charter with captain, crew and fuel",
          "Full-board meals and twin-share guest-house accommodation",
          `Return ${destination.transferLabel} transfer and airport/jetty meet-and-greet`,
        ].map((item) => (
          <div key={item} className="flex gap-2 rounded-xl border border-neutral-200 bg-white p-3 text-sm text-neutral-700">
            <span aria-hidden="true" className="font-semibold text-maldives-600">
              ✓
            </span>
            {item}
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-neutral-200 bg-white p-4">
          <p className="text-sm font-semibold text-ocean-900">Charter rates per boat, per fishing day</p>
          <ul className="mt-3 grid grid-cols-2 gap-2 text-sm">
            {packages.map((item) => (
              <li key={item.key} className="rounded-lg bg-neutral-50 p-2">
                <span className="block text-xs text-neutral-600">{item.label}</span>
                <Price baseAmount={item.pricePerDay} className="font-semibold text-ocean-900" />
              </li>
            ))}
          </ul>
        </div>
        <div className="grid gap-3">
          {config.fleet.map((boat) => (
            <div key={boat.name} className="rounded-xl border border-neutral-200 bg-white p-4">
              <p className="text-base font-semibold text-ocean-900">{boat.name}</p>
              <p className="mt-1 text-sm font-medium text-neutral-800">{boat.detail}</p>
              <p className="mt-1 text-xs text-neutral-600">{boat.facts}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-4 text-xs text-neutral-600">
        Rates are calculated per group and divided per person.
        {minSaving && maxSaving.discount > 0
          ? ` Package savings increase from ${Math.round(minSaving.discount * 100)}% at ${minSaving.days} days to ${Math.round(maxSaving.discount * 100)}% at ${maxSaving.days} days.`
          : ""}{" "}
        Some packages use fixed published per-person rates at certain atolls. Final prices are confirmed when you book.
      </p>
    </div>
  );
}
