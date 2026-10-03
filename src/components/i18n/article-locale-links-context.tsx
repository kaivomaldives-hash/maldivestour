"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import type { Locale } from "@/lib/i18n/locales";

/**
 * Lets an article detail page tell the header/footer LanguageSwitcher
 * exactly which path to send the visitor to in each locale, instead of
 * the switcher's generic fallback (the Maldives hub) -- articles have
 * their own per-locale slug, so the switcher can't derive the translated
 * URL from the current pathname alone (see getArticleLocalePaths).
 */
interface ArticleLocaleLinksContextValue {
  paths: Partial<Record<Locale, string>> | null;
  setPaths: (paths: Partial<Record<Locale, string>> | null) => void;
}

const ArticleLocaleLinksContext = createContext<ArticleLocaleLinksContextValue | null>(null);

export function ArticleLocaleLinksProvider({ children }: { children: ReactNode }) {
  const [paths, setPaths] = useState<Partial<Record<Locale, string>> | null>(null);
  return <ArticleLocaleLinksContext.Provider value={{ paths, setPaths }}>{children}</ArticleLocaleLinksContext.Provider>;
}

export function useArticleLocaleLinks(): ArticleLocaleLinksContextValue {
  const ctx = useContext(ArticleLocaleLinksContext);
  if (!ctx) throw new Error("useArticleLocaleLinks must be used within an ArticleLocaleLinksProvider");
  return ctx;
}

/** Rendered by an article detail page to register its per-locale paths
 * with the switcher for as long as that page is mounted; clears on
 * unmount so navigating to a non-article page doesn't leave stale links
 * active. */
export function RegisterArticleLocaleLinks({ paths }: { paths: Partial<Record<Locale, string>> }) {
  const { setPaths } = useArticleLocaleLinks();

  useEffect(() => {
    setPaths(paths);
    return () => setPaths(null);
  }, [paths, setPaths]);

  return null;
}
