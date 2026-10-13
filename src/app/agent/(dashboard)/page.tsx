import { notFound } from "next/navigation";

import { AgentProfileForm } from "@/components/agent/agent-profile-form";
import { getMyAgentAccount } from "@/lib/agent/repository";

export default async function AgentDashboardPage() {
  const account = await getMyAgentAccount();
  if (!account) notFound();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-ocean-900">Your Profile</h1>

      {account.status === "pending" && (
        <p className="mt-2 rounded-xl border border-aqua-200 bg-aqua-50 p-4 text-sm text-neutral-700">
          Your application is awaiting review. We&rsquo;ll be in touch once it&rsquo;s approved — you can still update your details below in
          the meantime.
        </p>
      )}
      {account.status === "approved" && (
        <p className="mt-2 rounded-xl border border-maldives-200 bg-maldives-50 p-4 text-sm text-neutral-700">
          You&rsquo;re approved. Sign in while booking an eligible rate and your 10% discount applies automatically — the original rate,
          discount, and final price are always shown clearly before you confirm.
        </p>
      )}
      {account.status === "rejected" && account.rejectionReason && (
        <p className="mt-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-neutral-700">
          <span className="font-medium text-red-700">Changes requested: </span>
          {account.rejectionReason}
        </p>
      )}
      {account.status === "suspended" && (
        <p className="mt-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-neutral-700">
          Your account is currently suspended. Contact us if you believe this is a mistake.
        </p>
      )}

      <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-4">
        <AgentProfileForm account={account} />
      </div>
    </div>
  );
}
