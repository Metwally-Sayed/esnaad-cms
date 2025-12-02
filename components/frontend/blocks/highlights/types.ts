export type HighlightItem = {
  label: string;
  value: string;
  description?: string;
};

export type HeroStripHighlightsContent = {
  variant: "hero-strip";
  items: HighlightItem[];
  contactLabel?: string;
  divider?: boolean;
  tone?: "light" | "dark";
};

export type GridHighlightsContent = {
  variant: "grid-cards";
  title?: string;
  items: HighlightItem[];
};

export type HighlightsContent =
  | HeroStripHighlightsContent
  | GridHighlightsContent;
