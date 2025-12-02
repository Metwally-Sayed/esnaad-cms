import type { CTAContent } from "@/components/frontend/blocks/cta";
import type { HighlightsContent } from "@/components/frontend/blocks/highlights";
import HeroSection from "@/components/frontend/home/HeroSection";

type BasicCTA = {
  label?: string;
  text?: string;
  link?: string;
  href?: string;
};

type HeroContent = {
  title?: string;
  subtitle?: string;
  description?: string;
  headlines?: Array<string | { text?: string }>;
  ctas?: Array<CTAContent | BasicCTA>;
  cta?: CTAContent | BasicCTA;
  buttons?: Array<CTAContent | BasicCTA>;
  highlights?: HighlightsContent | Array<{ label: string; value: string }>;
  mediaType?: string;
  mediaUrl?: string;
  backgroundImage?: string;
  posterImage?: string;
  brandName?: string;
  brandDescriptor?: string;
  location?: string;
  contactLabel?: string;
  [key: string]: unknown;
};

const normalizeCTAs = (content: HeroContent): CTAContent[] => {
  const ctas: CTAContent[] = [];

  const pushInline = (cta?: CTAContent | BasicCTA) => {
    if (!cta) {
      return;
    }
    if ("variant" in cta && cta.variant) {
      ctas.push(cta as CTAContent);
    } else {
      const label = cta.label ?? cta.text ?? "Learn more";
      const href = cta.href ?? cta.link ?? "#";
      ctas.push({
        variant: "hero-inline",
        label,
        href,
        tone: "light",
      });
    }
  };

  if (Array.isArray(content.ctas)) {
    content.ctas.forEach((cta) => pushInline(cta));
  } else {
    pushInline(content.cta);
  }

  if (Array.isArray(content.buttons)) {
    content.buttons.forEach((cta) => pushInline(cta));
  }

  return ctas;
};

const normalizeHighlights = (
  content: HeroContent
): HighlightsContent | undefined => {
  if (!content.highlights) {
    return undefined;
  }

  if (
    typeof content.highlights === "object" &&
    !Array.isArray(content.highlights) &&
    "variant" in content.highlights
  ) {
    return content.highlights as HighlightsContent;
  }

  if (Array.isArray(content.highlights)) {
    return {
      variant: "hero-strip",
      items: content.highlights,
      contactLabel: content.contactLabel,
      tone: "light",
    };
  }

  return undefined;
};

const HeroBlock = ({ content }: { content: HeroContent }) => {
  const headlines: string[] = [];

  if (typeof content.title === "string" && content.title.length) {
    headlines.push(content.title);
  }

  if (Array.isArray(content.headlines)) {
    content.headlines.forEach((headline) => {
      if (typeof headline === "string") {
        headlines.push(headline);
      } else if (headline?.text) {
        headlines.push(headline.text);
      }
    });
  }

  if (!headlines.length && typeof content.subtitle === "string") {
    headlines.push(content.subtitle);
  }

  const heroHeadlines = headlines.length ? headlines : [" "];

  const ctas = normalizeCTAs(content);
  const highlights = normalizeHighlights(content);

  const mediaType: "video" | "image" =
    content.mediaType === "image" ? "image" : "video";
  const mediaUrl =
    content.mediaUrl ??
    (content as any).videoUrl ??
    content.backgroundImage ??
    "/hero-panel.svg";

  return (
    <HeroSection
      brand={{
        name: content.brandName || "",
        descriptor: content.brandDescriptor || "",
      }}
      headline={heroHeadlines}
      description={content.subtitle ?? content.description}
      ctas={ctas.length ? ctas : undefined}
      highlights={highlights}
      location={content.location}
      contactLabel={content.contactLabel}
      media={{
        type: mediaType,
        src: mediaUrl,
        poster: content.posterImage ?? content.backgroundImage,
      }}
    />
  );
};

export default HeroBlock;
