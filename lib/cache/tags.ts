export const CACHE_TTL_SECONDS = 30;

export const CACHE_TAGS = {
  pages: "pages",
  media: "media",
  collections: "collections",
  header: "header",
  footer: "footer",
  seoDefaults: "seo-defaults",
} as const;

export const FRONTEND_LOCALES = ["en", "ar"] as const;

export type FrontendLocale = (typeof FRONTEND_LOCALES)[number];

export function normalizePageSlug(slug: string): string {
  const trimmed = slug.trim().toLowerCase();
  const withLeadingSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  const collapsed = withLeadingSlash.replace(/\/{2,}/g, "/");
  const withoutTrailingSlash =
    collapsed.length > 1 ? collapsed.replace(/\/$/, "") : collapsed;

  return withoutTrailingSlash || "/";
}

export function toLocalizedPath(locale: FrontendLocale, slug: string): string {
  const normalizedSlug = normalizePageSlug(slug);
  return normalizedSlug === "/" ? `/${locale}` : `/${locale}${normalizedSlug}`;
}

export function getPageTag(slug: string): string {
  return `page-${normalizePageSlug(slug)}`;
}

export function getCollectionTag(collectionId: string): string {
  return `collection-${collectionId}`;
}

export function getNavigationTag(type: "header" | "footer"): string {
  return type === "header" ? CACHE_TAGS.header : CACHE_TAGS.footer;
}
