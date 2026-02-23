import { cache } from "react";
import { unstable_cache } from "next/cache";
import { CACHE_TAGS, CACHE_TTL_SECONDS, getPageTag, normalizePageSlug } from "@/lib/cache/tags";
import { getPageBySlug } from "@/server/actions/page";

/**
 * Cached page fetching with React cache() for request deduplication
 * and Next.js unstable_cache() for persistent caching
 *
 * - Request deduplication: Multiple calls in same render use same result
 * - Persistent cache: Results cached for 30 seconds
 * - Auto-invalidation: Cache cleared when pages updated via revalidateTag("pages")
 */
export const getPageBySlugCached = cache(async (slug: string) => {
  const normalizedSlug = normalizePageSlug(slug);

  return unstable_cache(
    async () => {
      return getPageBySlug({ slug: normalizedSlug });
    },
    [getPageTag(normalizedSlug)],
    {
      tags: [CACHE_TAGS.pages, getPageTag(normalizedSlug)],
      revalidate: CACHE_TTL_SECONDS,
    }
  )();
});
