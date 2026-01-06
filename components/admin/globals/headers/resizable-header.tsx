"use client";
import { cn } from "@/lib/utils";
import { useHeaderStore } from "@/store/header-store";
import { Menu, X } from "lucide-react";
import {
    AnimatePresence,
    motion,
    useMotionValueEvent,
    useScroll,
} from "motion/react";
import Image from "next/image";

import React, { useState } from "react";

interface NavbarProps {
  children: React.ReactNode;
  className?: string;
}

interface NavBodyProps {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
}

interface NavItemsProps {
  items: {
    name: string;
    link: string;
  }[];
  className?: string;
  onItemClick?: () => void;
  visible?: boolean;
}

interface MobileNavProps {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
}

interface MobileNavHeaderProps {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
}

interface MobileNavMenuProps {
  children: React.ReactNode;
  className?: string;
  isOpen: boolean;
  onClose?: () => void;
}

export const Navbar = ({ children, className }: NavbarProps) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState<boolean>(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 100) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  });

  return (
    <motion.div
      ref={ref}
      className={cn("fixed inset-x-0 top-6 z-40 w-full", className)}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(
              child as React.ReactElement<{ visible?: boolean }>,
              { visible }
            )
          : child
      )}
    </motion.div>
  );
};

export const NavBody = ({ children, className, visible }: NavBodyProps) => {
  return (
    <motion.div
      animate={{
        backdropFilter: visible ? "blur(10px)" : "none",
        boxShadow: visible
          ? "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset"
          : "none",
        y: visible ? 0 : 10,
        borderWidth: visible ? 1 : 0,
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 50,
      }}
      className={cn(
        "relative z-60 mx-auto hidden w-full max-w-7xl flex-row items-center justify-between self-start rounded-full bg-transparent px-6 py-3 lg:flex",
        visible && "bg-foreground/80 backdrop-blur-md border border-background/20 gap-2",
        className
      )}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(
              child as React.ReactElement<{ visible?: boolean }>,
              { visible }
            )
          : child
      )}
    </motion.div>
  );
};

export const NavItems = ({ items, className, onItemClick, visible }: NavItemsProps) => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <motion.div
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "hidden flex-row items-center justify-center gap-1 text-[0.65rem] font-medium uppercase tracking-[0.35em] transition duration-200 lg:flex",
        visible ? "text-background/70 hover:text-background" : "text-muted-foreground hover:text-foreground",
        className
      )}
    >
      {items.map((item, idx) => (
        <a
          onMouseEnter={() => setHovered(idx)}
          onClick={onItemClick}
          className={cn(
            "relative px-3 py-2 transition-colors whitespace-nowrap font-sans uppercase tracking-[0.35em]",
            visible ? "text-background/70 hover:text-background" : "text-muted-foreground hover:text-foreground"
          )}
          key={`link-${idx}`}
          href={item.link}
        >
          {hovered === idx && (
            <motion.div
              layoutId="hovered"
              className={cn(
                "absolute inset-0 h-full w-full rounded-full",
                visible ? "bg-background/10" : "bg-muted"
              )}
            />
          )}
          <span className="relative z-20">{item.name}</span>
        </a>
      ))}
    </motion.div>
  );
};

export const MobileNav = ({ children, className, visible }: MobileNavProps) => {
  return (
    <motion.div
      animate={{
        backdropFilter: visible ? "blur(10px)" : "none",
        boxShadow: visible
          ? "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset"
          : "none",
        width: visible ? "90%" : "100%",
        paddingRight: visible ? "12px" : "0px",
        paddingLeft: visible ? "12px" : "0px",
        borderRadius: visible ? "1rem" : "2rem",
        y: visible ? 20 : 0,
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 50,
      }}
      className={cn(
        "relative z-50 mx-auto flex w-full max-w-[calc(100vw-2rem)] flex-col items-center justify-between bg-transparent px-0 py-2 font-sans text-[0.65rem] uppercase tracking-[0.4em] lg:hidden",
        visible && "bg-foreground/80 backdrop-blur-md border border-background/20",
        className
      )}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(
              child as React.ReactElement<{ visible?: boolean }>,
              { visible }
            )
          : child
      )}
    </motion.div>
  );
};

