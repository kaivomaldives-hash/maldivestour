"use server";

import { revalidatePath } from "next/cache";

import { requireStaff } from "@/lib/admin/auth";
import { normalizeLegacyPath } from "@/lib/redirects/resolve";
import { getSiteUrl } from "@/lib/seo/site";
import { createClient } from "@/lib/supabase/server";

export interface AdminActionResult {
  ok: boolean;
  error?: string;
  /** createRedirect only: existing redirects that pointed at the new
   * source and were repointed at its target to avoid a chain. */
  repointed?: string[];
}

/** Flipping `is_active` is safe:
 * the chain-prevention trigger (`prevent_redirect_chains()`) re-runs on
 * every update including this one, but it only re-checks this row's own
 * unchanged source_path/target_path against the rest of the table — since
 * this update never touches those columns, a row that was valid stays
 * valid. It's also easily reversible, and exactly the "eventually" bar the
 * spec sets for this round. */
export async function toggleRedirectActive(id: string, isActive: boolean): Promise<AdminActionResult> {
  await requireStaff();

  const supabase = await createClient();
  const { error } = await supabase
    .from("url_redirects")
    .update({ is_active: isActive } as unknown as never)
    .eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/redirects");
  revalidatePath("/admin");
  return { ok: true };
}

/** Accepts either a site-relative path or a full URL on this site's own
 * domain (what an editor naturally pastes from the address bar) and
 * returns just the path. Anything on another domain is rejected -- the
 * redirect resolver only ever follows same-site paths (open-redirect
 * guard, see resolve.ts). */
function toSitePath(raw: string): string | null {
  const value = raw.trim();
  if (!value) return null;
  if (value.startsWith("/") && !value.startsWith("//")) return value.split(/[?#]/)[0];
  try {
    const url = new URL(value);
    const site = new URL(getSiteUrl());
    if (url.hostname.replace(/^www\./, "") !== site.hostname.replace(/^www\./, "")) return null;
    return url.pathname;
  } catch {
    return null;
  }
}

/** Creates a same-site path redirect. The source is stored normalized (no
 * trailing slash/query, matching how incoming requests are looked up);
 * the target keeps the site's trailing-slash convention. The database's
 * own chain-prevention trigger still has the final say -- its error is
 * passed back as a readable message rather than a raw exception. */
export async function createRedirect(input: { source: string; target: string; statusCode: number; notes?: string }): Promise<AdminActionResult> {
  await requireStaff();

  const sourceRaw = toSitePath(input.source);
  const targetRaw = toSitePath(input.target);
  if (!sourceRaw) return { ok: false, error: "Source must be a path on this site (e.g. /maldives/transfers/old-slug/) or a full URL on this site." };
  if (!targetRaw) return { ok: false, error: "Target must be a path on this site or a full URL on this site." };

  const sourcePath = normalizeLegacyPath(sourceRaw);
  const targetPath = targetRaw.endsWith("/") || /\.[a-z0-9]+$/i.test(targetRaw) ? targetRaw : `${targetRaw}/`;
  if (sourcePath === "/") return { ok: false, error: "The homepage can't be redirected." };
  if (normalizeLegacyPath(targetPath) === sourcePath) return { ok: false, error: "Source and target are the same page." };
  const statusCode = [301, 302, 308].includes(input.statusCode) ? input.statusCode : 301;

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("url_redirects")
    .select("id")
    .in("source_path", [sourcePath, `${sourcePath}/`])
    .limit(1)
    .returns<Array<{ id: string }>>();
  if (existing && existing.length > 0) return { ok: false, error: `A redirect from ${sourcePath} already exists — search for it below to enable/disable or delete it.` };

  // Chain checks, tolerant of a trailing slash on either side (the
  // database trigger below compares exact strings only).
  const targetNormalized = normalizeLegacyPath(targetPath);
  const [{ data: targetIsSource }, { data: pointsAtSource }] = await Promise.all([
    supabase.from("url_redirects").select("id").eq("is_active", true).in("source_path", [targetNormalized, `${targetNormalized}/`]).limit(1).returns<Array<{ id: string }>>(),
    supabase.from("url_redirects").select("id, source_path").eq("is_active", true).in("target_path", [sourcePath, `${sourcePath}/`]).returns<Array<{ id: string; source_path: string }>>(),
  ]);
  if (targetIsSource && targetIsSource.length > 0) return { ok: false, error: "The target is itself redirected somewhere else — point this redirect at the final page instead." };

  // Redirects that already point AT this source (e.g. an old-site .html
  // URL -> the page now being retired) are repointed straight at the new
  // target first, so visitors and crawlers get one hop instead of a chain
  // -- which the database's chain-prevention trigger would reject anyway.
  const repointed = (pointsAtSource ?? []).filter((r) => normalizeLegacyPath(r.source_path) !== targetNormalized);
  if (repointed.length > 0) {
    const { error: repointError } = await supabase
      .from("url_redirects")
      .update({ target_path: targetPath } as unknown as never)
      .in("id", repointed.map((r) => r.id));
    if (repointError) return { ok: false, error: repointError.message };
  }

  const { error } = await supabase.from("url_redirects").insert({
    source_path: sourcePath,
    target_type: "path",
    target_path: targetPath,
    status_code: statusCode,
    is_active: true,
    notes: input.notes?.trim() || null,
  } as unknown as never);
  if (error) {
    if (error.message.includes("redirect chain: target_path")) return { ok: false, error: "The target is itself redirected somewhere else — point this redirect at the final page instead." };
    if (error.message.includes("redirect chain: source_path")) return { ok: false, error: "Another redirect already points to this source — update that one to point at the final page instead." };
    return { ok: false, error: error.message };
  }

  revalidatePath("/admin/redirects");
  revalidatePath("/admin");
  return { ok: true, repointed: repointed.map((r) => r.source_path) };
}

export async function deleteRedirect(id: string): Promise<AdminActionResult> {
  await requireStaff();

  const supabase = await createClient();
  const { error } = await supabase.from("url_redirects").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/redirects");
  revalidatePath("/admin");
  return { ok: true };
}
