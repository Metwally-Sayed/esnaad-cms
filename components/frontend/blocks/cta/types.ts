export type HeroInlineCTAContent = {
  variant: "hero-inline";
  label: string;
  href: string;
  tone?: "light" | "dark";
  accentWidth?: number;
};

export type GlowButtonCTAContent = {
  variant: "glow-button";
  label: string;
  href: string;
  sublabel?: string;
  glowColor?: string;
};

export type SplitPanelCTAContent = {
  variant: "split-panel";
  heading: string;
  copy: string;
  primary: {
    label: string;
    href: string;
  };
  secondary?: {
    label: string;
    href: string;
  };
};

export type CTAContent =
  | HeroInlineCTAContent
  | GlowButtonCTAContent
  | SplitPanelCTAContent;
