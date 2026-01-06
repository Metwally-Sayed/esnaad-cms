import Image from "next/image";
import { getLocale } from "next-intl/server";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type MediaDetailsContent = {
  nameEn?: string;
  nameAr?: string;
  descriptionEn?: string;
  descriptionAr?: string;
  type?: string;
  image?: string;
  slug?: string;
  updatedAt?: string | Date;
  createdAt?: string | Date;
};

export default async function MediaDetailsPage({
  content,
  className,
}: {
  content: MediaDetailsContent;
  className?: string;
}) {
  const locale = await getLocale();

  const title = locale === "ar" ? content.nameAr : content.nameEn;
  const description =
    locale === "ar"
      ? typeof content.descriptionAr === "string"
        ? content.descriptionAr
        : ""
      : typeof content.descriptionEn === "string"
        ? content.descriptionEn
        : "";

  const updatedAt = content.updatedAt
    ? new Date(content.updatedAt)
    : content.createdAt
      ? new Date(content.createdAt)
      : null;

  return (
    <main className={cn("min-h-screen bg-background", className)}>
      {/* Back Button */}
      <div className="container mx-auto px-4 pt-24 pb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/${locale}/gallery${content.type ? `?type=${content.type}` : ""}`}>
            <ArrowLeft className="me-2 size-4" />
            {locale === "ar" ? "العودة إلى المعرض" : "Back to Gallery"}
          </Link>
        </Button>
      </div>

      {/* Hero Image */}
      {content.image && (
        <section className="container mx-auto px-4 pb-8">
          <div className="relative aspect-[21/9] w-full overflow-hidden rounded-lg bg-muted">
            <Image
              src={content.image}
              alt={title || "Media"}
              fill
              className="object-cover"
              priority
            />
          </div>
        </section>
      )}

      {/* Content */}
      <section className="container mx-auto px-4 pb-16">
        <div className="mx-auto max-w-4xl">
          {/* Meta */}
          <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {content.type && (
              <div className="flex items-center gap-2">
                <Tag className="size-4" />
                <span className="rounded-full bg-primary/10 px-3 py-1 text-primary">
                  {content.type.charAt(0).toUpperCase() + content.type.slice(1)}
                </span>
              </div>
            )}
            {updatedAt && (
              <div className="flex items-center gap-2">
                <Calendar className="size-4" />
                <time dateTime={updatedAt.toISOString()}>
                  {updatedAt.toLocaleDateString(
                    locale === "ar" ? "ar-SA" : "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </time>
              </div>
            )}
          </div>

          {/* Title */}
          {title && (
            <h1 className="mb-6 text-4xl font-light tracking-tight md:text-5xl">
              {title}
            </h1>
          )}

          {/* Description */}
          {description && (
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <p className="text-lg leading-relaxed text-muted-foreground">
                {description}
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
