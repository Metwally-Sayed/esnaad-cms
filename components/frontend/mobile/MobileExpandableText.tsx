"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

export interface MobileExpandableTextProps {
  text?: string;
  children?: React.ReactNode;
  collapsedLines?: 4 | 5 | 6 | 7 | 8;
  className?: string;
  contentClassName?: string;
  buttonClassName?: string;
  readMoreLabel?: string;
  readLessLabel?: string;
}

const LINE_CLAMP_CLASS_MAP: Record<
  NonNullable<MobileExpandableTextProps["collapsedLines"]>,
  string
> = {
  4: "line-clamp-4",
  5: "line-clamp-5",
  6: "line-clamp-6",
  7: "line-clamp-7",
  8: "line-clamp-8",
};

export function MobileExpandableText({
  text,
  children,
  collapsedLines = 5,
  className,
  contentClassName,
  buttonClassName,
  readMoreLabel = "Read more",
  readLessLabel = "Read less",
}: MobileExpandableTextProps) {
  const [expanded, setExpanded] = useState(false);
  const hasText = typeof text === "string" && text.trim().length > 0;

  if (!hasText && !children) {
    return null;
  }

  return (
    <div className={cn("space-y-2.5", className)}>
      {hasText ? (
        <p
          className={cn(
            "text-sm leading-relaxed text-muted-foreground sm:text-base",
            !expanded && LINE_CLAMP_CLASS_MAP[collapsedLines],
            contentClassName
          )}
        >
          {text}
        </p>
      ) : (
        <div
          className={cn(
            "text-sm leading-relaxed text-muted-foreground sm:text-base",
            !expanded && LINE_CLAMP_CLASS_MAP[collapsedLines],
            contentClassName
          )}
        >
          {children}
        </div>
      )}
      <Button
        type="button"
        variant="link"
        className={cn(
          "h-auto p-0 text-[0.68rem] uppercase tracking-[0.2em] text-foreground/80 hover:text-foreground",
          buttonClassName
        )}
        onClick={() => setExpanded((prev) => !prev)}
      >
        {expanded ? readLessLabel : readMoreLabel}
      </Button>
    </div>
  );
}

