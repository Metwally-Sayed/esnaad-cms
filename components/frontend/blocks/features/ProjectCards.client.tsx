"use client";

import { MobileSectionHeader, MobileSnapRail } from "@/components/frontend/mobile";
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
    <section className="bg-background px-4 py-12 text-foreground transition-colors sm:px-6 sm:py-14 md:px-10 md:py-16">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="md:hidden">
          <MobileSectionHeader
            title={heading}
            className="mb-5"
            titleClassName="font-serif text-2xl tracking-[0.08em] normal-case"
          />
          <MobileSnapRail itemClassName="basis-[84%]">
            {cards.map((card, index) => {
              const actionLabel = card.actionLabel || "Explore Project";
              const isClickable = Boolean(card.link || card.actionType === "button");
              const cardContent = (
                <div className="relative aspect-[5/6] w-full overflow-hidden bg-muted">
                  {card.image ? (
                    <Image
                      src={card.image}
                      alt={card.title || "Project image"}
                      fill
                      className="object-cover"
                      sizes="85vw"
                      quality={100}
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/5" />
                  <div className="absolute inset-x-0 bottom-0 space-y-3 p-5">
                    <p className="font-serif text-lg tracking-[0.08em] text-white">
                      {card.title}
                    </p>
                    {isClickable ? (
                      <div className="inline-flex items-center rounded-full border border-white/50 bg-white/10 px-4 py-2 text-[0.62rem] uppercase tracking-[0.16em] text-white/95 backdrop-blur-sm">
                        {actionLabel}
                      </div>
                    ) : null}
                  </div>
                </div>
              );

              const key = `${card.title}-${index}`;
              const containerClass = "group relative block overflow-hidden rounded-2xl border border-border/50 bg-card/40 shadow-sm";

              if (card.link) {
                return (
                  <motion.div key={key} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.45, delay: index * 0.04 }}>
                    <Link href={card.link} className={containerClass}>
                      {cardContent}
                    </Link>
                  </motion.div>
                );
              }

              if (card.actionType === "button") {
                return (
                  <motion.button
                    key={key}
                    type="button"
                    className={containerClass}
                    onClick={() => {}}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.45, delay: index * 0.04 }}
                  >
                    {cardContent}
                  </motion.button>
                );
              }

              return (
                <motion.div
                  key={key}
                  className={containerClass}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, delay: index * 0.04 }}
                >
                  {cardContent}
                </motion.div>
              );
            })}
          </MobileSnapRail>
        </div>

        <div className="hidden md:block">
          {heading ? (
            <ScrollReveal width="100%" mode="fade-up">
              <h2 className="font-serif text-2xl tracking-[0.08em] text-foreground sm:text-3xl md:text-4xl">
                {heading}
              </h2>
            </ScrollReveal>
          ) : null}

          <ScrollReveal
            width="100%"
            className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
          >
            {cards.map((card, index) => {
              const actionLabel = card.actionLabel || "Explore Project";
              const isClickable = Boolean(card.link || card.actionType === "button");
              const cardContent = (
                <div className="relative aspect-[5/6] w-full overflow-hidden bg-muted">
                  {card.image && (
                    <Image
                      src={card.image}
                      alt={card.title || "Project image"}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      quality={100}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/5" />
                  <div className="absolute inset-x-0 bottom-0 space-y-3 p-5 sm:p-6">
                    <p className="font-serif text-lg uppercase tracking-[0.12em] text-white sm:text-xl">
                      {card.title}
                    </p>
                    {isClickable ? (
                      <div className="inline-flex items-center rounded-full border border-white/45 bg-white/10 px-4 py-1.5 text-xs font-medium tracking-[0.08em] text-white backdrop-blur-sm transition-colors group-hover:bg-white/20">
                        {actionLabel}
                      </div>
                    ) : null}
                  </div>
                </div>
              );

              const key = `${card.title}-${index}`;
              const containerClass = cn(
                "group relative block overflow-hidden rounded-2xl border border-border/50 bg-card/40 shadow-sm transition-all duration-300",
                "hover:-translate-y-1 hover:border-primary/40 hover:shadow-2xl",
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
                    onClick={() => {}}
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
      </div>
    </section>
  );
}
