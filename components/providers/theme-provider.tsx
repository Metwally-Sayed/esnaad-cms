"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/store/theme-store";
import { getActiveTheme } from "@/server/actions/theme";
import { ThemeName } from "@/lib/theme-config";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const setTheme = useThemeStore((state) => state.setTheme);
  const setIsDark = useThemeStore((state) => state.setIsDark);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        // Fetch theme colors from database
        const result = await getActiveTheme();
        console.log("Theme from database:", result);

        // Get dark mode from localStorage (independent of theme colors)
        const themeMode = localStorage.getItem("theme-mode") || "dark";
        const savedMode = themeMode === "dark";
        console.log("Dark mode from localStorage:", themeMode, "=>", savedMode);

        if (result.success && result.theme) {
          // Apply theme color from database
          setTheme(result.theme);
        } else {
          // Fallback to localStorage for theme
          const savedTheme = (localStorage.getItem("theme-name") || "default") as ThemeName;
          setTheme(savedTheme);
        }

        // Apply dark mode from localStorage
        setIsDark(savedMode);
      } catch (error) {
        console.error("Error loading theme:", error);

        // Fallback: load both from localStorage
        const savedTheme = (localStorage.getItem("theme-name") || "default") as ThemeName;
        const themeMode = localStorage.getItem("theme-mode") || "dark";
        const savedMode = themeMode === "dark";

        setTheme(savedTheme);
        setIsDark(savedMode);
      }
    };

    loadTheme();
  }, [setTheme, setIsDark]);

  return <>{children}</>;
}
