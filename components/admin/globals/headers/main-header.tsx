"use client";

import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { cn } from "@/lib/utils";
import { useHeaderStore } from "@/store/header-store";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";

interface AnimatedMenuIconProps {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
  hasScrolled?: boolean;
}

const AnimatedMenuIcon = ({ isOpen, onClick, className, hasScrolled }: AnimatedMenuIconProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "header__burger",
        isOpen && "header__burger--opened",
        hasScrolled ? "text-foreground" : "text-white",
        className
      )}
      id="js-burger"
      data-arts-cursor="true"
      data-arts-cursor-scale="1.7"
      data-arts-cursor-magnetic="true"
      data-arts-cursor-hide-native="true"
      aria-label={isOpen ? "Close menu" : "Open menu"}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick();
        }
      }}
    >
      <div className={cn("header__burger-line", hasScrolled ? "bg-foreground" : "bg-white")}></div>
      <div className={cn("header__burger-line", hasScrolled ? "bg-foreground" : "bg-white")}></div>
      <div className={cn("header__burger-line", hasScrolled ? "bg-foreground" : "bg-white")}></div>
    </div>
  );
};

interface NavLink {
  name: string;
  href: string;
  children?: NavLink[];
}

type DbLink = {
  name: string;
  nameAr?: string | null;
  slug?: string | null;
  href?: string | null;
  children?: DbLink[];
};

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
      nameAr?: string | null;
      slug: string;
      order: number;
    }>;
  } | null;
  locale?: string;
}

const defaultLinks = [
  { name: "HOME", nameAr: "الرئيسية", href: "/", slug: "/" },
  { name: "DEVELOPMENTS", nameAr: "مشاريعنا", href: "/developments", slug: "/developments" },
  { name: "ABOUT US", nameAr: "من نحن", href: "/about", slug: "/about" },
  { name: "MEDIA CENTER", nameAr: "المركز الإعلامي", href: "/media-center", slug: "/media-center" },
  { name: "BLOGS", nameAr: "المدونة", href: "/gallery", slug: "/gallery" },
  { name: "AGENCY REGISTRATION", nameAr: "تسجيل الوكلاء", href: "/agency-registration", slug: "/agency-registration" },
  { name: "CAREERS", nameAr: "الوظائف", href: "/careers", slug: "/careers" },
  { name: "CONTACT US", nameAr: "تواصل معنا", href: "/contact", slug: "/contact" },
];

