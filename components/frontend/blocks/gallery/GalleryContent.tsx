import { getAllMediaItems } from "@/server/actions/media";
import GalleryFilters from "./GalleryFilters";
import MediaPostCard from "./MediaPostCard";

type Props = {
  locale: string;
  filterType?: string;
};

export default async function GalleryContent({ locale, filterType }: Props) {
  const result = await getAllMediaItems("updatedAt");

  if (!result.success || !result.data) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No media items found
      </div>
    );
  }

  // Get unique types for filters
  const allTypes = Array.from(new Set(result.data.map(item => item.type)));

  // Filter items by type if specified
  const filteredItems = filterType
    ? result.data.filter(item => item.type === filterType)
    : result.data;

  return (
    <div className="space-y-8">
      {/* Filters */}
      <GalleryFilters
        locale={locale}
        currentType={filterType}
        availableTypes={allTypes}
      />

      {/* Posts Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No posts found for this filter
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <MediaPostCard
              key={item.id}
              item={item}
              locale={locale}
            />
          ))}
        </div>
      )}
    </div>
  );
}
