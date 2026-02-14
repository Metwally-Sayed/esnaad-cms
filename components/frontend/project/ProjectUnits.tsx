"use client";

import { motion } from "framer-motion";

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
  const hasStats = stats.length > 0;
  const hasOverview = Boolean(overview?.trim() || subtitle?.trim());

  if (!hasStats && !hasOverview) {
    return <section id="units" className="relative bg-background py-24 overflow-hidden" />;
  }

  return (
    <section id="units" className="relative bg-background py-24 overflow-hidden">
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
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-4 font-serif text-4xl font-light uppercase tracking-[0.2em] sm:text-5xl lg:text-6xl">
            {title}
          </h2>
          {subtitle?.trim() && (
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl">
              {subtitle}
            </p>
          )}
        </motion.div>

        {hasStats && (
          <div className="grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={`${stat.value}-${stat.label}-${index}`}
                className="rounded-lg border border-border/60 bg-card/40 p-5 text-center sm:p-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="mb-2 font-serif text-3xl text-foreground sm:text-4xl md:text-5xl">
                  {stat.value}
                </div>
                <div className="text-xs uppercase leading-tight tracking-wider text-foreground/80 sm:text-sm sm:tracking-widest md:text-base">
                  {stat.label}
                </div>
                {stat.description?.trim() && (
                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                    {stat.description}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {overview?.trim() && (
          <motion.div
            className="mx-auto mt-10 max-w-4xl rounded-lg border border-border/60 bg-card/40 px-6 py-8 text-center sm:px-10"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-serif text-base leading-relaxed text-foreground/90 sm:text-lg">
              {overview}
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
