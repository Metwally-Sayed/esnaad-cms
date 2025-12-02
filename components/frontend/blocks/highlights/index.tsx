import HeroHighlightStrip from "./HeroHighlightStrip";
import StackedHighlightsGrid from "./StackedHighlightsGrid";
import {
  GridHighlightsContent,
  HeroStripHighlightsContent,
  HighlightsContent,
} from "./types";

type HighlightFactoryProps = {
  content: HighlightsContent;
  className?: string;
};

export const HighlightFactory = ({
  content,
  className,
}: HighlightFactoryProps) => {
  switch (content.variant) {
    case "hero-strip":
      return (
        <HeroHighlightStrip
          {...(content as HeroStripHighlightsContent)}
          className={className}
        />
      );
    case "grid-cards":
      return (
        <StackedHighlightsGrid
          {...(content as GridHighlightsContent)}
          className={className}
        />
      );
    default:
      return null;
  }
};

export type { HighlightsContent } from "./types";
export { HeroHighlightStrip, StackedHighlightsGrid };
