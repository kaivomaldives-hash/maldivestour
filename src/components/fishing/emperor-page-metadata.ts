import type { Metadata } from "next";

import { EMPEROR_LOCALES } from "@/lib/i18n/fishing-pages/emperor";
import { canonicalUrl, hreflangAlternates } from "@/lib/seo/site";

export function emperorPageMetadata(): Metadata {
  const title = "Emperor Private Fishing Charter Maldives | Maldives Fishing";
  const description =
    "Private fishing charter in the Maldives aboard Emperor, a 32 ft boat for up to 5 anglers: USD 980 half day, USD 1,380 full day, per boat. GT, tuna, wahoo.";
  const url = canonicalUrl("/maldives/fishing/emperor");
  return {
    title,
    description,
    alternates: { canonical: url, languages: hreflangAlternates("/maldives/fishing/emperor/", EMPEROR_LOCALES) },
    openGraph: { title, description, url },
  };
}
