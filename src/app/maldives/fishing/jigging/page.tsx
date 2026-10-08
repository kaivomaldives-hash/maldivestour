import type { Metadata } from "next";

import { TechniqueLandingPage, techniquePageMetadata } from "@/components/fishing/technique-landing-page";
import { TECHNIQUE_PAGES } from "@/lib/fishing/technique-content";

const CONTENT = TECHNIQUE_PAGES.jigging;

export function generateMetadata(): Metadata {
  return techniquePageMetadata(CONTENT);
}

export default function Page() {
  return <TechniqueLandingPage content={CONTENT} />;
}
