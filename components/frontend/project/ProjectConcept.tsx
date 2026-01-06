"use client";

import { motion } from "framer-motion";
import { Download } from "lucide-react";
import Image from "next/image";

type ProjectConceptProps = {
  description: string;
  images: string[];
  architecture: string;
  features: string[];
  brochureUrl?: string;
  labels?: {
    concept: string;
    architecture: string;
    uniqueFeatures: string;
    downloadBrochure: string;
  };
};

export function ProjectConcept({
  description,
  images,
  architecture,
  features,
  brochureUrl,
  labels,
}: ProjectConceptProps) {
  console.log("🎨 ProjectConcept rendering", {
    description: description?.substring(0, 50),
    imageCount: images?.length,
    featuresCount: features?.length
  });

  return (
    <section id="concept" className="min-h-screen snap-start px-4 sm:px-6 md:px-10 py-12 sm:py-20 lg:py-28 bg-background flex items-center">
      <div className="mx-auto max-w-7xl w-full">
        {/* Description */}
        <motion.p
          className="mx-auto max-w-4xl text-center font-serif text-base sm:text-lg md:text-xl leading-relaxed text-foreground"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {description}
        </motion.p>

        {/* Image Grid + Concept Details */}
        <div className="mt-10 sm:mt-16 grid gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Image Grid (6 images in 2x3 layout) */}
          <motion.div
            className="grid grid-cols-3 gap-2 sm:gap-4"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {images.slice(0, 6).map((image, index) => (
              <div
                key={index}
                className="relative aspect-square overflow-hidden rounded-sm"
              >
                <Image
                  src={image}
                  alt={`Concept image ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-110"
                  sizes="(max-width: 768px) 33vw, 16vw"
                />
              </div>
            ))}
          </motion.div>

          {/* Concept Details */}
          <motion.div
            className="flex flex-col justify-center space-y-6 sm:space-y-8"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light uppercase tracking-[0.08em] sm:tracking-[0.1em]">
              {labels?.concept || "CONCEPT"}
            </h2>

            <div className="space-y-5 sm:space-y-6">
              <div>
                <h3 className="mb-2 text-xs sm:text-sm font-semibold uppercase tracking-wider text-foreground/70">
                  {labels?.architecture || "Architecture"}:
                </h3>
                <p className="font-serif text-base sm:text-lg text-foreground leading-relaxed">
                  {architecture}
                </p>
              </div>

              <div>
                <h3 className="mb-2 sm:mb-3 text-xs sm:text-sm font-semibold uppercase tracking-wider text-foreground/70">
                  {labels?.uniqueFeatures || "Unique Features"}:
                </h3>
                <p className="font-serif text-sm sm:text-base leading-relaxed text-foreground">
                  {features.join(", ")}
                </p>
              </div>
            </div>

            {brochureUrl && (
              <a
                href={brochureUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex w-full sm:w-fit items-center justify-center gap-2 sm:gap-3 rounded-full border-2 border-foreground px-6 sm:px-8 py-3 sm:py-4 font-serif text-sm sm:text-base uppercase tracking-[0.08em] sm:tracking-[0.1em] transition-all hover:bg-foreground hover:text-background touch-manipulation"
              >
                <Download className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-y-1" />
                {labels?.downloadBrochure || "DOWNLOAD BROCHURE"}
              </a>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
