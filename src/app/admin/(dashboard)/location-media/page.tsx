import Link from "next/link";

import { LocationMediaSubmissionReviewList } from "@/components/admin/location-media-submission-review-list";
import { Pagination } from "@/components/ui/pagination";
import { getLocationMediaSubmissionsAdmin, LOCATION_MEDIA_SUBMISSION_STATUSES } from "@/lib/admin/location-media-submissions-repository";

export default async function AdminLocationMediaPage({ searchParams }: { searchParams: Promise<{ status?: string; page?: string }> }) {
  const sp = await searchParams;
  const status =
    sp.status && (LOCATION_MEDIA_SUBMISSION_STATUSES as readonly string[]).includes(sp.status)
      ? (sp.status as (typeof LOCATION_MEDIA_SUBMISSION_STATUSES)[number])
      : undefined;
  const page = Math.max(1, Number(sp.page) || 1);

  const results = await getLocationMediaSubmissionsAdmin({ status, page });
  const totalPages = Math.max(1, Math.ceil(results.total / results.pageSize));

  return (
    <div>
      <h1 className="text-2xl font-semibold text-ocean-900">Location Media Submissions ({results.total})</h1>
      <p className="mt-1 text-sm text-neutral-600">
        Photos guests submit on island, atoll, attraction, and dive site pages. Approving a submission publishes all of its photos to that
        location&rsquo;s gallery.
      </p>

      <nav className="mt-4 flex gap-2 text-sm">
        <Link
          href="/admin/location-media"
          className={`rounded-full px-3.5 py-2 font-medium ${!status ? "bg-lagoon-100 text-ocean-900" : "text-neutral-600 hover:bg-neutral-100"}`}
        >
          All
        </Link>
        {LOCATION_MEDIA_SUBMISSION_STATUSES.map((s) => (
          <Link
            key={s}
            href={`/admin/location-media?status=${s}`}
            className={`rounded-full px-3.5 py-2 font-medium capitalize ${status === s ? "bg-lagoon-100 text-ocean-900" : "text-neutral-600 hover:bg-neutral-100"}`}
          >
            {s}
          </Link>
        ))}
      </nav>

      <div className="mt-6">
        <LocationMediaSubmissionReviewList submissions={results.items} />
      </div>

      <Pagination page={page} totalPages={totalPages} basePath="/admin/location-media" baseQuery={status ? `status=${status}` : undefined} />
    </div>
  );
}
