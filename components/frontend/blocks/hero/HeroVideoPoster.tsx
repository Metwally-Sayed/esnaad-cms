"use client";

import { HeroVariantProps } from "./index";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function HeroVideoPoster({ content, className }: HeroVariantProps) {
  const image = content.image as string | undefined;
  const imageAlt = (content.imageAlt as string) || "Video poster";
  const title = (content.title as string) || "BUILDING VIDEO";
  const videoUrl = content.videoUrl as string | undefined;
  const minHeight = Number(content.minHeight) || 440;

  if (!image) return null;

  const Wrapper = videoUrl ? Link : "div";
  const wrapperProps = videoUrl ? { href: videoUrl as string } : {};

  return (
    <section className={cn("px-0", className)}>
      <motion.div
        className="relative w-full overflow-hidden"
        style={{ minHeight }}
        initial={{ opacity: 0.5, scale: 1.02 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <Wrapper {...(wrapperProps as any)} className="block h-full w-full">
          <div className="relative h-full w-full">
            <Image
              src={image}
              alt={imageAlt}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-black/15" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <div className="grid place-items-center rounded-full border border-white/60 bg-white/80 p-4 text-white shadow-lg backdrop-blur-sm transition duration-300 hover:scale-105">
                  <div className="border-l-[14px] border-l-black border-y-[10px] border-y-transparent" />
                </div>
                <p className="font-serif text-xl uppercase tracking-[0.18em] text-white md:text-2xl">
                  {title}
                </p>
              </div>
            </div>
          </div>
        </Wrapper>
      </motion.div>
    </section>
  );
}
