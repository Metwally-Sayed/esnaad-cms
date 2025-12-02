import { create } from "zustand";
import type { NavigationData } from "@/lib/types/navigation";

// Re-export for backward compatibility
export type FooterData = NavigationData;

interface FooterStore {
  // Current active footer data from database
  footerData: FooterData | null;

  // Loading state
  isLoading: boolean;

  // Actions
  setFooterData: (data: FooterData | null) => void;
  setIsLoading: (loading: boolean) => void;
  getFooterId: () => string;
}

export const useFooterStore = create<FooterStore>((set, get) => ({
  footerData: null,
  isLoading: false,

  setFooterData: (data) => set({ footerData: data }),

  setIsLoading: (loading) => set({ isLoading: loading }),

  getFooterId: () => get().footerData?.id || "",
}));
