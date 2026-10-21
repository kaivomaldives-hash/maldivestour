import type { ReactNode } from "react";

/**
 * The site-wide content width, applied consistently across every page
 * (including the header and footer, which both import this same
 * constant — never a separately-tuned width). Widened from max-w-6xl
 * (1152px) to 1440px on request, to use more of a large monitor while
 * still keeping real margins and readable line lengths rather than
 * going edge-to-edge.
 * Exported as a plain class string (not just a wrapper component) because
 * most pages need it on their own `<main>` landmark rather than on an
 * extra nested `<div>`.
 */
export const CONTAINER_CLASS = "mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={[CONTAINER_CLASS, className].filter(Boolean).join(" ")}>{children}</div>;
}
