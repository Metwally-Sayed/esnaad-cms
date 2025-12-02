"use client";

import { HeroVariantProps } from "./index";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function HeroImageOnly({ content, className }: HeroVariantProps) {
  const image = content.image as string | undefined;
  const imageAlt = (content.imageAlt as string) || "Hero image";
  const minHeight = Number(content.minHeight) || 520;

  if (!image) return null;

  return (
    <section className={cn("w-full", className)}>
      <motion.div
        className="relative w-full overflow-hidden"
        style={{ minHeight }}
        initial={{ opacity: 0.6, scale: 1.02 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <Image
          src={image}
          alt={imageAlt}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      </motion.div>
    </section>
  );
}
