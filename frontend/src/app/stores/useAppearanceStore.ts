import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AppearanceState {
  fontSize: number;
  readingFont: "sans" | "serif" | "mono" | "book";
  readingMode: boolean;
  accentColor: string;
  set: <K extends keyof AppearanceState>(key: K, value: AppearanceState[K]) => void;
}

export const useAppearanceStore = create<AppearanceState>()(
  persist(
    (set) => ({
      fontSize: 15,
      readingFont: "sans",
      readingMode: false,
      accentColor: "",
      set: (key, value) => set({ [key]: value } as Partial<AppearanceState>),
    }),
    {
      name: "scholar-appearance-storage",
    }
  )
);
