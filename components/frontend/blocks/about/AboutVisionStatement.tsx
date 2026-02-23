"use client";

import { MobileExpandableText, MobileSectionHeader } from "@/components/frontend/mobile";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";

type AboutVisionStatementProps = {
  content: {
    heading?: string;
    subheading?: string;
    paragraphs?: { text?: string }[];
    portraitImage?: string;
    portraitAlt?: string;
    founderHeading?: string;
    founderParagraphs?: { text?: string }[];
    topBackgroundColor?: string;
    bottomBackgroundColor?: string;
    customColors?: boolean;
    titleColor?: string;
    subtitleColor?: string;
    textColor?: string;
  };
  className?: string;
};

export default function AboutVisionStatement({ content, className }: AboutVisionStatementProps) {
  const tCommon = useTranslations("Common");
  const paragraphs = content.paragraphs ?? [];
  const founderParagraphs = content.founderParagraphs ?? [];
  const introCopy = paragraphs
    .map((paragraph) => paragraph.text?.trim())
    .filter((paragraph): paragraph is string => Boolean(paragraph))
    .join("\n\n");
  const founderCopy = founderParagraphs
    .map((paragraph) => paragraph.text?.trim())
    .filter((paragraph): paragraph is string => Boolean(paragraph))
    .join("\n\n");
  const useCustomColors = content.customColors === true;
  const topBg = useCustomColors
    ? content.topBackgroundColor || "transparent"
    : "hsl(var(--background))";
  const bottomBg = useCustomColors
    ? content.bottomBackgroundColor || "transparent"
    : "hsl(var(--muted))";
  const titleStyle = useCustomColors ? { color: content.titleColor } : undefined;
  const subtitleStyle = useCustomColors ? { color: content.subtitleColor } : undefined;
  const textStyle = useCustomColors ? { color: content.textColor } : undefined;

  return (
    <section
      className={cn("w-full px-4 py-12 md:px-12 md:py-16", className)}
      style={{
        background: `linear-gradient(to bottom, ${topBg} 0%, ${topBg} 55%, ${bottomBg} 55%, ${bottomBg} 100%)`,
      }}
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-12">
        <div className="space-y-4 md:hidden">
          <motion.div
            className="rounded-2xl border border-border/60 bg-card/70 p-5 backdrop-blur-sm"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <MobileSectionHeader
              centered
              title={content.heading}
              subtitle={content.subheading}
              className="space-y-2"
              titleClassName={cn("font-serif text-2xl tracking-[0.1em] normal-case", !useCustomColors && "text-foreground")}
              subtitleClassName={cn("text-[0.68rem] uppercase tracking-[0.2em]", !useCustomColors && "text-muted-foreground")}
            />
            {introCopy ? (
              <MobileExpandableText
                text={introCopy}
                collapsedLines={8}
                readMoreLabel={tCommon("readMore")}
                readLessLabel={tCommon("readLess")}
                className="mt-4"
                contentClassName="whitespace-pre-line text-sm leading-7 text-muted-foreground"
                buttonClassName="text-[0.62rem] tracking-[0.2em]"
              />
            ) : null}
          </motion.div>

          {content.portraitImage ? (
            <motion.div
              className="rounded-2xl border border-border/60 bg-card/70 p-4"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.04 }}
            >
              <div className="mx-auto h-[240px] w-[190px] overflow-hidden rounded-xl">
                <Image
                  src={content.portraitImage}
                  alt={content.portraitAlt || "Founder portrait"}
                  width={190}
                  height={240}
                  className="h-full w-full object-cover"
                />
              </div>
            </motion.div>
          ) : null}

          {(content.founderHeading || founderCopy) ? (
            <motion.div
              className="rounded-2xl border border-border/60 bg-card/70 p-5 backdrop-blur-sm"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.06 }}
            >
              {content.founderHeading ? (
                <h3
                  className={cn(
                    "text-center font-serif text-lg uppercase tracking-[0.14em]",
                    !useCustomColors && "text-foreground"
                  )}
                  style={titleStyle}
                >
                  {content.founderHeading}
                </h3>
              ) : null}
              {founderCopy ? (
                <MobileExpandableText
                  text={founderCopy}
                  collapsedLines={8}
                  readMoreLabel={tCommon("showDetails")}
                  readLessLabel={tCommon("hideDetails")}
                  className="mt-4"
                  contentClassName="whitespace-pre-line text-sm leading-7 text-muted-foreground"
                  buttonClassName="text-[0.62rem] tracking-[0.2em]"
                />
              ) : null}
            </motion.div>
          ) : null}
        </div>

        <div className="hidden md:block">
          <motion.div
            className="space-y-3 text-center"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            {content.heading && (
              <h2
                className={cn(
                  "font-serif text-2xl uppercase tracking-[0.18em] md:text-3xl",
                  !useCustomColors && "text-foreground"
                )}
                style={titleStyle}
              >
                {content.heading}
              </h2>
            )}
            {content.subheading && (
              <p
                className={cn(
                  "text-sm uppercase tracking-[0.2em]",
                  !useCustomColors && "text-muted-foreground"
                )}
                style={subtitleStyle ?? textStyle}
              >
                {content.subheading}
              </p>
            )}
          </motion.div>

          <motion.div
            className={cn(
              "mt-10 space-y-5 text-start text-sm leading-7 md:text-base",
              !useCustomColors && "text-foreground"
            )}
            style={textStyle}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
          >
            {paragraphs.map((p, idx) => (
              <p key={idx}>{p.text}</p>
            ))}
          </motion.div>

          {content.portraitImage && (
            <motion.div
              className="mx-auto mt-10 h-[220px] w-[180px] overflow-hidden"
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image
                src={content.portraitImage}
                alt={content.portraitAlt || "Founder portrait"}
                width={180}
                height={220}
                className="h-full w-full object-cover"
              />
            </motion.div>
          )}

          {(content.founderHeading || founderParagraphs.length > 0) && (
            <motion.div
              className="mt-10 space-y-4 text-start"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
            >
              {content.founderHeading && (
                <h3
                  className={cn(
                    "text-center font-serif text-lg uppercase tracking-[0.16em] md:text-xl",
                    !useCustomColors && "text-foreground"
                  )}
                  style={titleStyle}
                >
                  {content.founderHeading}
                </h3>
              )}
              <div
                className={cn(
                  "space-y-5 text-sm leading-7 md:text-base",
                  !useCustomColors && "text-foreground"
                )}
                style={textStyle}
              >
                {founderParagraphs.map((p, idx) => (
                  <p key={idx}>{p.text}</p>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
