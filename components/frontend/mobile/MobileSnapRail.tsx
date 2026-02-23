import { cn } from "@/lib/utils";
import { Children } from "react";

export interface MobileSnapRailProps {
  children: React.ReactNode;
  className?: string;
  itemClassName?: string;
  withPeek?: boolean;
}

export function MobileSnapRail({
  children,
  className,
  itemClassName,
  withPeek = true,
}: MobileSnapRailProps) {
  const childItems = Children.toArray(children);

  return (
    <div
      className={cn(
        "mobile-snap-rail",
        withPeek && "mobile-snap-rail--peek",
        className
      )}
    >
      {childItems.map((child, index) => (
        <div key={index} className={cn("mobile-snap-item", itemClassName)}>
          {child}
        </div>
      ))}
    </div>
  );
}
