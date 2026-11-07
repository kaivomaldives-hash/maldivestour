"use client";

import { usePathname } from "next/navigation";

import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  PinterestIcon,
  TikTokIcon,
  XIcon,
  YouTubeIcon,
} from "@/components/ui/icons";
import { FISHING_SOCIAL_LINKS, MTG_SOCIAL_LINKS, type SocialNetwork } from "@/lib/social-links";

/**
 * Footer social links are brand-scoped, not sitewide: the fishing section
 * (/maldives/fishing/) has its own dedicated profiles on every network, run
 * separately from MTG's main accounts, and the site owner doesn't want a
 * fishing-page visitor sent to the main MTG profile instead of the fishing
 * one. The rest of the footer (travel links, newsletter, copyright) stays
 * identical everywhere — only this block swaps, which is why it's split
 * into its own small client component rather than duplicating the whole
 * footer file (duplicating the whole thing would mean keeping travel
 * links/newsletter/WhatsApp/copyright in sync by hand forever).
 *
 * The profiles themselves live in src/lib/social-links.ts (also used by
 * the booking thank-you email).
 */
const ICONS: Record<SocialNetwork, (props: { className?: string }) => React.ReactNode> = {
  linkedin: LinkedInIcon,
  youtube: YouTubeIcon,
  facebook: FacebookIcon,
  x: XIcon,
  pinterest: PinterestIcon,
  tiktok: TikTokIcon,
  instagram: InstagramIcon,
};

export function FooterSocialLinks() {
  const pathname = usePathname();
  const isFishing = pathname?.startsWith("/maldives/fishing") ?? false;
  const links = isFishing ? FISHING_SOCIAL_LINKS : MTG_SOCIAL_LINKS;
  const brand = isFishing ? "Maldives Fishing" : "MTG";

  return (
    <>
      <p className="text-xs font-semibold uppercase tracking-wide text-lagoon-300">Follow {brand}</p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {links.map(({ network, label, href }) => {
          const Icon = ICONS[network];
          return (
            <li key={label}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${brand} on ${label} (opens in a new tab)`}
                className="min-touch-target inline-flex items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              >
                <Icon className="h-5 w-5" />
              </a>
            </li>
          );
        })}
      </ul>
    </>
  );
}
