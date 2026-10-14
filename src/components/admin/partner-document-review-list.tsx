"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { getPartnerDocumentSignedUrl, updatePartnerDocumentStatus } from "@/lib/admin/partner-accounts-actions";
import { PARTNER_DOCUMENT_TYPES, type PartnerDocumentStatus, type PartnerDocumentType } from "@/lib/partner/types";

interface DocumentItem {
  id: string;
  documentType: PartnerDocumentType;
  storagePath: string;
  fileName: string | null;
  status: PartnerDocumentStatus;
  adminNote: string | null;
}

const STATUS_CLASS: Record<PartnerDocumentStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-maldives-100 text-maldives-800",
  rejected: "bg-red-100 text-red-700",
};

export function PartnerDocumentReviewList({ documents }: { documents: DocumentItem[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [viewError, setViewError] = useState<string | null>(null);

  if (documents.length === 0) {
    return <p className="text-sm text-neutral-500">No documents uploaded yet.</p>;
  }

  return (
    <div className="space-y-3">
      {viewError && <p className="text-sm text-red-600">{viewError}</p>}
      {documents.map((doc) => (
        <div key={doc.id} className="rounded-xl border border-neutral-200 p-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-sm font-medium text-neutral-900">{PARTNER_DOCUMENT_TYPES.find((t) => t.value === doc.documentType)?.label}</p>
              <p className="text-xs text-neutral-500">{doc.fileName ?? "File"}</p>
            </div>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_CLASS[doc.status]}`}>{doc.status}</span>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              disabled={isPending}
              onClick={() => {
                setViewError(null);
                // Open the tab synchronously, in direct response to the
                // click — a window.open() called only after the awaited
                // signed-url fetch below is no longer treated as
                // user-initiated by most browsers (Safari in particular),
                // so it's silently blocked or, if a "popup blocked" prompt
                // delays it, the tab can end up loading the signed URL
                // well after its (previously 60s) expiry, showing a
                // Supabase sign-in/expired-token page instead of the
                // document — exactly the "different link opens, can't
                // view the document" symptom this was reported as.
                const tab = window.open("", "_blank", "noopener,noreferrer");
                startTransition(async () => {
                  const result = await getPartnerDocumentSignedUrl(doc.storagePath);
                  if (!result.url) {
                    tab?.close();
                    setViewError(result.error ?? "Could not open this document.");
                    return;
                  }
                  if (!tab) {
                    setViewError("Your browser blocked the popup — please allow popups for this site and try again.");
                    return;
                  }
                  tab.location.href = result.url;
                });
              }}
              className="text-sm font-medium text-maldives-600 hover:underline disabled:opacity-50"
            >
              View document
            </button>

            {doc.status !== "approved" && (
              <button
                type="button"
                disabled={isPending}
                onClick={() => {
                  startTransition(async () => {
                    await updatePartnerDocumentStatus(doc.id, "approved", null);
                    router.refresh();
                  });
                }}
                className="text-sm font-medium text-neutral-600 hover:text-maldives-700 disabled:opacity-50"
              >
                Approve
              </button>
            )}
            {doc.status !== "rejected" && (
              <button
                type="button"
                disabled={isPending}
                onClick={() => {
                  const note = window.prompt("Reason (shown to the partner):") ?? "";
                  startTransition(async () => {
                    await updatePartnerDocumentStatus(doc.id, "rejected", note);
                    router.refresh();
                  });
                }}
                className="text-sm font-medium text-neutral-600 hover:text-red-600 disabled:opacity-50"
              >
                Reject
              </button>
            )}
          </div>
          {doc.adminNote && <p className="mt-1 text-xs text-neutral-500">{doc.adminNote}</p>}
        </div>
      ))}
    </div>
  );
}
