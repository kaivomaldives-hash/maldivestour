"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";

import { BedIcon, BoatIcon, CompassIcon, DivingIcon, FishIcon, GlobeIcon, MapPinIcon, PackageIcon } from "@/components/ui/icons";
import { getChromeStrings } from "@/lib/i18n/chrome-strings";
import { localizedSiteHref } from "@/lib/i18n/hub-paths";
import { localeFromPathname, type Locale } from "@/lib/i18n/locales";
import { getUiStrings } from "@/lib/i18n/ui-strings";

// `labelKey` indexes ui.footerLinks (or chrome strings for Liveaboards);
// `href` is the real English URL, sent through localizedSiteHref so the
// bar keeps the visitor in their own language wherever that page exists.
const PRIMARY_ITEMS = [
  { labelKey: "resorts", href: "/maldives/resorts/", Icon: BedIcon },
  { labelKey: "activities", href: "/maldives/activities/", Icon: CompassIcon },
  { labelKey: "fishing", href: "/maldives/fishing/", Icon: FishIcon },
  { labelKey: "diving", href: "/maldives/diving/", Icon: DivingIcon },
  { labelKey: "transfers", href: "/maldives/transfers/", Icon: BoatIcon },
] as const;

// Liveaboards has no dedicated accommodation-type directory yet (no real
// per-vessel inventory — see ACCOMMODATION_TYPE_SEGMENT's own comment in
// src/lib/accommodations/types.ts), so this points at the one real,
// populated liveaboard page that exists today rather than a page with
// nothing on it.
const SECONDARY_ITEMS = [
  { labelKey: "guesthouses", href: "/maldives/guesthouses/", Icon: BedIcon },
  { labelKey: "liveaboards", href: "/maldives/packages/liveaboard/", Icon: BoatIcon },
  { labelKey: "packages", href: "/maldives/packages/", Icon: PackageIcon },
  { labelKey: "attractions", href: "/maldives/attractions/", Icon: MapPinIcon },
  { labelKey: "maldives", href: "/maldives/", Icon: GlobeIcon },
] as const;

type NavItem = (typeof PRIMARY_ITEMS)[number] | (typeof SECONDARY_ITEMS)[number];

function localizeItems(items: readonly NavItem[], locale: Locale) {
  const ui = getUiStrings(locale);
  const chrome = getChromeStrings(locale);
  return items.map((item) => ({
    ...item,
    label: item.labelKey === "liveaboards" ? chrome.liveaboards : ui.footerLinks[item.labelKey],
    href: localizedSiteHref(locale, item.href),
  }));
}

// Swipe up this many pixels on the bar to reveal the second row; swipe
// down by the same amount to hide it again.
const SWIPE_THRESHOLD_PX = 24;

/**
 * Fixed, mobile-only app-style bottom navigation (Task 12 §5), extended
 * with a second, hidden row of 5 more destinations (guesthouses,
 * liveaboards, packages, attractions, the Maldives hub) revealed by
 * swiping up on the bar, or tapping the small handle above it. A
 * full-screen backdrop behind the bar (but below it in z-index) closes
 * the second row on a tap anywhere else, and it always starts collapsed —
 * on first mount, and again on every route change. That reset is a plain
 * `key={pathname}` remount of the stateful inner component (React's own
 * recommended way to reset state on a prop change) rather than an effect
 * calling setState, so a reload or a new page never carries the expanded
 * state over.
 */
export function MobileBottomNav() {
  const pathname = usePathname();
  return <BottomNavBar key={pathname} pathname={pathname} />;
}

function BottomNavBar({ pathname }: { pathname: string }) {
  const [expanded, setExpanded] = useState(false);
  const locale = localeFromPathname(pathname);
  const primary = localizeItems(PRIMARY_ITEMS, locale);
  const secondary = localizeItems(SECONDARY_ITEMS, locale);
  const maldivesHref = localizedSiteHref(locale, "/maldives/");
  const chrome = getChromeStrings(locale);
  const touchStartY = useRef<number | null>(null);

  function onTouchStart(event: React.TouchEvent) {
    touchStartY.current = event.touches[0]?.clientY ?? null;
  }

  function onTouchEnd(event: React.TouchEvent) {
    const startY = touchStartY.current;
    touchStartY.current = null;
    if (startY === null) return;
    const endY = event.changedTouches[0]?.clientY ?? startY;
    const deltaY = startY - endY;
    if (deltaY > SWIPE_THRESHOLD_PX) setExpanded(true);
    else if (deltaY < -SWIPE_THRESHOLD_PX) setExpanded(false);
  }

  return (
    <>
      {expanded && <div className="fixed inset-0 z-30 bg-black/20 lg:hidden" onClick={() => setExpanded(false)} aria-hidden="true" />}

      <nav
        aria-label="Primary"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-neutral-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90 lg:hidden"
      >
        {/* A floating pull-tab above the bar, not inside its normal flow —
            the collapsed bar keeps the exact same single-row height it
            always had (no layout.tsx padding change needed), and this
            just gives swiping up something visible to grab/tap too. */}
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          aria-label={expanded ? chrome.fewerDestinations : chrome.moreDestinations}
          className="absolute -top-5 left-1/2 flex h-5 w-12 -translate-x-1/2 items-center justify-center"
        >
          <span className="h-1 w-9 rounded-full bg-neutral-300" />
        </button>

        {expanded && (
          <ul className="grid grid-cols-5 border-t border-neutral-100">
            {secondary.map(({ label, href, Icon }) => {
              const active = pathname === href || (href !== maldivesHref && pathname.startsWith(href));
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className="min-touch-target flex flex-col items-center justify-center gap-0.5 py-2 text-[11px] font-medium text-neutral-500 transition-colors hover:text-maldives-600"
                  >
                    <Icon className={`h-6 w-6 ${active ? "text-maldives-600" : "text-neutral-400"}`} />
                    <span className={active ? "text-maldives-600" : ""}>{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}

        <ul className="grid grid-cols-5">
          {primary.map(({ label, href, Icon }) => {
            const active = pathname === href || pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className="min-touch-target flex flex-col items-center justify-center gap-0.5 py-2 text-[11px] font-medium text-neutral-500 transition-colors hover:text-maldives-600"
                >
                  <Icon className={`h-6 w-6 ${active ? "text-maldives-600" : "text-neutral-400"}`} />
                  <span className={active ? "text-maldives-600" : ""}>{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
