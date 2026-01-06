
"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";

type ProjectFloorPlansProps = {
  floorPlans?: string[];
};

export function ProjectFloorPlans({ floorPlans = [] }: ProjectFloorPlansProps) {
  const t = useTranslations("Project");

  const [currentIndex, setCurrentIndex] = useState(0);

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

  const nextPlan = () => {
    setCurrentIndex((prev) => (prev + 1) % floorPlans.length);
  };

  const prevPlan = () => {
    setCurrentIndex((prev) => (prev - 1 + floorPlans.length) % floorPlans.length);
  };

  return (
    <section id="floor-plans" className="min-h-screen snap-start bg-background py-20 flex items-center">
      <div className="container mx-auto px-4 w-full">
        <h2 className="mb-12 font-serif text-3xl text-foreground md:text-4xl">
          {t('floorPlans')}
        </h2>

        <div className="relative flex flex-col items-center">
          <div className="relative aspect-[16/9] w-full max-w-4xl overflow-hidden bg-muted/20 rounded-lg">
            <Image
              src={floorPlans[currentIndex]}
              alt={`Floor Plan ${currentIndex + 1}`}
              fill
              className="object-contain p-8"
            />
          </div>

          <div className="mt-8 text-center">
            <h3 className="font-serif text-2xl uppercase text-foreground">
              {t('floorPlan')} {currentIndex + 1} / {floorPlans.length}
            </h3>
            <p className="text-sm uppercase tracking-widest text-muted-foreground">
              {t('keyPlanLevel')}
            </p>
          </div>

          {/* Navigation Controls - only show if more than 1 floor plan */}
          {floorPlans.length > 1 && (
            <div className="absolute top-1/2 flex w-full -translate-y-1/2 justify-between px-4 md:px-12">
              <Button
                variant="ghost"
                size="icon"
                onClick={prevPlan}
                className="h-12 w-12 rounded-full border border-border bg-background/50 hover:bg-background"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={nextPlan}
                className="h-12 w-12 rounded-full border border-border bg-background/50 hover:bg-background"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
