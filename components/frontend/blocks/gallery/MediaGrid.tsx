import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getAllMediaItems, getAllCategories } from "@/server/actions/media";
import { getLocale } from "next-intl/server";

export type MediaGridItem = {
  image?: string;
  label?: string;
  link?: string;
};

export type MediaGridContent = {
  items?: MediaGridItem[];
  collectionId?: string;
  filterType?: string; // Optional: filter by media type (e.g., "category", "article")
};

export default async function MediaGrid({
  content,
  className,
}: {
  content: MediaGridContent;
  className?: string;
}) {
  const locale = await getLocale();

  let items: MediaGridItem[] = [];

  // If collectionId is provided, dynamically generate cards
  if (content.collectionId) {
    // Check if we should show category items or post type cards
    if (content.filterType === "category") {
      // Show category items as cards
      const result = await getAllCategories();
      if (result.success && result.data) {
        items = result.data.map(category => ({
          image: category.image,
          label: locale === "ar" ? category.nameAr : category.nameEn,
          link: `/${locale}/gallery?type=${category.slug}`, // Link to gallery filtered by category slug
        }));
      }
    } else {
      // Dynamically group posts by type to create cards
      const result = await getAllMediaItems();
      if (result.success && result.data) {
        const mediaItems = result.data;

        // Group posts by type
        const typeMap = new Map<string, typeof mediaItems[0]>();

        mediaItems.forEach(item => {
          if (item.type && !typeMap.has(item.type)) {
            typeMap.set(item.type, item);
          }
        });

        // Create a card for each unique type
        items = Array.from(typeMap.entries()).map(([type, firstItem]) => ({
          image: firstItem.image,
          label: type.charAt(0).toUpperCase() + type.slice(1),
          link: `/${locale}/gallery?type=${type}`,
        }));
      }
    }
  }

  // Fallback to static items if provided and no dynamic items generated
  if (items.length === 0 && content.items) {
    items = content.items;
  }

  return (
    <section className={cn("bg-background py-16", className)}>
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-6 md:grid-cols-3">
          {items.map((item, index) => (
            <Link
              key={index}
              href={item.link || "#"}
              className="group relative aspect-[4/5] overflow-hidden rounded-sm transition-transform duration-300 hover:scale-[1.02]"
            >
              {/* Image */}
              {item.image && (
                <Image
                  src={item.image}
                  alt={item.label || `${index + 1}`}
                  fill
                  className="object-cover transition-all duration-500 group-hover:scale-105"
                />
              )}

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40 transition-opacity duration-300 group-hover:bg-black/50" />

              {/* Label */}
              {item.label && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-4xl font-light tracking-[0.15em] text-white md:text-5xl">
                    {item.label}
                  </h3>
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
