import type { Metadata } from "next";

import { canonicalUrl } from "@/lib/seo/site";

export function emperorPageMetadata(): Metadata {
  const title = "Emperor Private Fishing Charter Maldives | Maldives Fishing";
  const description =
    "Fish the Maldives aboard Emperor, a private 32-foot fishing charter with twin 200 HP engines for up to 5 anglers. GT, tuna, wahoo and more — home-based in Gaafu Atoll, arranged from other locations across the Maldives on request.";
  const url = canonicalUrl("/maldives/fishing/emperor");
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url },
  };
}
