import "server-only";

import { BOOKING_STATUSES, type BookingStatus } from "@/lib/admin/booking-status";
import { getAdminPendingCounts } from "@/lib/admin/pending-counts";
import { createClient } from "@/lib/supabase/server";

/**
 * Real counts only — every number here is a live `count: "exact", head:
 * true` query against a table that actually exists, run as the signed-in
 * staff user (so it's governed by the same `*_staff_read`/`*_staff_all`
 * RLS policies as everything else, not a service-role bypass). No
 * revenue/traffic/conversion figures are computed anywhere in this file —
 * this app has no analytics/payment data to compute them from, and the
 * spec is explicit: don't invent statistics.
 */

export { BOOKING_STATUSES };
export type { BookingStatus };

export interface DashboardStats {
  bookingsByStatus: Record<BookingStatus, number>;
  bookingsTotal: number;
  customers: number;
  accommodations: number;
  activitiesTotal: number;
  activitiesFishing: number;
  activitiesDiving: number;
  activitiesSurfing: number;
  transferRoutes: number;
  packages: number;
  articles: number;
  providers: number;
  atolls: number;
  islands: number;
  media: number;
  reviewsPending: number;
  reviewsTotal: number;
  commentsTotal: number;
  commentsFlagged: number;
  partnerRequestsNew: number;
  partnerApplicationsPending: number;
  partnerListingsPending: number;
  agentApplicationsPending: number;
  affiliateApplicationsPending: number;
  paymentRequestsPending: number;
  redirects: number;
  listingsPublished: number;
  listingsDraft: number;
}

/** The node types that count as an actual public "listing" for the
 * published/draft overview cards — deliberately excludes location,
 * category, and provider (structural/taxonomy/directory entities, not
 * content someone publishes or drafts in the everyday sense). */
const LISTING_NODE_TYPES = ["accommodation", "activity", "transfer_route", "package", "article"];

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

async function countRows(supabase: SupabaseServerClient, table: string, filters: Record<string, string> = {}): Promise<number> {
  // Same placeholder-Database-types workaround as everywhere else in this
  // codebase (src/lib/bookings/notifications.ts, src/lib/bookings/
  // actions.ts) — src/types/database.ts has no real Tables map yet.
  let query = (supabase.from as (table: string) => ReturnType<typeof supabase.from>)(table).select("id", { count: "exact", head: true });
  for (const [column, value] of Object.entries(filters)) {
    query = query.eq(column, value);
  }
  const { count, error } = await query;
  if (error) {
    console.error(`[admin dashboard] count(${table}${Object.keys(filters).length ? `, ${JSON.stringify(filters)}` : ""}) failed:`, error.message);
    return 0;
  }
  return count ?? 0;
}

async function countListingsByStatus(supabase: SupabaseServerClient, status: string): Promise<number> {
  const { count, error } = await supabase
    .from("nodes")
    .select("id", { count: "exact", head: true })
    .in("node_type", LISTING_NODE_TYPES)
    .eq("status", status);
  if (error) {
    console.error(`[admin dashboard] count(nodes, listings, status=${status}) failed:`, error.message);
    return 0;
  }
  return count ?? 0;
}

async function getDashboardStatsUncached(): Promise<DashboardStats> {
  const supabase = await createClient();

  const [
    bookingCounts,
    customers,
    accommodations,
    activitiesTotal,
    activitiesFishing,
    activitiesDiving,
    activitiesSurfing,
    transferRoutes,
    packages,
    articles,
    providers,
    atolls,
    islands,
    media,
    reviewsPending,
    reviewsTotal,
    commentsTotal,
    commentsFlagged,
    pendingCounts,
    redirects,
    listingsPublished,
    listingsDraft,
  ] = await Promise.all([
    Promise.all(BOOKING_STATUSES.map((status) => countRows(supabase, "bookings", { status }))),
    countRows(supabase, "customers"),
    countRows(supabase, "accommodations"),
    countRows(supabase, "activities"),
    countRows(supabase, "activities", { activity_category: "fishing" }),
    countRows(supabase, "activities", { activity_category: "diving" }),
    countRows(supabase, "activities", { activity_category: "surfing" }),
    countRows(supabase, "transfer_routes"),
    countRows(supabase, "packages"),
    countRows(supabase, "articles"),
    countRows(supabase, "providers"),
    countRows(supabase, "locations", { location_type: "atoll" }),
    countRows(supabase, "locations", { location_type: "island" }),
    countRows(supabase, "media_assets"),
    countRows(supabase, "reviews", { status: "pending" }),
    countRows(supabase, "reviews"),
    countRows(supabase, "article_comments"),
    countRows(supabase, "article_comments", { status: "flagged" }),
    // Same underlying counts (and same 60s in-process cache) the admin
    // nav's sidebar badges use — see src/lib/admin/pending-counts.ts.
    getAdminPendingCounts(),
    countRows(supabase, "url_redirects"),
    countListingsByStatus(supabase, "published"),
    countListingsByStatus(supabase, "draft"),
  ]);

  const bookingsByStatus = Object.fromEntries(BOOKING_STATUSES.map((status, i) => [status, bookingCounts[i]])) as Record<
    BookingStatus,
    number
  >;

  return {
    bookingsByStatus,
    bookingsTotal: bookingCounts.reduce((sum, n) => sum + n, 0),
    customers,
    accommodations,
    activitiesTotal,
    activitiesFishing,
    activitiesDiving,
    activitiesSurfing,
    transferRoutes,
    packages,
    articles,
    providers,
    atolls,
    islands,
    media,
    reviewsPending,
    reviewsTotal,
    commentsTotal,
    commentsFlagged,
    partnerRequestsNew: pendingCounts.partnerLeads,
    partnerApplicationsPending: pendingCounts.partnerApplications,
    partnerListingsPending: pendingCounts.partnerListings,
    agentApplicationsPending: pendingCounts.agentApplications,
    affiliateApplicationsPending: pendingCounts.affiliateApplications,
    paymentRequestsPending: pendingCounts.paymentRequests,
    redirects,
    listingsPublished,
    listingsDraft,
  };
}

// This one page load fires ~27 separate count queries at once (one per
// card/filter above) -- every staff visit to /admin was re-running the
// whole burst uncached, which showed up as a cluster of Postgres
// statement-timeout and 500 errors during a 2026-10-12 load incident.
//
// This can NOT be wrapped in the usual cachedRead()/unstable_cache
// helper every other repository module uses: createClient() (above)
// reads next/headers cookies() to run as the signed-in staff user (it
// has to -- these counts are gated by is_staff()-checked RLS), and this
// fork's Next.js hard-errors ("used `cookies()` inside a function
// cached with `unstable_cache()`", error code E846) the moment a
// cookies()-reading call executes inside an unstable_cache callback.
// That's exactly what broke /admin after this was first wrapped in
// cachedRead. A plain in-process memo sidesteps Next's cache machinery
// entirely, at the cost of not being shared across serverless
// instances/cold starts -- an acceptable trade for a low-traffic admin
// page.
let statsCache: { value: DashboardStats; expiresAt: number } | null = null;
const STATS_CACHE_TTL_MS = 60_000;

export async function getDashboardStats(): Promise<DashboardStats> {
  if (statsCache && statsCache.expiresAt > Date.now()) {
    return statsCache.value;
  }
  const value = await getDashboardStatsUncached();
  statsCache = { value, expiresAt: Date.now() + STATS_CACHE_TTL_MS };
  return value;
}
