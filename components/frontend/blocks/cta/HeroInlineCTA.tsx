import { SmartLink } from "@/components/ui/smart-link";
import { cn } from "@/lib/utils";
import type { HeroInlineCTAContent } from "./types";

type HeroInlineCTAProps = HeroInlineCTAContent & {
  className?: string;
};

const toneStyles: Record<
  NonNullable<HeroInlineCTAContent["tone"]>,
  { text: string; border: string; bg: string }
> = {
  light: {
    text: "text-white",
    border: "border-white/30 hover:border-white",
    bg: "bg-white/10 hover:bg-white/20",
  },
  dark: {
    text: "text-foreground",
    border: "border-foreground/30 hover:border-foreground",
    bg: "bg-foreground/10 hover:bg-foreground/20",
  },
};

const HeroInlineCTA = ({
  label,
  href,
  tone = "light",
  accentWidth = 40,
  className,
}: HeroInlineCTAProps) => {
  const toneClass = toneStyles[tone];

  return (
    <SmartLink
      href={href}
      className={cn(
        "inline-flex items-center gap-3 border px-6 py-3 text-xs font-semibold uppercase tracking-[0.5em] transition",
        toneClass.text,
        toneClass.border,
        toneClass.bg,
        className
      )}
    >
      {label}
      <span className={cn("h-px bg-current")} style={{ width: accentWidth }} />
    </SmartLink>
  );
};

export default HeroInlineCTA;
