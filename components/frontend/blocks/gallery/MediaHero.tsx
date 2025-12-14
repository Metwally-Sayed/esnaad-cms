"use client";

import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export type MediaHeroContent = {
  title?: string;
  subtitle?: string;
};

export default function MediaHero({
  content,
  className,
}: {
  content: MediaHeroContent;
  className?: string;
}) {
  const t = useTranslations("Gallery");
  const title = content.title || t("mediaCenter");
  const subtitle = content.subtitle || t("whatTheySay");

  return (
    <section
      className={cn(
        "flex min-h-[40vh] items-center justify-center bg-background py-24",
        className
      )}
    >
      <div className="mx-auto max-w-7xl px-4 text-center">
        <h1 className="mb-6 text-5xl font-light tracking-[0.2em] md:text-6xl lg:text-7xl">
          {title}
        </h1>
        <p className="text-xl font-light tracking-[0.15em] text-muted-foreground md:text-2xl">
          {subtitle}
        </p>
      </div>
    </section>
  );
}
