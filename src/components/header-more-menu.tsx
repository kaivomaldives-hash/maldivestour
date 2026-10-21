"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { ChevronRightIcon } from "@/components/ui/icons";

// Exported so the mobile nav panel (site-header.tsx), which is already a
// single flat list rather than a dropdown, can render the same 5 items
// inline instead of duplicating this list.
export const MORE_NAV_ITEMS = [
  { label: "Travel Guide", href: "/maldives/travel-guide/" },
  { label: "Resorts", href: "/maldives/resorts/" },
  { label: "Hotels", href: "/maldives/hotels/" },
  { label: "Guesthouses", href: "/maldives/guesthouses/" },
  // No dedicated accommodation-type page exists yet (no real per-vessel
  // inventory — see ACCOMMODATION_TYPE_SEGMENT's own comment in
  // src/lib/accommodations/types.ts), same reasoning as the mobile bottom
  // nav's own Liveaboards entry.
  { label: "Liveaboards", href: "/maldives/packages/liveaboard/" },
] as const;

function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(href);
}

/** Desktop header "More" dropdown — replaces the old standalone "Travel
 * Guide" nav tab with a trigger that groups it alongside the
 * accommodation-type pages that otherwise had no spot in the primary nav.
 * Closes on an outside click/tap, on Escape, and on route change (the
 * last via a key={pathname} remount, same pattern as the mobile bottom
 * nav's own expand/collapse state — see that component's comment on why
 * that's preferred over an effect calling setState). */
export function HeaderMoreMenu() {
  const pathname = usePathname();
  return <MoreMenuButton key={pathname} pathname={pathname} />;
}

function MoreMenuButton({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const active = MORE_NAV_ITEMS.some((item) => isActive(pathname, item.href));

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
          active ? "bg-lagoon-100 text-ocean-900" : "text-neutral-600 hover:bg-neutral-100 hover:text-ocean-900"
        }`}
      >
        Pages
        <ChevronRightIcon className={`h-3.5 w-3.5 transition-transform ${open ? "-rotate-90" : "rotate-90"}`} />
      </button>
      {open && (
        <div role="menu" className="absolute left-0 z-50 mt-2 w-48 rounded-xl border border-neutral-200 bg-white py-1 shadow-lg">
          {MORE_NAV_ITEMS.map((item) => {
            const itemActive = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                role="menuitem"
                onClick={() => setOpen(false)}
                aria-current={itemActive ? "page" : undefined}
                className={`block px-4 py-2 text-sm ${itemActive ? "bg-lagoon-100 text-ocean-900" : "text-neutral-700 hover:bg-neutral-100"}`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
