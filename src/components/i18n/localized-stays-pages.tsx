import Link from "next/link";
import { notFound } from "next/navigation";

import { NodeInquiryForm } from "@/components/bookings/node-inquiry-form";
import { RegisterEntityLocaleLinks } from "@/components/i18n/entity-locale-links-context";
import { LocalizedAccommodationCard } from "@/components/i18n/localized-accommodation-card";
import { isStaysLocale, loadLocalizedStay, type LocalizedStayType } from "@/components/i18n/localized-stays-metadata";
import { LocalizedLinkPills } from "@/components/i18n/localized-place-grid";
import { LocationMap } from "@/components/locations/location-map";
import { CONTAINER_CLASS } from "@/components/ui/container";
import { MediaImage } from "@/components/ui/media-image";
import { PageHero } from "@/components/ui/page-hero";
import { getAccommodations } from "@/lib/accommodations/repository";
import { ACCOMMODATION_TYPE_SEGMENT, type AccommodationSummary } from "@/lib/accommodations/types";
import { bookingCta } from "@/lib/bookings/copy";
import { fill } from "@/lib/i18n/destination-strings";
import { localizeHubPath } from "@/lib/i18n/hub-paths";
import { getEntityLocalePaths, localizeCards } from "@/lib/i18n/repository";
import { getStaysStrings } from "@/lib/i18n/stays-strings";
import { getUiStrings } from "@/lib/i18n/ui-strings";
import { breadcrumbJsonLd, safeJsonLdStringify } from "@/lib/seo/site";

/**
 * Translated stays pages -- the /{locale}/maldives/stays/ hub, the
 * resorts/hotels/guesthouses directories and their property detail
 * pages -- shared by every [locale] route file under those segments.
 * Same conventions as the other translated verticals: property names stay
 * their real names, summaries are translated, and facts/rooms/photos are
 * canonical data under localized labels. The English page's long overview
 * prose, nearby listings and reviews stay on the English page (linked).
 */

const STAY_TYPES: LocalizedStayType[] = ["resort", "hotel", "guesthouse"];
const prefixFor = (type: LocalizedStayType) => `/maldives/${ACCOMMODATION_TYPE_SEGMENT[type]}/`;

// Mirrors PINNED_GUESTHOUSE_SLUGS in src/app/maldives/stays/page.tsx.
const PINNED_GUESTHOUSE_SLUGS = ["yuvi-blue-maldives-himmafushi"];

async function getAllOfType(type: LocalizedStayType): Promise<AccommodationSummary[]> {
  const first = await getAccommodations({ type, pageSize: 100 });
  const pages = Math.ceil(first.total / 100);
  const rest = await Promise.all(Array.from({ length: Math.max(0, pages - 1) }, (_, i) => getAccommodations({ type, pageSize: 100, page: i + 2 })));
  return [...first.items, ...rest.flatMap((r) => r.items)];
}

export async function LocalizedStaysHub({ locale: rawLocale }: { locale: string }) {
  if (!isStaysLocale(rawLocale)) notFound();
  const locale = rawLocale;
  const ui = getUiStrings(locale);
  const s = getStaysStrings(locale);

  const [resorts, hotels, guesthouses] = await Promise.all([
    getAccommodations({ type: "resort", pageSize: 3 }),
    getAccommodations({ type: "hotel", pageSize: 3 }),
    getAccommodations({ type: "guesthouse", pageSize: 24 }),
  ]);
  const sortedGuesthouses = [...guesthouses.items].sort(
    (a, b) => Number(PINNED_GUESTHOUSE_SLUGS.includes(b.slug)) - Number(PINNED_GUESTHOUSE_SLUGS.includes(a.slug)),
  );
  const totals = { resort: resorts.total, hotel: hotels.total, guesthouse: guesthouses.total };
  const samples = { resort: resorts.items, hotel: hotels.items, guesthouse: sortedGuesthouses.slice(0, 3) };
  const cardsByType = Object.fromEntries(
    await Promise.all(STAY_TYPES.map(async (type) => [type, await localizeCards(locale, samples[type], prefixFor(type))] as const)),
  ) as Record<LocalizedStayType, Awaited<ReturnType<typeof localizeCards>>>;

  return (
    <main>
      <PageHero
        breadcrumbs={[{ label: ui.breadcrumbHome, href: `/${locale}/` }, { label: ui.nav.maldives, href: localizeHubPath(locale, "/maldives/") }, { label: s.nav.stays }]}
        eyebrow={s.hub.heroEyebrow}
        title={s.hub.title}
        description={s.hub.description}
        variant="ocean"
      />

      <div className={`${CONTAINER_CLASS} space-y-14 py-10 sm:py-14`}>
        {STAY_TYPES.map((type) => (
          <section key={type}>
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-ocean-900">
                  {s.nav[type]} <span className="font-normal text-neutral-500">({totals[type]})</span>
                </h2>
                <p className="mt-1 text-sm text-neutral-600">{s.hub.typeDescriptions[type]}</p>
              </div>
              <Link href={localizeHubPath(locale, prefixFor(type))} className="shrink-0 text-sm font-medium text-maldives-600 hover:text-ocean-800 hover:underline">
                {s.hub.viewAll} →
              </Link>
            </div>
            <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {samples[type].map((a) => (
                <LocalizedAccommodationCard key={a.id} accommodation={a} card={cardsByType[type].get(a.id)!} s={s} />
              ))}
            </ul>
          </section>
        ))}

        <section className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
          <h2 className="text-lg font-semibold text-ocean-900">{s.hub.liveaboardsTitle}</h2>
          <p className="mt-2 text-sm text-neutral-600">{s.hub.liveaboardsText}</p>
        </section>
      </div>
    </main>
  );
}

