import { CTAFactory, type CTAContent } from "@/components/frontend/blocks/cta";
import {
  HighlightFactory,
  type HighlightsContent,
} from "@/components/frontend/blocks/highlights";

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

  return (
    <section className="relative isolate h-[820px] min-h-[70vh] w-full overflow-hidden bg-black text-white">
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
      <div className="absolute inset-0 bg-black/60" />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />

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
              <p className="text-xs uppercase tracking-[0.7em] text-white/70">
                {location}
              </p>
            ) : null}
            <div className="mt-4 space-y-2 font-serif text-3xl uppercase tracking-[0.4em] sm:text-4xl">
              {headline.map((line) => (
                <div key={line} className="space-y-1">
                  {chunkLine(line).map((chunk) => (
                    <p key={`${line}-${chunk}`}>{chunk}</p>
                  ))}
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
