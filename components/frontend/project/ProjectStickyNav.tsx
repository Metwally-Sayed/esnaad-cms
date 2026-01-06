"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export type StickyTab = {
  id: string;
  label: string;
};

type ProjectStickyNavProps = {
  tabs: StickyTab[];
};

export function ProjectStickyNav({ tabs }: ProjectStickyNavProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let ticking = false;

    const updateState = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollBottom = scrollY + viewportHeight;

      // Show after scrolling past hero (1 viewport height)
      const passedHero = scrollY > viewportHeight * 0.8;
      // Hide when near bottom (within 200px of page end) to avoid clashing with footer
      const nearBottom = documentHeight - scrollBottom < 200;

      setIsVisible(passedHero && !nearBottom);

      // Scroll Spy Logic
      // Find the section that is currently most visible in the viewport
      if (passedHero) {
        let currentSectionId = activeTab;
        let minDistance = Infinity;

        tabs.forEach((tab) => {
          const element = document.getElementById(tab.id);
          if (element) {
            const rect = element.getBoundingClientRect();
            // Distance from center of viewport to center of element
            const elementCenter = rect.top + rect.height / 2;
            const viewportCenter = viewportHeight / 2;
            const distance = Math.abs(elementCenter - viewportCenter);

            if (distance < minDistance) {
              minDistance = distance;
              currentSectionId = tab.id;
            }
          }
        });
        
        if (currentSectionId) {
          setActiveTab(currentSectionId);
        }
      }

      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateState);
        ticking = true;
      }
    };

    // Initial check
    updateState();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateState);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateState);
    };
  }, [tabs, activeTab]);

  const scrollToSection = (tabId: string) => {
    setActiveTab(tabId);
    const element = document.getElementById(tabId);
    if (element) {
      const yOffset = -100; // Offset for better positioning (nav height + padding)
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div
      className={cn(
        "fixed bottom-8 left-1/2 z-50 -translate-x-1/2 transition-all duration-500 will-change-transform",
        isVisible
          ? "translate-y-0 opacity-100"
          : "translate-y-[150%] opacity-0 pointer-events-none"
      )}
    >
      <div className="w-fit max-w-[90vw] overflow-hidden rounded-xl border border-black/10 bg-black/70 p-1.5 shadow-2xl backdrop-blur-xl sm:p-2 dark:border-white/10 dark:bg-white/10">
        <div className="scrollbar-hide flex flex-row gap-0.5 overflow-x-auto sm:gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => scrollToSection(tab.id)}
              className={cn(
                "relative shrink-0 whitespace-nowrap rounded-lg px-3 py-2 font-serif text-[0.65rem] uppercase tracking-wide transition-all duration-300 touch-manipulation sm:rounded-xl sm:px-6 sm:py-2.5 sm:text-xs sm:tracking-wider md:px-8 md:py-3 md:tracking-widest",
                activeTab === tab.id
                  ? "bg-white text-black shadow-md dark:bg-white/90 dark:text-black"
                  : "text-white/70 hover:bg-white/10 hover:text-white dark:text-white/80"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
