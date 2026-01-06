"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

export type UnitType = {
  type: string; // e.g., "1 Bedroom", "2 Bedroom", "Studio"
  size: string; // e.g., "750 sq ft"
  bathrooms: string; // e.g., "1", "2"
  price: string; // e.g., "AED 1.2M"
  image: string;
  features: string[]; // e.g., ["Balcony", "Built-in Wardrobes"]
};

type ProjectUnitsProps = {
  title: string;
  subtitle?: string;
  units: UnitType[];
};

export function ProjectUnits({ title, subtitle, units }: ProjectUnitsProps) {
  const t = useTranslations("Project");

  console.log("🏘️ ProjectUnits rendering", {
    title,
    subtitle,
    unitsCount: units?.length
  });

  if (!units || units.length === 0) {
    console.log("⚠️ ProjectUnits: No units to display");
    return null;
  }

  return (
    <section id="units" className="relative bg-background py-24 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light uppercase tracking-[0.2em] mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </motion.div>

        {/* Units Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {units.map((unit, index) => (
            <motion.div
              key={index}
              className="group relative bg-card border border-border rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-primary/50"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              {/* Unit Image */}
              <div className="relative h-64 w-full overflow-hidden bg-muted">
                <Image
                  src={unit.image}
                  alt={unit.type}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {/* Price Tag */}
                <div className="absolute top-4 end-4 bg-primary/90 backdrop-blur-sm text-primary-foreground px-4 py-2 rounded-full font-serif text-sm tracking-wider">
                  {unit.price}
                </div>
              </div>

              {/* Unit Details */}
              <div className="p-6">
                <h3 className="font-serif text-2xl font-medium tracking-wide mb-4">
                  {unit.type}
                </h3>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-border">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
                      {t("size")}
                    </p>
                    <p className="font-medium">{unit.size}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
                      {t("bathrooms")}
                    </p>
                    <p className="font-medium">{unit.bathrooms}</p>
                  </div>
                </div>

                {/* Features List */}
                {unit.features && unit.features.length > 0 && (
                  <div className="space-y-2">
                    {unit.features.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        className="flex items-start gap-2 text-sm"
                      >
                        <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Hover Effect Border */}
              <div className="absolute inset-0 border-2 border-primary/0 rounded-lg transition-all duration-300 group-hover:border-primary/20 pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
