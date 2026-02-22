"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type ProjectFloorPlansProps = {
  floorPlans?: string[];
};

export function ProjectFloorPlans({ floorPlans = [] }: ProjectFloorPlansProps) {
  const t = useTranslations("Project");
  const AUTO_SLIDE_MS = 5000;
  const SWIPE_THRESHOLD_PX = 70;
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const safeImages = floorPlans || [];
  const imageCount = safeImages.length;

  const normalizeIndex = (index: number) => {
    if (imageCount === 0) return 0;
    return ((index % imageCount) + imageCount) % imageCount;
  };

  const previousIndex = normalizeIndex(activeIndex - 1);
  const nextIndex = normalizeIndex(activeIndex + 1);

  const goToPrev = () => {
    setDirection(-1);
    setActiveIndex(previousIndex);
  };

  const goToNext = () => {
    setDirection(1);
    setActiveIndex(nextIndex);
  };

  const goToIndex = (index: number) => {
    const target = normalizeIndex(index);
    setDirection(target >= activeIndex ? 1 : -1);
    setActiveIndex(target);
  };

  const autoAdvanceRef = useRef<() => void>(() => {});

  useEffect(() => {
    autoAdvanceRef.current = () => {
      if (imageCount <= 1) return;
      setDirection(1);
      setActiveIndex((prev) => ((prev + 1) % imageCount + imageCount) % imageCount);
    };
  }, [imageCount]);

  useEffect(() => {
    if (imageCount <= 1) return;
    const timer = setInterval(() => {
      autoAdvanceRef.current();
    }, AUTO_SLIDE_MS);
    return () => clearInterval(timer);
  }, [imageCount, AUTO_SLIDE_MS]);

  if (imageCount === 0) {
    return (
      <section id="floor-plans" className="min-h-screen snap-start bg-background py-20 flex items-center">
        <div className="container mx-auto w-full px-4 text-center text-muted-foreground">
          <p>{t("noFloorPlansAvailable") || "No floor plans available"}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="floor-plans" className="min-h-screen snap-start bg-[#060606] px-4 py-12 sm:px-6 sm:py-16 md:px-10 lg:py-20">
      <div className="mx-auto w-full max-w-[1720px]">
        <div className="relative overflow-hidden rounded-2xl bg-[#090909]">
          <div className="px-4 pt-6 sm:px-8 sm:pt-8 lg:px-12">
            <h2 className="text-center font-serif text-3xl font-light uppercase tracking-[0.12em] text-white sm:text-4xl">
              {t("floorPlans")}
            </h2>
          </div>

          <div className="relative pt-4 sm:pt-6">
            <div className="relative h-[64vw] min-h-[280px] max-h-[780px] overflow-hidden sm:h-[58vw] lg:h-[44vw]">
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={`floor-plan-strip-${activeIndex}`}
                  custom={direction}
                  className="absolute inset-0 grid grid-cols-1 gap-4 will-change-transform lg:grid-cols-[1fr_2.35fr_1fr] lg:gap-6"
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.06}
                  onDragEnd={(_, info) => {
                    const offsetX = info.offset.x;
                    const velocityX = info.velocity.x;
                    if (offsetX <= -SWIPE_THRESHOLD_PX || velocityX <= -420) {
                      goToNext();
                    } else if (offsetX >= SWIPE_THRESHOLD_PX || velocityX >= 420) {
                      goToPrev();
                    }
                  }}
                variants={{
                  enter: (dir: 1 | -1) => ({
                    x: dir > 0 ? 120 : -120,
                    opacity: 1,
                  }),
                  center: {
                    x: 0,
                    opacity: 1,
                  },
                  exit: (dir: 1 | -1) => ({
                    x: dir > 0 ? -120 : 120,
                    opacity: 0,
                  }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
                  opacity: { duration: 0.08, ease: "linear" },
                }}
              >
                  <button
                    type="button"
                    onClick={goToPrev}
                    className="relative hidden h-full overflow-hidden bg-black lg:block"
                    aria-label="Previous floor plan"
                  >
                    <Image
                      src={safeImages[previousIndex]}
                      alt="Previous floor plan"
                      fill
                      quality={100}
                      className="object-cover opacity-95 transition-opacity hover:opacity-100"
                      sizes="20vw"
                    />
                  </button>

                  <div className="relative h-full overflow-hidden bg-black touch-pan-y">
                    <Image
                      src={safeImages[activeIndex]}
                      alt={`Floor Plan ${activeIndex + 1}`}
                      fill
                      priority
                      quality={100}
                      className="object-cover select-none"
                      draggable={false}
                      sizes="(max-width: 1024px) 100vw, 60vw"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={goToNext}
                    className="relative hidden h-full overflow-hidden bg-black lg:block"
                    aria-label="Next floor plan"
                  >
                    <Image
                      src={safeImages[nextIndex]}
                      alt="Next floor plan"
                      fill
                      quality={100}
                      className="object-cover opacity-95 transition-opacity hover:opacity-100"
                      sizes="20vw"
                    />
                  </button>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex items-center justify-center gap-3 pb-6 pt-4 sm:pb-8">
              {safeImages.map((_, index) => {
                const isActive = index === activeIndex;
                return (
                  <button
                    key={`floor-plan-dot-${index}`}
                    type="button"
                    onClick={() => goToIndex(index)}
                    aria-label={`Go to floor plan ${index + 1}`}
                    className="group relative h-4 w-4"
                  >
                    <span
                      className={`absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all ${
                        isActive ? "bg-white" : "bg-white/35 group-hover:bg-white/60"
                      }`}
                    />
                    {isActive ? (
                      <motion.svg
                        key={`floor-plan-dot-progress-${activeIndex}`}
                        className="absolute inset-0"
                        viewBox="0 0 16 16"
                        fill="none"
                        aria-hidden
                      >
                        <motion.circle
                          cx="8"
                          cy="8"
                          r="7.5"
                          stroke="rgba(255,255,255,0.8)"
                          strokeWidth="1"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{
                            duration: AUTO_SLIDE_MS / 1000,
                            ease: "linear",
                          }}
                        />
                      </motion.svg>
                    ) : null}
                  </button>
                );
              })}
            </div>

            <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-20 bg-gradient-to-r from-[#060606] to-transparent lg:block" />
            <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-20 bg-gradient-to-l from-[#060606] to-transparent lg:block" />
          </div>
        </div>
      </div>
    </section>
  );
}
