import { unstable_cache } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache/tags";
import { getGlobalHeader } from "@/server/actions/header";
import { getGlobalFooter } from "@/server/actions/footer";

/**
 * Cached header fetching with 1-hour revalidation
 * Auto-invalidates when header is updated via revalidateTag("header")
 */
export const getGlobalHeaderCached = async () => {
  return unstable_cache(
    async () => {
      return getGlobalHeader();
    },
    ["global-header"],
    {
      tags: [CACHE_TAGS.header],
      revalidate: 3600 // 1 hour
    }
  )();
};

/**
 * Cached footer fetching with 1-hour revalidation
 * Auto-invalidates when footer is updated via revalidateTag("footer")
 */
export const getGlobalFooterCached = async () => {
  return unstable_cache(
    async () => {
      return getGlobalFooter();
    },
    ["global-footer"],
    {
      tags: [CACHE_TAGS.footer],
      revalidate: 3600 // 1 hour
    }
  )();
};
