import { CMS_CONFIG } from "@/config/cms.config";
import { ThemeName } from "@/lib/theme-config";
import { create } from "zustand";

interface ThemeState {
  theme: ThemeName;
  isDark: boolean;
  mounted: boolean;
  setTheme: (theme: ThemeName) => void;
  setIsDark: (isDark: boolean) => void;
  toggleDarkMode: () => void;
  initializeTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: CMS_CONFIG.defaultTheme,
  isDark: true,
  mounted: false,

  setTheme: (theme) => {
    console.log("Setting theme to:", theme);
    set({ theme, mounted: true });
    if (typeof window !== "undefined") {
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("theme-name", theme);
      console.log("Theme applied to DOM:", document.documentElement.getAttribute("data-theme"));
    }
  },

  setIsDark: (isDark) => {
    // Force true always
    const forceDark = true;
    console.log("setIsDark called, enforcing:", forceDark);
    set({ isDark: forceDark, mounted: true });
    if (typeof window !== "undefined") {
      document.documentElement.classList.add("dark");
      console.log("Added dark class to document (enforced)");
      localStorage.setItem("theme-mode", "dark");
    }
  },

  toggleDarkMode: () => {
    // Disable toggling, always force dark
    const { setIsDark } = get();
    setIsDark(true);
  },

  initializeTheme: () => {
    if (typeof window !== "undefined") {
      const savedTheme = (localStorage.getItem("theme-name") || CMS_CONFIG.defaultTheme) as ThemeName;
      
      // Always force dark mode
      const savedMode = true;

      set({
        theme: savedTheme,
        isDark: savedMode,
        mounted: true,
      });

      // Apply to DOM
      document.documentElement.setAttribute("data-theme", savedTheme);
      document.documentElement.classList.add("dark");
    }
  },
}));
