"use client";

import { ThemeName } from "@/lib/theme-config";
import { getActiveTheme } from "@/server/actions/theme";
import { useThemeStore } from "@/store/theme-store";
import { useEffect } from "react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const setTheme = useThemeStore((state) => state.setTheme);
  const setIsDark = useThemeStore((state) => state.setIsDark);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        // Fetch theme colors from database
        const result = await getActiveTheme();
        console.log("Theme from database:", result);

        // Always force dark mode
        const savedMode = true;
        console.log("Dark mode forced: true");

        if (result.success && result.theme) {
          // Apply theme color from database
          setTheme(result.theme);
        } else {
          // Fallback to localStorage for theme
          const savedTheme = (localStorage.getItem("theme-name") || "default") as ThemeName;
          setTheme(savedTheme);
        }

        // Apply dark mode
        setIsDark(savedMode);
      } catch (error) {
        console.error("Error loading theme:", error);

        // Fallback: load both from localStorage
        const savedTheme = (localStorage.getItem("theme-name") || "default") as ThemeName;
        // Force dark mode
        const savedMode = true;

        setTheme(savedTheme);
        setIsDark(savedMode);
      }
    };

    loadTheme();
  }, [setTheme, setIsDark]);

  return <>{children}</>;
}
