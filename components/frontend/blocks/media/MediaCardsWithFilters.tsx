import { getAllMediaItems } from "@/server/actions/media";
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
  let items: any[] = [];
  let allTypes: string[] = [];

  if (content.collectionId) {
    const sortBy = content.sortBy || "updatedAt";
    const result = await getAllMediaItems(sortBy);

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
      {/* Hero Section */}
      {showFilters && (
        <div className="border-b bg-gradient-to-b from-muted/50 to-background">
          <div className="container mx-auto px-4 py-16">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-5xl font-bold tracking-tight lg:text-6xl">
                {t("title")}
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                {t("subtitle")}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      {showFilters && allTypes.length > 0 && (
        <div className="border-b bg-muted/30">
          <div className="py-6">
            <MediaFilters
              locale={locale}
              currentType={urlFilterType}
              availableTypes={allTypes}
            />
          </div>
        </div>
      )}

      {/* Cards */}
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
