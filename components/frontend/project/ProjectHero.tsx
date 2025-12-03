"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

type ProjectHeroProps = {
  heroImage: string;
  title: string;
  tabs?: string[];
};

export function ProjectHero({ heroImage, title, tabs = ["Location", "Units", "Amenities"] }: ProjectHeroProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  const scrollToSection = (tab: string) => {
    setActiveTab(tab);
    const sectionId = tab.toLowerCase().replace(/\s+/g, "-");
    
    // Use setTimeout to ensure state update completes before scrolling
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      console.log(`Scrolling to: ${sectionId}`, element ? "Found" : "Not found");
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        console.error(`Element with id="${sectionId}" not found in DOM`);
      }
    }, 100);
  };

  return (
    <section className="relative h-screen w-full overflow-hidden snap-start">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={heroImage}
          alt={title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 sm:px-6">
        <motion.h1
          className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-8xl font-light uppercase tracking-[0.15em] sm:tracking-[0.2em] text-white text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {title}
        </motion.h1>
      </div>

      {/* Sticky Navigation Tabs - Glassmorphism Effect */}
      <motion.div
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-row gap-1 w-auto rounded-xl border border-black/40 bg-black/60 p-2 backdrop-blur-xl shadow-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => scrollToSection(tab)}
            className={`relative px-4 sm:px-8 py-2.5 sm:py-3 font-serif text-xs sm:text-sm uppercase tracking-wider sm:tracking-widest transition-all duration-300 rounded-lg sm:rounded-xl touch-manipulation ${
              activeTab === tab
                ? "bg-white/30 text-white shadow-md"
                : "text-white/80 hover:bg-white/20 active:bg-white/25 hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </motion.div>


    </section>
  );
}
