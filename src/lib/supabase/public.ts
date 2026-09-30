import { createClient as createSupabaseClient, type SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";

/**
 * Supabase client for public, read-only content (resorts, activities,
 * islands, articles, etc.) fetched in Server Components.
 *
 * Deliberately does NOT read `next/headers` cookies, unlike
 * `@/lib/supabase/server`'s createClient(). Every public page is rendered
 * for anonymous visitors under the same anon-key RLS policies regardless of
 * whether a session cookie is present, so there is no behavioral difference
 * for this content — but calling `cookies()` anywhere in a route's render
 * tree opts the entire route out of static rendering/ISR in Next's caching
 * model, forcing a fresh Supabase round trip on every single page view.
 * Using this stateless client instead lets `export const revalidate` (and
 * plain static rendering where no revalidate is set) actually take effect.
 *
 * Only use this for read paths that don't depend on the visitor's own
 * session (no `supabase.auth.*`, no user-scoped RLS). Anything that needs
 * the signed-in user — admin pages, booking/review writes, auth checks —
 * must keep using `@/lib/supabase/server`, which is correctly per-request
 * there (it captures that request's cookies) and must stay that way.
 *
 * This client carries no per-request state at all, so — unlike
 * server.ts's — it's safe to build once per server process and reuse
 * across every request, instead of constructing a fresh
 * PostgREST/GoTrue/Realtime wrapper on every one of the many repository
 * calls a single page render makes.
 */
let cachedClient: SupabaseClient<Database> | undefined;

export function createClient() {
  if (!cachedClient) {
    cachedClient = createSupabaseClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      },
    );
  }
  return cachedClient;
}
