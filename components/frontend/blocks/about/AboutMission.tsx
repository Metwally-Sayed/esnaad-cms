"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type AboutMissionProps = {
  content: {
    sectionTitle?: string;
    missionTitle?: string;
    missionText?: string;
    visionTitle?: string;
    visionText?: string;
    backgroundImage?: string;
    customColors?: boolean;
    backgroundColor?: string;
    titleColor?: string;
    textColor?: string;
  };
  className?: string;
};

export default function AboutMission({ content, className }: AboutMissionProps) {
  const useCustomColors = content.customColors === true;
  const hasBackgroundImage = Boolean(content.backgroundImage);

  const sectionStyle = useCustomColors
    ? { backgroundColor: content.backgroundColor }
    : undefined;
  const titleStyle = useCustomColors ? { color: content.titleColor } : undefined;
  const textStyle = useCustomColors ? { color: content.textColor } : undefined;

  return (
    <section
      className={cn(
        "relative py-16 md:py-24",
        useCustomColors
          ? null
          : hasBackgroundImage
            ? "text-white"
            : "bg-background text-foreground",
        className
      )}
      style={sectionStyle}
    >
      {/* Background Image */}
      {hasBackgroundImage && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${content.backgroundImage})` }}
          />
          <div className="absolute inset-0 bg-black/60" />
        </>
      )}

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        {content.sectionTitle && (
          <motion.div
            className="mb-12 text-center md:mb-16"
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2
              className={cn(
                "font-serif text-3xl tracking-[0.2em] md:text-4xl",
                !useCustomColors && (hasBackgroundImage ? "text-white" : "text-foreground")
              )}
              style={titleStyle}
            >
              {content.sectionTitle}
            </h2>
          </motion.div>
        )}

        {/* Mission & Vision Grid */}
        <div className="grid gap-12 md:grid-cols-2 md:gap-16">
          {/* Mission */}
          {content.missionText && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              {content.missionTitle && (
                <h3
                  className={cn(
                    "mb-4 font-serif text-2xl tracking-wide",
                    !useCustomColors &&
                      (hasBackgroundImage ? "text-white" : "text-foreground")
                  )}
                  style={titleStyle}
                >
                  {content.missionTitle}
                </h3>
              )}
              <p
                className={cn(
                  "text-base leading-relaxed md:text-lg",
                  !useCustomColors &&
                    (hasBackgroundImage ? "text-white/90" : "text-foreground/80")
                )}
                style={textStyle}
                >
                  {content.missionText}
                </p>
            </motion.div>
          )}

          {/* Vision */}
          {content.visionText && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
            >
              {content.visionTitle && (
                <h3
                  className={cn(
                    "mb-4 font-serif text-2xl tracking-wide",
                    !useCustomColors &&
                      (hasBackgroundImage ? "text-white" : "text-foreground")
                  )}
                  style={titleStyle}
                >
                  {content.visionTitle}
                </h3>
              )}
              <p
                className={cn(
                  "text-base leading-relaxed md:text-lg",
                  !useCustomColors &&
                    (hasBackgroundImage ? "text-white/90" : "text-foreground/80")
                )}
                style={textStyle}
                >
                  {content.visionText}
                </p>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
