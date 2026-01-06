"use client";

import { useRef, useEffect, useState } from "react";

type ScrollRevealProps = {
  children: React.ReactNode;
  width?: "fit-content" | "100%";
  mode?: "fade-up" | "fade-in" | "slide-left" | "slide-right" | "pop";
  delay?: number;
  duration?: number;
  className?: string;
};

export const ScrollReveal = ({
  children,
  width = "fit-content",
  mode = "fade-up",
  delay = 0,
  duration = 0.5,
  className = "",
}: ScrollRevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Once visible, stop observing
          observer.unobserve(element);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px",
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const getAnimationClass = () => {
    const base = "transition-all";
    const delayClass = delay > 0 ? `delay-[${delay * 1000}ms]` : "";
    const durationClass = `duration-[${duration * 1000}ms]`;

    if (!isVisible) {
      switch (mode) {
        case "fade-in":
          return `${base} ${delayClass} ${durationClass} opacity-0 scale-95`;
        case "slide-left":
          return `${base} ${delayClass} ${durationClass} opacity-0 -translate-x-12`;
        case "slide-right":
          return `${base} ${delayClass} ${durationClass} opacity-0 translate-x-12`;
        case "pop":
          return `${base} ${delayClass} ${durationClass} opacity-0 scale-75`;
        case "fade-up":
        default:
          return `${base} ${delayClass} ${durationClass} opacity-0 translate-y-10`;
      }
    }

    return `${base} ${delayClass} ${durationClass} opacity-100 translate-x-0 translate-y-0 scale-100`;
  };

  return (
    <div
      ref={ref}
      style={{ width }}
      className={`${getAnimationClass()} ${className}`}
    >
      {children}
    </div>
  );
};
