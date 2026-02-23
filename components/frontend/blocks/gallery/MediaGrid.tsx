import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getAllCategoriesCached, getAllMediaItemsCached } from "@/lib/data/media";
import { getLocale, getTranslations } from "next-intl/server";

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
  const tCommon = await getTranslations("Common");

  let items: MediaGridItem[] = [];

  // If collectionId is provided, dynamically generate cards
  if (content.collectionId) {
    // Check if we should show category items or post type cards
    if (content.filterType === "category") {
      // Show category items as cards
      const result = await getAllCategoriesCached();
      if (result.success && result.data) {
        items = result.data.map(category => ({
          image: category.image,
          label: locale === "ar" ? category.nameAr : category.nameEn,
          link: `/${locale}/gallery?type=${category.slug}`, // Link to gallery filtered by category slug
        }));
      }
    } else {
      // Dynamically group posts by type to create cards
      const result = await getAllMediaItemsCached();
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
    <section className={cn("bg-background py-12 md:py-16", className)}>
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-5 md:grid-cols-3 md:gap-6">
          {items.map((item, index) => (
            <Link
              key={index}
              href={item.link || "#"}
              className="group overflow-hidden rounded-2xl border border-border/60 bg-card/70 transition-transform duration-300 hover:scale-[1.01] md:relative md:aspect-[4/5] md:rounded-sm md:border-none md:bg-transparent"
            >
              <div className="relative aspect-[16/11] overflow-hidden md:absolute md:inset-0 md:aspect-auto">
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.label || `${index + 1}`}
                    fill
                    className="object-cover transition-all duration-500 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent md:bg-black/40 md:transition-opacity md:duration-300 md:group-hover:bg-black/50" />
              </div>

              {item.label ? (
                <div className="flex items-center justify-between px-4 py-4 md:absolute md:inset-0 md:justify-center md:p-0">
                  <h3 className="font-serif text-xl tracking-[0.08em] text-white md:text-5xl md:font-light md:tracking-[0.15em]">
                    {item.label}
                  </h3>
                  <span className="text-[0.62rem] uppercase tracking-[0.2em] text-white/80 md:hidden">
                    {tCommon("view")}
                  </span>
                </div>
              ) : null}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
