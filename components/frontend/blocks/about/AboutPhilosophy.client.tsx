"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

type PhilosophyItemContent = {
  image?: string;
  title?: string;
  description?: string;
};

type AboutPhilosophyClientProps = {
  content: {
    sectionTitle?: string;
    subtitle?: string;
    description?: string;
    itemTextAlign?: "left" | "center" | "right";
    customColors?: boolean;
    backgroundColor?: string;
    titleColor?: string;
    textColor?: string;
  };
  items: PhilosophyItemContent[];
  className?: string;
};

export function AboutPhilosophyClient({ content, items, className }: AboutPhilosophyClientProps) {
  const sectionStyle = content.customColors
    ? { backgroundColor: content.backgroundColor }
    : undefined;

  const titleStyle = content.customColors ? { color: content.titleColor } : undefined;
  const textStyle = content.customColors ? { color: content.textColor } : undefined;

  return (
    <section
      className={cn(
        "py-16 md:py-24",
        !content.customColors && "bg-background",
        className
      )}
      style={sectionStyle}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2
            className={cn(
              "font-serif text-3xl tracking-[0.2em] md:text-4xl lg:text-5xl",
              !content.customColors && "text-foreground"
            )}
            style={titleStyle}
          >
            {content.sectionTitle}
          </h2>
          <p
            className={cn(
              "mt-4 font-serif text-xl tracking-[0.15em] md:text-2xl",
              !content.customColors && "text-muted-foreground"
            )}
            style={textStyle}
          >
            {content.subtitle}
          </p>
          {content.description && (
            <p
              className={cn(
                "mt-4 text-base leading-relaxed md:text-lg",
                !content.customColors && "text-muted-foreground"
              )}
              style={textStyle}
            >
              {content.description}
            </p>
          )}
        </motion.div>

        <div className="grid gap-x-8 gap-y-16 md:grid-cols-2">
          {items.map((item, index) => {
            const hasDescription = Boolean(item.description);
            const textAlignment =
              content.itemTextAlign || (hasDescription ? "left" : "center");

            return (
              <motion.div
                key={`${item.title}-${index}`}
                className="flex flex-col gap-6"
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.08 * index,
                }}
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.title || "Collection item"}
                      fill
                      className="object-cover transition-transform duration-700 hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  )}
                </div>

                <div className="space-y-4">
                  <h3
                    className={cn(
                      "font-serif text-2xl tracking-wide",
                      textAlignment === "center" && "text-center",
                      textAlignment === "right" && "text-right",
                      !content.customColors && "text-foreground"
                    )}
                    style={titleStyle}
                  >
                    {item.title}
                  </h3>
                  {hasDescription && (
                    <p
                      className={cn(
                        "text-base leading-relaxed md:text-lg",
                        textAlignment === "center" && "text-center",
                        textAlignment === "right" && "text-right",
                        !content.customColors && "text-muted-foreground"
                      )}
                      style={textStyle}
                    >
                      {item.description}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
