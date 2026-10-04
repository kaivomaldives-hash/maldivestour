import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { getBookingsAdmin } from "@/lib/admin/bookings-repository";
import { getDashboardStats } from "@/lib/admin/dashboard";

const BOOKING_STATUS_TONE: Record<string, "neutral" | "maldives" | "aqua" | "outline"> = {
  new: "outline",
  contacted: "aqua",
  pending: "aqua",
  confirmed: "maldives",
  cancelled: "neutral",
  completed: "neutral",
};

const BOOKING_STATUS_LABEL: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  pending: "Pending",
  confirmed: "Confirmed",
  cancelled: "Cancelled",
  completed: "Completed",
};

function StatTile({ label, value, href }: { label: string; value: number; href?: string }) {
  const content = (
    <>
      <p className="text-2xl font-semibold text-ocean-900">{value.toLocaleString()}</p>
      <p className="mt-1 text-sm text-neutral-600">{label}</p>
    </>
  );
  const className = "rounded-2xl border border-neutral-200 bg-white p-4 transition-colors hover:border-maldives-300";
  return href ? (
    <Link href={href} className={className}>
      {content}
    </Link>
  ) : (
    <div className={className}>{content}</div>
  );
}

export default async function AdminDashboardPage() {
  const [stats, recentBookings] = await Promise.all([getDashboardStats(), getBookingsAdmin({ page: 1 })]);
  const recent = recentBookings.items.slice(0, 5);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold text-ocean-900">Dashboard</h1>
        <p className="mt-1 text-sm text-neutral-600">Live counts from the database — nothing here is estimated.</p>
      </div>

      <section>
        <h2 className="text-lg font-semibold text-ocean-900">Overview</h2>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatTile label="Pending bookings" value={stats.bookingsByStatus.pending} href="/admin/bookings?status=pending" />
          <StatTile label="Confirmed bookings" value={stats.bookingsByStatus.confirmed} href="/admin/bookings?status=confirmed" />
          <StatTile label="Customers" value={stats.customers} href="/admin/customers" />
          <StatTile label="Reviews awaiting approval" value={stats.reviewsPending} href="/admin/reviews?status=pending" />
          <StatTile label="Published listings" value={stats.listingsPublished} />
          <StatTile label="Draft listings" value={stats.listingsDraft} />
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-ocean-900">Bookings ({stats.bookingsTotal})</h2>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {Object.entries(stats.bookingsByStatus).map(([status, count]) => (
            <StatTile key={status} label={BOOKING_STATUS_LABEL[status] ?? status} value={count} href={`/admin/bookings?status=${status}`} />
          ))}
        </div>

        {recent.length > 0 && (
          <div className="mt-4 overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-neutral-200 bg-neutral-50 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                <tr>
                  <th className="px-4 py-3">Reference</th>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Submitted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {recent.map((b) => (
                  <tr key={b.id} className="hover:bg-neutral-50">
                    <td className="px-4 py-3">
                      <Link href={`/admin/bookings/${b.id}`} className="font-mono text-xs font-medium text-maldives-600 hover:underline">
                        {b.bookingReference}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-neutral-700">{b.productTitle}</td>
                    <td className="px-4 py-3 text-neutral-600">{b.customerName}</td>
                    <td className="px-4 py-3">
                      <Badge tone={BOOKING_STATUS_TONE[b.status] ?? "neutral"}>{BOOKING_STATUS_LABEL[b.status] ?? b.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-neutral-500">{new Date(b.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold text-ocean-900">Content</h2>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          <StatTile label="Accommodations" value={stats.accommodations} href="/admin/accommodations" />
          <StatTile label="Activities (total)" value={stats.activitiesTotal} href="/admin/activities" />
          <StatTile label="Fishing activities" value={stats.activitiesFishing} href="/admin/activities" />
          <StatTile label="Diving activities" value={stats.activitiesDiving} href="/admin/activities" />
          <StatTile label="Surfing activities" value={stats.activitiesSurfing} href="/admin/activities" />
          <StatTile label="Transfer routes" value={stats.transferRoutes} href="/admin/transfers" />
          <StatTile label="Packages" value={stats.packages} href="/admin/packages" />
          <StatTile label="Articles" value={stats.articles} href="/admin/articles" />
          <StatTile label="Providers" value={stats.providers} href="/admin/providers" />
          <StatTile label="Atolls" value={stats.atolls} href="/admin/locations" />
          <StatTile label="Islands" value={stats.islands} href="/admin/locations" />
          <StatTile label="Media assets" value={stats.media} />
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-ocean-900">Needs attention</h2>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatTile label="Reviews pending" value={stats.reviewsPending} href="/admin/reviews?status=pending" />
          <StatTile label="Reviews (total)" value={stats.reviewsTotal} href="/admin/reviews" />
          <StatTile label="Comments flagged" value={stats.commentsFlagged} href="/admin/comments?status=flagged" />
          <StatTile label="Comments (total)" value={stats.commentsTotal} href="/admin/comments" />
          <StatTile label="New partner requests" value={stats.partnerRequestsNew} href="/admin/vendors?status=new" />
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-ocean-900">SEO</h2>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatTile label="URL redirects" value={stats.redirects} href="/admin/redirects" />
        </div>
      </section>
    </div>
  );
}
