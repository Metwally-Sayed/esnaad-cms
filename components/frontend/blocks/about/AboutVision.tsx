"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";

type AboutVisionProps = {
  content: {
    heading?: string;
    paragraphs?: { text?: string }[];
    image?: string;
    imageAlt?: string;
    backgroundColor?: string;
    customColors?: boolean;
    titleColor?: string;
    textColor?: string;
  };
  className?: string;
};

export default function AboutVision({ content, className }: AboutVisionProps) {
  const paragraphs = content.paragraphs ?? [];
  const useCustomColors = content.customColors === true;
  const sectionStyle = useCustomColors
    ? { backgroundColor: content.backgroundColor }
    : undefined;
  const titleStyle = useCustomColors ? { color: content.titleColor } : undefined;
  const textStyle = useCustomColors ? { color: content.textColor } : undefined;

  return (
    <section
      className={cn(
        "px-6 py-12 md:px-10 md:py-16",
        !useCustomColors && "bg-background",
        className
      )}
      style={sectionStyle}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        {content.heading && (
          <motion.h3
            className={cn(
              "text-center font-serif text-lg uppercase tracking-[0.18em] md:text-xl font-bold",
              !useCustomColors && "text-foreground"
            )}
            style={titleStyle}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            {content.heading}
          </motion.h3>
        )}

        <div className="grid gap-8 md:grid-cols-[1.05fr_1fr] md:items-start">
          <motion.div
            className="relative h-[420px] w-full overflow-hidden bg-muted md:h-[520px] lg:h-[560px]"
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            {content.image && (
              <Image
                src={content.image}
                alt={content.imageAlt || "About image"}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 55vw"
              />
            )}
          </motion.div>

          <motion.div
            className={cn(
              "space-y-5 text-base leading-relaxed md:text-lg",
              !useCustomColors && "text-foreground"
            )}
            style={textStyle}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
          >
            {paragraphs.map((p, idx) => (
              <p key={idx}>{p.text}</p>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
