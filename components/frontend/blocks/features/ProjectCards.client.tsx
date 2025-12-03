"use client";

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

export function ProjectCardsClient({ heading, cards }: ProjectCardsClientProps) {
  return (
    <section className="px-4 sm:px-6 md:px-10 py-10 sm:py-12 bg-background text-foreground transition-colors">
      <div className="mx-auto max-w-6xl space-y-4 sm:space-y-5">
        {heading ? (
          <motion.h2
            className="font-serif text-xl sm:text-2xl tracking-[0.06em] sm:tracking-[0.08em] text-foreground"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            {heading}
          </motion.h2>
        ) : null}

        <div className="grid gap-2 sm:gap-3 md:grid-cols-3">
          {cards.map((card, index) => {
            const cardContent = (
              <div className="relative aspect-[4/3] w-full overflow-hidden md:aspect-[1/1] lg:aspect-[3/4] xl:aspect-[3/4]">
                {card.image && (
                  <Image
                    src={card.image}
                    alt={card.title || "Project image"}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105 group-active:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background/35 via-transparent to-transparent dark:from-black/35" />
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

            const motionProps = {
              key: `${card.title}-${index}`,
              className: cn(
                "group relative block overflow-hidden",
                card.link && "cursor-pointer"
              ),
              initial: { opacity: 0, y: 18 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true, amount: 0.25 },
              transition: {
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
                delay: 0.08 * index,
              },
            };

            // If link is provided, wrap in Link component
            if (card.link) {
              return (
                <motion.div {...motionProps}>
                  <Link href={card.link} className="block">
                    {cardContent}
                  </Link>
                </motion.div>
              );
            }

            // If actionType is button, add click handler
            if (card.actionType === "button") {
              return (
                <motion.button
                  {...motionProps}
                  onClick={() => {
                    console.log(`Action clicked for: ${card.title}`);
                    // Custom action can be handled here
                    // You could dispatch events, open modals, etc.
                  }}
                  type="button"
                >
                  {cardContent}
                </motion.button>
              );
            }

            // Default: non-clickable card
            return <motion.div {...motionProps}>{cardContent}</motion.div>;
          })}
        </div>
      </div>
    </section>
  );
}
