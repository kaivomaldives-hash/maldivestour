"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin" },
  { label: "Bookings", href: "/admin/bookings" },
  { label: "Reviews", href: "/admin/reviews" },
  { label: "Comments", href: "/admin/comments" },
  { label: "Accommodations", href: "/admin/accommodations" },
  { label: "Activities", href: "/admin/activities" },
  { label: "Transfers", href: "/admin/transfers" },
  { label: "Packages", href: "/admin/packages" },
  { label: "Articles", href: "/admin/articles" },
  { label: "Providers", href: "/admin/providers" },
  { label: "Locations", href: "/admin/locations" },
  { label: "Redirects", href: "/admin/redirects" },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Vertical nav for the sidebar layout — `onNavigate` lets the mobile
 * drawer (AdminSidebar) close itself on link tap without this component
 * needing to know anything about that drawer's open/closed state. */
export function AdminNav({ isAdmin, onNavigate }: { isAdmin: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();
  const items = isAdmin ? [...NAV_ITEMS, { label: "Users", href: "/admin/users" }] : NAV_ITEMS;

  return (
    <nav aria-label="Admin" className="flex flex-col gap-0.5">
      {items.map((item) => {
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
