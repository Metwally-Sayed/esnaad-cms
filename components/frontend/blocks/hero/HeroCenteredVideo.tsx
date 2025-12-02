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
  const mimeType = inferMimeType(videoUrl);

  return (
    <section className={cn("relative min-h-screen overflow-hidden", className)}>
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
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 text-center text-white">
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
