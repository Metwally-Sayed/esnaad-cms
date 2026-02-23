"use client";

import { HeroVariantProps } from "./index";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function HeroTitleOnly({ content, className }: HeroVariantProps) {
  const title = (content.title as string) || "";
  const backgroundColor = (content.backgroundColor as string) || "";
  const textColor = (content.textColor as string) || "";
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check if dark mode is active
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    };

    checkDarkMode();

    // Watch for dark mode changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // Don't apply inline styles in dark mode - let Tailwind classes take over
  const bgStyle = backgroundColor && !isDarkMode ? { backgroundColor } : undefined;
  const textStyle = textColor && !isDarkMode ? { color: textColor } : undefined;

  return (
    <section
      className={cn(
        "mobile-section-spacing flex items-center justify-center bg-background px-4 sm:py-20",
        className
      )}
      style={bgStyle}
    >
      <motion.h1
        className="mx-auto max-w-[16ch] text-center font-serif text-3xl uppercase tracking-[0.08em] text-foreground sm:max-w-[22ch] sm:text-5xl sm:tracking-[0.12em] lg:text-6xl"
        style={textStyle}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {title}
      </motion.h1>
    </section>
  );
}
