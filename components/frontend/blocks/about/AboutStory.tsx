"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";

type Paragraph = {
  text?: string;
};

type AboutStoryProps = {
  content: {
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
  const useCustomColors = content.customColors === true;
  const paragraphs = content.paragraphs;
  const bgColor = content.backgroundColor;
  const titleColor = content.titleColor;
  const subtitleColor = content.subtitleColor;
  const textColor = content.textColor;

  const sectionStyle = useCustomColors ? { backgroundColor: bgColor } : undefined;
  const titleStyle = useCustomColors ? { color: titleColor } : undefined;
  const subtitleStyle = useCustomColors ? { color: subtitleColor } : undefined;
  const textStyle = useCustomColors ? { color: textColor } : undefined;

  return (
    <section
      className={cn(
        "pt-16 md:pt-24",
        !useCustomColors && "bg-background",
        className
      )}
      style={sectionStyle}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="mb-12 text-center md:mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {content.sectionTitle && (
            <h2
              className={cn(
                "font-serif text-3xl tracking-[0.2em] md:text-4xl lg:text-5xl",
                !useCustomColors && "text-foreground"
              )}
              style={titleStyle}
            >
              {content.sectionTitle}
            </h2>
          )}
          {content.subtitle && (
            <p
              className={cn(
                "mt-4 font-serif text-xl tracking-[0.15em] md:text-2xl",
                !useCustomColors && "text-muted-foreground"
              )}
              style={subtitleStyle}
            >
              {content.subtitle}
            </p>
          )}
        </motion.div>

        {/* Content Grid */}
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          {/* Image */}
          <motion.div
            className="relative aspect-4/5 w-full overflow-hidden lg:aspect-auto lg:h-full lg:min-h-[500px]"
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {content.image && (
              <Image
                src={content.image}
                alt={content.imageAlt || "About image"}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            )}
          </motion.div>

          {/* Text Content */}
          <div className="flex flex-col justify-center space-y-6 lg:py-8">
            {paragraphs?.map((paragraph, index) => (
              <motion.p
                key={index}
                className={cn(
                  "text-base leading-relaxed md:text-lg",
                  !useCustomColors && "text-muted-foreground"
                )}
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
    </section>
  );
}
