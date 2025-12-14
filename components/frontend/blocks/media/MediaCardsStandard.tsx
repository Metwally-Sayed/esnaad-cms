import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { MediaItem } from "@/server/actions/media";

// Helper function to get aspect ratio class
const getAspectRatioClass = (imageStyle?: string) => {
  switch (imageStyle) {
    case "wide":
      return "aspect-video"; // 16:9
    case "square":
      return "aspect-square"; // 1:1
    case "portrait":
      return "aspect-[4/5]"; // 4:5
    case "tall":
      return "aspect-[3/4]"; // 3:4
    case "landscape":
    default:
      return "aspect-[16/10]"; // 16:10 (default)
  }
};

export function MediaCardsStandard({
  items,
  locale,
  className,
  imageStyle,
}: {
  items: MediaItem[];
  locale: string;
  className?: string;
  imageStyle?: string;
}) {
  const aspectRatioClass = getAspectRatioClass(imageStyle);

  return (
    <section className={cn("py-16", className)}>
      <div className="container mx-auto px-4">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Link
              key={item.id}
              href={`/${locale}/gallery/${item.slug}`}
              className="group block overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-xl hover:border-primary/50"
            >
              {/* Image */}
              <div className={cn("relative overflow-hidden bg-muted", aspectRatioClass)}>
                {item.image && (
                  <Image
                    src={item.image}
                    alt={locale === "ar" ? item.nameAr : item.nameEn}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                )}
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* Type Badge */}
                <div className="absolute left-4 top-4 rounded-full bg-background/95 backdrop-blur-sm px-3 py-1.5 text-xs font-semibold text-foreground shadow-lg">
                  {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="mb-3 line-clamp-2 text-xl font-semibold transition-colors group-hover:text-primary">
                  {locale === "ar" ? item.nameAr : item.nameEn}
                </h3>
                {(item.descriptionEn || item.descriptionAr) && (
                  <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {locale === "ar"
                      ? typeof item.descriptionAr === "string"
                        ? item.descriptionAr
                        : ""
                      : typeof item.descriptionEn === "string"
                        ? item.descriptionEn
                        : ""}
                  </p>
                )}
                {item.updatedAt && (
                  <p className="mt-4 text-xs text-muted-foreground">
                    {new Date(item.updatedAt).toLocaleDateString(
                      locale === "ar" ? "ar-EG" : "en-US",
                      { year: "numeric", month: "short", day: "numeric" }
                    )}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
