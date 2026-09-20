import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSiteUrl } from "@/lib/seo/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Maldives Tour Guide (MTG)",
    template: "%s",
  },
  description:
    "A real, source-verified travel guide to the Maldives — atolls, islands, resorts, hotels, guesthouses, activities, diving, fishing, surfing, transfers and packages.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-white text-ocean-900">
        <SiteHeader />
        {/* pb-20 clears the fixed mobile bottom nav (h-16 + safe-area inset)
            on small screens; lg:pb-0 removes it once that nav is hidden. */}
        <div className="flex flex-1 flex-col pb-20 lg:pb-0">{children}</div>
        <SiteFooter />
        <MobileBottomNav />
      </body>
    </html>
  );
}
