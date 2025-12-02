
"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export function ProjectFloorPlans() {
  // Placeholder data - in a real app this would come from props
  const plans = [
    {
      title: "1 TO 4TH FLOOR",
      subtitle: "KEY PLAN LEVEL",
      image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b91d?q=80&w=2574&auto=format&fit=crop", // Placeholder
    },
    {
      title: "5TH TO 8TH FLOOR",
      subtitle: "KEY PLAN LEVEL",
      image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b91d?q=80&w=2574&auto=format&fit=crop", // Placeholder
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextPlan = () => {
    setCurrentIndex((prev) => (prev + 1) % plans.length);
  };

  const prevPlan = () => {
    setCurrentIndex((prev) => (prev - 1 + plans.length) % plans.length);
  };

  return (
    <section id="units" className="min-h-screen snap-start bg-background py-20 flex items-center">
      <div className="container mx-auto px-4 w-full">
        <h2 className="mb-12 font-serif text-3xl text-foreground md:text-4xl">
          FLOOR PLANS
        </h2>

        <div className="relative flex flex-col items-center">
          <div className="relative aspect-[16/9] w-full max-w-4xl overflow-hidden bg-muted/20">
             {/* In a real implementation, we'd use the actual floor plan images */}
             <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                <Image 
                    src={plans[currentIndex].image} 
                    alt={plans[currentIndex].title}
                    fill
                    className="object-contain p-8"
                />
             </div>
          </div>

          <div className="mt-8 text-center">
            <h3 className="font-serif text-2xl uppercase text-foreground">
              {plans[currentIndex].title}
            </h3>
            <p className="text-sm uppercase tracking-widest text-muted-foreground">
              {plans[currentIndex].subtitle}
            </p>
          </div>

          {/* Navigation Controls */}
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
        </div>
      </div>
    </section>
  );
}
