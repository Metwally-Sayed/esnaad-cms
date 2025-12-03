"use client";

import { HeroVariantProps } from "./index";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

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
  const minHeight = (content.minHeight as number) || undefined;
  const mimeType = inferMimeType(videoUrl);

  // Determine the height class based on minHeight prop
  const heightClass = minHeight ? `min-h-[${minHeight}px]` : "min-h-screen";
  const heightStyle = minHeight ? { minHeight: `${minHeight}px` } : undefined;

  return (
    <section
      className={cn("relative overflow-hidden", heightClass, className)}
      style={heightStyle}
    >
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster={posterImage}
          className="h-full w-full object-cover"
        >
          <source src={videoUrl} type={mimeType} />
        </video>
      </div>

      {/* Content */}
      <div
        className={cn("relative z-10 flex flex-col items-center justify-center px-4 text-center text-white", heightClass)}
        style={heightStyle}
      >
        <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-7xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mb-8 max-w-2xl text-lg text-white/80 md:text-xl">
            {subtitle}
          </p>
        )}
        {ctas.length > 0 && (
          <div className="flex flex-wrap gap-4">
            {ctas.map((cta, index) => (
              <Link key={index} href={cta.link || "#"}>
                <Button
                  variant={cta.variant === "primary" ? "default" : cta.variant === "ghost" ? "ghost" : "secondary"}
                  size="lg"
                  className={cta.variant === "primary" ? "bg-white text-black hover:bg-white/90" : ""}
                >
                  {cta.text}
                </Button>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
