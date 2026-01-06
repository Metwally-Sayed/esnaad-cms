import Image from "next/image";
import { cn } from "@/lib/utils";
import { getTranslations, getLocale } from "next-intl/server";
import { getAllMediaItems } from "@/server/actions/media";

export type IndustryUpdateItem = {
  image?: string;
  title?: string;
  description?: string;
  link?: string;
};

export type IndustryUpdateContent = {
  sectionTitle?: string;
  items?: IndustryUpdateItem[];
  collectionId?: string;
  limit?: number; // Optional: limit number of posts to display (default: 3)
  sortBy?: "order" | "updatedAt" | "createdAt"; // Optional: sort order (default: updatedAt for latest first)
};

export default async function IndustryUpdate({
  content,
  className,
}: {
  content: IndustryUpdateContent;
  className?: string;
}) {
  const t = await getTranslations("Gallery");
  const locale = await getLocale();
  const sectionTitle = content.sectionTitle || t("industryUpdate");

  // If collectionId is provided, fetch from collection
  let items = content.items || [];

  if (content.collectionId) {
    // Get sort order from content (default to updatedAt for showing latest first)
    const sortBy = content.sortBy || "updatedAt";

    // Fetch media items with specified sorting
    const result = await getAllMediaItems(sortBy);
    if (result.success && result.data) {
      let mediaItems = result.data;

      // Apply limit (default to 3 latest posts)
      const limit = content.limit || 3;
      mediaItems = mediaItems.slice(0, limit);

      // Transform media items to industry update items
      items = mediaItems.map(item => ({
        image: item.image,
        title: locale === "ar" ? item.nameAr : item.nameEn,
        description: locale === "ar"
          ? (typeof item.descriptionAr === 'string' ? item.descriptionAr : '')
          : (typeof item.descriptionEn === 'string' ? item.descriptionEn : ''),
        link: `/${locale}/gallery/${item.slug}`,
      }));
    }
  }

  return (
    <section className={cn("bg-background py-16", className)}>
      <div className="mx-auto max-w-7xl px-4">
        {/* Section Title */}
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-light tracking-[0.15em] md:text-5xl">
            {sectionTitle}
          </h2>
        </div>

        {/* Grid */}
        <div className="grid gap-8 md:grid-cols-3">
          {items.map((item, index) => (
            <a
              key={index}
              href={item.link || "#"}
              className="group"
            >
              {/* Image Container */}
              <div className="relative mb-6 aspect-[4/3] overflow-hidden rounded-sm">
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.title || `${index + 1}`}
                    fill
                    className="object-cover transition-all duration-500 group-hover:scale-105"
                  />
                )}

                {/* Overlay with Title */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60" />
                {item.title && (
                  <div className="absolute inset-0 flex items-center justify-center p-6">
                    <h3 className="text-center text-2xl font-light tracking-wide text-white md:text-3xl">
                      {item.title}
                    </h3>
                  </div>
                )}
              </div>

              {/* Description */}
              {item.description && (
                <p className="line-clamp-3 overflow-hidden text-ellipsis text-center text-base leading-relaxed text-foreground/80 transition-colors group-hover:text-foreground">
                  {item.description}
                </p>
              )}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
