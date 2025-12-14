"use client";

import { CTAFactory, type CTAContent } from "@/components/frontend/blocks/cta";
import {
    HighlightFactory,
    type HighlightsContent,
} from "@/components/frontend/blocks/highlights";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

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
  const mediaType = media?.type ?? "video";
  const mediaSource = media?.src ?? DEFAULT_VIDEO;
  const mimeType = inferMimeType(mediaSource);

  const containerRef = useRef<HTMLElement>(null);
  
  // Track scroll progress of the hero section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Transform values for parallax effect
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.5]);

  return (
    <section ref={containerRef} className="relative isolate h-[720px] md:h-[920px] lg:min-h-[70vh] w-full overflow-hidden bg-black text-white">
      <motion.div
        className="absolute inset-0 h-full w-full"
        style={{ y, scale, opacity }}
      >
        {mediaType === "image" ? (
          <div
            className="absolute inset-0 h-full w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${mediaSource})` }}
          />
        ) : (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            poster={media?.poster}
          >
            <source src={mediaSource} type={mimeType} />
          </video>
        )}
      </motion.div>

      <div className="relative z-10 flex h-full flex-col px-4 pb-12 pt-8 sm:px-10 lg:px-24">
        <div className="mt-auto grid gap-6 text-white">
          <div
            className={
              !description && !highlights?.items?.length && !ctas?.length
                ? "mb-20"
                : ""
            }
          >
            {location ? (
              <ScrollReveal mode="fade-in" delay={0.2}>
                <p className="text-xs uppercase tracking-[0.7em] text-white/70">
                  {location}
                </p>
              </ScrollReveal>
            ) : null}
            <div className="mt-4 space-y-2 font-serif text-3xl uppercase tracking-[0.4em] sm:text-4xl">
              {headline.map((line) => (
                <div key={line} className="space-y-1">
                <ScrollReveal mode="slide-right" staggerChildren={0.1}>
                  {chunkLine(line).map((chunk) => (
                    <p key={`${line}-${chunk}`}>{chunk}</p>
                  ))}
                </ScrollReveal>
                </div>
              ))}
            </div>
          </div>

          {description ? (
            <p className="max-w-xl text-sm text-white/70 sm:text-base">
              {description}
            </p>
          ) : null}

          {highlights?.items?.length ? (
            <HighlightFactory content={highlights} className="text-white/70" />
          ) : null}

          {ctas && ctas.length ? (
            <div className="flex flex-wrap gap-3">
              {ctas.map((ctaContent, index) => (
                <CTAFactory
                  key={`${ctaContent.variant}-${index}`}
                  content={ctaContent}
                />
              ))}
            </div>
          ) : null}

          {/* {contactLabel ? (
            <p className="text-sm uppercase tracking-[0.4em] text-white/80">
              {contactLabel}
            </p>
          ) : null} */}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
