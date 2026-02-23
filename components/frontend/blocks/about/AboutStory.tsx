"use client";

import { MobileExpandableText, MobileSectionHeader } from "@/components/frontend/mobile";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { useEffect, useState } from "react";

type Paragraph = {
  text?: string;
};

type AboutStoryProps = {
  content: {
    en?: {
      sectionTitle?: string;
      subtitle?: string;
      image?: string;
      imageAlt?: string;
      paragraphs?: Paragraph[];
      customColors?: boolean;
      backgroundColor?: string;
      titleColor?: string;
      subtitleColor?: string;
      textColor?: string;
    };
    ar?: {
      sectionTitle?: string;
      subtitle?: string;
      image?: string;
      imageAlt?: string;
      paragraphs?: Paragraph[];
      customColors?: boolean;
      backgroundColor?: string;
      titleColor?: string;
      subtitleColor?: string;
      textColor?: string;
    };
    sectionTitle?: string;
    subtitle?: string;
    image?: string;
    imageAlt?: string;
    paragraphs?: Paragraph[];
    customColors?: boolean;
    backgroundColor?: string;
    titleColor?: string;
    subtitleColor?: string;
    textColor?: string;
  };
  className?: string;
};

export default function AboutStory({ content, className }: AboutStoryProps) {
  const t = useTranslations("About");
  const tCommon = useTranslations("Common");
  const locale = useLocale();
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check if dark mode is active
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };

    checkDarkMode();

    // Watch for dark mode changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  // Get locale-specific content from nested structure
  const localeContent = locale === "ar" ? content.ar : content.en;

  // Use locale-specific content if available, fallback to root level
  const sectionTitle = localeContent?.sectionTitle ?? content.sectionTitle;
  const subtitle = localeContent?.subtitle ?? content.subtitle;
  const image = localeContent?.image ?? content.image;
  const imageAlt = localeContent?.imageAlt ?? content.imageAlt;
  const paragraphs = localeContent?.paragraphs ?? content.paragraphs;
  const customColors = localeContent?.customColors ?? content.customColors ?? false;
  const bgColor = localeContent?.backgroundColor ?? content.backgroundColor;
  const titleColor = localeContent?.titleColor ?? content.titleColor;
  const subtitleColor = localeContent?.subtitleColor ?? content.subtitleColor;
  const textColor = localeContent?.textColor ?? content.textColor;
  const paragraphText = (paragraphs ?? [])
    .map((paragraph) => paragraph.text?.trim())
    .filter((paragraph): paragraph is string => Boolean(paragraph));
  const combinedParagraphs = paragraphText.join("\n\n");

  const useCustomColors = customColors === true;

  // Don't apply inline styles in dark mode - let Tailwind classes take over
  const sectionStyle = useCustomColors && !isDarkMode ? { backgroundColor: bgColor } : undefined;
  const titleStyle = useCustomColors && !isDarkMode ? { color: titleColor } : undefined;
  const subtitleStyle = useCustomColors && !isDarkMode ? { color: subtitleColor } : undefined;
  const textStyle = useCustomColors && !isDarkMode ? { color: textColor } : undefined;

  return (
    <section
      className={cn(
        "bg-background pt-12 md:pt-24",
        className
      )}
      style={sectionStyle}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mobile-section-spacing space-y-6 md:hidden"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-muted shadow-lg">
            {image && (
              <Image
                src={image}
                alt={imageAlt || t("aboutImage")}
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />
            )}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/45 to-transparent" />
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/65 p-5 backdrop-blur-sm">
            <MobileSectionHeader
              title={sectionTitle}
              subtitle={subtitle}
              className="space-y-2.5"
              titleClassName="font-serif text-2xl tracking-[0.1em] normal-case"
              subtitleClassName="font-serif text-sm tracking-[0.08em] text-muted-foreground"
            />
            {combinedParagraphs ? (
              <MobileExpandableText
                text={combinedParagraphs}
                collapsedLines={8}
                readMoreLabel={tCommon("readMore")}
                readLessLabel={tCommon("readLess")}
                className="mt-4"
                contentClassName="whitespace-pre-line text-sm leading-7 text-muted-foreground"
                buttonClassName="text-[0.62rem] tracking-[0.2em]"
              />
            ) : null}
          </div>
        </motion.div>

        <div className="hidden md:block">
          <motion.div
            className="mb-12 text-center md:mb-16"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {sectionTitle && (
              <h2
                className="font-serif text-3xl tracking-[0.2em] text-foreground md:text-4xl lg:text-5xl"
                style={titleStyle}
              >
                {sectionTitle}
              </h2>
            )}
            {subtitle && (
              <p
                className="mt-4 font-serif text-xl tracking-[0.15em] text-muted-foreground md:text-2xl"
                style={subtitleStyle}
              >
                {subtitle}
              </p>
            )}
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
            <motion.div
              className="relative aspect-4/5 w-full overflow-hidden lg:aspect-auto lg:h-full lg:min-h-[500px]"
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              {image && (
                <Image
                  src={image}
                  alt={imageAlt || t("aboutImage")}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              )}
            </motion.div>

            <div className="flex flex-col justify-center space-y-6 lg:py-8">
              {paragraphs?.map((paragraph, index) => (
                <motion.p
                  key={index}
                  className="text-base leading-relaxed text-muted-foreground md:text-lg"
                  style={textStyle}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1],
                    delay: index * 0.06,
                  }}
                >
                  {paragraph.text}
                </motion.p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
