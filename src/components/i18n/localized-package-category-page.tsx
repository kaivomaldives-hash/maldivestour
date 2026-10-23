import type { Metadata } from "next";
import Link from "next/link";

import { PackageCard } from "@/components/packages/package-card";
import { CONTAINER_CLASS } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { FaqSection } from "@/components/ui/faq-section";
import { PageHero } from "@/components/ui/page-hero";
import { localizeHubPath } from "@/lib/i18n/hub-paths";
import { getLinkLocalizer } from "@/lib/i18n/link-localizer";
import type { Locale } from "@/lib/i18n/locales";
import { getPackageCategoryStrings, PACKAGE_CATEGORY_LOCALES } from "@/lib/i18n/package-categories";
import { getUiStrings } from "@/lib/i18n/ui-strings";
import { PACKAGE_CATEGORY_CONTENT } from "@/lib/packages/category-content";
import { PACKAGE_CATEGORY_FALLBACK_IMAGES, type PackageCategoryFallbackKey } from "@/lib/packages/category-images";
import { filterPackageViews, getAllPackageViews, sortPackageViews } from "@/lib/packages/view-repository";
import { PACKAGE_CATEGORIES, type PackageCategorySlug } from "@/lib/packages/view-types";
import { breadcrumbJsonLd, hreflangAlternates, localizedCanonicalUrl, safeJsonLdStringify } from "@/lib/seo/site";

/** Same hero photo per style as the English page (package-category-page.tsx). */
const CATEGORY_IMAGE_KEY: Record<PackageCategorySlug, PackageCategoryFallbackKey> = {
  luxury: "luxury",
  family: "family",
  "adults-only": "adultsOnly",
  "long-stay": "luxury",
  budget: "budget",
  honeymoon: "honeymoon",
  solo: "budget",
  diving: "diving",
  fishing: "fishing",
  surfing: "surfing",
  liveaboard: "liveaboard",
};

export function isPackageCategorySlug(slug: string): slug is PackageCategorySlug {
  return PACKAGE_CATEGORIES.some((c) => c.slug === slug);
}

export function localizedPackageCategoryMetadata(locale: Locale, category: PackageCategorySlug): Metadata {
  const strings = getPackageCategoryStrings(locale);
  if (!strings) return {};
  const t = strings.categories[category];
  const englishPath = `/maldives/packages/${category}/`;
  const url = localizedCanonicalUrl(locale, englishPath);
  return {
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: { canonical: url, languages: hreflangAlternates(englishPath, PACKAGE_CATEGORY_LOCALES) },
    openGraph: { title: t.metaTitle, description: t.metaDescription, url, locale },
  };
}

/**
 * The translated form of a package style page (src/components/packages/
 * package-category-page.tsx): same packages, hero photo and FAQ/related-
 * links structure, with translated copy (src/lib/i18n/package-categories/).
 * The search/filter bar stays on the English page, linked from here.
 */
export async function LocalizedPackageCategoryPage({ locale, category }: { locale: Locale; category: PackageCategorySlug }) {
  const strings = getPackageCategoryStrings(locale)!;
  const t = strings.categories[category];
  const ui = getUiStrings(locale);
  const englishPath = `/maldives/packages/${category}/`;

  const [allViews, L] = await Promise.all([getAllPackageViews(), getLinkLocalizer(locale)]);
  const packages = sortPackageViews(filterPackageViews(allViews, { category }), "recommended").filter((v) => !v.isDemo);

  const breadcrumbs = [
    { label: ui.breadcrumbHome, href: `/${locale}/` },
    { label: ui.nav.maldives, href: localizeHubPath(locale, "/maldives/") },
    { label: ui.nav.packages, href: localizeHubPath(locale, "/maldives/packages/") },
    { label: t.title },
  ];
  const relatedLinks = [
    { href: "/maldives/packages/", label: strings.allPackages },
    ...PACKAGE_CATEGORY_CONTENT[category].relatedLinks.map((link, i) => ({ href: link.href, label: t.relatedLabels[i] ?? link.label })),
  ];
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: locale,
    mainEntity: t.faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })),
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(breadcrumbJsonLd(breadcrumbs, localizeHubPath(locale, englishPath))) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(faqJsonLd) }} />

      <PageHero
        breadcrumbs={breadcrumbs}
        eyebrow={strings.eyebrow}
        title={t.title}
        description={t.intro}
        image={PACKAGE_CATEGORY_FALLBACK_IMAGES[CATEGORY_IMAGE_KEY[category]]}
      />

      <div className={`${CONTAINER_CLASS} py-10 sm:py-14`}>
        <p className="text-sm">
          <Link href={englishPath} hrefLang="en" className="font-medium text-maldives-600 hover:underline">
            {strings.filtersInEnglish} →
          </Link>
        </p>

        {packages.length === 0 ? (
          <EmptyState title={strings.emptyTitle.replace("{title}", t.title)} description={strings.emptyDescription} />
        ) : (
          <ul className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {packages.map((pkg) => (
              <PackageCard key={pkg.slug} pkg={pkg} localize={L} />
            ))}
          </ul>
        )}

        <FaqSection faqs={t.faqs} title={ui.packagesHub.faqTitle} className="mt-14 border-t border-neutral-200 pt-10" />

        <section className="mt-12 border-t border-neutral-200 pt-10">
          <h2 className="text-xl font-semibold text-ocean-900">{ui.packagesHub.styleTitle}</h2>
          <nav aria-label={ui.packagesHub.styleTitle} className="mt-4 flex flex-wrap gap-2">
            {PACKAGE_CATEGORIES.filter((c) => c.slug !== category).map((c) => (
              <Link
                key={c.slug}
                href={L.href(`/maldives/packages/${c.slug}/`)}
                className="rounded-full border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 hover:border-maldives-500 hover:text-maldives-600"
              >
                {strings.categories[c.slug].title}
              </Link>
            ))}
          </nav>
        </section>

        <section className="mt-12 border-t border-neutral-200 pt-10">
          <h2 className="text-xl font-semibold text-ocean-900">{strings.relatedTitle}</h2>
          <nav aria-label={strings.relatedTitle} className="mt-4 flex flex-wrap gap-2">
            {relatedLinks.map((link) => (
              <Link
                key={link.href}
                href={L.href(link.href)}
                className="rounded-full border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 hover:border-maldives-500 hover:text-maldives-600"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </section>
      </div>
    </main>
  );
}
