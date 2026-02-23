"use client";

import { cn } from "@/lib/utils";
import { MessageCircle, Phone, Video } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function StickyActionButtons() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show buttons after a small delay or scroll
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const actions = [
    {
      icon: Phone,
      label: "Call Us",
      href: "tel:800376223",
      color: "bg-green-500/80 hover:bg-green-500",
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      href: "https://wa.me/971800376223",
      color: "bg-[#25D366]/80 hover:bg-[#25D366]",
    },
    {
      icon: Video,
      label: "Video Call",
      href: "/contact-us",
      color: "bg-blue-500/80 hover:bg-blue-500",
    },
  ];

  return (
    <div
      className={cn(
        "fixed z-50 flex transition-all duration-500 will-change-transform",
        "right-3 sm:right-6 md:right-8",
        "bottom-[max(5.5rem,calc(env(safe-area-inset-bottom)+0.5rem))] sm:bottom-24",
        isVisible
          ? "translate-x-0 opacity-100"
          : "translate-x-[200%] opacity-0 pointer-events-none"
      )}
    >
      <div className="flex flex-col items-center gap-1.5 rounded-2xl border border-white/10 bg-black/45 px-1.5 py-1.5 shadow-2xl backdrop-blur-xl sm:gap-2 sm:p-2">
        {actions.map((action, index) => (
          <Link
            key={index}
            href={action.href}
            target={action.href.startsWith("http") ? "_blank" : undefined}
            className={cn(
              "group mobile-touch-target relative flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl transition-all duration-300 hover:scale-110",
              "bg-white/10 text-white hover:bg-white/20 hover:text-white hover:shadow-lg hover:shadow-white/10"
              // Alternatively use the specific colors defined above:
              // action.color, "text-white backdrop-blur-sm"
            )}
            aria-label={action.label}
          >
            <action.icon className="h-4 w-4 sm:h-6 sm:w-6" strokeWidth={1.7} />

            {/* Tooltip */}
            <span className="absolute right-full mr-3 hidden whitespace-nowrap rounded-lg bg-black/80 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:block group-hover:opacity-100 dark:bg-white/90 dark:text-black">
              {action.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
