"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { deletePartnerDocument, uploadPartnerDocument } from "@/lib/partner/document-actions";
import { PARTNER_DOCUMENT_TYPES, type PartnerDocument, type PartnerDocumentType } from "@/lib/partner/types";

const STATUS_LABEL: Record<string, string> = { pending: "Pending review", approved: "Approved", rejected: "Rejected" };
const STATUS_CLASS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-maldives-100 text-maldives-800",
  rejected: "bg-red-100 text-red-700",
};

export function PartnerVerificationTab({ documents }: { documents: PartnerDocument[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [documentType, setDocumentType] = useState<PartnerDocumentType>("business_license");
  const formRef = useRef<HTMLFormElement>(null);

  const byType = new Map(documents.map((d) => [d.documentType, documents.filter((doc) => doc.documentType === d.documentType)]));

  return (
    <div className="space-y-8">
      <form
        ref={formRef}
        className="space-y-4 rounded-2xl border border-neutral-200 p-4"
        onSubmit={(event) => {
          event.preventDefault();
          setError(null);
          const formData = new FormData(event.currentTarget);

          startTransition(async () => {
            const result = await uploadPartnerDocument(formData);
            if (!result.ok) {
              setError(result.error ?? "Upload failed. Please try again.");
              return;
            }
            formRef.current?.reset();
            router.refresh();
          });
        }}
      >
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Document type</span>
          <select
            name="documentType"
            value={documentType}
            onChange={(event) => setDocumentType(event.target.value as PartnerDocumentType)}
            className="min-touch-target w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:border-maldives-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-maldives-500 focus-visible:ring-offset-1"
          >
            {PARTNER_DOCUMENT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          <span className="mt-1 block text-xs text-neutral-500">{PARTNER_DOCUMENT_TYPES.find((t) => t.value === documentType)?.description}</span>
        </label>

        <label className="block text-sm">
          <span className="mb-1 block font-medium text-neutral-700">File</span>
          <input name="file" type="file" required accept="image/*,.pdf" className="block w-full text-sm" />
        </label>

        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}

        <Button type="submit" disabled={isPending}>
          {isPending ? "Uploading…" : "Upload Document"}
        </Button>
      </form>

      <div className="space-y-6">
        {PARTNER_DOCUMENT_TYPES.map((type) => {
          const uploaded = byType.get(type.value) ?? [];
          return (
            <div key={type.value}>
              <h3 className="text-sm font-semibold text-ocean-900">{type.label}</h3>
              {uploaded.length === 0 ? (
                <p className="mt-1 text-sm text-neutral-500">Not uploaded yet.</p>
              ) : (
                <ul className="mt-2 space-y-2">
                  {uploaded.map((doc) => (
                    <li key={doc.id} className="flex items-center justify-between gap-3 rounded-xl border border-neutral-200 px-3 py-2 text-sm">
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-neutral-900">{doc.fileName ?? "File"}</p>
                        {doc.adminNote && <p className="mt-0.5 text-xs text-neutral-500">{doc.adminNote}</p>}
                      </div>
                      <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_CLASS[doc.status]}`}>
                        {STATUS_LABEL[doc.status]}
                      </span>
                      {doc.status === "pending" && (
                        <button
                          type="button"
                          disabled={isPending}
                          onClick={() => {
                            startTransition(async () => {
                              await deletePartnerDocument(doc.id, doc.storagePath);
                              router.refresh();
                            });
                          }}
                          className="shrink-0 text-xs font-medium text-neutral-500 hover:text-red-600 disabled:opacity-50"
                        >
                          Remove
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
