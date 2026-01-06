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
  const bgStyle = backgroundColor && !isDarkMode ? { backgroundColor } : undefined;
  const textStyle = textColor && !isDarkMode ? { color: textColor } : undefined;

  return (
    <section
      className={cn("flex items-center justify-center px-4 py-16 md:py-20 bg-background", className)}
      style={bgStyle}
    >
      <motion.h1
        className="font-serif text-4xl tracking-[0.12em] text-foreground md:text-5xl lg:text-6xl"
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