export async function LocalizedStaysDirectory({ locale: rawLocale, type }: { locale: string; type: LocalizedStayType }) {
  if (!isStaysLocale(rawLocale)) notFound();
  const locale = rawLocale;
  const ui = getUiStrings(locale);
  const s = getStaysStrings(locale);
  const d = s.directory[type];

  const items = await getAllOfType(type);
  const cards = await localizeCards(locale, items, prefixFor(type));

  return (
    <main>
      <PageHero
        breadcrumbs={[
          { label: ui.nav.maldives, href: localizeHubPath(locale, "/maldives/") },
          { label: s.nav.stays, href: localizeHubPath(locale, "/maldives/stays/") },
          { label: s.nav[type] },
        ]}
        eyebrow={s.hub.heroEyebrow}
        title={d.title}
        description={d.description}
      />

      <div className={`${CONTAINER_CLASS} py-10 sm:py-14`}>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((a) => (
            <LocalizedAccommodationCard key={a.id} accommodation={a} card={cards.get(a.id)!} s={s} />
          ))}
        </ul>

        <LocalizedLinkPills
          title={s.detail.exploreMoreTitle}
          links={[
            ...STAY_TYPES.filter((t) => t !== type).map((t) => ({ href: localizeHubPath(locale, prefixFor(t)), label: s.nav[t] })),
            { href: localizeHubPath(locale, "/maldives/transfers/"), label: ui.nav.transfers },
            { href: localizeHubPath(locale, "/maldives/packages/"), label: ui.nav.packages },
            { href: prefixFor(type), label: s.detail.englishVersionLink },
          ]}
        />
      </div>
    </main>
  );
}

