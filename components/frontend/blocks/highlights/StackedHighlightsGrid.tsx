import { cn } from "@/lib/utils";
import type { GridHighlightsContent } from "./types";

type StackedHighlightsGridProps = GridHighlightsContent & {
  className?: string;
};

const StackedHighlightsGrid = ({
  title,
  items,
  className,
}: StackedHighlightsGridProps) => {
  return (
    <section
      className={cn(
        "w-full rounded-3xl border border-border/60 bg-background/80 p-6 text-foreground shadow-[0_35px_80px_rgba(0,0,0,0.18)]",
        className
      )}
    >
      {title ? (
        <p className="mb-6 text-xs font-semibold uppercase tracking-[0.45em] text-muted-foreground">
          {title}
        </p>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-border/40 bg-white/60 p-4 text-center shadow-sm"
          >
            <p className="font-serif text-2xl uppercase tracking-[0.1em] text-foreground">
              {item.value}
            </p>
            <p className="mt-1 text-xs uppercase tracking-[0.4em] text-muted-foreground">
              {item.label}
            </p>
            {item.description ? (
              <p className="mt-2 text-[0.7rem] text-muted-foreground">
                {item.description}
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
};

export default StackedHighlightsGrid;
