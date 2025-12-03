"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";

type ProjectLocationProps = {
  description: string;
  mapEmbedUrl: string;
  emplacementText: string;
  recreationalText: string;
  videoTourUrl?: string;
};

export function ProjectLocation({
  description,
  mapEmbedUrl,
  emplacementText,
  recreationalText,
  videoTourUrl,
}: ProjectLocationProps) {
  return (
    <section id="location" className="min-h-screen snap-start bg-[#F3EFE7] px-4 sm:px-6 md:px-10 py-12 sm:py-20 lg:py-28 flex items-center">
      <div className="mx-auto max-w-7xl w-full">
        <div className="grid gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Content */}
          <motion.div
            className="space-y-6 sm:space-y-10"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light uppercase tracking-[0.08em] sm:tracking-[0.1em]">
              LOCATION
            </h2>

            <p className="font-serif text-sm sm:text-base leading-relaxed text-foreground/80">
              {description}
            </p>

            {videoTourUrl && (
              <button className="group inline-flex w-full sm:w-auto items-center justify-center gap-2 sm:gap-3 rounded-full border-2 border-foreground px-6 sm:px-8 py-3 sm:py-4 font-serif text-sm sm:text-base uppercase tracking-[0.08em] sm:tracking-[0.1em] transition-all hover:bg-foreground hover:text-background touch-manipulation">
                <Play className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:scale-110" />
                WATCH VIDEO TOUR
              </button>
            )}

            {/* Emplacement */}
            <div className="space-y-2 sm:space-y-3">
              <h3 className="font-serif text-lg sm:text-xl font-medium">Emplacement</h3>
              <p className="font-serif text-sm sm:text-base leading-relaxed text-foreground/80">
                {emplacementText}
              </p>
            </div>

            {/* Recreational Activities */}
            <div className="space-y-2 sm:space-y-3">
              <h3 className="font-serif text-lg sm:text-xl font-medium">
                Recreational Activities
              </h3>
              <p className="font-serif text-sm sm:text-base leading-relaxed text-foreground/80">
                {recreationalText}
              </p>
            </div>
          </motion.div>

          {/* Right Map */}
          <motion.div
            className="relative h-[350px] sm:h-[450px] md:h-[600px] overflow-hidden rounded-lg"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <iframe
              src={mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Project Location Map"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
