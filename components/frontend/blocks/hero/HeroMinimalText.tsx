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
      className="relative flex min-h-[50vh] w-full items-center justify-center overflow-hidden px-4 py-24 text-center bg-[#f8f6f4]"
    >
      <motion.div
        className={cn(
          "max-w-4xl",
          textAlign === "left" && "text-left",
          textAlign === "center" && "text-center",
          textAlign === "right" && "text-right"
        )}
        style={{ color: textColor }}
        initial={{ opacity: 0, y: 26, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <h1 className="mb-6 font-serif text-5xl font-light tracking-[0.1em] md:text-6xl lg:text-6xl uppercase text-black dark:text-black">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg opacity-80 md:text-xl text-black dark:text-black">
            {subtitle}
          </p>
        )}
      </motion.div>
    </section>
  );
}
