/**
 * The site's real, verified social profiles, shared by the footer and the
 * booking thank-you email. Brand-scoped: the fishing section has its own
 * profiles on every network, run separately from MTG's main accounts.
 * Do not add any account not explicitly supplied by the site owner.
 */
export type SocialNetwork = "linkedin" | "youtube" | "facebook" | "x" | "pinterest" | "tiktok" | "instagram";

export interface SocialLink {
  network: SocialNetwork;
  label: string;
  href: string;
}

export const MTG_SOCIAL_LINKS: SocialLink[] = [
  { network: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/company/maldivestourguide/" },
  { network: "youtube", label: "YouTube", href: "https://www.youtube.com/@Maldives-Holiday" },
  { network: "facebook", label: "Facebook", href: "https://web.facebook.com/maldivestourguide" },
  { network: "x", label: "X", href: "https://x.com/maldivestourg" },
  { network: "pinterest", label: "Pinterest", href: "https://www.pinterest.com/themaldivesholidays/" },
  { network: "tiktok", label: "TikTok", href: "https://www.tiktok.com/@maldivestourguides?lang=en" },
  { network: "instagram", label: "Instagram", href: "https://www.instagram.com/themaldivesholiday/" },
];

export const FISHING_SOCIAL_LINKS: SocialLink[] = [
  { network: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/company/maldives-fishing/" },
  { network: "youtube", label: "YouTube", href: "https://www.youtube.com/@maldivesfishing2" },
  { network: "facebook", label: "Facebook", href: "https://web.facebook.com/profile.php?id=61594780457332" },
  { network: "x", label: "X", href: "https://x.com/maldivesfishin2" },
  { network: "pinterest", label: "Pinterest", href: "https://www.pinterest.com/maldivesfishing/" },
  { network: "tiktok", label: "TikTok", href: "https://www.tiktok.com/@maldivesfishing2" },
  { network: "instagram", label: "Instagram", href: "https://www.instagram.com/maldivesfishing2/" },
];
