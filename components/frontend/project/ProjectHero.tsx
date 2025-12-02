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
        {/* Dark Overlay - stronger for better text contrast */}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-between px-6">
        <div className="h-[50%] flex items-end">
        <motion.h1
          className="font-serif text-6xl font-light uppercase tracking-[0.2em] text-white md:text-7xl lg:text-8xl "
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {title}
        </motion.h1>
        </div>


        {/* Navigation Tabs - Glassmorphism Effect */}
        <div className="h-[50%] flex items-end justify-center mb-24">
          <motion.div
            className="flex gap-1 rounded-xl border border-white/20 bg-white/10 p-2 backdrop-blur-md shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => scrollToSection(tab)}
                className={`relative px-8 py-3 font-serif text-sm uppercase tracking-widest transition-all duration-300 rounded-xl ${
                  activeTab === tab
                    ? "bg-white/20 text-white shadow-md"
                    : "text-white/70 hover:bg-white/10 hover:text-white/90"
                }`}
              >
                {tab}
              </button>
            ))}
          </motion.div>
        </div>
     
      </div>


    </section>
  );
}
