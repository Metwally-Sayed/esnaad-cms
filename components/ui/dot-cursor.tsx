"use client";
import { Cursor } from "../motion-primitives/cursor";
import { useThemeStore } from "@/store/theme-store";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

export function DotCursor({
  children,
}: {
  children?: React.ReactNode;
}) {
  const isDark = useThemeStore((state) => state.isDark);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <Cursor
        attachToParent
        variants={{
          initial: { scale: 0.3, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 0.3, opacity: 0 },
        }}
        springConfig={{
          bounce: 0.001,
        }}
        transition={{
          ease: "easeInOut",
          duration: 0.15,
        }}
        className="z-9999"
      >
        <motion.div
          animate={{
            scale: isClicking ? 0.6 : 1,
            opacity: isClicking ? 0.8 : 1,
          }}
          transition={{
            duration: 0.1,
            ease: "easeOut",
          }}
          className="w-4 h-4 rounded-full pointer-events-none backdrop-blur-md"
          style={{
            backgroundColor: isDark
              ? "rgba(200, 200, 200, 0.5)"
              : "rgba(100, 100, 100, 0.5)",
          }}
        />
      </Cursor>
      <div className="w-full h-full">
        {children}
      </div>
    </div>
  );
}
