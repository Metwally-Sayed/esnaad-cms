"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";
import { flushSync } from "react-dom";

interface LanguageSwitcherProps
  extends React.ComponentPropsWithoutRef<"button"> {
  currentLocale: string;
}

export const LanguageSwitcher = ({
  currentLocale,
  className,
}: LanguageSwitcherProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const switchLanguage = useCallback(
    async (newLocale: string) => {
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
        router.push(newPath);
        return;
      }

      try {
        await document.startViewTransition(() => {
          flushSync(() => {
            router.push(newPath);
          });
        }).ready;
      } catch (error) {
        console.error("Language transition failed:", error);
        router.push(newPath);
      }
    },
    [pathname, router]
  );

  const isEnglish = currentLocale === "en";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "flex items-center gap-1 font-sans text-xs font-medium uppercase tracking-widest outline-none transition-opacity hover:opacity-70",
          className
        )}
      >
        <span>{isEnglish ? "EN" : "العربية"}</span>
        <ChevronDown className="h-3 w-3" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[120px]">
        <DropdownMenuItem
          onClick={() => switchLanguage("en")}
          className={cn(
            "cursor-pointer justify-between",
            isEnglish && "bg-accent text-accent-foreground"
          )}
        >
          English
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => switchLanguage("ar")}
          className={cn(
            "cursor-pointer justify-between font-sans",
            !isEnglish && "bg-accent text-accent-foreground"
          )}
        >
          العربية
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
