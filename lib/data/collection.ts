import { cache } from "react";
import { unstable_cache } from "next/cache";
import {
  CACHE_TAGS,
  CACHE_TTL_SECONDS,
  getCollectionTag,
} from "@/lib/cache/tags";
import {
  getPhilosophyItems,
  getProjectCards,
} from "@/server/actions/collection";

export const getProjectCardsCached = cache(
  async ({
    collectionId,
    locale,
  }: {
    collectionId?: string;
    locale: string;
  }) => {
    if (!collectionId) {
      return [];
    }

    return unstable_cache(
      async () => {
        return getProjectCards({ collectionId, locale });
      },
      ["project-cards", collectionId, locale],
      {
        tags: [CACHE_TAGS.collections, getCollectionTag(collectionId)],
        revalidate: CACHE_TTL_SECONDS,
      }
    )();
  }
);

export const getPhilosophyItemsCached = cache(
  async (collectionId?: string, locale: string = "en") => {
    if (!collectionId) {
      return [];
    }

    return unstable_cache(
      async () => {
        return getPhilosophyItems(collectionId, locale);
      },
      ["philosophy-items", collectionId, locale],
      {
        tags: [CACHE_TAGS.collections, getCollectionTag(collectionId)],
        revalidate: CACHE_TTL_SECONDS,
      }
    )();
  }
);
