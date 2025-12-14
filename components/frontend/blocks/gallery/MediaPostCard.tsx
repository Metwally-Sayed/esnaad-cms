import Image from "next/image";
import Link from "next/link";
import type { MediaItem } from "@/server/actions/media";
import { Badge } from "@/components/ui/badge";
import { getTranslations } from "next-intl/server";

type Props = {
  item: MediaItem;
  locale: string;
};

export default async function MediaPostCard({ item, locale }: Props) {
  const t = await getTranslations("gallery");
  const title = locale === "ar" ? item.nameAr : item.nameEn;
  const postUrl = `/${locale}/media/${item.slug}`;
  const categoryLabel = t(`filters.${item.type}`, { default: item.type });

  return (
    <Link
      href={postUrl}
      className="group flex flex-col overflow-hidden rounded-lg border bg-card transition-all hover:shadow-lg"
    >
      {/* Image */}
      <div className="relative aspect-video overflow-hidden bg-muted">
        {item.image && (
          <Image
            src={item.image}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        {/* Category Badge */}
        <div className="mb-3">
          <Badge variant="secondary" className="w-fit">
            {categoryLabel}
          </Badge>
        </div>

        {/* Title */}
        <h3 className="mb-2 text-xl font-semibold line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>

        {/* Date */}
        {item.updatedAt && (
          <p className="mt-auto text-sm text-muted-foreground">
            {new Date(item.updatedAt).toLocaleDateString(
              locale === "ar" ? "ar-EG" : "en-US",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            )}
          </p>
        )}
      </div>
    </Link>
  );
}
