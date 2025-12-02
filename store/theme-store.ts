import { create } from "zustand";
import { ThemeName } from "@/lib/theme-config";
import { CMS_CONFIG } from "@/config/cms.config";

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
  isDark: false,
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
    console.log("setIsDark called with:", isDark);
    set({ isDark, mounted: true });
    if (typeof window !== "undefined") {
      if (isDark) {
        document.documentElement.classList.add("dark");
        console.log("Added dark class to document");
      } else {
        document.documentElement.classList.remove("dark");
        console.log("Removed dark class from document");
      }
      localStorage.setItem("theme-mode", isDark ? "dark" : "light");
      console.log("Saved to localStorage:", isDark ? "dark" : "light");
    }
  },

  toggleDarkMode: () => {
    const { isDark, setIsDark } = get();
    setIsDark(!isDark);
  },

  initializeTheme: () => {
    if (typeof window !== "undefined") {
      const savedTheme = (localStorage.getItem("theme-name") || CMS_CONFIG.defaultTheme) as ThemeName;
      const savedMode = localStorage.getItem("theme-mode") === "dark";

      set({
        theme: savedTheme,
        isDark: savedMode,
        mounted: true,
      });

      // Apply to DOM
      document.documentElement.setAttribute("data-theme", savedTheme);
      if (savedMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  },
}));
