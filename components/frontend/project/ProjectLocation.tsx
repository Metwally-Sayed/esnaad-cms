"use client";

import { MobileExpandableText } from "@/components/frontend/mobile";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { useTranslations } from "next-intl";

type ProjectLocationProps = {
  description: string;
  mapEmbedUrl: string;
  emplacementText: string;
  recreationalText: string;
  videoTourUrl?: string;
  labels?: {
    location: string;
    amenities: string;
    units: string;
  };
};

const extractIframeSource = (value: string): string => {
  const trimmed = value.trim();
  if (!trimmed) return "";

  if (!trimmed.includes("<iframe")) {
    return trimmed;
  }

  const srcMatch = trimmed.match(/src\s*=\s*["']([^"']+)["']/i);
  if (!srcMatch?.[1]) {
    return "";
  }

  return srcMatch[1].replace(/&amp;/g, "&").trim();
};

const toCompactGoogleMapSource = (value: string): string => {
  try {
    const parsed = new URL(value);
    const isGoogleMaps = parsed.hostname.includes("google.") && parsed.pathname.includes("/maps");

    if (!isGoogleMaps) {
      return value;
    }

    const pb = parsed.searchParams.get("pb");
    if (pb) {
      // Prefer place query extracted from pb to preserve accurate target location.
      const decodedPb = decodeURIComponent(pb);
      const placeTokens = [...decodedPb.matchAll(/!2s([^!]+)!/g)]
        .map((match) => match[1]?.trim())
        .filter((token): token is string => Boolean(token) && token.length > 2);

      if (placeTokens.length > 0) {
        const bestPlaceToken = placeTokens[placeTokens.length - 1];
        return `https://maps.google.com/maps?q=${encodeURIComponent(bestPlaceToken)}&z=16&output=embed`;
      }

      // Google embed URLs usually contain lng/lat in this token pair.
      const coordinateMatches = [...decodedPb.matchAll(/!2d(-?\d+(?:\.\d+)?)!3d(-?\d+(?:\.\d+)?)/g)];
      const coordinateMatch = coordinateMatches.length > 0 ? coordinateMatches[coordinateMatches.length - 1] : null;

      if (coordinateMatch?.[1] && coordinateMatch?.[2]) {
        const lng = coordinateMatch[1];
        const lat = coordinateMatch[2];
        return `https://maps.google.com/maps?ll=${lat},${lng}&z=16&output=embed`;
      }
    }

    if (!parsed.searchParams.get("output")) {
      parsed.searchParams.set("output", "embed");
    }

    return parsed.toString();
  } catch {
    return value;
  }
};

export function ProjectLocation({
  description,
  mapEmbedUrl,
  emplacementText,
  recreationalText,
  videoTourUrl,
  labels,
}: ProjectLocationProps) {
  const tCommon = useTranslations("Common");
  const mapSource = useMemo(
    () => toCompactGoogleMapSource(extractIframeSource(mapEmbedUrl)),
    [mapEmbedUrl]
  );

  return (
    <section id="location" className="bg-background px-4 py-12 sm:px-6 sm:py-20 md:px-10 lg:py-28">
      <div className="mx-auto max-w-7xl w-full">
        <div className="space-y-5 md:hidden">
          <motion.div
            className="rounded-2xl border border-border/70 bg-card/65 p-5 backdrop-blur-sm"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="font-serif text-3xl tracking-[0.08em]">
              {labels?.location || "LOCATION"}
            </h2>
            <MobileExpandableText
              text={description}
              collapsedLines={7}
              readMoreLabel={tCommon("readMore")}
              readLessLabel={tCommon("readLess")}
              className="mt-4"
              contentClassName="font-serif text-sm leading-7 text-foreground/80"
              buttonClassName="text-[0.62rem] tracking-[0.2em]"
            />
          </motion.div>

          <motion.div
            className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border/70"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.03 }}
          >
            {mapSource ? (
              <iframe
                src={mapSource}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Project Location Map"
              />
            ) : (
              <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-border/70 bg-muted/20 px-4 text-center text-sm text-muted-foreground">
                Invalid map embed value. Paste a Google Maps embed URL or iframe code.
              </div>
            )}
          </motion.div>

          <Accordion type="multiple" className="space-y-3">
            <AccordionItem value="emplacement" className="rounded-xl border border-border/70 px-4">
              <AccordionTrigger className="py-4 text-xs uppercase tracking-[0.2em] hover:no-underline">
                {labels?.units || "Emplacement"}
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-sm leading-7 text-foreground/80">
                {emplacementText}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="amenities" className="rounded-xl border border-border/70 px-4">
              <AccordionTrigger className="py-4 text-xs uppercase tracking-[0.2em] hover:no-underline">
                {labels?.amenities || "Recreational Activities"}
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-sm leading-7 text-foreground/80">
                {recreationalText}
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {videoTourUrl ? (
            <a
              href={videoTourUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group mobile-touch-target inline-flex w-full items-center justify-center gap-2 rounded-full border border-foreground px-6 py-3 text-[0.68rem] uppercase tracking-[0.16em] transition-all hover:bg-foreground hover:text-background"
            >
              <Play className="h-4 w-4 transition-transform group-hover:scale-110" />
              {tCommon("watchVideoTour")}
            </a>
          ) : null}
        </div>

        <div className="hidden gap-8 sm:gap-12 md:grid lg:grid-cols-2 lg:gap-16">
          <motion.div
            className="space-y-6 sm:space-y-10"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="font-serif text-3xl font-light uppercase tracking-[0.08em] sm:text-4xl sm:tracking-[0.1em] md:text-5xl">
              {labels?.location || "LOCATION"}
            </h2>

            <p className="font-serif text-sm leading-relaxed text-foreground/80 sm:text-base">
              {description}
            </p>

            {videoTourUrl && (
              <a
                href={videoTourUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex w-full touch-manipulation items-center justify-center gap-2 rounded-full border-2 border-foreground px-6 py-3 font-serif text-sm uppercase tracking-[0.08em] transition-all hover:bg-foreground hover:text-background sm:w-auto sm:gap-3 sm:px-8 sm:py-4 sm:text-base sm:tracking-[0.1em]"
              >
                <Play className="h-4 w-4 transition-transform group-hover:scale-110 sm:h-5 sm:w-5" />
                {tCommon("watchVideoTour")}
              </a>
            )}

            <div className="space-y-2 sm:space-y-3">
              <h3 className="font-serif text-lg font-medium sm:text-xl">{labels?.units || "Emplacement"}</h3>
              <p className="font-serif text-sm leading-relaxed text-foreground/80 sm:text-base">
                {emplacementText}
              </p>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <h3 className="font-serif text-lg font-medium sm:text-xl">
                {labels?.amenities || "Recreational Activities"}
              </h3>
              <p className="font-serif text-sm leading-relaxed text-foreground/80 sm:text-base">
                {recreationalText}
              </p>
            </div>
          </motion.div>

          <motion.div
            className="relative h-[350px] overflow-hidden rounded-lg sm:h-[450px] md:h-[600px]"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            {mapSource ? (
              <iframe
                src={mapSource}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Project Location Map"
              />
            ) : (
              <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-border/70 bg-muted/20 px-4 text-center text-sm text-muted-foreground">
                Invalid map embed value. Paste a Google Maps embed URL or iframe code.
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
