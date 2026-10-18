import "server-only";

import { createClient } from "@/lib/supabase/server";

/**
 * Counts behind the admin nav's per-item badges and the dashboard's
 * "Needs attention" tiles for everything partner-related: leads from
 * the "Become a Partner" footer form, self-service partner/agent/
 * affiliate applications awaiting review, and listing submissions
 * awaiting moderation. Read on every admin page load (via the sidebar
 * layout), so this is cached the same in-process-memo-with-TTL way as
 * getDashboardStats() in ./dashboard.ts, and for the identical reason
 * given there: this has to run as the signed-in staff user (cookies()-
 * gated RLS), which rules out wrapping it in unstable_cache.
 */
export interface AdminPendingCounts {
  partnerLeads: number;
  partnerApplications: number;
  partnerListings: number;
  agentApplications: number;
  affiliateApplications: number;
}

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

async function countRows(supabase: SupabaseServerClient, table: string, filters: Record<string, string>): Promise<number> {
  let query = (supabase.from as (table: string) => ReturnType<typeof supabase.from>)(table).select("id", { count: "exact", head: true });
  for (const [column, value] of Object.entries(filters)) {
    query = query.eq(column, value);
  }
  const { count, error } = await query;
  if (error) {
    console.error(`[admin pending-counts] count(${table}, ${JSON.stringify(filters)}) failed:`, error.message);
    return 0;
  }
  return count ?? 0;
}

async function getAdminPendingCountsUncached(): Promise<AdminPendingCounts> {
  const supabase = await createClient();
  const [partnerLeads, partnerApplications, partnerListings, agentApplications, affiliateApplications] = await Promise.all([
    countRows(supabase, "partner_requests", { status: "new" }),
    countRows(supabase, "partner_accounts", { onboarding_status: "submitted" }),
    countRows(supabase, "listing_submissions", { status: "pending" }),
    countRows(supabase, "agent_accounts", { status: "pending" }),
    countRows(supabase, "affiliate_accounts", { status: "pending" }),
  ]);
  return { partnerLeads, partnerApplications, partnerListings, agentApplications, affiliateApplications };
}

let countsCache: { value: AdminPendingCounts; expiresAt: number } | null = null;
const COUNTS_CACHE_TTL_MS = 60_000;

export async function getAdminPendingCounts(): Promise<AdminPendingCounts> {
  if (countsCache && countsCache.expiresAt > Date.now()) {
    return countsCache.value;
  }
  const value = await getAdminPendingCountsUncached();
  countsCache = { value, expiresAt: Date.now() + COUNTS_CACHE_TTL_MS };
  return value;
}
