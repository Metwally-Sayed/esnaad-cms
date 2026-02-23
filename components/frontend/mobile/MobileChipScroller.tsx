"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ChipItem = {
  key: string;
  label: string;
};

export interface MobileChipScrollerProps {
  items: ChipItem[];
  activeKey?: string;
  onChange: (key: string) => void;
  className?: string;
}

export function MobileChipScroller({
  items,
  activeKey,
  onChange,
  className,
}: MobileChipScrollerProps) {
  if (!items.length) {
    return null;
  }

  return (
    <div
      className={cn(
        "mobile-chip-scroller no-scrollbar flex items-center gap-2 overflow-x-auto py-1",
        className
      )}
    >
      {items.map((item) => {
        const isActive = item.key === activeKey;
        return (
          <Button
            key={item.key}
            type="button"
            variant={isActive ? "default" : "outline"}
            className={cn(
              "mobile-touch-target shrink-0 rounded-full px-4 text-[0.68rem] uppercase tracking-[0.18em]",
              isActive && "shadow-sm"
            )}
            onClick={() => onChange(item.key)}
          >
            {item.label}
          </Button>
        );
      })}
    </div>
  );
}

