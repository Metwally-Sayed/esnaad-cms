"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";

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
  const mapSource = useMemo(
    () => toCompactGoogleMapSource(extractIframeSource(mapEmbedUrl)),
    [mapEmbedUrl]
  );

  return (
    <section id="location" className="min-h-screen snap-start bg-background px-4 sm:px-6 md:px-10 py-12 sm:py-20 lg:py-28 flex items-center">
      <div className="mx-auto max-w-7xl w-full">
        <div className="grid gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Content */}
          <motion.div
            className="space-y-6 sm:space-y-10"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light uppercase tracking-[0.08em] sm:tracking-[0.1em]">
              {labels?.location || "LOCATION"}
            </h2>

            <p className="font-serif text-sm sm:text-base leading-relaxed text-foreground/80">
              {description}
            </p>

            {videoTourUrl && (
              <button className="group inline-flex w-full sm:w-auto items-center justify-center gap-2 sm:gap-3 rounded-full border-2 border-foreground px-6 sm:px-8 py-3 sm:py-4 font-serif text-sm sm:text-base uppercase tracking-[0.08em] sm:tracking-[0.1em] transition-all hover:bg-foreground hover:text-background touch-manipulation">
                <Play className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:scale-110" />
                WATCH VIDEO TOUR
              </button>
            )}

            {/* Emplacement */}
            <div className="space-y-2 sm:space-y-3">
              <h3 className="font-serif text-lg sm:text-xl font-medium">{labels?.units || "Emplacement"}</h3>
              <p className="font-serif text-sm sm:text-base leading-relaxed text-foreground/80">
                {emplacementText}
              </p>
            </div>

            {/* Recreational Activities */}
            <div className="space-y-2 sm:space-y-3">
              <h3 className="font-serif text-lg sm:text-xl font-medium">
                {labels?.amenities || "Recreational Activities"}
              </h3>
              <p className="font-serif text-sm sm:text-base leading-relaxed text-foreground/80">
                {recreationalText}
              </p>
            </div>
          </motion.div>

          {/* Right Map */}
          <motion.div
            className="relative h-[350px] sm:h-[450px] md:h-[600px] overflow-hidden rounded-lg"
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
