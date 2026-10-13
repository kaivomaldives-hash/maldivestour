import { notFound } from "next/navigation";

import { AffiliateProfileForm } from "@/components/affiliate/affiliate-profile-form";
import { getMyAffiliateAccount } from "@/lib/affiliate/repository";

export default async function AffiliateDashboardPage() {
  const account = await getMyAffiliateAccount();
  if (!account) notFound();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-ocean-900">Your Profile</h1>

      {account.status === "pending" && (
        <p className="mt-2 rounded-xl border border-aqua-200 bg-aqua-50 p-4 text-sm text-neutral-700">
          Your application is awaiting review. Referral links and commission only activate once you&rsquo;re approved — you can still
          update your details below in the meantime.
        </p>
      )}
      {account.status === "approved" && (
        <div className="mt-2 rounded-xl border border-maldives-200 bg-maldives-50 p-4 text-sm text-neutral-700">
          <p>You&rsquo;re approved. Share your referral code with customers — they get 5% off, and you earn 5% commission on eligible bookings.</p>
          <p className="mt-3">
            <span className="font-medium text-neutral-900">Your referral code: </span>
            <span className="font-mono text-base font-semibold text-ocean-900">{account.referralCode}</span>
          </p>
        </div>
      )}
      {account.status === "rejected" && account.rejectionReason && (
        <p className="mt-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-neutral-700">
          <span className="font-medium text-red-700">Changes requested: </span>
          {account.rejectionReason}
        </p>
      )}
      {account.status === "suspended" && (
        <p className="mt-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-neutral-700">
          Your account is currently suspended — your referral code is inactive. Contact us if you believe this is a mistake.
        </p>
      )}

      <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-4">
        <AffiliateProfileForm account={account} />
      </div>
    </div>
  );
}
