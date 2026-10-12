import type { Metadata } from "next";

import { ProfileForm } from "@/components/admin/profile-form";
import { requireStaff } from "@/lib/admin/auth";
import { getMyProfile } from "@/lib/admin/users-repository";

export const metadata: Metadata = {
  title: "My Profile | Admin | MTG",
  robots: { index: false, follow: false },
};

/** Self-service profile editor -- any signed-in staff member (editor or
 * admin) can reach this via the account menu in AdminSidebar. Deliberately
 * separate from /admin/users (admin-only, everyone else's roles): this
 * page only ever reads/writes the caller's own profiles row. */
export default async function AdminProfilePage() {
  const { userId, email, isAdmin } = await requireStaff();
  const profile = await getMyProfile(userId);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-ocean-900">My Profile</h1>
      <p className="mt-1 text-sm text-neutral-600">{email}</p>

      <div className="mt-6 max-w-lg rounded-2xl border border-neutral-200 bg-white p-6">
        <ProfileForm
          displayName={profile?.displayName ?? ""}
          bio={profile?.bio ?? ""}
          homeCountry={profile?.homeCountry ?? ""}
          role={profile?.role ?? (isAdmin ? "admin" : "editor")}
        />
      </div>
    </div>
  );
}
