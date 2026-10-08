import Link from "next/link";

import { FooterSocialLinks } from "@/components/footer-social-links";
import { FooterSubscribeForm } from "@/components/footer-subscribe-form";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { CONTAINER_CLASS } from "@/components/ui/container";
import { WhatsAppIcon } from "@/components/ui/icons";
import type { Locale } from "@/lib/i18n/locales";

const TRAVEL_LINKS = [
  { label: "Maldives", href: "/maldives/" },
  { label: "Atolls", href: "/maldives/atolls/" },
  { label: "Islands", href: "/maldives/islands/" },
  { label: "Resorts", href: "/maldives/resorts/" },
  { label: "Hotels", href: "/maldives/hotels/" },
  { label: "Guesthouses", href: "/maldives/guesthouses/" },
  { label: "Activities", href: "/maldives/activities/" },
  { label: "Fishing", href: "/maldives/fishing/" },
  { label: "Diving", href: "/maldives/diving/" },
  { label: "Surfing", href: "/maldives/surfing/" },
  { label: "Transfers", href: "/maldives/transfers/" },
  { label: "Airport Transfers", href: "/maldives/airport-transfers/" },
  { label: "Resort Transfers", href: "/maldives/resort-transfers/" },
  { label: "Island Transfers", href: "/maldives/island-transfers/" },
  { label: "Private Speedboat Charter", href: "/maldives-speedboats-charter/" },
  { label: "Ferry Schedule", href: "/maldives-ferry-schedule/" },
  { label: "Packages", href: "/maldives/packages/" },
  { label: "Travel Guide", href: "/maldives/travel-guide/" },
];

const WHATSAPP_URL = "https://wa.me/9607794332";

export function SiteFooter({ availableLocales }: { availableLocales: Locale[] }) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-neutral-200 bg-ocean-950 text-lagoon-100">
      <div className={`${CONTAINER_CLASS} py-12`}>
        <div className="grid gap-10 lg:grid-cols-[2fr_3fr_2fr]">
          <div>
            <p className="text-lg font-semibold text-white">
              <span className="text-lagoon-300">MTG</span> · Maldives Tour Guide
            </p>
            <p className="mt-3 max-w-xs text-sm text-lagoon-100/80">
              A directory and travel guide for the Maldives — real atolls, islands, resorts, activities and transfers,
              sourced and kept up to date.
            </p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Chat with us on WhatsApp
            </a>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-lagoon-300">Travel</p>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-3">
              {TRAVEL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-lagoon-100/80 transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <FooterSocialLinks />
            <FooterSubscribeForm />
            <Link
              href="/become-a-partner/"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20"
            >
              Become a Partner
            </Link>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-lagoon-100/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} Maldives Tour Guide (MTG). All information is provided for travel planning purposes. ·{" "}
            <Link href="/terms-and-conditions/" className="underline hover:text-white">
              Terms and Conditions
            </Link>
          </p>
          <LanguageSwitcher publishedLocales={availableLocales} variant="dark" />
        </div>
      </div>
    </footer>
  );
}
