import { cn } from "@/lib/utils";

export interface MobileSectionHeaderProps {
  title?: string;
  subtitle?: string;
  eyebrow?: string;
  centered?: boolean;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  eyebrowClassName?: string;
}

export function MobileSectionHeader({
  title,
  subtitle,
  eyebrow,
  centered = false,
  className,
  titleClassName,
  subtitleClassName,
  eyebrowClassName,
}: MobileSectionHeaderProps) {
  if (!title && !subtitle && !eyebrow) {
    return null;
  }

  return (
    <header
      className={cn(
        "space-y-2.5 sm:space-y-3",
        centered ? "text-center" : "text-start",
        className
      )}
    >
      {eyebrow ? (
        <p
          className={cn(
            "text-[0.62rem] uppercase tracking-[0.24em] text-muted-foreground sm:text-xs sm:tracking-[0.32em]",
            eyebrowClassName
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      {title ? (
        <h2
          className={cn(
            "font-serif text-2xl uppercase tracking-[0.12em] text-foreground sm:text-3xl sm:tracking-[0.16em]",
            titleClassName
          )}
        >
          {title}
        </h2>
      ) : null}
      {subtitle ? (
        <p
          className={cn(
            "text-sm leading-relaxed text-muted-foreground sm:text-base",
            subtitleClassName
          )}
        >
          {subtitle}
        </p>
      ) : null}
    </header>
  );
}

