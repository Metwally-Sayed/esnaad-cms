import { cache } from "react";
import { unstable_cache } from "next/cache";
import { CACHE_TAGS, CACHE_TTL_SECONDS } from "@/lib/cache/tags";
import { getGlobalSeoDefaults } from "@/server/actions/global-settings";

export const getGlobalSeoDefaultsCached = cache(async () => {
  return unstable_cache(
    async () => {
      return getGlobalSeoDefaults();
    },
    ["global-seo-defaults"],
    {
      tags: [CACHE_TAGS.seoDefaults],
      revalidate: CACHE_TTL_SECONDS,
    }
  )();
});
