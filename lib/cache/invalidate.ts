import "server-only";

import { revalidatePath, updateTag } from "next/cache";
import {
  CACHE_TAGS,
  FRONTEND_LOCALES,
  getCollectionTag,
  getNavigationTag,
  getPageTag,
  normalizePageSlug,
  toLocalizedPath,
} from "@/lib/cache/tags";

function uniqueValues(values: string[]): string[] {
  return Array.from(new Set(values));
}

export function invalidatePageCaches(slug: string): void {
  invalidatePageCachesBySlugs([slug]);
}

export function invalidatePageCachesBySlugs(slugs: string[]): void {
  const normalizedSlugs = uniqueValues(
    slugs
      .map((slug) => slug?.trim())
      .filter(Boolean)
      .map((slug) => normalizePageSlug(slug as string))
  );

  if (normalizedSlugs.length === 0) {
    return;
  }

  updateTag(CACHE_TAGS.pages);

  for (const normalizedSlug of normalizedSlugs) {
    updateTag(getPageTag(normalizedSlug));

    for (const locale of FRONTEND_LOCALES) {
      revalidatePath(toLocalizedPath(locale, normalizedSlug));
    }
  }
}

export function invalidateCollectionCaches(collectionId?: string): void {
  updateTag(CACHE_TAGS.collections);

  if (collectionId) {
    updateTag(getCollectionTag(collectionId));
  }
}

export function invalidateCollectionCachesByIds(collectionIds: string[]): void {
  updateTag(CACHE_TAGS.collections);

  for (const collectionId of uniqueValues(collectionIds.filter(Boolean))) {
    updateTag(getCollectionTag(collectionId));
  }
}

export function invalidateMediaCaches(): void {
  updateTag(CACHE_TAGS.media);

  for (const locale of FRONTEND_LOCALES) {
    revalidatePath(`/${locale}/gallery`);
  }
}

export function invalidateSeoDefaultsCaches(): void {
  updateTag(CACHE_TAGS.seoDefaults);
  updateTag(CACHE_TAGS.pages);

  for (const locale of FRONTEND_LOCALES) {
    revalidatePath(`/${locale}`);
  }
}

export function invalidateNavigationCache(type: "header" | "footer"): void {
  updateTag(getNavigationTag(type));
}
