"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

type ProjectHeroProps = {
  heroImage: string;
  title: string;
  tabs?: string[];
};

export function ProjectHero({ heroImage, title }: ProjectHeroProps) {
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

  return (
    <section ref={containerRef} className="relative h-screen w-full overflow-hidden snap-start">
      {/* Background Image */}
      <motion.div
        className="absolute inset-0"
        style={{ y, scale, opacity }}
      >
        <Image
          src={heroImage}
          alt={title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 sm:px-6">
        <motion.h1
          className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-8xl font-light uppercase tracking-[0.15em] sm:tracking-[0.2em] text-white text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {title}
        </motion.h1>
      </div>
    </section>
  );
}
