"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { AdminPendingCounts } from "@/lib/admin/pending-counts";

interface NavLink {
  label: string;
  href: string;
  countKey?: keyof AdminPendingCounts;
}

interface NavSection {
  heading?: string;
  items: NavLink[];
}

// Grouped so the five partner/application-related items (previously a
// flat run of "Providers, Vendors, Partner Applications, Partner
// Listings, Travel Agents, Affiliates" that the site owner found
// confusing) sit together under one heading, separate from "Providers"
// — which is a content attribution tag on listings (who operates an
// activity/accommodation), not a partner account or application at
// all, and so lives under Content instead.
const NAV_SECTIONS: NavSection[] = [
  { items: [{ label: "Dashboard", href: "/admin" }] },
  {
    heading: "Bookings & Guests",
    items: [
      { label: "Bookings", href: "/admin/bookings" },
      { label: "Offer Requests", href: "/admin/holiday-requests" },
      { label: "Customers", href: "/admin/customers" },
      { label: "Reviews", href: "/admin/reviews" },
      { label: "Comments", href: "/admin/comments" },
      { label: "Location Comments", href: "/admin/location-comments" },
      { label: "Page Comments", href: "/admin/node-comments" },
      { label: "Location Media", href: "/admin/location-media" },
      { label: "Place Submissions", href: "/admin/place-submissions", countKey: "placeSubmissions" },
    ],
  },
  {
    heading: "Content",
    items: [
      { label: "Accommodations", href: "/admin/accommodations" },
      { label: "Activities", href: "/admin/activities" },
      { label: "Transfers", href: "/admin/transfers" },
      { label: "Packages", href: "/admin/packages" },
      { label: "Holiday Pricing", href: "/admin/holiday-pricing" },
      { label: "Articles", href: "/admin/articles" },
      { label: "Providers", href: "/admin/providers" },
      { label: "Locations", href: "/admin/locations" },
    ],
  },
  {
    // "Vendors" renamed to "Partner Leads" — it's just inbound "Become a
    // Partner" footer-form contact requests, not an account of any kind,
    // which the old name implied and which collided with "Partner
    // Applications" (actual self-service accounts from /partner/signup).
    heading: "Partners",
    items: [
      { label: "Partner Applications", href: "/admin/partners", countKey: "partnerApplications" },
      { label: "Partner Listings", href: "/admin/partner-listings", countKey: "partnerListings" },
      { label: "Partner Leads", href: "/admin/vendors", countKey: "partnerLeads" },
      { label: "Travel Agents", href: "/admin/agents", countKey: "agentApplications" },
      { label: "Affiliates", href: "/admin/affiliates", countKey: "affiliateApplications" },
      { label: "Payments", href: "/admin/payments", countKey: "paymentRequests" },
    ],
  },
  {
    heading: "Site",
    items: [{ label: "Redirects", href: "/admin/redirects" }],
  },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function CountBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span className="ml-auto inline-flex min-w-[1.25rem] items-center justify-center rounded-full bg-maldives-600 px-1.5 py-0.5 text-[11px] font-semibold leading-none text-white">
      {count > 99 ? "99+" : count}
    </span>
  );
}

/** Vertical nav for the sidebar layout — `onNavigate` lets the mobile
 * drawer (AdminSidebar) close itself on link tap without this component
 * needing to know anything about that drawer's open/closed state.
 * `pendingCounts` drives the per-item badges (new partner leads,
 * applications awaiting review, listings awaiting moderation) and the
 * total next to "Dashboard" — see src/lib/admin/pending-counts.ts. */
export function AdminNav({
  isAdmin,
  pendingCounts,
  onNavigate,
}: {
  isAdmin: boolean;
  pendingCounts: AdminPendingCounts;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const totalPending = Object.values(pendingCounts).reduce((sum, n) => sum + n, 0);

  const sections = isAdmin
    ? [...NAV_SECTIONS.slice(0, -1), { ...NAV_SECTIONS[NAV_SECTIONS.length - 1], items: [...NAV_SECTIONS[NAV_SECTIONS.length - 1].items, { label: "Users", href: "/admin/users" }] }]
    : NAV_SECTIONS;

  return (
    <nav aria-label="Admin" className="flex flex-col gap-0.5">
      {sections.map((section, i) => (
        <div key={section.heading ?? `section-${i}`} className={i > 0 ? "mt-4" : undefined}>
          {section.heading && (
            <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-neutral-400">{section.heading}</p>
          )}
          {section.items.map((item) => {
            const active = isActive(pathname, item.href);
            const count = item.countKey ? pendingCounts[item.countKey] : item.href === "/admin" ? totalPending : 0;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active ? "bg-lagoon-100 text-ocean-900" : "text-neutral-600 hover:bg-neutral-100 hover:text-ocean-900"
                }`}
              >
                <span>{item.label}</span>
                <CountBadge count={count} />
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
