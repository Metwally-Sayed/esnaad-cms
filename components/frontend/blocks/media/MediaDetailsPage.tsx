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
      <div className="container mx-auto px-4 pb-4 pt-20 md:pb-6 md:pt-24">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/${locale}/gallery${content.type ? `?type=${content.type}` : ""}`}>
            <ArrowLeft className="me-2 size-4" />
            {locale === "ar" ? "العودة إلى المعرض" : "Back to Gallery"}
          </Link>
        </Button>
      </div>

      <section className="container mx-auto px-4 pb-5 md:hidden">
        <div className="rounded-2xl border border-border/60 bg-card/70 p-5">
          {title ? (
            <h1 className="font-serif text-3xl leading-tight tracking-[0.04em] text-foreground">
              {title}
            </h1>
          ) : null}

          <div className="mt-4 flex flex-wrap gap-2.5 text-[0.62rem] uppercase tracking-[0.18em] text-muted-foreground">
            {content.type ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background/80 px-3 py-1.5">
                <Tag className="size-3" />
                {content.type.charAt(0).toUpperCase() + content.type.slice(1)}
              </span>
            ) : null}
            {updatedAt ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background/80 px-3 py-1.5">
                <Calendar className="size-3" />
                {updatedAt.toLocaleDateString(
                  locale === "ar" ? "ar-SA" : "en-US",
                  { year: "numeric", month: "short", day: "numeric" }
                )}
              </span>
            ) : null}
          </div>
        </div>
      </section>

      {content.image && (
        <section className="container mx-auto px-4 pb-8 md:pb-10">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-muted md:aspect-[21/9] md:rounded-lg">
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

      <section className="container mx-auto px-4 pb-16">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 hidden flex-wrap items-center gap-4 text-sm text-muted-foreground md:flex">
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

          {title ? (
            <h1 className="mb-6 hidden text-4xl font-light tracking-tight md:block md:text-5xl">
              {title}
            </h1>
          ) : null}

          {description && (
            <div className="prose max-w-none dark:prose-invert md:prose-lg">
              <p className="text-base leading-8 text-muted-foreground md:text-lg md:leading-relaxed">
                {description}
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
