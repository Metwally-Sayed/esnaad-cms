/**
 * Hero Block Variant Factory
 *
 * Renders the appropriate hero variant based on the variant ID.
 */

import { BlockContent } from "@/lib/block-variants";
import HeroBlock from "@/components/frontend/blocks/HeroBlock";
import HeroCenteredVideo from "./HeroCenteredVideo";
import HeroSplitImage from "./HeroSplitImage";
import HeroMinimalText from "./HeroMinimalText";
import HeroGallery from "./HeroGallery";
import HeroStats from "./HeroStats";
import HeroTitleOnly from "./HeroTitleOnly";
import HeroImageOnly from "./HeroImageOnly";
import HeroVideoPoster from "./HeroVideoPoster";

export type HeroVariantProps = {
  content: BlockContent;
  className?: string;
};

type HeroFactoryProps = {
  variant: string;
  content: BlockContent;
  className?: string;
};

export const HeroFactory = ({ variant, content, className }: HeroFactoryProps) => {
  switch (variant) {
    case "hero-advanced":
      // Use the full-featured legacy HeroBlock/HeroSection
      return <HeroBlock content={content as Record<string, unknown>} />;
    case "hero-centered-video":
      return <HeroCenteredVideo content={content} className={className} />;
    case "hero-split-image":
      return <HeroSplitImage content={content} className={className} />;
    case "hero-minimal-text":
      return <HeroMinimalText content={content} className={className} />;
    case "hero-gallery":
      return <HeroGallery content={content} className={className} />;
    case "hero-stats":
      return <HeroStats content={content} className={className} />;
    case "hero-title-only":
      return <HeroTitleOnly content={content} className={className} />;
    case "hero-image-only":
      return <HeroImageOnly content={content} className={className} />;
    case "hero-video-poster":
      return <HeroVideoPoster content={content} className={className} />;
    default:
      // Fallback to advanced hero for legacy or unknown variants
      return <HeroBlock content={content as Record<string, unknown>} />;
  }
};

export {
  HeroCenteredVideo,
  HeroSplitImage,
  HeroMinimalText,
  HeroGallery,
  HeroStats,
  HeroTitleOnly,
  HeroImageOnly,
  HeroVideoPoster,
};