export async function LocalizedStayDetail({ locale: rawLocale, type, slug }: { locale: string; type: LocalizedStayType; slug: string }) {
  const loaded = await loadLocalizedStay(rawLocale, type, slug);
  if (!loaded) notFound();
  const { locale, accommodation } = loaded;
  const ui = getUiStrings(locale);
  const s = getStaysStrings(locale);
  const d = s.detail;
  const prefix = prefixFor(type);
  const { primaryLocation, atoll } = accommodation;

  const [localePaths, islandCards, atollCards] = await Promise.all([
    getEntityLocalePaths(accommodation.id, accommodation.englishSlug, prefix),
    primaryLocation ? localizeCards(locale, [primaryLocation], "/maldives/islands/") : Promise.resolve(new Map()),
    atoll ? localizeCards(locale, [atoll], "/maldives/atolls/") : Promise.resolve(new Map()),
  ]);
  const islandCard = primaryLocation ? islandCards.get(primaryLocation.id) : undefined;
  const atollCard = atoll ? atollCards.get(atoll.id) : undefined;

  const breadcrumbs = [
    { label: ui.nav.maldives, href: localizeHubPath(locale, "/maldives/") },
    { label: s.nav[type], href: localizeHubPath(locale, prefix) },
    { label: accommodation.title },
  ];
  const yesNo = (value: boolean) => (value ? d.yes : d.no);

  return (
    <main>
      <RegisterEntityLocaleLinks paths={localePaths} fallbackHubPath={prefix} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(breadcrumbJsonLd(breadcrumbs, localizeHubPath(locale, `${prefix}${accommodation.slug}`))) }}
      />
      <PageHero breadcrumbs={breadcrumbs} eyebrow={d.typeLabel[type]} title={accommodation.title} description={accommodation.summary ?? undefined} image={accommodation.heroImage} />

      <div className={`${CONTAINER_CLASS} py-10 sm:py-14`}>
        <dl className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-neutral-500">{d.type}</dt>
            <dd className="font-medium">{d.typeLabel[type]}</dd>
          </div>
          {accommodation.starRating && (
            <div>
              <dt className="text-neutral-500">{d.starRating}</dt>
              <dd className="font-medium">{accommodation.starRating}★</dd>
            </div>
          )}
          {accommodation.priceTier && (
            <div>
              <dt className="text-neutral-500">{d.priceTier}</dt>
              <dd className="font-medium">{s.priceTiers[accommodation.priceTier] ?? accommodation.priceTier}</dd>
            </div>
          )}
          {accommodation.roomCount && (
            <div>
              <dt className="text-neutral-500">{d.rooms}</dt>
              <dd className="font-medium">{accommodation.roomCount}</dd>
            </div>
          )}
          {accommodation.allInclusive !== null && (
            <div>
              <dt className="text-neutral-500">{d.allInclusive}</dt>
              <dd className="font-medium">{yesNo(accommodation.allInclusive)}</dd>
            </div>
          )}
          {accommodation.overwaterVillas !== null && (
            <div>
              <dt className="text-neutral-500">{d.overwaterVillas}</dt>
              <dd className="font-medium">{yesNo(accommodation.overwaterVillas)}</dd>
            </div>
          )}
          {islandCard && (
            <div>
              <dt className="text-neutral-500">{d.island}</dt>
              <dd className="font-medium">
                <Link href={islandCard.href} className="hover:underline">
                  {islandCard.title}
                </Link>
              </dd>
            </div>
          )}
          {atollCard && (
            <div>
              <dt className="text-neutral-500">{d.atoll}</dt>
              <dd className="font-medium">
                <Link href={atollCard.href} className="hover:underline">
                  {atollCard.title}
                </Link>
              </dd>
            </div>
          )}
        </dl>

        {accommodation.overviewParagraphs.length > 0 && (
          <p className="mt-6 text-sm">
            <Link href={`${prefix}${accommodation.englishSlug}/`} className="font-medium text-maldives-600 hover:underline">
              {d.fullDescriptionEnglish}
            </Link>
          </p>
        )}

        {accommodation.galleryImages.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-semibold text-ocean-900">{d.gallery}</h2>
            <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {accommodation.galleryImages.map((image, i) => (
                <li key={image.id} className="relative aspect-[4/3] overflow-hidden rounded-xl">
                  <MediaImage asset={image} alt={`${accommodation.title} — ${d.photoAlt} ${i + 1}`} fillParent />
                </li>
              ))}
            </ul>
          </section>
        )}

        <LocationMap
          title={accommodation.title}
          lat={primaryLocation?.lat ?? null}
          lng={primaryLocation?.lng ?? null}
          heading={fill(d.mapHeading, accommodation.title)}
          intro={d.mapIntro}
        />

        {accommodation.rooms.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-semibold text-ocean-900">{d.roomsTitle}</h2>
            <p className="mt-1 text-sm text-neutral-600">{d.roomsIntro}</p>
            <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {accommodation.rooms.map((room) => (
                <li key={room.id} className="overflow-hidden rounded-2xl border border-neutral-200">
                  {room.images[0] && (
                    <div className="relative aspect-[4/3]">
                      <MediaImage asset={room.images[0]} alt={`${room.name} — ${accommodation.title}`} fillParent />
                    </div>
                  )}
                  <div className="p-4">
                    <p className="font-medium text-ocean-900">{room.name}</p>
                    <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm text-neutral-600">
                      {room.bedType && (
                        <span>
                          {room.bedType} {d.bed}
                        </span>
                      )}
                      {room.maxOccupancy && (
                        <span>
                          {d.maxGuests} {room.maxOccupancy}
                        </span>
                      )}
                    </div>
                    {room.priceFrom !== null && (
                      <p className="mt-2 text-sm text-neutral-600">
                        {d.from}{" "}
                        <span className="font-semibold text-ocean-900">
                          {room.currency === "USD" ? "$" : `${room.currency} `}
                          {room.priceFrom.toLocaleString()}
                        </span>
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {accommodation.isBookable && (
          <section className="mt-10 rounded-2xl border border-neutral-200 p-6">
            <h2 className="text-xl font-semibold text-ocean-900">{d.requestOfferTitle}</h2>
            <p className="mt-1 text-sm text-neutral-600">{d.requestOfferIntro}</p>
            <div className="mt-4">
              <NodeInquiryForm
                productNodeId={accommodation.id}
                productTitle={accommodation.title}
                source="accommodation"
                submitLabel={bookingCta("accommodation").submitLabel}
                showAccommodationFields
                roomOptions={accommodation.rooms.map((room) => room.name)}
              />
            </div>
          </section>
        )}

        <LocalizedLinkPills
          title={d.exploreMoreTitle}
          links={[
            { href: localizeHubPath(locale, prefix), label: s.nav[type] },
            { href: localizeHubPath(locale, "/maldives/stays/"), label: s.nav.stays },
            ...(islandCard ? [{ href: islandCard.href, label: islandCard.title }] : []),
            { href: localizeHubPath(locale, "/maldives/transfers/"), label: ui.nav.transfers },
            { href: localizeHubPath(locale, "/maldives/packages/"), label: ui.nav.packages },
            { href: `${prefix}${accommodation.englishSlug}/`, label: d.englishVersionLink },
          ]}
        />
      </div>
    </main>
  );
}

