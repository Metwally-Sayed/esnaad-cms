"use client";

import { HeroVariantProps } from "./index";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function HeroTitleOnly({ content, className }: HeroVariantProps) {
  const title = (content.title as string) || "";
  const backgroundColor = (content.backgroundColor as string) || "";
  const textColor = (content.textColor as string) || "";

  return (
    <section
      className={cn("flex items-center justify-center px-4 py-16 md:py-20", className)}
      style={{ backgroundColor }}
    >
      <motion.h1
        className="font-serif text-4xl tracking-[0.12em] text-foreground md:text-5xl lg:text-6xl"
        style={{ color: textColor || undefined }}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {title}
      </motion.h1>
    </section>
  );
}