export function MainHeader({ logo, links, className, initialData, locale }: MainHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set());
  const menuButtonRef = useRef<HTMLDivElement>(null);

  // Get header data from Zustand store
  const headerData = useHeaderStore((state) => state.headerData);

  console.log(headerData, "headerData");


  // Helper function to map database links to NavLink format
  const mapLinksToNavLinks = (dbLinks: DbLink[]): NavLink[] => {
    // We need to know the current locale to pick correct name
    // Since MainHeader is a client component, we should probably receive locale as a prop or infer from path
    // But better to receive it.
    // For now let's try to get it from window location or simple heuristic if not passed
    // Actually best practice is to pass it.
    // Let's assume we will pass locale.

    return dbLinks.map(link => {
      let displayName = link.name;

      if (locale === 'ar') {
        if (link.nameAr) {
          displayName = link.nameAr;
        } else {
          // Fallback to default links translation if available
          // Check by href/slug OR by name (case-insensitive)
          const defaultLink = defaultLinks.find(dl =>
            dl.href === (link.slug || link.href) ||
            dl.name.toLowerCase() === link.name.toLowerCase()
          );

          if (defaultLink?.nameAr) {
            displayName = defaultLink.nameAr;
          }
        }
      }

      return {
        name: displayName,
        // Ensure href is always a string, falling back to "#" if missing
        href: link.slug || link.href || "#",
        children: link.children ? mapLinksToNavLinks(link.children) : undefined
      };
    });
  };

  // Use links from props, or from store, or from initialData, or fall back to defaults
  const navLinks = links ||
    (headerData?.links ? mapLinksToNavLinks(headerData.links) : undefined) ||
    (initialData?.links ? mapLinksToNavLinks(initialData.links) : undefined) ||
    mapLinksToNavLinks(defaultLinks);

  console.log(navLinks, "navLinks");

  const toggleSubmenu = useCallback((linkName: string) => {
    setExpandedMenus(prev => {
      const newSet = new Set(prev);
      if (newSet.has(linkName)) {
        newSet.delete(linkName);
      } else {
        newSet.add(linkName);
      }
      return newSet;
    });
  }, []);

  const { scrollY } = useScroll();

  // Prevent body scroll when menu is open (important for iOS Safari)
  useEffect(() => {
    if (isMenuOpen) {
      // Store original overflow
      const originalOverflow = document.body.style.overflow;
      const originalPosition = document.body.style.position;

      // Prevent scrolling on iOS Safari
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${window.scrollY}px`;

      return () => {
        // Restore original overflow
        const scrollY = document.body.style.top;
        document.body.style.overflow = originalOverflow;
        document.body.style.position = originalPosition;
        document.body.style.top = '';
        document.body.style.width = '';

        // Restore scroll position
        if (scrollY) {
          window.scrollTo(0, parseInt(scrollY || '0') * -1);
        }
      };
    }
  }, [isMenuOpen]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const currentScrollY = latest;

    // Set hasScrolled if user scrolled past 20px (more responsive)
    if (currentScrollY > 20) {
      setHasScrolled(true);
    } else {
      setHasScrolled(false);
    }
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
          y: 0,
          opacity: 1,
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
        className={cn(
          "fixed top-0 left-0 right-0 z-40 flex items-center justify-between transition-all duration-300 font-sans text-[0.65rem] uppercase tracking-[0.45em]",
          // Mobile-first padding with safe area support for iPhone
          "px-4 py-3 sm:px-6 sm:py-4",
          // iOS safe area support
          "pt-[max(0.75rem,env(safe-area-inset-top))] sm:pt-[max(1rem,env(safe-area-inset-top))]",
          "pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))]",
          "bg-transparent border-b border-transparent transition-colors duration-300",
          hasScrolled ? "text-foreground" : "text-white",
          className
        )}
      >
        {/* Logo */}
        <Link
          href={`/${locale || 'en'}`}
          className="relative z-50 flex items-center font-serif tracking-[0.2em] sm:tracking-[0.3em] touch-manipulation"
          onClick={() => {
            if (isMenuOpen) toggleMenu();
          }}
        >
          {logo || (
            <span
              className={cn(
                "text-base sm:text-xl font-semibold transition-colors duration-300",
                hasScrolled ? "text-foreground" : "text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
              )}
            >
              ESNAAD
            </span>
          )}
        </Link>

        {/* Actions Container - Language & Theme */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Switcher */}
          <LanguageSwitcher
            currentLocale={locale || "en"}
            className={cn(
              "transition-all duration-300",
              hasScrolled
                ? "text-foreground"
                : "text-white hover:text-white/80"
            )}
          />

          {/* Theme Toggler */}
          {/* <AnimatedThemeToggler
            className={cn(
              "h-10 w-10 sm:h-11 sm:w-11 transition-all duration-300 rounded-full inline-flex items-center justify-center",
              hasScrolled
                ? "bg-foreground/5 hover:bg-foreground/10 active:bg-foreground/15 text-foreground"
                : "bg-white/10 hover:bg-white/20 active:bg-white/25 text-white",
              "[&_svg]:h-4 [&_svg]:w-4 sm:[&_svg]:h-5 sm:[&_svg]:w-5"
            )}
          /> */}

          {/* Menu Button */}
          <div ref={menuButtonRef}>
            <AnimatedMenuIcon isOpen={isMenuOpen} onClick={toggleMenu} hasScrolled={hasScrolled} />
          </div>
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
            className="fixed inset-0 z-30 bg-background text-foreground font-serif uppercase tracking-[0.2em] sm:tracking-[0.3em] overflow-y-auto overscroll-contain"
            style={{
              // iOS safe area support - add extra padding for menu
              paddingTop: 'max(5rem, calc(env(safe-area-inset-top) + 4rem))',
              paddingBottom: 'max(8rem, calc(env(safe-area-inset-bottom) + 6rem))',
              paddingLeft: 'max(1rem, env(safe-area-inset-left))',
              paddingRight: 'max(1rem, env(safe-area-inset-right))',
              // Ensure proper uppercase rendering
              textTransform: 'uppercase',
              fontVariant: 'normal',
              fontFeatureSettings: 'normal',
            }}
          >
            <nav className="flex flex-col items-center justify-start min-h-full space-y-4 sm:space-y-8 w-full px-4 py-2">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  className="w-full text-center"
                >
                  {link.children && link.children.length > 0 ? (
                    // Parent link with children
                    <div className="flex flex-col items-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleSubmenu(link.name);
                        }}
                        className="group relative inline-block text-2xl sm:text-4xl md:text-6xl font-semibold transition-colors hover:opacity-60 active:opacity-50 touch-manipulation py-1 sm:py-2 cursor-pointer"
                      >
                        {link.name}
                      </button>

                      <AnimatePresence>
                        {expandedMenus.has(link.name) && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="flex flex-col items-center space-y-2 sm:space-y-3 mt-3 sm:mt-4 w-full"
                          >
                            {link.children.map((child, childIndex) => (
                              <motion.div
                                key={child.href}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ delay: childIndex * 0.05, duration: 0.2 }}
                                className="w-full flex justify-center"
                              >
                                <Link
                                  href={child.href}
                                  onClick={toggleMenu}
                                  className="group relative inline-block text-base sm:text-xl md:text-3xl font-normal opacity-70 hover:opacity-100 transition-all duration-300 touch-manipulation py-1 px-4"
                                >
                                  {child.name}
                                  <motion.span
                                    className="absolute -bottom-0.5 left-4 right-4 h-px w-0 bg-background/50"
                                    whileHover={{ width: "calc(100% - 2rem)" }}
                                    transition={{ duration: 0.3 }}
                                  />
                                </Link>
                              </motion.div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    // Regular link without children
                    <Link
                      href={link.href}
                      onClick={toggleMenu}
                      className="group relative inline-block text-2xl sm:text-4xl md:text-6xl font-semibold transition-colors hover:opacity-60 active:opacity-50 touch-manipulation py-1 sm:py-2"
                    >
                      {link.name}
                      <motion.span
                        className="absolute -bottom-1 sm:-bottom-2 left-0 h-0.5 sm:h-1 w-0 bg-background"
                        whileHover={{ width: "100%" }}
                        transition={{ duration: 0.3 }}
                      />
                    </Link>
                  )}
                </motion.div>
              ))}

              {/* Controls Section - Theme & Language */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: navLinks.length * 0.1 + 0.2, duration: 0.3 }}
                className="mt-8 sm:mt-12 flex flex-col items-center gap-6 pb-4"
              >
                {/* Theme and Language Controls */}
                <div className="flex items-center gap-4">
                  {/* <div className="flex flex-col items-center gap-2">
                    <LanguageSwitcher
                      currentLocale={locale || "en"}
                      className="h-12 w-12 sm:h-14 sm:w-14 bg-foreground/5 hover:bg-foreground/10 active:bg-foreground/15 text-foreground"
                    />
                    <span className="text-[0.6rem] sm:text-xs font-sans uppercase tracking-[0.3em] sm:tracking-[0.4em] opacity-70">
                      Language
                    </span>
                  </div> */}

                  {/* <div className="flex flex-col items-center gap-2">
                    <AnimatedThemeToggler className="h-12 w-12 sm:h-14 sm:w-14 rounded-full inline-flex items-center justify-center bg-foreground/5 hover:bg-foreground/10 active:bg-foreground/15 text-foreground [&_svg]:h-5 [&_svg]:w-5 sm:[&_svg]:h-6 sm:[&_svg]:w-6" />
                    <span className="text-[0.6rem] sm:text-xs font-sans uppercase tracking-[0.3em] sm:tracking-[0.4em] opacity-70">
                      Theme
                    </span>
                  </div> */}
                </div>

                {/* Social Links */}
                <div className="flex items-center gap-4 sm:gap-6 pt-4 border-t border-foreground/10 w-full justify-center">
                  <a
                    href="#"
                    className="group flex flex-col items-center gap-1.5 sm:gap-2 transition-opacity hover:opacity-100 active:opacity-100 opacity-70 touch-manipulation p-2"
                    aria-label="Instagram"
                  >
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                    <span className="text-[0.6rem] sm:text-xs font-sans uppercase tracking-[0.3em] sm:tracking-[0.4em]">Instagram</span>
                  </a>

                  <a
                    href="#"
                    className="group flex flex-col items-center gap-1.5 sm:gap-2 transition-opacity hover:opacity-100 active:opacity-100 opacity-70 touch-manipulation p-2"
                    aria-label="Twitter"
                  >
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    <span className="text-[0.6rem] sm:text-xs font-sans uppercase tracking-[0.3em] sm:tracking-[0.4em]">Twitter</span>
                  </a>

                  <a
                    href="#"
                    className="group flex flex-col items-center gap-1.5 sm:gap-2 transition-opacity hover:opacity-100 active:opacity-100 opacity-70 touch-manipulation p-2"
                    aria-label="LinkedIn"
                  >
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    <span className="text-[0.6rem] sm:text-xs font-sans uppercase tracking-[0.3em] sm:tracking-[0.4em]">LinkedIn</span>
                  </a>
                </div>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
