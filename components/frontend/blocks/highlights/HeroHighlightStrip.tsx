import { cn } from "@/lib/utils";
import type { HeroStripHighlightsContent } from "./types";

type HeroHighlightStripProps = HeroStripHighlightsContent & {
  className?: string;
};

const toneMap: Record<
  NonNullable<HeroStripHighlightsContent["tone"]>,
  { value: string; label: string; divider: string }
> = {
  light: {
    value: "text-white",
    label: "text-white/70",
    divider: "bg-white/30",
  },
  dark: {
    value: "text-foreground",
    label: "text-foreground/70",
    divider: "bg-foreground/20",
  },
};

const HeroHighlightStrip = ({
  items,
  contactLabel,
  divider = true,
  tone = "light",
  className,
}: HeroHighlightStripProps) => {
  const toneClass = toneMap[tone];

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-8 text-xs uppercase tracking-[0.4em]",
        className
      )}
    >
      {items.map((item) => (
        <div key={item.label}>
          <p className={cn("text-sm sm:text-base", toneClass.value)}>
            {item.value}
          </p>
          <p className={cn("text-[0.6rem]", toneClass.label)}>{item.label}</p>
        </div>
      ))}
      {divider ? <div className={cn("h-12 w-px", toneClass.divider)} /> : null}
      {contactLabel ? (
        <p className={cn("text-sm", toneClass.value)}>{contactLabel}</p>
      ) : null}
    </div>
  );
};

export default HeroHighlightStrip;
