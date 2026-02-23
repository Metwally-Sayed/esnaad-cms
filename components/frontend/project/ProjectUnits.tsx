"use client";

import { MobileExpandableText } from "@/components/frontend/mobile";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export type ProjectUnitStat = {
  value: string;
  label: string;
  description?: string;
};

type ProjectUnitsProps = {
  title: string;
  subtitle?: string;
  overview?: string;
  stats: ProjectUnitStat[];
};

export function ProjectUnits({ title, subtitle, overview, stats }: ProjectUnitsProps) {
  const tCommon = useTranslations("Common");
  const hasStats = stats.length > 0;
  const hasOverview = Boolean(overview?.trim() || subtitle?.trim());

  if (!hasStats && !hasOverview) {
    return <section id="units" className="relative overflow-hidden bg-background" />;
  }

  return (
    <section id="units" className="relative overflow-hidden bg-background py-16 md:py-24">
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-10 text-center md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-3 font-serif text-3xl font-light tracking-[0.08em] sm:text-5xl md:mb-4 md:uppercase md:tracking-[0.2em] lg:text-6xl">
            {title}
          </h2>
          {subtitle?.trim() && (
            <p className="mx-auto max-w-2xl text-base leading-7 text-muted-foreground sm:text-xl sm:leading-normal">
              {subtitle}
            </p>
          )}
        </motion.div>

        {hasStats && (
          <div className="grid grid-cols-2 gap-4 sm:gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={`${stat.value}-${stat.label}-${index}`}
                className="rounded-2xl border border-border/70 bg-card/65 p-4 text-center backdrop-blur-sm sm:p-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="mb-2 font-serif text-2xl text-foreground sm:text-4xl md:text-5xl">
                  {stat.value}
                </div>
                <div className="text-[0.62rem] uppercase leading-tight tracking-[0.16em] text-foreground/80 sm:text-sm sm:tracking-widest md:text-base">
                  {stat.label}
                </div>
                {stat.description?.trim() && (
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:mt-3 sm:text-sm">
                    {stat.description}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {overview?.trim() && (
          <motion.div
            className="mx-auto mt-8 max-w-4xl rounded-2xl border border-border/70 bg-card/65 px-5 py-6 text-center backdrop-blur-sm sm:mt-10 sm:px-10 sm:py-8"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6 }}
          >
            <div className="md:hidden">
              <MobileExpandableText
                text={overview}
                collapsedLines={7}
                readMoreLabel={tCommon("readMore")}
                readLessLabel={tCommon("readLess")}
                contentClassName="font-serif text-sm leading-7 text-foreground/90"
                buttonClassName="text-[0.62rem] tracking-[0.2em]"
              />
            </div>
            <p className="hidden font-serif text-base leading-relaxed text-foreground/90 md:block md:text-lg">
              {overview}
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
