import Link from "next/link";
import type { Metadata } from "next";

import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { DismissPayoutRequestButton } from "@/components/admin/dismiss-payout-request-button";
import { getPendingPayoutRequestsAdmin } from "@/lib/admin/payout-requests-repository";

export const metadata: Metadata = {
  title: "Payments | Admin | MTG",
  robots: { index: false, follow: false },
};

function money(amount: number, currency: string): string {
  return `${currency} ${amount.toFixed(2)}`;
}

/** Everything currently waiting on a manual payment action, from either
 * side of the programme — an affiliate's "Request Withdrawal" (MTG owes
 * them) or a partner's "Notify Payment Sent" (they owe MTG). Resolving
 * one for real happens on that affiliate's/partner's own admin page
 * (Record Payout / Record Payment Received), which clears it from here
 * automatically; "Dismiss" is only for a mistaken/duplicate submission. */
export default async function AdminPaymentsPage() {
  const requests = await getPendingPayoutRequestsAdmin();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-ocean-900">Payments ({requests.length})</h1>
      <p className="mt-1 text-sm text-neutral-600">
        Withdrawal requests from affiliates and payment notices from partners. Open the linked account to actually record the payout/payment — that
        clears the request from this list automatically.
      </p>

      {requests.length === 0 ? (
        <div className="mt-8">
          <EmptyState title="Nothing pending" description="No affiliate withdrawal requests or partner payment notices are waiting right now." />
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {requests.map((r) => (
            <li key={r.id} className="rounded-2xl border border-neutral-200 bg-white p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <Badge tone={r.partyType === "affiliate" ? "maldives" : "aqua"}>
                    {r.partyType === "affiliate" ? "Affiliate withdrawal" : "Partner payment sent"}
                  </Badge>
                  <p className="mt-2 text-sm font-medium text-neutral-900">
                    <Link href={r.partyHref} className="hover:underline">
                      {r.partyName}
                    </Link>
                  </p>
                  <p className="text-sm text-neutral-600">{money(r.requestedAmount, r.currency)}</p>
                  {r.note && <p className="mt-1 text-sm text-neutral-500">&ldquo;{r.note}&rdquo;</p>}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-sm text-neutral-500">{new Date(r.requestedAt).toLocaleDateString()}</span>
                  <DismissPayoutRequestButton requestId={r.id} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
