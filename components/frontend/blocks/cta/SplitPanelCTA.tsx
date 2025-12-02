import Link from "next/link";
import type { SplitPanelCTAContent } from "./types";
import { cn } from "@/lib/utils";

type SplitPanelCTAProps = SplitPanelCTAContent & {
  className?: string;
};

const SplitPanelCTA = ({
  heading,
  copy,
  primary,
  secondary,
  className,
}: SplitPanelCTAProps) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-3xl border border-foreground/10 bg-white/5 p-6 text-white shadow-[0_20px_50px_rgba(0,0,0,0.4)] backdrop-blur",
        className
      )}
    >
      <div>
        <p className="font-serif text-2xl uppercase tracking-[0.2em]">
          {heading}
        </p>
        <p className="mt-2 text-sm text-white/70">{copy}</p>
      </div>
      <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.35em]">
        <Link
          href={primary.href}
          className="rounded-full bg-white px-6 py-2 text-foreground transition hover:bg-white/80"
        >
          {primary.label}
        </Link>
        {secondary ? (
          <Link
            href={secondary.href}
            className="rounded-full border border-white/30 px-6 py-2 text-white transition hover:border-white"
          >
            {secondary.label}
          </Link>
        ) : null}
      </div>
    </div>
  );
};

export default SplitPanelCTA;
