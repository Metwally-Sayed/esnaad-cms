"use client";

import { cn } from "@/lib/utils";
import { useHeaderStore } from "@/store/header-store";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { flushSync } from "react-dom";

interface AnimatedMenuIconProps {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
  hasScrolled?: boolean;
}

const AnimatedMenuIcon = ({ isOpen, onClick, className, hasScrolled }: AnimatedMenuIconProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative z-50 flex h-12 w-12 flex-col items-center justify-center rounded-md transition-all duration-300 border",
        hasScrolled 
          ? "bg-foreground/5 hover:bg-foreground/10 border-foreground/20" 
          : "bg-background/5 hover:bg-background/10 border-background/20",
        className
      )}
      aria-label={isOpen ? "Close menu" : "Open menu"}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        className="transition-colors duration-300"
      >
        <motion.path
          stroke={hasScrolled ? "currentColor" : "currentColor"}
          strokeWidth="2.5"
          strokeLinecap="round"
          animate={isOpen ? { d: "M 4 4 L 20 20" } : { d: "M 4 6 L 20 6" }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={cn(
            "transition-colors duration-300",
            hasScrolled ? "text-foreground" : "text-background"
          )}
        />
        <motion.path
          stroke={hasScrolled ? "currentColor" : "currentColor"}
          strokeWidth="2.5"
          strokeLinecap="round"
          animate={isOpen ? { opacity: 0 } : { opacity: 1, d: "M 4 12 L 20 12" }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={cn(
            "transition-colors duration-300",
            hasScrolled ? "text-foreground" : "text-background"
          )}
        />
        <motion.path
          stroke={hasScrolled ? "currentColor" : "currentColor"}
          strokeWidth="2.5"
          strokeLinecap="round"
          animate={isOpen ? { d: "M 4 20 L 20 4" } : { d: "M 4 18 L 20 18" }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={cn(
            "transition-colors duration-300",
            hasScrolled ? "text-foreground" : "text-background"
          )}
        />
      </svg>
    </button>
  );
};

interface NavLink {
  name: string;
  href: string;
}

interface MainHeaderProps {
  logo?: React.ReactNode;
  links?: NavLink[];
  className?: string;
  initialData?: {
    id: string;
    name: string;
    links: Array<{
      id: string;
      name: string;
      slug: string;
      order: number;
    }>;
  } | null;
}

const defaultLinks: NavLink[] = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Portfolio", href: "/portfolio" },
  { name: "Contact", href: "/contact" },
];

export function MainHeader({ logo, links, className, initialData }: MainHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [hasScrolled, setHasScrolled] = useState(false);
  const menuButtonRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

  // Get header data from Zustand store
  const headerData = useHeaderStore((state) => state.headerData);

  // Use links from props, or from store, or from initialData, or fall back to defaults
  const navLinks = links ||
    headerData?.links.map(link => ({
      name: link.name,
      href: link.slug
    })) ||
    initialData?.links.map(link => ({
      name: link.name,
      href: link.slug
    })) ||
    defaultLinks;

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const currentScrollY = latest;

    // Set hasScrolled if user scrolled past 50px
    if (currentScrollY > 50) {
      setHasScrolled(true);
    } else {
      setHasScrolled(false);
    }

    // Show/hide header based on scroll direction
    if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
      // Scrolling down - hide header
      setIsVisible(false);
    } else {
      // Scrolling up - show header
      setIsVisible(true);
    }

    lastScrollY.current = currentScrollY;
  });

  const toggleMenu = useCallback(async () => {
    if (!menuButtonRef.current) {
      setIsMenuOpen(!isMenuOpen);
      return;
    }

    // Check if View Transition API is supported
    if (!document.startViewTransition) {
      setIsMenuOpen(!isMenuOpen);
      return;
    }

    try {
      await document.startViewTransition(() => {
        flushSync(() => {
          setIsMenuOpen(!isMenuOpen);
        });
      }).ready;

      const { top, left, width, height } = menuButtonRef.current.getBoundingClientRect();
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
          duration: 500,
          easing: "ease-in-out",
          pseudoElement: isMenuOpen
            ? "::view-transition-old(root)"
            : "::view-transition-new(root)",
        }
      );
    } catch (error) {
      console.error("Menu transition failed:", error);
      setIsMenuOpen(!isMenuOpen);
    }
  }, [isMenuOpen]);

  return (
    <>
      {/* Fixed Header */}
      <motion.header
        animate={{
          y: isVisible ? 0 : -100,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
        className={cn(
          "fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-4 transition-all duration-300 font-sans text-[0.65rem] uppercase tracking-[0.45em]",
          hasScrolled
            ? "bg-background text-foreground backdrop-blur-xl border-b border-foreground/15 shadow-sm"
            : "bg-foreground text-background border-b border-transparent",
          className
        )}
      >
        {/* Logo */}
        <Link
          href="/"
          className="relative z-50 flex items-center space-x-2 font-serif text-lg tracking-[0.3em]"
        >
          {logo || (
            <>
              <div
                className={cn(
                  "h-8 w-8 rounded-md transition-colors duration-300",
                  hasScrolled
                    ? "bg-linear-to-br from-foreground to-foreground/70"
                    : "bg-linear-to-br from-background to-background/70"
                )}
              />
              <span
                className={cn(
                  "text-xl font-semibold transition-colors duration-300",
                  hasScrolled ? "text-foreground" : "text-background"
                )}
              >
                Esnaad
              </span>
            </>
          )}
        </Link>

        {/* Menu Button */}
        <div ref={menuButtonRef}>
          <AnimatedMenuIcon isOpen={isMenuOpen} onClick={toggleMenu} hasScrolled={hasScrolled} />
        </div>
      </motion.header>

      {/* Full Screen Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-30 flex items-center justify-center bg-foreground text-background font-serif uppercase tracking-[0.3em]"
          >
            <nav className="flex flex-col items-center justify-center space-y-8">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                >
                  <Link
                    href={link.href}
                    onClick={toggleMenu}
                    className="group relative text-4xl font-semibold transition-colors hover:opacity-60 md:text-6xl"
                  >
                    {link.name}
                    <motion.span
                      className="absolute -bottom-2 left-0 h-1 w-0 bg-background"
                      whileHover={{ width: "100%" }}
                      transition={{ duration: 0.3 }}
                    />
                  </Link>
                </motion.div>
              ))}

              {/* Additional CTA or Social Links */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: navLinks.length * 0.1 + 0.2, duration: 0.3 }}
                className="mt-12 flex items-center gap-6"
              >
                <a
                  href="#"
                  className="group flex flex-col items-center gap-2 transition-opacity hover:opacity-100 opacity-70"
                  aria-label="Instagram"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  <span className="text-xs font-sans uppercase tracking-[0.4em]">Instagram</span>
                </a>

                <a
                  href="#"
                  className="group flex flex-col items-center gap-2 transition-opacity hover:opacity-100 opacity-70"
                  aria-label="Twitter"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  <span className="text-xs font-sans uppercase tracking-[0.4em]">Twitter</span>
                </a>

                <a
                  href="#"
                  className="group flex flex-col items-center gap-2 transition-opacity hover:opacity-100 opacity-70"
                  aria-label="LinkedIn"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  <span className="text-xs font-sans uppercase tracking-[0.4em]">LinkedIn</span>
                </a>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
