import { cache } from "react";
import { unstable_cache } from "next/cache";
import { getPageBySlug } from "@/server/actions/page";

/**
 * Cached page fetching with React cache() for request deduplication
 * and Next.js unstable_cache() for persistent caching
 *
 * - Request deduplication: Multiple calls in same render use same result
 * - Persistent cache: Results cached for 60 seconds
 * - Auto-invalidation: Cache cleared when pages updated via revalidateTag("pages")
 */
export const getPageBySlugCached = cache(async (slug: string) => {
  return unstable_cache(
    async () => {
      return getPageBySlug({ slug });
    },
    [`page-${slug}`],
    {
      tags: ["pages", `page-${slug}`],
      revalidate: 60
    }
  )();
});
