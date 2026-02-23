"use client";

import { MobileSectionHeader } from "@/components/frontend/mobile";
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
        "flex min-h-[30vh] items-center justify-center bg-background py-14 md:min-h-[40vh] md:py-24",
        className
      )}
    >
      <div className="mx-auto max-w-7xl px-4 text-center">
        <div className="mx-auto max-w-xl rounded-2xl border border-border/60 bg-card/60 px-5 py-6 backdrop-blur-sm md:hidden">
          <MobileSectionHeader
            centered
            title={title}
            subtitle={subtitle}
            titleClassName="font-serif text-2xl tracking-[0.08em] normal-case"
            subtitleClassName="text-sm leading-7 text-muted-foreground"
          />
        </div>

        <div className="hidden md:block">
          <h1 className="mb-6 text-5xl font-light tracking-[0.2em] md:text-6xl lg:text-7xl">
            {title}
          </h1>
          <p className="text-xl font-light tracking-[0.15em] text-muted-foreground md:text-2xl">
            {subtitle}
          </p>
        </div>
      </div>
    </section>
  );
}
