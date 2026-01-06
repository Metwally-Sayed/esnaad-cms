"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { flushSync } from "react-dom";

interface LanguageSwitcherProps
  extends React.ComponentPropsWithoutRef<"button"> {
  currentLocale: string;
  duration?: number;
}

export const LanguageSwitcher = ({
  currentLocale,
  className,
  duration = 400,
  ...props
}: LanguageSwitcherProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const toggleLanguage = useCallback(async () => {
    if (!buttonRef.current) return;

    const newLocale = currentLocale === "en" ? "ar" : "en";

    // Remove current locale from pathname and add new one
    const segments = pathname.split("/").filter(Boolean);
    if (segments[0] === "en" || segments[0] === "ar") {
      segments[0] = newLocale;
    } else {
      segments.unshift(newLocale);
    }
    const newPath = `/${segments.join("/")}`;

    // Check if View Transition API is supported
    if (!document.startViewTransition) {
      // Fallback for browsers without View Transition API
      router.push(newPath);
      return;
    }

    try {
      await document.startViewTransition(() => {
        flushSync(() => {
          router.push(newPath);
        });
      }).ready;

      const { top, left, width, height } =
        buttonRef.current.getBoundingClientRect();
      const x = left + width / 2;
      const y = top + height / 2;
      const maxRadius = Math.hypot(
        Math.max(left, window.innerWidth - left),
        Math.max(top, window.innerHeight - top)
      );

      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${maxRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    } catch (error) {
      // If animation fails, still switch the language
      console.error("Language transition failed:", error);
      router.push(newPath);
    }
  }, [currentLocale, pathname, router, duration]);

  // Show the NEXT language, not current
  const isEnglish = currentLocale === "en";
  const nextLanguage = isEnglish ? "ar" : "en";
  const displayText = isEnglish ? "ع" : "EN"; // Show Arabic if current is English, and vice versa

  return (
    <button
      ref={buttonRef}
      onClick={toggleLanguage}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative inline-flex items-center justify-center rounded-full transition-all duration-500 touch-manipulation group overflow-hidden backdrop-blur-sm",
        "hover:shadow-lg hover:shadow-current/20 active:scale-95",
        className
      )}
      aria-label={`Switch to ${isEnglish ? "Arabic" : "English"}`}
      {...props}
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        animate={{
          background: [
            "radial-gradient(circle at 0% 0%, currentColor 0%, transparent 50%)",
            "radial-gradient(circle at 100% 100%, currentColor 0%, transparent 50%)",
            "radial-gradient(circle at 0% 100%, currentColor 0%, transparent 50%)",
            "radial-gradient(circle at 100% 0%, currentColor 0%, transparent 50%)",
            "radial-gradient(circle at 0% 0%, currentColor 0%, transparent 50%)",
          ],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{ opacity: 0.08 }}
      />

      {/* Main SVG Icon */}
      <div className="relative w-full h-full flex items-center justify-center">
        <svg
          className="w-full h-full relative z-10"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Rotating Globe Background */}
          <motion.g
            animate={{ rotate: isHovered ? 360 : 0 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "24px 24px" }}
          >
            {/* Main Circle */}
            <circle
              cx="24"
              cy="24"
              r="20"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
              opacity="0.2"
            />

            {/* Latitude lines */}
            <ellipse
              cx="24"
              cy="24"
              rx="20"
              ry="6"
              stroke="currentColor"
              strokeWidth="0.8"
              fill="none"
              opacity="0.15"
            />
            <ellipse
              cx="24"
              cy="24"
              rx="20"
              ry="12"
              stroke="currentColor"
              strokeWidth="0.8"
              fill="none"
              opacity="0.15"
            />

            {/* Longitude lines */}
            <ellipse
              cx="24"
              cy="24"
              rx="6"
              ry="20"
              stroke="currentColor"
              strokeWidth="0.8"
              fill="none"
              opacity="0.15"
            />
            <ellipse
              cx="24"
              cy="24"
              rx="12"
              ry="20"
              stroke="currentColor"
              strokeWidth="0.8"
              fill="none"
              opacity="0.15"
            />

            {/* Dots around the globe for a modern touch */}
            <motion.circle
              cx="24"
              cy="4"
              r="1.5"
              fill="currentColor"
              opacity="0.3"
              animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0 }}
            />
            <motion.circle
              cx="44"
              cy="24"
              r="1.5"
              fill="currentColor"
              opacity="0.3"
              animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            />
            <motion.circle
              cx="24"
              cy="44"
              r="1.5"
              fill="currentColor"
              opacity="0.3"
              animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            />
            <motion.circle
              cx="4"
              cy="24"
              r="1.5"
              fill="currentColor"
              opacity="0.3"
              animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
            />
          </motion.g>

          {/* Centered Language Code with Flip Animation - Shows NEXT language */}
          <motion.g
            key={nextLanguage}
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: -90, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            style={{ transformOrigin: "24px 24px" }}
          >
            {displayText === "EN" ? (
              <>
                {/* "EN" Text - shown when current is Arabic */}
                <text
                  x="24"
                  y="29"
                  textAnchor="middle"
                  fill="currentColor"
                  fontSize="12"
                  fontWeight="700"
                  fontFamily="sans-serif"
                  letterSpacing="0.8"
                >
                  EN
                </text>
                {/* Small arrow indicator */}
                <motion.path
                  d="M29 24L32 24M32 24L30.5 22.5M32 24L30.5 25.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.6"
                  animate={{ x: [0, 2, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </>
            ) : (
              <>
                {/* "ع" Arabic Letter - shown when current is English */}
                <text
                  x="24"
                  y="30"
                  textAnchor="middle"
                  fill="currentColor"
                  fontSize="16"
                  fontWeight="700"
                  fontFamily="sans-serif"
                >
                  ع
                </text>
                {/* Small arrow indicator (flipped) */}
                <motion.path
                  d="M19 24L16 24M16 24L17.5 22.5M16 24L17.5 25.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.6"
                  animate={{ x: [0, -2, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </>
            )}
          </motion.g>

          {/* Orbiting particles */}
          <motion.g
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "24px 24px" }}
          >
            <circle cx="24" cy="6" r="1" fill="currentColor" opacity="0.4" />
            <circle cx="38" cy="18" r="1" fill="currentColor" opacity="0.4" />
            <circle cx="10" cy="30" r="1" fill="currentColor" opacity="0.4" />
          </motion.g>
        </svg>

        {/* Glow effect on hover */}
        <motion.div
          className="absolute inset-0 rounded-full blur-md"
          animate={{
            opacity: isHovered ? 0.3 : 0,
            scale: isHovered ? 1.2 : 1,
          }}
          style={{
            background: "currentColor",
          }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Screen reader text */}
      <span className="sr-only">
        {isEnglish ? "Switch to Arabic" : "Switch to English"}
      </span>

      {/* Ripple effect on click */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-current"
        initial={{ scale: 1, opacity: 0 }}
        whileTap={{ scale: 1.5, opacity: [0, 0.5, 0] }}
        transition={{ duration: 0.6 }}
      />
    </button>
  );
};
