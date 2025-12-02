import { create } from "zustand";
import type { NavigationData } from "@/lib/types/navigation";

// Re-export for backward compatibility
export type HeaderData = NavigationData;

interface HeaderStore {
  // Current active header data from database
  headerData: HeaderData | null;

  // Loading state
  isLoading: boolean;

  // Actions
  setHeaderData: (data: HeaderData | null) => void;
  setIsLoading: (loading: boolean) => void;
  getHeaderId: () => string;
}

export const useHeaderStore = create<HeaderStore>((set, get) => ({
  headerData: null,
  isLoading: false,

  setHeaderData: (data) => set({ headerData: data }),

  setIsLoading: (loading) => set({ isLoading: loading }),

  getHeaderId: () => get().headerData?.id || "",
}));
