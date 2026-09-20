"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { CONTAINER_CLASS } from "@/components/ui/container";
import { CloseIcon, MenuIcon } from "@/components/ui/icons";

const PRIMARY_NAV = [
  { label: "Maldives", href: "/maldives/" },
  { label: "Resorts", href: "/maldives/resorts/" },
  { label: "Activities", href: "/maldives/activities/" },
  { label: "Diving", href: "/maldives/diving/" },
  { label: "Fishing", href: "/maldives/fishing/" },
  { label: "Transfers", href: "/maldives/transfers/" },
  { label: "Packages", href: "/maldives/packages/" },
];

const WHATSAPP_URL = "https://wa.me/9607794332";

function isActive(pathname: string, href: string): boolean {
  if (href === "/maldives/") return pathname === "/maldives" || pathname === "/maldives/";
  return pathname === href || pathname.startsWith(href);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close the mobile panel on route change so it never lingers open.
  // Adjusting state during render (React's recommended pattern for
  // resetting state in response to a prop/derived value changing) rather
  // than in an effect, which would cause an extra render pass.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setMobileOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className={`${CONTAINER_CLASS} flex h-16 items-center justify-between gap-4`}>
        <Link href="/" className="flex shrink-0 items-baseline gap-1.5 font-semibold text-ocean-900">
          <span className="text-lg tracking-tight sm:text-xl">
            <span className="text-maldives-600">MTG</span>
          </span>
          <span className="hidden text-sm font-medium text-neutral-500 sm:inline">Maldives Tour Guide</span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {PRIMARY_NAV.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                  active ? "bg-lagoon-100 text-ocean-900" : "text-neutral-600 hover:bg-neutral-100 hover:text-ocean-900"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden shrink-0 lg:block">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-maldives-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-ocean-800"
          >
            Get in touch
          </a>
        </div>

        <button
          type="button"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav-panel"
          onClick={() => setMobileOpen((open) => !open)}
          className="min-touch-target inline-flex items-center justify-center rounded-full text-ocean-900 transition-colors hover:bg-neutral-100 lg:hidden"
        >
          {mobileOpen ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div id="mobile-nav-panel" className="border-t border-neutral-200 bg-white lg:hidden">
          <nav aria-label="Primary" className={`${CONTAINER_CLASS} flex flex-col gap-1 py-3`}>
            {PRIMARY_NAV.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-lg px-3 py-2.5 text-base font-medium transition-colors ${
                    active ? "bg-lagoon-100 text-ocean-900" : "text-neutral-700 hover:bg-neutral-100"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center justify-center rounded-full bg-maldives-600 px-4 py-2.5 text-sm font-medium text-white"
            >
              Get in touch
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
