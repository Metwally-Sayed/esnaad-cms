"use client";

import { HeroVariantProps } from "./index";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

type CTA = {
  text?: string;
  link?: string;
  variant?: "primary" | "secondary";
};

export default function HeroSplitImage({ content, className }: HeroVariantProps) {
  const title = content.title as string;
  const subtitle = content.subtitle as string;
  const image = content.image as string;
  const imageAlt = (content.imageAlt as string) || "Hero image";
  const imagePosition = (content.imagePosition as "left" | "right") || "right";
  const ctas = (content.ctas as CTA[]) || [];

  return (
    <section className={cn("min-h-screen bg-background", className)}>
      <div className={cn(
        "mx-auto grid min-h-screen max-w-7xl gap-8 px-4 py-16 md:grid-cols-2 md:gap-12 md:py-0",
        imagePosition === "left" && "md:[direction:rtl]"
      )}>
        {/* Text Content */}
        <div className={cn(
          "flex flex-col justify-center",
          imagePosition === "left" && "md:[direction:ltr]"
        )}>
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mb-8 text-lg text-muted-foreground md:text-xl">
              {subtitle}
            </p>
          )}
          {ctas.length > 0 && (
            <div className="flex flex-wrap gap-4">
              {ctas.map((cta, index) => (
                <Link key={index} href={cta.link || "#"}>
                  <Button
                    variant={cta.variant === "secondary" ? "secondary" : "default"}
                    size="lg"
                  >
                    {cta.text}
                  </Button>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Image */}
        <div className={cn(
          "relative flex items-center justify-center",
          imagePosition === "left" && "md:[direction:ltr]"
        )}>
          {image && (
            <div className="relative aspect-square w-full max-w-lg overflow-hidden rounded-2xl">
              <Image
                src={image}
                alt={imageAlt}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
