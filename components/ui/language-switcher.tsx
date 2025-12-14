"use client";

import { useCallback, useRef } from "react";
import { Languages } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { flushSync } from "react-dom";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps
  extends React.ComponentPropsWithoutRef<"button"> {
  currentLocale: string;
  duration?: number;
}

export const LanguageSwitcher = ({
  currentLocale,
  className,
  duration = 400,
  ...props
}: LanguageSwitcherProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggleLanguage = useCallback(async () => {
    if (!buttonRef.current) return;

    const newLocale = currentLocale === "en" ? "ar" : "en";

    // Remove current locale from pathname and add new one
    const segments = pathname.split("/").filter(Boolean);
    if (segments[0] === "en" || segments[0] === "ar") {
      segments[0] = newLocale;
    } else {
      segments.unshift(newLocale);
    }
    const newPath = `/${segments.join("/")}`;

    // Check if View Transition API is supported
    if (!document.startViewTransition) {
      // Fallback for browsers without View Transition API
      router.push(newPath);
      return;
    }

    try {
      await document.startViewTransition(() => {
        flushSync(() => {
          router.push(newPath);
        });
      }).ready;

      const { top, left, width, height } =
        buttonRef.current.getBoundingClientRect();
      const x = left + width / 2;
      const y = top + height / 2;
      const maxRadius = Math.hypot(
        Math.max(left, window.innerWidth - left),
        Math.max(top, window.innerHeight - top)
      );

      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${maxRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    } catch (error) {
      // If animation fails, still switch the language
      console.error("Language transition failed:", error);
      router.push(newPath);
    }
  }, [currentLocale, pathname, router, duration]);

  return (
    <button
      ref={buttonRef}
      onClick={toggleLanguage}
      className={cn(
        "relative inline-flex items-center justify-center gap-1.5 rounded-full transition-all duration-300 touch-manipulation group p-1",
        className
      )}
      aria-label={`Switch to ${currentLocale === "en" ? "Arabic" : "English"}`}
      {...props}
    >
      <Languages className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:scale-110" />
      <span className="text-xs sm:text-sm font-bold tracking-wide">
        {currentLocale === "en" ? "ع" : "EN"}
      </span>
      <span className="sr-only">
        Switch to {currentLocale === "en" ? "Arabic" : "English"}
      </span>
    </button>
  );
};
