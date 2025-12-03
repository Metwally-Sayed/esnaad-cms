"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { HeroVariantProps } from "./index";

export default function HeroMinimalText({ content, className }: HeroVariantProps) {
  const title = content.title as string;
  const subtitle = content.subtitle as string;
  const backgroundColor = (content.backgroundColor as string) || "#000000";
  const textColor = (content.textColor as string) || "#ffffff";
  const textAlign = (content.textAlign as "left" | "center" | "right") || "center";

  return (
    <section
      className="relative flex min-h-[40vh] sm:min-h-[50vh] w-full items-center justify-center overflow-hidden px-4 sm:px-6 py-16 sm:py-24 text-center bg-[#f8f6f4]"
    >
      <motion.div
        className={cn(
          "max-w-4xl w-full",
          textAlign === "left" && "text-left",
          textAlign === "center" && "text-center",
          textAlign === "right" && "text-right"
        )}
        style={{ color: textColor }}
        initial={{ opacity: 0, y: 26, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <h1 className="mb-4 sm:mb-6 font-serif text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-[0.08em] sm:tracking-[0.1em] uppercase text-black dark:text-black leading-tight sm:leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm sm:text-base md:text-lg lg:text-xl opacity-80 text-black dark:text-black leading-relaxed max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
      </motion.div>
    </section>
  );
}
