import { getAllMediaItems } from "@/server/actions/media";
import type { MediaItem } from "@/server/actions/media";
import { getLocale } from "next-intl/server";
import { MediaCardsStandard } from "./MediaCardsStandard";
import { MediaCards3d } from "./MediaCards3d";

export type MediaCardsContent = {
  collectionId?: string;
  filterType?: string;
  sortBy?: "order" | "updatedAt" | "createdAt";
  limit?: number;
  imageStyle?: string;
};

export default async function MediaCards({
  content,
  className,
  variant = "media-cards-standard",
}: {
  content: MediaCardsContent;
  className?: string;
  variant?: string;
}) {
  const locale = await getLocale();

  // Fetch media items if collection is specified
  let items: MediaItem[] = [];

  if (content.collectionId) {
    const sortBy = content.sortBy || "order";
    const result = await getAllMediaItems(sortBy);

    if (result.success && result.data) {
      let mediaItems = result.data;

      // Filter by type if specified
      if (content.filterType && typeof content.filterType === 'string' && content.filterType.trim() !== '') {
        mediaItems = mediaItems.filter(item => item.type === content.filterType);
      }

      // Apply limit if specified
      if (content.limit && content.limit > 0) {
        mediaItems = mediaItems.slice(0, content.limit);
      }

      items = mediaItems;
    }
  }

  // Choose card style based on variant
  if (variant === "media-cards-3d") {
    return <MediaCards3d items={items} locale={locale} className={className} imageStyle={content.imageStyle} />;
  }

  return <MediaCardsStandard items={items} locale={locale} className={className} imageStyle={content.imageStyle} />;
}
