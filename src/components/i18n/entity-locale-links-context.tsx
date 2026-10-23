"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import type { Locale } from "@/lib/i18n/locales";

/**
 * Lets ANY translated entity's detail page (article, package, transfer
 * route, ...) tell the header/footer LanguageSwitcher exactly which
 * path to send the visitor to in each locale, instead of the
 * switcher's generic fallback (that entity type's own hub, or the
 * Maldives hub as a last resort) -- every entity has its own per-locale
 * slug, so the switcher can't derive the translated URL from the
 * current pathname alone (see getEntityLocalePaths).
 *
 * Generalized from the article-only ArticleLocaleLinksContext this
 * replaces: packages and transfer routes are translated now too, and
 * without this wired in for them, picking a language from a package or
 * transfer-route page silently dropped the visitor on that language's
 * Maldives hub instead of the matching translated package/route (Task
 * 22 bug report).
 */
interface EntityLocaleLinks {
  paths: Partial<Record<Locale, string>>;
  /** Where to send the visitor for a locale with no real translation of
   * THIS entity -- that entity type's own hub (e.g.
   * "/maldives/packages/" for a package), not generically the Maldives
   * hub, so the fallback stays as relevant as possible. */
  fallbackHubPath: string;
}

interface EntityLocaleLinksContextValue {
  links: EntityLocaleLinks | null;
  setLinks: (links: EntityLocaleLinks | null) => void;
}

const EntityLocaleLinksContext = createContext<EntityLocaleLinksContextValue | null>(null);

export function EntityLocaleLinksProvider({ children }: { children: ReactNode }) {
  const [links, setLinks] = useState<EntityLocaleLinks | null>(null);
  return <EntityLocaleLinksContext.Provider value={{ links, setLinks }}>{children}</EntityLocaleLinksContext.Provider>;
}

export function useEntityLocaleLinks(): EntityLocaleLinksContextValue {
  const ctx = useContext(EntityLocaleLinksContext);
  if (!ctx) throw new Error("useEntityLocaleLinks must be used within an EntityLocaleLinksProvider");
  return ctx;
}

/** Rendered by an entity detail page to register its per-locale paths
 * with the switcher for as long as that page is mounted; clears on
 * unmount so navigating to a non-entity page doesn't leave stale links
 * active. */
export function RegisterEntityLocaleLinks({ paths, fallbackHubPath }: EntityLocaleLinks) {
  const { setLinks } = useEntityLocaleLinks();

  useEffect(() => {
    setLinks({ paths, fallbackHubPath });
    return () => setLinks(null);
  }, [paths, fallbackHubPath, setLinks]);

  return null;
}
