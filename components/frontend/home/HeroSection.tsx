"use client";

import { CTAFactory, type CTAContent } from "@/components/frontend/blocks/cta";
import {
  HighlightFactory,
  type HighlightsContent,
} from "@/components/frontend/blocks/highlights";
import { MobileExpandableText } from "@/components/frontend/mobile";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useMemo, useRef, useState } from "react";

type HeroSectionProps = {
  brand: {
    name: string;
    descriptor: string;
  };
  headline: string[];
  description?: string;
  ctas?: CTAContent[];
  highlights?: HighlightsContent;
  location?: string;
  contactLabel?: string;
  media?: {
    type?: "video" | "image";
    src: string;
    poster?: string;
    mobileType?: "video" | "image";
    mobileSrc?: string;
    mobilePoster?: string;
  };
};

const DEFAULT_VIDEO =
  "https://cdn.coverr.co/videos/coverr-contemporary-interior-o2152/1080p.mp4";

const inferMimeType = (src: string) => {
  const lowerSrc = src.toLowerCase();
  if (lowerSrc.includes(".m3u8")) return "application/x-mpegURL";
  if (lowerSrc.endsWith(".webm")) return "video/webm";
  if (lowerSrc.endsWith(".mov")) return "video/quicktime";
  if (lowerSrc.endsWith(".mp4")) return "video/mp4";
  return undefined;
};

const chunkLine = (line: string) => {
  const words = line.trim().split(/\s+/);
  const chunks: string[] = [];
  for (let i = 0; i < words.length; i += 2) {
    chunks.push(words.slice(i, i + 2).join(" "));
  }
  return chunks;
};

