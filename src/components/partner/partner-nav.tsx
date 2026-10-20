"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/partner" },
  { label: "My Listings", href: "/partner/listings" },
  { label: "Bookings", href: "/partner/bookings" },
  { label: "Payments", href: "/partner/payments" },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/partner") return pathname === "/partner";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Same shape as AdminNav (src/components/admin/admin-nav.tsx) -- vertical
 * nav for the sidebar layout, `onNavigate` lets the mobile drawer close
 * itself on link tap. */
export function PartnerNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Partner" className="flex flex-col gap-0.5">
      {NAV_ITEMS.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              active ? "bg-lagoon-100 text-ocean-900" : "text-neutral-600 hover:bg-neutral-100 hover:text-ocean-900"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
