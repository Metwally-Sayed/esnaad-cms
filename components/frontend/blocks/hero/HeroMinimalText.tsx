"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { HeroVariantProps } from "./index";

export default function HeroMinimalText({ content }: HeroVariantProps) {
  const title = content.title as string;
  const subtitle = content.subtitle as string;
  const textColor = (content.textColor as string) || "#ffffff";
  const textAlign = (content.textAlign as "left" | "center" | "right") || "center";
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check if dark mode is active
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };

    checkDarkMode();

    // Watch for dark mode changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  // Don't apply inline styles in dark mode - let Tailwind classes take over
  const textStyle = textColor && !isDarkMode ? { color: textColor } : undefined;

  return (
    <section
      className="relative flex min-h-[40vh] sm:min-h-[50vh] w-full items-center justify-center overflow-hidden px-4 sm:px-6 py-16 sm:py-24 text-center bg-background"
    >
      <motion.div
        className={cn(
          "max-w-4xl w-full",
          textAlign === "left" && "text-start",
          textAlign === "center" && "text-center",
          textAlign === "right" && "text-end"
        )}
        style={textStyle}
        initial={{ opacity: 0, y: 26, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <h1 className="mb-4 sm:mb-6 font-serif text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-[0.08em] sm:tracking-[0.1em] uppercase text-foreground leading-tight sm:leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm sm:text-base md:text-lg lg:text-xl opacity-80 text-foreground leading-relaxed max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
      </motion.div>
    </section>
  );
}
