"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";

type AboutEssayProps = {
  content: {
    en?: {
      paragraphs?: { text?: string }[];
      image?: string;
      imageAlt?: string;
      customColors?: boolean;
      backgroundColor?: string;
      textColor?: string;
    };
    ar?: {
      paragraphs?: { text?: string }[];
      image?: string;
      imageAlt?: string;
      customColors?: boolean;
      backgroundColor?: string;
      textColor?: string;
    };
    paragraphs?: { text?: string }[];
    image?: string;
    imageAlt?: string;
    customColors?: boolean;
    backgroundColor?: string;
    textColor?: string;
  };
  className?: string;
};

export default function AboutEssay({ content, className }: AboutEssayProps) {
  const t = useTranslations("About");
  const locale = useLocale();

  // Get locale-specific content from nested structure
  const localeContent = locale === "ar" ? content.ar : content.en;

  // Use locale-specific content if available, fallback to root level
  const paragraphs = localeContent?.paragraphs ?? content.paragraphs ?? [];
  const image = localeContent?.image ?? content.image;
  const imageAlt = localeContent?.imageAlt ?? content.imageAlt;
  const customColors = localeContent?.customColors ?? content.customColors ?? false;
  const backgroundColor = localeContent?.backgroundColor ?? content.backgroundColor;
  const textColor = localeContent?.textColor ?? content.textColor;

  const useCustomColors = customColors === true;
  const sectionStyle = useCustomColors
    ? { backgroundColor }
    : undefined;
  const textStyle = useCustomColors ? { color: textColor } : undefined;

  return (
    <section
      className={cn(
        "px-6 py-12 md:px-10 md:py-16",
        !useCustomColors && "bg-background",
        className
      )}
      style={sectionStyle}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-start md:gap-10">
        <motion.div
          className={cn(
            "flex-1 space-y-6 text-base leading-relaxed md:text-lg",
            !useCustomColors && "text-foreground"
          )}
          style={textStyle}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {paragraphs.map((p, idx) => (
            <p key={idx}>{p.text}</p>
          ))}
        </motion.div>

        <motion.div
          className="relative h-[420px] w-full flex-1 overflow-hidden bg-muted md:h-[520px] lg:h-[580px]"
          initial={{ opacity: 0, x: 18 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          {image && (
            <Image
              src={image}
              alt={imageAlt || t("aboutImage")}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          )}
        </motion.div>
      </div>
    </section>
  );
}
