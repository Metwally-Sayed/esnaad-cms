/**
 * About Block Variant Factory
 *
 * Renders the appropriate about variant based on the variant ID.
 */

import { BlockContent } from "@/lib/block-variants";
import AboutMission from "./AboutMission";
import AboutPhilosophy from "./AboutPhilosophy";
import AboutStory from "./AboutStory";
import AboutTeam from "./AboutTeam";
import AboutEssay from "./AboutEssay";
import AboutVision from "./AboutVision";
import AboutVisionStatement from "./AboutVisionStatement";

export type AboutVariantProps = {
  content: BlockContent;
  className?: string;
};

type AboutFactoryProps = {
  variant: string;
  content: BlockContent;
  className?: string;
};

export const AboutFactory = async ({ variant, content, className }: AboutFactoryProps) => {
  switch (variant) {
    case "about-story":
      return <AboutStory content={content} className={className} />;
    case "about-team":
      return <AboutTeam content={content} className={className} />;
    case "about-mission":
      return <AboutMission content={content} className={className} />;
    case "about-philosophy":
      return <AboutPhilosophy content={content} className={className} />;
    case "about-essay":
      return <AboutEssay content={content} className={className} />;
    case "about-vision":
      return <AboutVision content={content} className={className} />;
    case "about-vision-statement":
      return <AboutVisionStatement content={content} className={className} />;
    default:
      // Fallback to story variant
      return <AboutStory content={content} className={className} />;
  }
};

export { AboutMission, AboutPhilosophy, AboutStory, AboutTeam, AboutEssay, AboutVision, AboutVisionStatement };
