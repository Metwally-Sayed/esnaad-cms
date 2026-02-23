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
    <section ref={containerRef} className="relative h-[72svh] min-h-[520px] w-full overflow-hidden md:h-screen">
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

      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent md:from-black/60 md:via-black/20" />

      <div className="relative z-10 flex h-full flex-col items-center justify-end px-4 pb-12 sm:px-6 md:justify-center md:pb-0">
        <motion.h1
          className="max-w-4xl text-center font-serif text-3xl font-light tracking-[0.08em] text-white sm:text-5xl md:text-6xl md:tracking-[0.15em] lg:text-8xl lg:tracking-[0.2em]"
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
