"use client";

import { HeroVariantProps } from "./index";
import Image from "next/image";
import { cn } from "@/lib/utils";

type GalleryImage = {
  url?: string;
  alt?: string;
  caption?: string;
};

export default function HeroGallery({ content, className }: HeroVariantProps) {
  const title = content.title as string;
  const subtitle = content.subtitle as string;
  const gallery = (content.gallery as GalleryImage[]) || [];
  const layout = (content.layout as "grid" | "carousel" | "masonry") || "grid";

  return (
    <section className={cn("min-h-screen bg-background py-16", className)}>
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              {subtitle}
            </p>
          )}
        </div>

        {/* Gallery */}
        {layout === "grid" && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.map((img, index) => (
              <div key={index} className="group relative aspect-square overflow-hidden rounded-lg">
                {img.url && (
                  <>
                    <Image
                      src={img.url}
                      alt={img.alt || `Gallery image ${index + 1}`}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {img.caption && (
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
                        <p className="text-sm text-white">{img.caption}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {layout === "masonry" && (
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
            {gallery.map((img, index) => (
              <div key={index} className="mb-4 break-inside-avoid">
                {img.url && (
                  <div className="group relative overflow-hidden rounded-lg">
                    <Image
                      src={img.url}
                      alt={img.alt || `Gallery image ${index + 1}`}
                      width={400}
                      height={300 + (index % 3) * 100}
                      className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {img.caption && (
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
                        <p className="text-sm text-white">{img.caption}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {layout === "carousel" && (
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
            {gallery.map((img, index) => (
              <div key={index} className="relative aspect-[3/4] w-72 flex-shrink-0 snap-center overflow-hidden rounded-lg">
                {img.url && (
                  <>
                    <Image
                      src={img.url}
                      alt={img.alt || `Gallery image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    {img.caption && (
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                        <p className="text-sm text-white">{img.caption}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