export const MobileNavHeader = ({
  children,
  className,
  visible,
}: MobileNavHeaderProps) => {
  return (
    <div
      className={cn(
        "flex w-full flex-row items-center justify-between",
        className
      )}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(
              child as React.ReactElement<{ visible?: boolean }>,
              { visible }
            )
          : child
      )}
    </div>
  );
};

export const MobileNavMenu = ({
  children,
  className,
  isOpen,
  onClose,
}: MobileNavMenuProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={cn(
            "absolute inset-x-0 top-16 z-50 flex w-full flex-col items-start justify-start gap-4 rounded-lg bg-foreground px-4 py-8 border border-background/20 shadow-lg",
            className
          )}
        >
          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-background transition hover:bg-white/20"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          ) : null}
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const MobileNavToggle = ({
  isOpen,
  onClick,
  visible,
}: {
  isOpen: boolean;
  onClick: () => void;
  visible?: boolean;
}) => {
  return isOpen ? (
    <X className={cn("transition-colors", visible ? "text-background" : "text-foreground")} onClick={onClick} />
  ) : (
    <Menu className={cn("transition-colors", visible ? "text-background" : "text-foreground")} onClick={onClick} />
  );
};

export const NavbarLogo = ({ visible }: { visible?: boolean }) => {
  return (
    <a
      href="#"
      className="relative z-20 mr-4 flex items-center space-x-2 px-2 py-1 font-serif text-lg uppercase tracking-[0.3em]"
    >
      <Image
        src="https://assets.aceternity.com/logo-dark.png"
        alt="logo"
        width={30}
        height={30}
        className="h-[30px] w-[30px]"
        priority
      />
      <span className={cn(
        "font-medium transition-colors",
        visible ? "text-background" : "text-foreground"
      )}>Startup</span>
    </a>
  );
};

export const NavbarButton = ({
  href,
  as: Tag = "a",
  children,
  className,
  variant = "primary",
  visible,
  ...props
}: {
  href?: string;
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "dark" | "gradient";
  visible?: boolean;
} & (
  | React.ComponentPropsWithoutRef<"a">
  | React.ComponentPropsWithoutRef<"button">
)) => {
  const baseStyles =
    "px-4 py-2 rounded-md text-[0.65rem] font-bold uppercase tracking-[0.35em] relative cursor-pointer hover:-translate-y-0.5 transition duration-200 inline-block text-center font-sans";

  const variantStyles = {
    primary: visible
      ? "bg-background text-foreground border border-background/20 shadow-md hover:shadow-lg"
      : "bg-background text-foreground border border-border shadow-md hover:shadow-lg",
    secondary: visible
      ? "bg-transparent text-background shadow-none border border-transparent hover:border-background/30"
      : "bg-transparent text-foreground shadow-none border border-transparent hover:border-border",
    dark: visible
      ? "bg-background text-foreground border border-background/20 shadow-md hover:shadow-lg"
      : "bg-foreground text-background border border-border shadow-md hover:shadow-lg",
    gradient:
      "bg-primary text-primary-foreground shadow-md hover:shadow-lg",
  };

  return (
    <Tag
      href={href || undefined}
      className={cn(baseStyles, variantStyles[variant], className)}
      {...props}
    >
      {children}
    </Tag>
  );
};

export function ResizableHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Get header data from Zustand store
  const headerData = useHeaderStore((state) => state.headerData);

  // Map header links to nav items format, or use defaults
  const navItems = headerData?.links.map(link => ({
    name: link.name,
    link: link.slug
  })) || [
    { name: "Home", link: "/" },
    { name: "About", link: "/about" },
    { name: "Services", link: "/services" },
    { name: "Contact", link: "/contact" },
  ];
  return (
    <Navbar>
      <NavBody>
        <NavbarLogo />
          <NavItems items={navItems} />
          <NavbarButton className="text" href="/contact">Get Started</NavbarButton>
      </NavBody>

      <MobileNav>
        <MobileNavHeader>
          <NavbarLogo />
          <MobileNavToggle
            isOpen={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </MobileNavHeader>
        <MobileNavMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        >
          <NavItems
            items={navItems}
            onItemClick={() => setIsMobileMenuOpen(false)}
          />
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}
