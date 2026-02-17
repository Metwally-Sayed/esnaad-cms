
"use client";

import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type ProjectFloorPlansProps = {
  floorPlans?: string[];
};

export function ProjectFloorPlans({ floorPlans = [] }: ProjectFloorPlansProps) {
  const t = useTranslations("Project");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const thumbnailsRef = useRef<HTMLDivElement>(null);

  const nextPlan = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % floorPlans.length);
  };

  const prevPlan = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + floorPlans.length) % floorPlans.length);
  };

  const goToPlan = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  // Scroll thumbnails to keep active one in view
  useEffect(() => {
    if (thumbnailsRef.current) {
      const activeThumbnail = thumbnailsRef.current.children[currentIndex] as HTMLElement;
      if (activeThumbnail) {
        thumbnailsRef.current.scrollTo({
          left: activeThumbnail.offsetLeft - thumbnailsRef.current.offsetWidth / 2 + activeThumbnail.offsetWidth / 2,
          behavior: 'smooth'
        });
      }
    }
  }, [currentIndex]);

  // Auto-scroll functionality using ref pattern to avoid dependency issues
  const autoScrollCallback = useRef(() => { });

  // Update ref to always have the latest state/props
  useEffect(() => {
    autoScrollCallback.current = () => {
      if (!isHovering && floorPlans.length > 1) {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % floorPlans.length);
      }
    };
  });

  // Set up the interval once
  useEffect(() => {
    const tick = () => autoScrollCallback.current();
    const interval = setInterval(tick, 3000); // 3 seconds
    return () => clearInterval(interval);
  }, []); // Empty dependency array = truly stable interval

  // If no floor plans provided, show message
  if (!floorPlans || floorPlans.length === 0) {
    return (
      <section id="floor-plans" className="min-h-screen snap-start bg-background py-20 flex items-center">
        <div className="container mx-auto px-4 w-full">
          <h2 className="mb-12 font-serif text-3xl text-foreground md:text-4xl">
            {t('floorPlans')}
          </h2>
          <div className="text-center text-muted-foreground">
            <p>{t('noFloorPlansAvailable') || 'No floor plans available'}</p>
          </div>
        </div>
      </section>
    );
  }

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <section id="floor-plans" className="min-h-screen snap-start bg-background py-20 flex items-center overflow-hidden">
      <div className="container mx-auto px-4 w-full h-full flex flex-col justify-center">
        <h2 className="mb-8 font-serif text-3xl text-foreground md:text-4xl text-center">
          {t('floorPlans')}
        </h2>

        <div
          className="relative flex flex-col items-center w-full max-w-6xl mx-auto"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Main Slider */}
          <div className="relative aspect-[16/9] w-full bg-transparent rounded-lg overflow-hidden">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                className="absolute inset-0 flex items-center justify-center p-4 md:p-8"
              >
                <div className="relative w-full h-full">
                  <Image
                    src={floorPlans[currentIndex]}
                    alt={`Floor Plan ${currentIndex + 1}`}
                    fill
                    className="object-contain"
                    priority={true}
                  />
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Controls */}
            {floorPlans.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={prevPlan}
                  className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 h-10 w-10 md:h-12 md:w-12 rounded-full bg-background/80 hover:bg-background border border-border shadow-sm z-10 transition-transform active:scale-95"
                >
                  <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={nextPlan}
                  className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 h-10 w-10 md:h-12 md:w-12 rounded-full bg-background/80 hover:bg-background border border-border shadow-sm z-10 transition-transform active:scale-95"
                >
                  <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
                </Button>
              </>
            )}
          </div>

          <div className="mt-6 text-center">
            <h3 className="font-serif text-xl md:text-2xl uppercase text-foreground">
              {t('floorPlan')} {currentIndex + 1} <span className="text-muted-foreground mx-1">/</span> {floorPlans.length}
            </h3>
            <p className="text-xs md:text-sm uppercase tracking-widest text-muted-foreground mt-1">
              {t('keyPlanLevel')}
            </p>
          </div>

          {/* Thumbnails Strip */}
          {floorPlans.length > 1 && (
            <div
              ref={thumbnailsRef}
              className="mt-8 flex gap-3 overflow-x-auto w-full max-w-4xl px-4 py-2 scrollbar-none snap-x"
              style={{ scrollBehavior: 'smooth' }}
            >
              {floorPlans.map((plan, index) => (
                <button
                  key={index}
                  onClick={() => goToPlan(index)}
                  className={`
                    relative flex-shrink-0 w-20 h-14 md:w-24 md:h-16 rounded overflow-hidden border-2 transition-all duration-300 snap-center
                    ${index === currentIndex
                      ? "border-primary opacity-100 scale-105 shadow-md"
                      : "border-transparent opacity-60 hover:opacity-100 grayscale hover:grayscale-0"}
                  `}
                >
                  <Image
                    src={plan}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="100px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
