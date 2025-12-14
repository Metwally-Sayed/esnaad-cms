"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MediaItem } from "@/server/actions/media";

interface CardTransform {
  rotateX: number;
  rotateY: number;
  scale: number;
}

// Helper function to get aspect ratio class
const getAspectRatioClass = (imageStyle?: string) => {
  switch (imageStyle) {
    case "wide":
      return "aspect-video"; // 16:9
    case "square":
      return "aspect-square"; // 1:1
    case "portrait":
      return "aspect-[4/5]"; // 4:5
    case "tall":
      return "aspect-[3/4]"; // 3:4
    case "landscape":
    default:
      return "aspect-video"; // 16:9 (default for 3D cards)
  }
};

function Media3dCard({
  item,
  locale,
  imageStyle,
}: {
  item: MediaItem;
  locale: string;
  imageStyle?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const lastMousePosition = useRef({ x: 0, y: 0 });

  const title = locale === "ar" ? item.nameAr : item.nameEn;
  const description =
    locale === "ar"
      ? typeof item.descriptionAr === "string"
        ? item.descriptionAr
        : ""
      : typeof item.descriptionEn === "string"
        ? item.descriptionEn
        : "";

  useEffect(() => {
    const card = cardRef.current;
    const image = imageRef.current;

    if (!card || !image) return;

    let rect: DOMRect;
    let centerX: number;
    let centerY: number;

    const updateCardTransform = (mouseX: number, mouseY: number) => {
      if (!rect) {
        rect = card.getBoundingClientRect();
        centerX = rect.left + rect.width / 2;
        centerY = rect.top + rect.height / 2;
      }

      const relativeX = mouseX - centerX;
      const relativeY = mouseY - centerY;

      const cardTransform: CardTransform = {
        rotateX: -relativeY * 0.035,
        rotateY: relativeX * 0.035,
        scale: 1.025,
      };

      const imageTransform: CardTransform = {
        rotateX: -relativeY * 0.025,
        rotateY: relativeX * 0.025,
        scale: 1.05,
      };

      return { cardTransform, imageTransform };
    };

    const animate = () => {
      const { cardTransform, imageTransform } = updateCardTransform(
        lastMousePosition.current.x,
        lastMousePosition.current.y
      );

      card.style.transform = `perspective(1000px) rotateX(${cardTransform.rotateX}deg) rotateY(${cardTransform.rotateY}deg) scale3d(${cardTransform.scale}, ${cardTransform.scale}, ${cardTransform.scale})`;
      card.style.boxShadow = "0 10px 35px rgba(0, 0, 0, 0.2)";

      image.style.transform = `perspective(1000px) rotateX(${imageTransform.rotateX}deg) rotateY(${imageTransform.rotateY}deg) scale3d(${imageTransform.scale}, ${imageTransform.scale}, ${imageTransform.scale})`;

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      lastMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseEnter = () => {
      card.style.transition = "transform 0.2s ease, box-shadow 0.2s ease";
      image.style.transition = "transform 0.2s ease";
      animate();
    };

    const handleMouseLeave = () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      card.style.transform =
        "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";
      card.style.boxShadow = "none";
      card.style.transition = "transform 0.5s ease, box-shadow 0.5s ease";

      image.style.transform =
        "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";
      image.style.transition = "transform 0.5s ease";
    };

    card.addEventListener("mouseenter", handleMouseEnter);
    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      card.removeEventListener("mouseenter", handleMouseEnter);
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <Link href={`/${locale}/gallery/${item.slug}`}>
      <Card ref={cardRef} className="cursor-pointer overflow-hidden">
        <CardHeader>
          <CardTitle className="line-clamp-2">{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          {item.image && (
            <img
              ref={imageRef}
              src={item.image}
              alt={title}
              className={cn("w-full rounded-md object-cover", getAspectRatioClass(imageStyle))}
            />
          )}
          {description && (
            <p className="line-clamp-3 text-muted-foreground">{description}</p>
          )}
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
              {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export function MediaCards3d({
  items,
  locale,
  className,
  imageStyle,
}: {
  items: MediaItem[];
  locale: string;
  className?: string;
  imageStyle?: string;
}) {
  return (
    <section className={cn("bg-background py-12", className)}>
      <div className="container mx-auto px-4">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <Media3dCard key={item.id} item={item} locale={locale} imageStyle={imageStyle} />
          ))}
        </div>
      </div>
    </section>
  );
}
