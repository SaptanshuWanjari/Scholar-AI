import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AppearanceState {
  theme: "light" | "dark" | "system";
  fontSize: number;
  readingFont: "sans" | "serif" | "mono" | "book";
  highContrast: boolean;
  accentColor: string; // Hex color for custom accent
  reduceAnimations: boolean;
  reduceTransparency: boolean;
  readingMode: boolean;
  set: <K extends keyof AppearanceState>(key: K, value: AppearanceState[K]) => void;
}

export const useAppearanceStore = create<AppearanceState>()(
  persist(
    (set) => ({
      theme: "system",
      fontSize: 15,
      readingFont: "sans",
      highContrast: false,
      accentColor: "#4f4d7a", // Default violet accent from theme.css
      reduceAnimations: false,
      reduceTransparency: false,
      readingMode: false,
      set: (key, value) => set({ [key]: value } as Partial<AppearanceState>),
    }),
    {
      name: "scholar-appearance-storage",
    }
  )
);
