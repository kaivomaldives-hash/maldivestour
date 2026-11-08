"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { getPartnerDocumentSignedUrl, updatePartnerDocumentStatus } from "@/lib/admin/partner-accounts-actions";
import { PARTNER_DOCUMENT_TYPES, type PartnerDocumentStatus, type PartnerDocumentType } from "@/lib/partner/types";
import { SignedUrlViewModal } from "@/components/admin/signed-url-view-modal";

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

/** "Sunset Guesthouse - Business tourism license.pdf": partner name + document
 * type, keeping the uploaded file's extension, so saved files are easy to
 * find and file later. Characters Windows/macOS reject in file names are
 * stripped. */
function downloadFileName(doc: DocumentItem, partnerName: string): string {
  const typeLabel = PARTNER_DOCUMENT_TYPES.find((t) => t.value === doc.documentType)?.label ?? "Document";
  const source = doc.fileName ?? doc.storagePath;
  const dot = source.lastIndexOf(".");
  const ext = dot > -1 && dot > source.lastIndexOf("/") ? source.slice(dot).toLowerCase() : "";
  const base = `${partnerName} - ${typeLabel}`.replace(/[\\/:*?"<>|]+/g, " ").replace(/\s+/g, " ").trim();
  return `${base}${ext}`;
}

/** Starts a browser download from an attachment-disposition URL. It's a
 * plain same-tab navigation to a file the server marks as a download, so
 * the page stays put and popup blockers don't apply (unlike window.open). */
function triggerDownload(url: string) {
  const a = document.createElement("a");
  a.href = url;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export function PartnerDocumentReviewList({ documents, partnerName = "Partner" }: { documents: DocumentItem[]; partnerName?: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [viewError, setViewError] = useState<string | null>(null);
  const [viewingUrl, setViewingUrl] = useState<string | null>(null);

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
                startTransition(async () => {
                  const result = await getPartnerDocumentSignedUrl(doc.storagePath);
                  if (!result.url) {
                    setViewError(result.error ?? "Could not open this document.");
                    return;
                  }
                  setViewingUrl(result.url);
                });
              }}
              className="text-sm font-medium text-maldives-600 hover:underline disabled:opacity-50"
            >
              View document
            </button>

            <button
              type="button"
              disabled={isPending}
              onClick={() => {
                setViewError(null);
                startTransition(async () => {
                  const result = await getPartnerDocumentSignedUrl(doc.storagePath, downloadFileName(doc, partnerName));
                  if (!result.url) {
                    setViewError(result.error ?? "Could not download this document.");
                    return;
                  }
                  triggerDownload(result.url);
                });
              }}
              className="inline-flex items-center gap-1 rounded-full border border-maldives-200 px-3 py-1 text-sm font-medium text-maldives-700 hover:bg-maldives-50 disabled:opacity-50"
            >
              <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path d="M10 3a1 1 0 0 1 1 1v7.59l2.3-2.3a1 1 0 1 1 1.4 1.42l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.42L9 11.6V4a1 1 0 0 1 1-1Z" />
                <path d="M4 15a1 1 0 0 1 1 1h10a1 1 0 1 1 0 2H5a2 2 0 0 1-2-2 1 1 0 0 1 1-1Z" />
              </svg>
              Download
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
      {viewingUrl && <SignedUrlViewModal url={viewingUrl} onClose={() => setViewingUrl(null)} />}
    </div>
  );
}
