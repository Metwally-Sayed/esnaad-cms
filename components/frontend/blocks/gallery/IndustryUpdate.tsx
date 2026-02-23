import Image from "next/image";
import { MobileExpandableText } from "@/components/frontend/mobile";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { getTranslations, getLocale } from "next-intl/server";
import { getAllMediaItemsCached } from "@/lib/data/media";

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
  const tCommon = await getTranslations("Common");
  const locale = await getLocale();
  const sectionTitle = content.sectionTitle || t("industryUpdate");

  // If collectionId is provided, fetch from collection
  let items = content.items || [];

  if (content.collectionId) {
    // Get sort order from content (default to updatedAt for showing latest first)
    const sortBy = content.sortBy || "updatedAt";

    // Fetch media items with specified sorting
    const result = await getAllMediaItemsCached(sortBy);
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
    <section className={cn("bg-background py-12 md:py-16", className)}>
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center">
          <h2 className="font-serif text-3xl tracking-[0.08em] md:text-5xl md:tracking-[0.15em]">
            {sectionTitle}
          </h2>
        </div>

        <div className="space-y-5 md:grid md:grid-cols-3 md:gap-8 md:space-y-0">
          {items.map((item, index) => (
            <Link
              key={index}
              href={item.link || "#"}
              className="group block overflow-hidden rounded-2xl border border-border/60 bg-card/70 md:rounded-sm md:border-none md:bg-transparent"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-t-2xl md:mb-6 md:aspect-[4/3] md:rounded-sm">
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.title || `${index + 1}`}
                    fill
                    className="object-cover transition-all duration-500 group-hover:scale-105"
                  />
                )}

                <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60" />
                {item.title && (
                  <div className="absolute inset-0 flex items-center justify-center p-6">
                    <h3 className="text-center font-serif text-2xl tracking-[0.08em] text-white md:text-3xl md:font-light md:tracking-wide">
                      {item.title}
                    </h3>
                  </div>
                )}
              </div>

              <div className="px-4 py-4 md:px-0 md:py-0">
                {item.description ? (
                  <>
                    <div className="md:hidden">
                      <MobileExpandableText
                        text={item.description}
                        collapsedLines={5}
                        readMoreLabel={tCommon("readMore")}
                        readLessLabel={tCommon("readLess")}
                        contentClassName="text-sm leading-7 text-muted-foreground"
                        buttonClassName="text-[0.62rem] tracking-[0.2em]"
                      />
                    </div>
                    <p className="hidden line-clamp-3 overflow-hidden text-ellipsis text-center text-base leading-relaxed text-foreground/80 transition-colors group-hover:text-foreground md:block">
                      {item.description}
                    </p>
                  </>
                ) : null}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
