"use client";

import { MobileExpandableText, MobileSectionHeader } from "@/components/frontend/mobile";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";

type AboutVisionProps = {
  content: {
    en?: {
      heading?: string;
      paragraphs?: { text?: string }[];
      image?: string;
      imageAlt?: string;
      backgroundColor?: string;
      customColors?: boolean;
      titleColor?: string;
      textColor?: string;
    };
    ar?: {
      heading?: string;
      paragraphs?: { text?: string }[];
      image?: string;
      imageAlt?: string;
      backgroundColor?: string;
      customColors?: boolean;
      titleColor?: string;
      textColor?: string;
    };
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
  const t = useTranslations("About");
  const tCommon = useTranslations("Common");
  const locale = useLocale();

  // Get locale-specific content from nested structure
  const localeContent = locale === "ar" ? content.ar : content.en;

  // Use locale-specific content if available, fallback to root level
  const heading = localeContent?.heading ?? content.heading;
  const paragraphs = localeContent?.paragraphs ?? content.paragraphs ?? [];
  const image = localeContent?.image ?? content.image;
  const imageAlt = localeContent?.imageAlt ?? content.imageAlt;
  const customColors = localeContent?.customColors ?? content.customColors ?? false;
  const backgroundColor = localeContent?.backgroundColor ?? content.backgroundColor;
  const titleColor = localeContent?.titleColor ?? content.titleColor;
  const textColor = localeContent?.textColor ?? content.textColor;
  const paragraphText = paragraphs
    .map((paragraph) => paragraph.text?.trim())
    .filter((paragraph): paragraph is string => Boolean(paragraph));
  const mobileNarrative = paragraphText.join("\n\n");

  const useCustomColors = customColors === true;
  const sectionStyle = useCustomColors
    ? { backgroundColor }
    : undefined;
  const titleStyle = useCustomColors ? { color: titleColor } : undefined;
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
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <div className="space-y-4 md:hidden">
          {heading ? (
            <motion.div
              className="rounded-2xl border border-border/60 bg-card/70 p-5"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <MobileSectionHeader
                title={heading}
                centered
                className="space-y-0"
                titleClassName={cn(
                  "font-serif text-xl tracking-[0.12em]",
                  !useCustomColors && "text-foreground"
                )}
              />
            </motion.div>
          ) : null}

          <motion.div
            className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-muted"
            initial={{ opacity: 0, y: 14 }}
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
              initial={{ opacity: 0, y: 14 }}
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

        <div className="hidden md:block">
          {heading && (
            <motion.h3
              className={cn(
                "text-center font-serif text-lg font-bold uppercase tracking-[0.18em] md:text-xl",
                !useCustomColors && "text-foreground"
              )}
              style={titleStyle}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              {heading}
            </motion.h3>
          )}

          <div className="mt-8 grid gap-8 md:grid-cols-[1.05fr_1fr] md:items-start">
            <motion.div
              className="relative h-[420px] w-full overflow-hidden bg-muted md:h-[520px] lg:h-[560px]"
              initial={{ opacity: 0, x: -16 }}
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
      </div>
    </section>
  );
}
