"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { LOCALE_NAMES, SUPPORTED_LOCALES, type Locale } from "@/lib/i18n/locales";

/**
 * Only lists locales that currently have at least a published homepage
 * (passed in from the server — see src/app/layout.tsx) plus English,
 * which always exists. This is a deliberate scoping choice for the
 * initial rollout (Task 19 §54 "quality over quantity"): listing all 9
 * supported languages here today would mean 7 of them go nowhere real,
 * since only German has published content. As more locales get their
 * homepage published, they start appearing here automatically — no
 * code change needed, this list is driven by real published rows.
 *
 * Target-page resolution (Task 19 §16): if the visitor is on the
 * homepage or the Maldives hub, the switcher sends them to that same
 * page in the target locale (when published). For every other page —
 * individual activity/accommodation/article pages don't have per-entity
 * translations published yet — it falls back to that locale's Maldives
 * hub rather than fabricating a URL or silently doing nothing. If the
 * target locale isn't published at all, the current page doesn't
 * change (there's nothing better to offer yet).
 */
export function LanguageSwitcher({ publishedLocales }: { publishedLocales: Locale[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const availableLocales: Locale[] = ["en", ...SUPPORTED_LOCALES.filter((l) => l !== "en" && publishedLocales.includes(l))];
  if (availableLocales.length <= 1) return null;

  const segments = pathname.split("/").filter(Boolean);
  const currentLocale: Locale = (SUPPORTED_LOCALES as readonly string[]).includes(segments[0]) ? (segments[0] as Locale) : "en";
  const pathAfterLocale = currentLocale === "en" ? pathname : `/${segments.slice(1).join("/")}`;
  const isHomepage = pathAfterLocale === "/" || pathAfterLocale === "";
  const isMaldivesHub = pathAfterLocale === "/maldives" || pathAfterLocale === "/maldives/";

  function targetHref(locale: Locale): string {
    const prefix = locale === "en" ? "" : `/${locale}`;
    if (isHomepage) return locale === "en" ? "/" : publishedLocales.includes(locale) ? `${prefix}/` : pathname;
    if (isMaldivesHub) return locale === "en" ? "/maldives/" : publishedLocales.includes(locale) ? `${prefix}/maldives/` : pathname;
    // Any other page: no per-entity translation lookup wired in yet --
    // fall back to that locale's Maldives hub if it's published.
    if (locale === "en") return "/maldives/";
    return publishedLocales.includes(locale) ? `${prefix}/maldives/` : pathname;
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Language"
        onClick={() => setOpen((v) => !v)}
        className="min-touch-target inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-ocean-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-maldives-600"
      >
        {LOCALE_NAMES[currentLocale].nativeName}
      </button>
      {open && (
        <ul role="listbox" aria-label="Choose language" className="absolute right-0 z-50 mt-1 min-w-[10rem] rounded-lg border border-neutral-200 bg-white py-1 shadow-lg">
          {availableLocales.map((locale) => (
            <li key={locale} role="option" aria-selected={locale === currentLocale}>
              <Link
                href={targetHref(locale)}
                onClick={() => setOpen(false)}
                className={`block px-4 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-maldives-600 ${
                  locale === currentLocale ? "bg-lagoon-100 font-medium text-ocean-900" : "text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                {LOCALE_NAMES[locale].nativeName}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
