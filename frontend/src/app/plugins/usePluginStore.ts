import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PluginStoreState {
  enabled: Record<string, boolean>;
  isEnabled: (id: string) => boolean;
  toggle: (id: string) => void;
  setEnabled: (id: string, value: boolean) => void;
}

export const usePluginStore = create<PluginStoreState>()(
  persist(
    (set, get) => ({
      enabled: { excalidraw: true },
      isEnabled: (id) => get().enabled[id] ?? false,
      toggle: (id) =>
        set((s) => ({ enabled: { ...s.enabled, [id]: !s.enabled[id] } })),
      setEnabled: (id, value) =>
        set((s) => ({ enabled: { ...s.enabled, [id]: value } })),
    }),
    { name: "scholar-plugins" },
  ),
);
