import { notFound } from "next/navigation";

import { PREFIXED_LOCALES, isLocale } from "@/lib/i18n/locales";

/**
 * Every non-English route lives under this tree (src/app/[locale]/...),
 * completely separate from the existing src/app/maldives/... tree, which
 * is untouched by this task. Because "maldives" and "admin" etc. are
 * static directory names, Next.js always matches those first — this
 * dynamic [locale] segment only ever receives requests whose first path
 * segment isn't one of the app's existing static routes, so there is no
 * routing conflict and no risk to any existing indexed English URL
 * (Task 19 §2/§42).
 *
 * The root layout (src/app/layout.tsx) already provides <html>/<body>,
 * fonts, header, footer and the sitewide JSON-LD — this is a nested
 * layout, not a competing document shell.
 */
export function generateStaticParams() {
  return PREFIXED_LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale) || locale === "en") notFound();

  return <>{children}</>;
}
