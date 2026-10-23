"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { FooterSocialLinks } from "@/components/footer-social-links";
import { FooterSubscribeForm } from "@/components/footer-subscribe-form";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { CONTAINER_CLASS } from "@/components/ui/container";
import { WhatsAppIcon } from "@/components/ui/icons";
import { getChromeStrings } from "@/lib/i18n/chrome-strings";
import { localizedSiteHref } from "@/lib/i18n/hub-paths";
import { localeFromPathname, type Locale } from "@/lib/i18n/locales";
import { getUiStrings } from "@/lib/i18n/ui-strings";

// `labelKey` indexes ui.footerLinks; `href` is the real English URL.
// Every link goes through localizedSiteHref: translated hubs stay in the
// visitor's language, and pages with no translated route yet (activity
// and transfer categories, surfing, place directories, ferries) keep
// their plain English URL rather than a guessed one that would 404.
const TRAVEL_LINKS = [
  { labelKey: "maldives", href: "/maldives/" },
  { labelKey: "atolls", href: "/maldives/atolls/" },
  { labelKey: "islands", href: "/maldives/islands/" },
  { labelKey: "resorts", href: "/maldives/resorts/" },
  { labelKey: "hotels", href: "/maldives/hotels/" },
  { labelKey: "guesthouses", href: "/maldives/guesthouses/" },
  { labelKey: "activities", href: "/maldives/activities/" },
  { labelKey: "fishing", href: "/maldives/fishing/" },
  { labelKey: "diving", href: "/maldives/diving/" },
  { labelKey: "surfing", href: "/maldives/surfing/" },
  { labelKey: "snorkeling", href: "/maldives/snorkeling/" },
  { labelKey: "excursions", href: "/maldives/excursions/" },
  { labelKey: "sandbankTours", href: "/maldives/sandbank-tours/" },
  { labelKey: "waterSports", href: "/maldives/water-sports/" },
  { labelKey: "islandHopping", href: "/maldives/island-hopping/" },
  { labelKey: "dolphinWhaleWatching", href: "/maldives/dolphin-whale-watching/" },
  { labelKey: "sightseeing", href: "/maldives/sightseeing/" },
  { labelKey: "transfers", href: "/maldives/transfers/" },
  { labelKey: "airportTransfers", href: "/maldives/airport-transfers/" },
  { labelKey: "resortTransfers", href: "/maldives/resort-transfers/" },
  { labelKey: "islandTransfers", href: "/maldives/island-transfers/" },
  { labelKey: "speedboatCharter", href: "/maldives-speedboats-charter/" },
  { labelKey: "ferrySchedule", href: "/maldives-ferry-schedule/" },
  { labelKey: "packages", href: "/maldives/packages/" },
  { labelKey: "travelGuide", href: "/maldives/travel-guide/" },
  { labelKey: "attractions", href: "/maldives/attractions/" },
  { labelKey: "restaurants", href: "/maldives/restaurants/" },
  { labelKey: "shops", href: "/maldives/shops/" },
  { labelKey: "hospitals", href: "/maldives/hospitals/" },
  { labelKey: "schools", href: "/maldives/schools/" },
  { labelKey: "gyms", href: "/maldives/gyms/" },
] as const;

const WHATSAPP_URL = "https://wa.me/9607794332";

export function SiteFooter({ availableLocales }: { availableLocales: Locale[] }) {
  const year = new Date().getFullYear();
  const locale = localeFromPathname(usePathname());
  const ui = getUiStrings(locale);
  const t = ui.footerLinks;
  const c = getChromeStrings(locale);

  return (
    <footer className="border-t border-neutral-200 bg-ocean-950 text-lagoon-100">
      <div className={`${CONTAINER_CLASS} py-12`}>
        <div className="grid gap-10 lg:grid-cols-[2fr_3fr_2fr]">
          <div>
            <p className="text-lg font-semibold text-white">
              <span className="text-lagoon-300">MTG</span> · Maldives Tour Guide
            </p>
            <p className="mt-3 max-w-xs text-sm text-lagoon-100/80">
              {c.footerTagline}
            </p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20"
            >
              <WhatsAppIcon className="h-4 w-4" />
              {c.whatsappChat}
            </a>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-lagoon-300">{c.footerTravelHeading}</p>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-3">
              {TRAVEL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={localizedSiteHref(locale, link.href)}
                    className="text-lagoon-100/80 transition-colors hover:text-white"
                  >
                    {t[link.labelKey]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <FooterSocialLinks />
            <FooterSubscribeForm />
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href="/become-a-partner/"
                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20"
              >
                {c.becomePartner}
              </Link>
              <Link
                href="/affiliate/signup/"
                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20"
              >
                {c.becomeAffiliate}
              </Link>
              <Link
                href="/agent/signup/"
                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20"
              >
                {c.becomeAgent}
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-lagoon-100/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} Maldives Tour Guide (MTG). {c.rights} ·{" "}
            <Link href="/terms-and-conditions/" className="underline hover:text-white">
              {c.terms}
            </Link>{" "}
            ·{" "}
            <Link href="/privacy-policy/" className="underline hover:text-white">
              {c.privacy}
            </Link>
          </p>
          <LanguageSwitcher publishedLocales={availableLocales} variant="dark" />
        </div>
      </div>
    </footer>
  );
}
