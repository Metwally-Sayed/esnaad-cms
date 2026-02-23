import { cache } from "react";
import { unstable_cache } from "next/cache";
import { CACHE_TAGS, CACHE_TTL_SECONDS } from "@/lib/cache/tags";
import { getAllCategories, getAllMediaItems } from "@/server/actions/media";

export const getAllMediaItemsCached = cache(
  async (sortBy: "order" | "updatedAt" | "createdAt" = "order") => {
    return unstable_cache(
      async () => {
        return getAllMediaItems(sortBy);
      },
      ["media-items", sortBy],
      {
        tags: [CACHE_TAGS.media],
        revalidate: CACHE_TTL_SECONDS,
      }
    )();
  }
);

export const getAllCategoriesCached = cache(async () => {
  return unstable_cache(
    async () => {
      return getAllCategories();
    },
    ["media-categories"],
    {
      tags: [CACHE_TAGS.media],
      revalidate: CACHE_TTL_SECONDS,
    }
  )();
});
