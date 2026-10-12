"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin, requireStaff } from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export interface AdminActionResult {
  ok: boolean;
  error?: string;
}

const ROLES = ["user", "editor", "admin"] as const;

/**
 * Role changes go through the RLS-respecting client, never the
 * service-role one — `profiles_admin_all` (is_admin()) and
 * prevent_profile_role_self_escalation() are the real, existing
 * enforcement for this, and this action deliberately doesn't bypass them.
 * requireAdmin() here is defense in depth on top of that, same reasoning
 * as bookings-actions.ts.
 */
export async function updateUserRole(userId: string, role: string): Promise<AdminActionResult> {
  const { userId: callerId } = await requireAdmin();
  if (!(ROLES as readonly string[]).includes(role)) return { ok: false, error: "Invalid role." };
  if (userId === callerId && role !== "admin") {
    return { ok: false, error: "You can't remove your own admin access from here." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ role } as unknown as never)
    .eq("id", userId);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/users");
  return { ok: true };
}

/**
 * Invites a new staff account by email (Supabase Auth sends the invite —
 * actual delivery depends on the project's configured email provider,
 * separate from the Resend key used for booking notifications). The
 * initial role IS set via the service-role client here, not the RLS path:
 * this is an authorized admin (gated by requireAdmin() below) provisioning
 * a brand-new account on their own initiative, not that account escalating
 * itself — the same reasoning scripts/bootstrap-admin.mjs documents for
 * the very first admin. Every role change AFTER this one goes through
 * updateUserRole()'s normal RLS-respecting path.
 */
export async function inviteStaffUser(email: string, role: string): Promise<AdminActionResult> {
  await requireAdmin();
  const trimmed = email.trim();
  if (!trimmed || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(trimmed)) return { ok: false, error: "Enter a valid email address." };
  if (role !== "editor" && role !== "admin") return { ok: false, error: "Invite role must be editor or admin." };

  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.inviteUserByEmail(trimmed);
  if (error || !data.user) return { ok: false, error: error?.message ?? "Failed to send invite." };

  const { error: roleError } = await admin.from("profiles").update({ role } as unknown as never).eq("id", data.user.id);
  if (roleError) return { ok: false, error: `Invited, but failed to set role: ${roleError.message}` };

  revalidatePath("/admin/users");
  return { ok: true };
}

/** Self-service -- any signed-in staff member (not just admins) can edit
 * their own display_name/bio/home_country. Never touches role or any
 * other staff member's row: requireStaff() establishes who's calling and
 * the update is always scoped to that id, never a client-supplied one. */
export async function updateMyProfile(fields: { displayName: string | null; bio: string | null; homeCountry: string | null }): Promise<AdminActionResult> {
  const { userId } = await requireStaff();

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      display_name: fields.displayName,
      bio: fields.bio,
      home_country: fields.homeCountry,
    } as unknown as never)
    .eq("id", userId);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/profile");
  return { ok: true };
}

/**
 * Permanently removes a staff account -- both the auth.users row (via the
 * service-role client, the only way to delete an auth user at all) and,
 * through profiles' `on delete cascade` FK to auth.users, its profiles
 * row along with it. Irreversible: there's no equivalent "undo" the way
 * updateUserRole() has (just set the role back), so the UI confirms
 * before calling this (see DeleteUserButton).
 */
export async function deleteUser(userId: string): Promise<AdminActionResult> {
  const { userId: callerId } = await requireAdmin();
  if (userId === callerId) return { ok: false, error: "You can't delete your own account from here." };

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(userId);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/users");
  return { ok: true };
}
