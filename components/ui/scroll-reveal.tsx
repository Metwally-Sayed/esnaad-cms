"use client";

import { motion, useInView, Variant } from "framer-motion";
import { useRef } from "react";

type ScrollRevealProps = {
  children: React.ReactNode;
  width?: "fit-content" | "100%";
  mode?: "fade-up" | "fade-in" | "slide-left" | "slide-right" | "pop";
  delay?: number;
  duration?: number;
  className?: string;
  viewportAmount?: number;
  staggerChildren?: number;
};

export const ScrollReveal = ({
  children,
  width = "fit-content",
  mode = "fade-up",
  delay = 0,
  duration = 0.5,
  className = "",
  viewportAmount = 0.2,
  staggerChildren = 0,
}: ScrollRevealProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -100px 0px", amount: "some" });

  const getVariants = (): { hidden: Variant; visible: Variant } => {
    switch (mode) {
      case "fade-in":
        return {
          hidden: { opacity: 0, scale: 0.98 },
          visible: { opacity: 1, scale: 1 },
        };
      case "slide-left":
        return {
          hidden: { opacity: 0, x: -50 },
          visible: { opacity: 1, x: 0 },
        };
      case "slide-right":
        return {
          hidden: { opacity: 0, x: 50 },
          visible: { opacity: 1, x: 0 },
        };
      case "pop":
        return {
          hidden: { opacity: 0, scale: 0.8 },
          visible: { opacity: 1, scale: 1 },
        };
      case "fade-up":
      default:
        return {
          hidden: { opacity: 0, y: 40 },
          visible: { opacity: 1, y: 0 },
        };
    }
  };

  const variants = getVariants();

  return (
    <motion.div
      ref={ref}
      style={{ width }}
      className={className}
      variants={{
        hidden: variants.hidden,
        visible: {
          ...variants.visible,
          transition: {
            duration,
            delay,
            ease: [0.25, 0.4, 0.25, 1], // easeOutQuad-ish
            staggerChildren: staggerChildren
          },
        },
      }}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {children}
    </motion.div>
  );
};
