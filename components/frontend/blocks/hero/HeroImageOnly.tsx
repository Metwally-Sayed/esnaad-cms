"use client";

import { cn } from "@/lib/utils";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { HeroVariantProps } from "./index";

export default function HeroImageOnly({ content, className }: HeroVariantProps) {
  const image = content.image as string | undefined;
  const imageAlt = (content.imageAlt as string) || "Hero image";
  const minHeight = Number(content.minHeight) || 520;

  const containerRef = useRef<HTMLElement>(null);
  
  // Track scroll progress of the hero section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Transform values for parallax effect
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.5]);

  if (!image) return null;

  return (
    <section ref={containerRef} className={cn("w-full overflow-hidden", className)}>
      <motion.div
        className="relative w-full"
        style={{ minHeight, y, scale, opacity }}
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
