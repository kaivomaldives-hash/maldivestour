import Link from "next/link";

import { PlaceSubmissionReviewList } from "@/components/admin/place-submission-review-list";
import { Pagination } from "@/components/ui/pagination";
import { getPlaceSubmissionsAdmin, PLACE_SUBMISSION_STATUSES } from "@/lib/admin/place-submissions-repository";

export default async function AdminPlaceSubmissionsPage({ searchParams }: { searchParams: Promise<{ status?: string; page?: string }> }) {
  const sp = await searchParams;
  const status =
    sp.status && (PLACE_SUBMISSION_STATUSES as readonly string[]).includes(sp.status)
      ? (sp.status as (typeof PLACE_SUBMISSION_STATUSES)[number])
      : undefined;
  const page = Math.max(1, Number(sp.page) || 1);

  const results = await getPlaceSubmissionsAdmin({ status, page });
  const totalPages = Math.max(1, Math.ceil(results.total / results.pageSize));

  return (
    <div>
      <h1 className="text-2xl font-semibold text-ocean-900">Place Submissions ({results.total})</h1>
      <p className="mt-1 text-sm text-neutral-600">
        Attractions, restaurants, shops, hospitals, schools, and gyms visitors propose from an island or atoll page. Approving a
        submission publishes it as a real listing on its category&rsquo;s own directory page.
      </p>

      <nav className="mt-4 flex gap-2 text-sm">
        <Link
          href="/admin/place-submissions"
          className={`rounded-full px-3.5 py-2 font-medium ${!status ? "bg-lagoon-100 text-ocean-900" : "text-neutral-600 hover:bg-neutral-100"}`}
        >
          All
        </Link>
        {PLACE_SUBMISSION_STATUSES.map((s) => (
          <Link
            key={s}
            href={`/admin/place-submissions?status=${s}`}
            className={`rounded-full px-3.5 py-2 font-medium capitalize ${status === s ? "bg-lagoon-100 text-ocean-900" : "text-neutral-600 hover:bg-neutral-100"}`}
          >
            {s}
          </Link>
        ))}
      </nav>

      <div className="mt-6">
        <PlaceSubmissionReviewList submissions={results.items} />
      </div>

      <Pagination page={page} totalPages={totalPages} basePath="/admin/place-submissions" baseQuery={status ? `status=${status}` : undefined} />
    </div>
  );
}
