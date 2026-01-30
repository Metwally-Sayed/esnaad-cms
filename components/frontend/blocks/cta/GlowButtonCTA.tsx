import { SmartLink } from "@/components/ui/smart-link";
import type { GlowButtonCTAContent } from "./types";
import { cn } from "@/lib/utils";

type GlowButtonCTAProps = GlowButtonCTAContent & {
  className?: string;
};

const GlowButtonCTA = ({
  label,
  sublabel,
  href,
  glowColor = "#E8D4B0",
  className,
}: GlowButtonCTAProps) => {
  return (
    <SmartLink
      href={href}
      className={cn(
        "group relative inline-flex flex-col items-start overflow-hidden rounded-full bg-white/5 px-6 py-3 text-xs uppercase tracking-[0.4em] text-white",
        "transition hover:scale-[1.01]",
        className
      )}
      style={{
        boxShadow: `0 0 40px ${glowColor}55`,
      }}
    >
      <span className="text-sm font-semibold">{label}</span>
      {sublabel ? (
        <span className="mt-1 text-[0.6rem] text-white/70">{sublabel}</span>
      ) : null}
      <span
        className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle at center, ${glowColor}55, transparent 60%)`,
        }}
      />
    </SmartLink>
  );
};

export default GlowButtonCTA;
