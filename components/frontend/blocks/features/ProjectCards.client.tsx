"use client";

import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

type ProjectCard = {
  title?: string;
  image?: string;
  link?: string;
  actionLabel?: string;
  actionType?: "button" | "link";
};

type ProjectCardsClientProps = {
  heading?: string;
  cards: ProjectCard[];
};

export function ProjectCardsClient({
  heading,
  cards,
}: ProjectCardsClientProps) {
  // Variants for individual cards to be staggered
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <section className="px-4 sm:px-6 md:px-10 py-10 sm:py-12 bg-background text-foreground transition-colors min-h-[85vh]">
      <div className="mx-auto max-w-6xl space-y-4 sm:space-y-5">
        {heading ? (
          <ScrollReveal width="100%" mode="fade-up">
            <h2 className="font-serif text-xl sm:text-2xl tracking-[0.06em] sm:tracking-[0.08em] text-foreground">
              {heading}
            </h2>
          </ScrollReveal>
        ) : null}

        <ScrollReveal
          width="100%"
          className="grid gap-2 sm:gap-3 md:grid-cols-3"
        >
          {cards.map((card, index) => {
            const cardContent = (
              <div className="relative aspect-4/3 w-full overflow-hidden md:aspect-square lg:aspect-3/4 xl:aspect-3/4">
                {card.image && (
                  <Image
                    src={card.image}
                    alt={card.title || "Project image"}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105 group-active:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-background/35 via-transparent to-transparent dark:from-black/35" />
                <div className="absolute inset-x-0 bottom-0 bg-black/50 dark:bg-black/55">
                  <p
                    className={cn(
                      "px-3 sm:px-4 py-3 sm:py-4 text-center font-serif text-base sm:text-lg uppercase tracking-[0.12em] sm:tracking-[0.14em] text-white"
                    )}
                  >
                    {card.title}
                  </p>
                </div>
              </div>
            );

            const key = `${card.title}-${index}`;
            const containerClass = cn(
              "group relative block overflow-hidden",
              card.link && "cursor-pointer"
            );

            if (card.link) {
              return (
                <motion.div
                  key={key}
                  variants={cardVariants}
                  className={containerClass}
                >
                  <Link href={card.link} className="block">
                    {cardContent}
                  </Link>
                </motion.div>
              );
            }

            if (card.actionType === "button") {
              return (
                <motion.button
                  key={key}
                  variants={cardVariants}
                  className={containerClass}
                  onClick={() =>
                    console.log(`Action clicked for: ${card.title}`)
                  }
                  type="button"
                >
                  {cardContent}
                </motion.button>
              );
            }

            return (
              <motion.div
                key={key}
                variants={cardVariants}
                className={containerClass}
              >
                {cardContent}
              </motion.div>
            );
          })}
        </ScrollReveal>
      </div>
    </section>
  );
}
