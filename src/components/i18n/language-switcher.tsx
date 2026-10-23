"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { useEntityLocaleLinks } from "@/components/i18n/entity-locale-links-context";
import { GlobeIcon } from "@/components/ui/icons";
import { hubPrefixForPath, localizeHubPath } from "@/lib/i18n/hub-paths";
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
 * Target-page resolution (Task 19 §16, generalized in Task 22, and
 * again to cover every hub page -- not just the top-level Maldives hub
 * -- after Task 22 shipped fishing/diving/activities): if the visitor
 * is on the homepage, or on any registered hub page itself (Maldives,
 * packages, transfers, travel guide, fishing, diving, activities --
 * see hubPrefixForPath), the switcher sends them to that SAME hub in
 * the target locale (when published). On any translated entity's
 * detail page (article, package, transfer route, fishing/diving/
 * activity trip), a RegisterEntityLocaleLinks call (rendered by that
 * page) has registered the entity's real per-locale paths via
 * EntityLocaleLinksProvider -- the switcher uses those when present,
 * since an entity's translated slug differs per locale and can't be
 * derived from the current pathname, falling back to THAT entity
 * type's own hub (not generically the Maldives hub) for a locale with
 * no translation of this specific entity yet. For every other page —
 * entity types with no per-entity translations published at all yet —
 * it falls back to that locale's Maldives hub rather than fabricating
 * a URL or silently doing nothing. If the target locale isn't
 * published at all, the current page doesn't change (there's nothing
 * better to offer yet).
 */
export function LanguageSwitcher({
  publishedLocales,
  variant = "light",
  align = "right",
}: {
  publishedLocales: Locale[];
  /** "light" (default) is the header/mobile-nav styling, for a white
   * background. "dark" is for the footer's dark bg-ocean-950 panel. */
  variant?: "light" | "dark";
  /** Which edge of the trigger button the dropdown panel opens from.
   * Default "right" fits every call site where this control sits near
   * the right side of its row (desktop header, footer). Pass "left" at
   * a call site where the trigger instead sits near the left edge of a
   * narrow container (the header's mobile nav panel) -- a right-anchored
   * panel there is wider than the button and extends further left than
   * the viewport, getting clipped. */
  align?: "left" | "right";
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { links: entityLocaleLinks } = useEntityLocaleLinks();

  const availableLocales: Locale[] = ["en", ...SUPPORTED_LOCALES.filter((l) => l !== "en" && publishedLocales.includes(l))];
  if (availableLocales.length <= 1) return null;

  const segments = pathname.split("/").filter(Boolean);
  const currentLocale: Locale = (SUPPORTED_LOCALES as readonly string[]).includes(segments[0]) ? (segments[0] as Locale) : "en";
  const pathAfterLocale = currentLocale === "en" ? pathname : `/${segments.slice(1).join("/")}`;
  const isHomepage = pathAfterLocale === "/" || pathAfterLocale === "";
  // Matches the full pathname against EVERY registered hub page (not
  // just "/maldives/") for the locale we're actually on -- a plain
  // string match on "/maldives/" would never fire for "/maldives/packages/"
  // etc, and silently stops matching once a hub segment itself gets
  // localized per locale (see hubPrefixForPath's own docs).
  const currentHubPrefix = hubPrefixForPath(currentLocale, pathname);

  function targetHref(locale: Locale): string {
    const prefix = locale === "en" ? "" : `/${locale}`;
    if (isHomepage) return locale === "en" ? "/" : publishedLocales.includes(locale) ? `${prefix}/` : pathname;
    if (currentHubPrefix) return locale === "en" ? currentHubPrefix : publishedLocales.includes(locale) ? localizeHubPath(locale, currentHubPrefix) : pathname;
    if (entityLocaleLinks) {
      // On a translated entity's detail page (article, package,
      // transfer route): use that entity's real translated path when
      // this locale has one, else fall back to its own hub (more
      // relevant than the whole Maldives hub) rather than a URL that 404s.
      const entityPath = entityLocaleLinks.paths[locale];
      if (entityPath) return entityPath;
      if (locale === "en") return entityLocaleLinks.fallbackHubPath;
      return publishedLocales.includes(locale) ? localizeHubPath(locale, entityLocaleLinks.fallbackHubPath) : pathname;
    }
    // Any other page: no per-entity translation lookup wired in yet --
    // fall back to that locale's Maldives hub if it's published.
    if (locale === "en") return "/maldives/";
    return publishedLocales.includes(locale) ? localizeHubPath(locale, "/maldives/") : pathname;
  }

  const triggerClass =
    variant === "dark"
      ? "min-touch-target inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-lagoon-100/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lagoon-300"
      : "min-touch-target inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-ocean-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-maldives-600";

  return (
    <div className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Language"
        onClick={() => setOpen((v) => !v)}
        className={triggerClass}
      >
        <GlobeIcon className="h-4 w-4" />
        {LOCALE_NAMES[currentLocale].nativeName}
      </button>
      {open && (
        <ul
          role="listbox"
          aria-label="Choose language"
          className={`absolute z-50 mt-1 min-w-[10rem] rounded-lg border border-neutral-200 bg-white py-1 shadow-lg ${align === "left" ? "left-0" : "right-0"}`}
        >
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
