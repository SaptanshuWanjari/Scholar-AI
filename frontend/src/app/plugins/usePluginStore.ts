import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface PluginRecord {
  id: string;
  name: string;
  description: string;
  npm_packages: string[];
  installed: boolean;
  enabled: boolean;
  installed_at: string | null;
}

export type PluginInstallState = "idle" | "installing" | "uninstalling";

interface PluginStoreState {
  plugins: Record<string, PluginRecord>;
  installStates: Record<string, PluginInstallState>;
  restartRequired: boolean;
  fetchPlugins: () => Promise<void>;
  install: (id: string) => Promise<void>;
  uninstall: (id: string) => Promise<void>;
  enable: (id: string) => Promise<void>;
  disable: (id: string) => Promise<void>;
  dismissRestart: () => void;
  isInstalled: (id: string) => boolean;
  isEnabled: (id: string) => boolean;
  getInstallState: (id: string) => PluginInstallState;
}

export const usePluginStore = create<PluginStoreState>()(
  persist(
    (set, get) => ({
      plugins: {},
      installStates: {},
      restartRequired: false,

      fetchPlugins: async () => {
        try {
          const res = await fetch("/api/plugins");
          if (!res.ok) return;
          const list: PluginRecord[] = await res.json();
          const plugins: Record<string, PluginRecord> = {};
          for (const p of list) plugins[p.id] = p;
          set({ plugins });
        } catch {
          // backend may not be running yet; keep cached state
        }
      },

      install: async (id) => {
        set((s) => ({ installStates: { ...s.installStates, [id]: "installing" as const } }));
        try {
          const res = await fetch(`/api/plugins/${id}/install`, { method: "POST" });
          const data = await res.json();
          if (!res.ok) throw new Error(data.detail ?? "Install failed");
          set((s) => ({
            plugins: {
              ...s.plugins,
              [id]: { ...s.plugins[id], installed: true, enabled: true },
            },
            restartRequired: s.restartRequired || data.restart_required,
          }));
        } finally {
          set((s) => ({ installStates: { ...s.installStates, [id]: "idle" as const } }));
        }
      },

      uninstall: async (id) => {
        set((s) => ({ installStates: { ...s.installStates, [id]: "uninstalling" as const } }));
        try {
          const res = await fetch(`/api/plugins/${id}/uninstall`, { method: "POST" });
          const data = await res.json();
          if (!res.ok) throw new Error(data.detail ?? "Uninstall failed");
          set((s) => ({
            plugins: {
              ...s.plugins,
              [id]: { ...s.plugins[id], installed: false, enabled: false },
            },
            restartRequired: s.restartRequired || data.restart_required,
          }));
        } finally {
          set((s) => ({ installStates: { ...s.installStates, [id]: "idle" as const } }));
        }
      },

      enable: async (id) => {
        await fetch(`/api/plugins/${id}/enable`, { method: "POST" });
        set((s) => ({
          plugins: { ...s.plugins, [id]: { ...s.plugins[id], enabled: true } },
        }));
      },

      disable: async (id) => {
        await fetch(`/api/plugins/${id}/disable`, { method: "POST" });
        set((s) => ({
          plugins: { ...s.plugins, [id]: { ...s.plugins[id], enabled: false } },
        }));
      },

      dismissRestart: () => set({ restartRequired: false }),

      isInstalled: (id) => get().plugins[id]?.installed ?? false,
      isEnabled: (id) => get().plugins[id]?.enabled ?? false,
      getInstallState: (id) => get().installStates[id] ?? "idle",
    }),
    {
      name: "scholar-plugins",
      partialize: (s) => ({ plugins: s.plugins }),
    },
  ),
);
