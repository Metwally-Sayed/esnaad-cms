import { getAllMediaItemsCached } from "@/lib/data/media";
import type { MediaItem } from "@/server/actions/media";
import { getLocale, getTranslations } from "next-intl/server";
import { MediaCardsStandard } from "./MediaCardsStandard";
import { MediaCards3d } from "./MediaCards3d";
import MediaFilters from "./MediaFilters";

export type MediaCardsWithFiltersContent = {
  collectionId?: string;
  filterType?: string;
  sortBy?: "order" | "updatedAt" | "createdAt";
  limit?: number;
  showFilters?: boolean;
  imageStyle?: string;
};

export default async function MediaCardsWithFilters({
  content,
  className,
  variant = "media-cards-standard",
  urlFilterType,
}: {
  content: MediaCardsWithFiltersContent;
  className?: string;
  variant?: string;
  urlFilterType?: string;
}) {
  const locale = await getLocale();
  const t = await getTranslations("gallery");

  // Fetch media items if collection is specified
  let items: MediaItem[] = [];
  let allTypes: string[] = [];

  if (content.collectionId) {
    const sortBy = content.sortBy || "updatedAt";
    const result = await getAllMediaItemsCached(sortBy);

    if (result.success && result.data) {
      let mediaItems = result.data;

      // Get all unique types for filters
      allTypes = Array.from(new Set(mediaItems.map(item => item.type)));

      // Apply URL filter first, then block-level filter
      const activeFilter = urlFilterType || content.filterType;

      // Filter by type if specified
      if (activeFilter && typeof activeFilter === 'string' && activeFilter.trim() !== '') {
        mediaItems = mediaItems.filter(item => item.type === activeFilter);
      }

      // Apply limit if specified
      if (content.limit && content.limit > 0) {
        mediaItems = mediaItems.slice(0, content.limit);
      }

      items = mediaItems;
    }
  }

  const showFilters = content.showFilters !== false; // Default to true

  return (
    <div className="min-h-screen bg-background">
      {showFilters && (
        <div className="border-b bg-gradient-to-b from-muted/50 to-background">
          <div className="container mx-auto px-4 py-8 md:py-16">
            <div className="mx-auto max-w-3xl rounded-2xl border border-border/60 bg-card/60 px-5 py-6 text-center backdrop-blur-sm md:rounded-none md:border-none md:bg-transparent md:px-0 md:py-0">
              <h1 className="font-serif text-3xl tracking-[0.08em] md:text-5xl md:font-bold md:tracking-tight lg:text-6xl">
                {t("title")}
              </h1>
              <p className="mt-3 text-sm leading-7 text-muted-foreground md:mt-6 md:text-lg md:leading-normal">
                {t("subtitle")}
              </p>
            </div>
          </div>
        </div>
      )}

      {showFilters && allTypes.length > 0 && (
        <div className="sticky top-16 z-30 border-b bg-background/95 backdrop-blur md:static md:border-b md:bg-muted/30 md:backdrop-blur-none">
          <div className="py-3 md:py-6">
            <MediaFilters
              currentType={urlFilterType}
              availableTypes={allTypes}
            />
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <div className="container mx-auto px-4 py-24 text-center">
          <div className="mx-auto max-w-md">
            <p className="text-lg text-muted-foreground">{t("noItems")}</p>
          </div>
        </div>
      ) : variant === "media-cards-3d" ? (
        <MediaCards3d items={items} locale={locale} className={className} imageStyle={content.imageStyle} />
      ) : (
        <MediaCardsStandard items={items} locale={locale} className={className} imageStyle={content.imageStyle} />
      )}
    </div>
  );
}
