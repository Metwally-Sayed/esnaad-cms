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
    <section className={cn("py-12 md:py-16", className)}>
      <div className="container mx-auto px-4">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {items.map((item) => (
            <Link
              key={item.id}
              href={`/${locale}/gallery/${item.slug}`}
              className="group block overflow-hidden rounded-2xl border border-border/70 bg-card/80 shadow-sm transition-all hover:border-primary/50 hover:shadow-xl"
            >
              <div className={cn("relative overflow-hidden bg-muted", aspectRatioClass)}>
                {item.image && (
                  <Image
                    src={item.image}
                    alt={locale === "ar" ? item.nameAr : item.nameEn}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 md:group-hover:scale-110"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-black/0 md:opacity-0 md:transition-opacity md:duration-300 md:group-hover:opacity-100" />

                <div className="absolute left-3 top-3 rounded-full bg-background/95 px-3 py-1.5 text-[0.62rem] uppercase tracking-[0.16em] text-foreground shadow-lg backdrop-blur-sm md:left-4 md:top-4 md:text-xs md:normal-case md:tracking-normal md:font-semibold">
                  {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                </div>
              </div>

              <div className="space-y-3 p-4 md:p-6">
                {item.updatedAt ? (
                  <p className="text-[0.62rem] uppercase tracking-[0.2em] text-muted-foreground md:mt-4 md:text-xs md:normal-case md:tracking-normal">
                    {new Date(item.updatedAt).toLocaleDateString(
                      locale === "ar" ? "ar-EG" : "en-US",
                      { year: "numeric", month: "short", day: "numeric" }
                    )}
                  </p>
                ) : null}
                <h3 className="line-clamp-2 font-serif text-xl leading-tight tracking-[0.05em] transition-colors group-hover:text-primary md:text-xl md:font-semibold md:tracking-normal">
                  {locale === "ar" ? item.nameAr : item.nameEn}
                </h3>
                {(item.descriptionEn || item.descriptionAr) && (
                  <p className="line-clamp-3 overflow-hidden text-ellipsis text-sm leading-7 text-muted-foreground md:line-clamp-2 md:leading-relaxed">
                    {locale === "ar"
                      ? typeof item.descriptionAr === "string"
                        ? item.descriptionAr
                        : ""
                      : typeof item.descriptionEn === "string"
                        ? item.descriptionEn
                        : ""}
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
