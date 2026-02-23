"use client";

import { MobileExpandableText } from "@/components/frontend/mobile";
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
  const tCommon = useTranslations("Common");
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
  const paragraphText = paragraphs
    .map((paragraph) => paragraph.text?.trim())
    .filter((paragraph): paragraph is string => Boolean(paragraph));
  const mobileNarrative = paragraphText.join("\n\n");
  const sectionStyle = useCustomColors
    ? { backgroundColor }
    : undefined;
  const textStyle = useCustomColors ? { color: textColor } : undefined;

  return (
    <section
      className={cn(
        "px-4 py-12 md:px-10 md:py-16",
        !useCustomColors && "bg-background",
        className
      )}
      style={sectionStyle}
    >
      <div className="mx-auto max-w-6xl">
        <div className="space-y-6 md:hidden">
          <motion.div
            className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-muted shadow-lg"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {image ? (
              <Image
                src={image}
                alt={imageAlt || t("aboutImage")}
                fill
                className="object-cover"
                sizes="100vw"
              />
            ) : null}
          </motion.div>

          {mobileNarrative ? (
            <motion.div
              className={cn("rounded-2xl border border-border/60 bg-card/70 p-5", !useCustomColors && "text-foreground")}
              style={textStyle}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.04 }}
            >
              <MobileExpandableText
                text={mobileNarrative}
                collapsedLines={8}
                readMoreLabel={tCommon("readMore")}
                readLessLabel={tCommon("readLess")}
                contentClassName="whitespace-pre-line text-sm leading-7 text-muted-foreground"
                buttonClassName="text-[0.62rem] tracking-[0.2em]"
              />
            </motion.div>
          ) : null}
        </div>

        <div className="hidden md:flex md:flex-row md:items-start md:gap-10">
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
      </div>
    </section>
  );
}
