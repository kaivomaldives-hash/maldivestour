"use client";

/**
 * Shows a signed Storage URL inline, in an on-page overlay, instead of
 * window.open()'ing it into a new tab. A browser's popup blocker treats
 * window.open() as untrusted unless it runs synchronously inside the
 * click handler (see the git history of partner-document-review-list.tsx
 * and location-media-submission-review-list.tsx for the two rounds of
 * "View X" bugs that approach kept causing) — an iframe rendered directly
 * into the page is never a popup, so there's nothing left to block.
 * Works for both images and PDFs (the two content types these signed
 * URLs ever point at): the browser's own viewer renders either inside
 * the iframe.
 */
export function SignedUrlViewModal({ url, onClose }: { url: string; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="relative flex h-full max-h-[90vh] w-full max-w-4xl flex-col" onClick={(event) => event.stopPropagation()}>
        <button
          type="button"
          onClick={onClose}
          className="mb-2 self-end rounded-full bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
        >
          Close ✕
        </button>
        <iframe src={url} title="Preview" className="h-full w-full flex-1 rounded-lg bg-white" />
      </div>
    </div>
  );
}
