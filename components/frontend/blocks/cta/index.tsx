import GlowButtonCTA from "./GlowButtonCTA";
import HeroInlineCTA from "./HeroInlineCTA";
import SplitPanelCTA from "./SplitPanelCTA";
import {
  CTAContent,
  GlowButtonCTAContent,
  HeroInlineCTAContent,
  SplitPanelCTAContent,
} from "./types";

type CTAFactoryProps = {
  content: CTAContent;
  className?: string;
};

export const CTAFactory = ({ content, className }: CTAFactoryProps) => {
  switch (content.variant) {
    case "hero-inline":
      return (
        <HeroInlineCTA {...(content as HeroInlineCTAContent)} className={className} />
      );
    case "glow-button":
      return (
        <GlowButtonCTA {...(content as GlowButtonCTAContent)} className={className} />
      );
    case "split-panel":
      return (
        <SplitPanelCTA {...(content as SplitPanelCTAContent)} className={className} />
      );
    default:
      return null;
  }
};

export type { CTAContent } from "./types";
export {
  HeroInlineCTA,
  GlowButtonCTA,
  SplitPanelCTA,
};