const HeroSection = ({
  brand,
  headline,
  description,
  ctas,
  highlights,
  location,
  contactLabel,
  media,
}: HeroSectionProps) => {
  const tCommon = useTranslations("Common");
  const isMobile = useIsMobile();
  const mediaType = isMobile
    ? media?.mobileType ?? media?.type ?? "video"
    : media?.type ?? "video";
  const mediaSource = isMobile
    ? media?.mobileSrc ?? media?.src ?? DEFAULT_VIDEO
    : media?.src ?? DEFAULT_VIDEO;
  const mediaPoster = isMobile
    ? media?.mobilePoster ?? media?.poster ?? ""
    : media?.poster ?? "";
  const mimeType = inferMimeType(mediaSource);
  const canRenderImageMedia = /^(https?:\/\/|\/)/i.test(mediaSource);
  const [mobileDetailsOpen, setMobileDetailsOpen] = useState(false);

  const containerRef = useRef<HTMLElement>(null);

  // Track scroll progress of the hero section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Transform values for parallax effect
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.5]);

  const primaryCta = ctas?.[0];
  const secondaryCtas = useMemo(() => ctas?.slice(1) ?? [], [ctas]);
  const headlineLines = useMemo(
    () =>
      headline
        .map((line) => line.trim())
        .filter((line) => line.length > 0),
    [headline]
  );
  const hasBrand = Boolean(brand?.name?.trim());
  const hasLocation = Boolean(location?.trim());
  const hasHeroIntro = hasBrand || hasLocation || headlineLines.length > 0;
  const hasMobileDetails =
    Boolean(description?.trim()) ||
    Boolean(highlights?.items?.length) ||
    Boolean(contactLabel?.trim()) ||
    secondaryCtas.length > 0;
  const hasDesktopDetails =
    Boolean(description?.trim()) ||
    Boolean(highlights?.items?.length) ||
    Boolean(ctas?.length) ||
    Boolean(contactLabel?.trim());
  const showMobileCard = Boolean(primaryCta) || hasMobileDetails;

  return (
    <section
      ref={containerRef}
      className="relative isolate h-[640px] w-full overflow-hidden bg-black text-white sm:h-[720px] md:h-[920px] lg:min-h-[70vh]"
    >
      <motion.div className="absolute inset-0 h-full w-full" style={{ y, scale, opacity }}>
        {mediaType === "image" ? (
          canRenderImageMedia ? (
            <Image
              src={mediaSource}
              alt={brand?.name ? `${brand.name} hero media` : "Hero media"}
              fill
              priority
              quality={100}
              sizes="100vw"
              className="object-cover"
            />
          ) : (
            <div
              className="absolute inset-0 h-full w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${mediaSource})` }}
            />
          )
        ) : (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster={mediaPoster}
            suppressHydrationWarning
          >
            <source src={mediaSource} type={mimeType} />
          </video>
        )}
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/25 to-black/70" />

      <div className="relative z-10 flex h-full flex-col px-4 pb-8 pt-7 sm:px-10 sm:pb-12 sm:pt-8 lg:px-24">
        <div className="mt-auto text-white">
          {hasHeroIntro || showMobileCard ? (
            <div
              className={cn(
                showMobileCard &&
                  "rounded-2xl border border-white/20 bg-black/35 p-4 backdrop-blur-md sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none",
                !showMobileCard && "p-0",
                !hasDesktopDetails ? "mb-12 sm:mb-20" : ""
              )}
            >
              {hasBrand ? (
                <ScrollReveal mode="fade-in" delay={0.1}>
                  <p className="text-[0.65rem] uppercase tracking-[0.28em] text-white/70 sm:text-xs sm:tracking-[0.5em]">
                    {brand.name}
                    {brand.descriptor ? ` — ${brand.descriptor}` : ""}
                  </p>
                </ScrollReveal>
              ) : null}
              {hasLocation ? (
                <ScrollReveal mode="fade-in" delay={0.2}>
                  <p className="text-[0.65rem] uppercase tracking-[0.3em] text-white/70 sm:text-xs sm:tracking-[0.7em]">
                    {location}
                  </p>
                </ScrollReveal>
              ) : null}

              {headlineLines.length > 0 ? (
                <div className="mt-3 space-y-1.5 font-serif text-2xl uppercase tracking-[0.18em] sm:mt-4 sm:space-y-2 sm:text-4xl sm:tracking-[0.4em]">
                  {headlineLines.map((line, index) => (
                    <div key={`${line}-${index}`} className="space-y-1">
                      <ScrollReveal mode="slide-right">
                        {index === 0 ? (
                          // First headline is H1 for SEO
                          <h1 className="space-y-1">
                            {chunkLine(line).map((chunk) => (
                              <span key={`${line}-${chunk}`} className="block">
                                {chunk}
                              </span>
                            ))}
                          </h1>
                        ) : (
                          chunkLine(line).map((chunk) => <p key={`${line}-${chunk}`}>{chunk}</p>)
                        )}
                      </ScrollReveal>
                    </div>
                  ))}
                </div>
              ) : null}

              {primaryCta ? (
                <div className="mt-5 sm:hidden">
                  <CTAFactory content={primaryCta} />
                </div>
              ) : null}

              {hasMobileDetails ? (
                <button
                  type="button"
                  onClick={() => setMobileDetailsOpen((prev) => !prev)}
                  className="mobile-touch-target mt-3 inline-flex items-center text-[0.62rem] uppercase tracking-[0.2em] text-white/80 transition-colors hover:text-white sm:hidden"
                >
                  {mobileDetailsOpen ? tCommon("hideDetails") : tCommon("showDetails")}
                </button>
              ) : null}

              {mobileDetailsOpen ? (
                <div className="mt-3 space-y-4 sm:hidden">
                  {description ? (
                    <MobileExpandableText
                      text={description}
                      collapsedLines={5}
                      className="space-y-1"
                      contentClassName="text-white/75"
                      readMoreLabel={tCommon("readMore")}
                      readLessLabel={tCommon("readLess")}
                    />
                  ) : null}

                  {highlights?.items?.length ? (
                    <HighlightFactory content={highlights} className="text-white/70" />
                  ) : null}

                  {secondaryCtas.length ? (
                    <div className="flex flex-wrap gap-2.5">
                      {secondaryCtas.map((ctaContent, index) => (
                        <CTAFactory
                          key={`${ctaContent.variant}-secondary-${index}`}
                          content={ctaContent}
                        />
                      ))}
                    </div>
                  ) : null}

                  {contactLabel ? (
                    <p className="text-[0.65rem] uppercase tracking-[0.24em] text-white/70">
                      {contactLabel}
                    </p>
                  ) : null}
                </div>
              ) : null}
            </div>
          ) : null}

          <div className="mt-4 hidden space-y-5 sm:block">
            {description ? (
              <p className="max-w-xl text-sm leading-relaxed text-white/70 sm:text-base">
                {description}
              </p>
            ) : null}

            {highlights?.items?.length ? (
              <HighlightFactory content={highlights} className="text-white/70" />
            ) : null}

            {ctas && ctas.length ? (
              <div className="flex flex-wrap gap-3">
                {ctas.map((ctaContent, index) => (
                  <CTAFactory key={`${ctaContent.variant}-${index}`} content={ctaContent} />
                ))}
              </div>
            ) : null}

            {contactLabel ? (
              <p className="text-[0.65rem] uppercase tracking-[0.24em] text-white/70 sm:text-xs sm:tracking-[0.4em]">
                {contactLabel}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
