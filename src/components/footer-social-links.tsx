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
 * Real, verified profiles only — do not add any account not explicitly
 * supplied by the site owner.
 */
const MTG_SOCIAL_LINKS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/maldivestourguide/", Icon: LinkedInIcon },
  { label: "YouTube", href: "https://www.youtube.com/@Maldives-Holiday", Icon: YouTubeIcon },
  { label: "Facebook", href: "https://web.facebook.com/maldivestourguide", Icon: FacebookIcon },
  { label: "X", href: "https://x.com/maldivestourg", Icon: XIcon },
  { label: "Pinterest", href: "https://www.pinterest.com/themaldivesholidays/", Icon: PinterestIcon },
  { label: "TikTok", href: "https://www.tiktok.com/@maldivestourguides?lang=en", Icon: TikTokIcon },
  { label: "Instagram", href: "https://www.instagram.com/themaldivesholiday/", Icon: InstagramIcon },
];

const FISHING_SOCIAL_LINKS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/maldives-fishing/", Icon: LinkedInIcon },
  { label: "YouTube", href: "https://www.youtube.com/@maldivesfishing2", Icon: YouTubeIcon },
  { label: "Facebook", href: "https://web.facebook.com/profile.php?id=61594780457332", Icon: FacebookIcon },
  { label: "X", href: "https://x.com/maldivesfishin2", Icon: XIcon },
  { label: "Pinterest", href: "https://www.pinterest.com/maldivesfishing/", Icon: PinterestIcon },
  { label: "TikTok", href: "https://www.tiktok.com/@maldivesfishing2", Icon: TikTokIcon },
  { label: "Instagram", href: "https://www.instagram.com/maldivesfishing2/", Icon: InstagramIcon },
];

export function FooterSocialLinks() {
  const pathname = usePathname();
  const isFishing = pathname?.startsWith("/maldives/fishing") ?? false;
  const links = isFishing ? FISHING_SOCIAL_LINKS : MTG_SOCIAL_LINKS;
  const brand = isFishing ? "Maldives Fishing" : "MTG";

  return (
    <>
      <p className="text-xs font-semibold uppercase tracking-wide text-lagoon-300">Follow {brand}</p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {links.map(({ label, href, Icon }) => (
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
        ))}
      </ul>
    </>
  );
}
