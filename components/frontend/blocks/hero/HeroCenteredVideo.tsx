"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import { HeroVariantProps } from "./index";

const inferMimeType = (src: string) => {
  const lowerSrc = src.toLowerCase();
  if (lowerSrc.includes(".m3u8")) return "application/x-mpegURL";
  if (lowerSrc.endsWith(".webm")) return "video/webm";
  if (lowerSrc.endsWith(".mov")) return "video/quicktime";
  if (lowerSrc.endsWith(".mp4")) return "video/mp4";
  return undefined;
};

type CTA = {
  text?: string;
  link?: string;
  variant?: "primary" | "secondary" | "ghost";
};

export default function HeroCenteredVideo({ content, className }: HeroVariantProps) {
  const title = content.title as string;
  const subtitle = content.subtitle as string;
  const videoUrl = content.videoUrl as string;
  const posterImage = content.posterImage as string;
  const ctas = (content.ctas as CTA[]) || [];
  const minHeight = Number(content.minHeight) || undefined;
  const mimeType = inferMimeType(videoUrl);
  const heightStyle = minHeight ? { minHeight: `${minHeight}px` } : undefined;

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

  return (
    <section
      ref={containerRef}
      className={cn(
        "relative min-h-[68svh] overflow-hidden sm:min-h-screen",
        className
      )}
      style={heightStyle}
    >
      {/* Video Background */}
      <motion.div className="absolute inset-0 z-0" style={{ y, scale, opacity }}>
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster={posterImage || ""}
          className="h-full w-full object-cover"
          suppressHydrationWarning
        >
          <source src={videoUrl} type={mimeType} />
        </video>
      </motion.div>
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/20 via-black/45 to-black/75" />

      {/* Content */}
      <div
        className="relative z-10 flex min-h-[68svh] items-end px-4 pb-8 pt-20 text-white sm:min-h-screen sm:items-center sm:justify-center sm:px-6 sm:pb-16"
        style={heightStyle}
      >
        <div className="w-full rounded-2xl border border-white/20 bg-black/35 p-4 backdrop-blur-md sm:w-auto sm:max-w-3xl sm:border-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none sm:text-center">
          <h1 className="mb-3 font-serif text-3xl uppercase tracking-[0.12em] sm:mb-6 sm:text-5xl sm:tracking-tight md:text-7xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mb-5 max-w-2xl text-sm leading-relaxed text-white/80 sm:mb-8 sm:text-lg md:text-xl">
              {subtitle}
            </p>
          )}
          {ctas.length > 0 && (
            <div className="flex w-full flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4">
              {ctas.map((cta, index) => (
                <Link key={index} href={cta.link || "#"} className="w-full sm:w-auto">
                  <Button
                    variant={
                      cta.variant === "primary"
                        ? "default"
                        : cta.variant === "ghost"
                          ? "ghost"
                          : "secondary"
                    }
                    size="lg"
                    className={cn(
                      "w-full sm:w-auto mobile-touch-target",
                      cta.variant === "primary" && "bg-white text-black hover:bg-white/90"
                    )}
                  >
                    {cta.text}
                  </Button>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
