import type { Metadata } from "next";
import Link from "next/link";

import { ActivityCard } from "@/components/activity/activity-card";
import { CONTAINER_CLASS } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { FaqSection } from "@/components/ui/faq-section";
import { PageHero } from "@/components/ui/page-hero";
import { getActivities } from "@/lib/activities/repository";
import { getCategoryBySlug, getNodeIdsByCategory } from "@/lib/categories/repository";
import { ACTIVITY_CATEGORY_LOCALES, ACTIVITY_CATEGORY_SLUGS, getActivityCategoryStrings, type ActivityCategorySlug } from "@/lib/i18n/activity-categories";
import { localizeHubPath } from "@/lib/i18n/hub-paths";
import { getLinkLocalizer } from "@/lib/i18n/link-localizer";
import type { Locale } from "@/lib/i18n/locales";
import { getUiStrings } from "@/lib/i18n/ui-strings";
import { breadcrumbJsonLd, hreflangAlternates, localizedCanonicalUrl, safeJsonLdStringify } from "@/lib/seo/site";

export function localizedActivityCategoryMetadata(locale: Locale, slug: ActivityCategorySlug): Metadata {
  const strings = getActivityCategoryStrings(locale);
  if (!strings) return {};
  const t = strings.categories[slug];
  const englishPath = `/maldives/${slug}/`;
  const url = localizedCanonicalUrl(locale, englishPath);
  return {
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: { canonical: url, languages: hreflangAlternates(englishPath, ACTIVITY_CATEGORY_LOCALES) },
    openGraph: { title: t.metaTitle, description: t.metaDescription, url, locale },
  };
}

/**
 * The translated form of an activity-category landing page (src/components/
 * activity/activity-category-landing-page.tsx): the same explicitly tagged
 * listings (the page's 'activity-category' node tag shares its URL slug),
 * with translated copy from src/lib/i18n/activity-categories/ and cards
 * linking to each activity's own translated page where one exists.
 */
export async function LocalizedActivityCategoryPage({ locale, slug }: { locale: Locale; slug: ActivityCategorySlug }) {
  const strings = getActivityCategoryStrings(locale)!;
  const t = strings.categories[slug];
  const ui = getUiStrings(locale);

  const [category, L] = await Promise.all([getCategoryBySlug(slug, "activity-category"), getLinkLocalizer(locale)]);
  const nodeIds = category ? await getNodeIdsByCategory(category.id) : [];
  const activities = nodeIds.length > 0 ? (await getActivities({ nodeIds, pageSize: 100 })).items : [];

  const breadcrumbs = [
    { label: ui.breadcrumbHome, href: `/${locale}/` },
    { label: ui.nav.maldives, href: localizeHubPath(locale, "/maldives/") },
    { label: ui.nav.activities, href: localizeHubPath(locale, "/maldives/activities/") },
    { label: t.h1 },
  ];
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: locale,
    mainEntity: t.faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })),
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(breadcrumbJsonLd(breadcrumbs, localizeHubPath(locale, `/maldives/${slug}/`))) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(faqJsonLd) }} />

      <PageHero breadcrumbs={breadcrumbs} eyebrow={t.eyebrow} title={t.h1} description={t.intro} />

      <div className={`${CONTAINER_CLASS} py-10 sm:py-14`}>
        {activities.length === 0 ? (
          <EmptyState title={t.emptyMessage} />
        ) : (
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {activities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} localize={L} />
            ))}
          </ul>
        )}

        <FaqSection faqs={t.faqs} title={ui.packagesHub.faqTitle} className="mt-14 border-t border-neutral-200 pt-10" />

        <div className="mt-10 border-t border-neutral-200 pt-6">
          <p className="text-sm font-medium text-neutral-500">{strings.otherTypes}</p>
          <nav aria-label={strings.otherTypes} className="mt-2 flex flex-wrap gap-2">
            {ACTIVITY_CATEGORY_SLUGS.filter((s) => s !== slug).map((s) => (
              <Link
                key={s}
                href={L.href(`/maldives/${s}/`)}
                className="rounded-full border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 hover:border-maldives-500 hover:text-maldives-600"
              >
                {strings.categories[s].label}
              </Link>
            ))}
          </nav>
          <Link href={L.href("/maldives/activities/")} className="mt-4 inline-block text-sm font-medium text-maldives-600 hover:underline">
            ← {strings.allActivities}
          </Link>
        </div>
      </div>
    </main>
  );
}
