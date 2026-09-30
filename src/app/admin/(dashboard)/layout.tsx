import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { requireStaff } from "@/lib/admin/auth";

export const metadata: Metadata = {
  title: "Admin | MTG",
  robots: { index: false, follow: false },
};

/**
 * Every route under this group (`src/app/admin/(dashboard)/*`) renders
 * behind requireStaff() — a Server Component check that runs before any
 * child page's own code, for every request, including a direct URL hit
 * with no JavaScript. `/admin/login` deliberately sits OUTSIDE this route
 * group (a sibling, not a child) so it isn't itself gated by the check that
 * would otherwise redirect an unauthenticated visitor straight back to it.
 *
 * Sidebar layout: AdminSidebar is fixed/sticky on the left on lg+ screens
 * and a slide-in drawer below that, behind a hamburger in its own mobile
 * top bar — see that component for why it owns its own open/closed state.
 */
export default async function AdminDashboardLayout({ children }: { children: ReactNode }) {
  const { email, isAdmin } = await requireStaff();

  return (
    <div className="min-h-screen bg-sand-50 lg:flex">
      <AdminSidebar isAdmin={isAdmin} email={email} />
      <main className="min-w-0 flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
