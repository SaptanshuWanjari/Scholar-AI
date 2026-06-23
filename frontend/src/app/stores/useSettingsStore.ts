import { create } from "zustand";
import { api, type BackendSettings } from "../lib/api";

interface SettingsState {
  fastModel: string;
  reasoningModel: string;
  embeddingModel: string;
  temperature: number;
  topK: number;
  similarityThreshold: number;
  streaming: boolean;
  citationsInline: boolean;
  accent: "violet" | "cyan" | "green";
  density: "comfortable" | "compact";
  industry: string;
  role: string;
  goals: string;
  interests: string;
  learningPreferences: string;
  hydrated: boolean;
  set: <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => void;
  hydrate: () => Promise<void>;
}

const PERSISTED: (keyof BackendSettings)[] = [
  "fastModel",
  "reasoningModel",
  "embeddingModel",
  "temperature",
  "topK",
  "similarityThreshold",
  "streaming",
  "citationsInline",
  "accent",
  "density",
  "industry",
  "role",
  "goals",
  "interests",
  "learningPreferences",
];

export const useSettingsStore = create<SettingsState>((set) => ({
  fastModel: "qwen3:8b",
  reasoningModel: "gemma4:12b",
  embeddingModel: "qwen3-embedding:0.6b",
  temperature: 0.4,
  topK: 5,
  similarityThreshold: 0.45,
  streaming: true,
  citationsInline: true,
  accent: "violet",
  density: "comfortable",
  industry: "",
  role: "",
  goals: "",
  interests: "",
  learningPreferences: "",
  hydrated: false,
  set: (key, value) => {
    set({ [key]: value } as Partial<SettingsState>);
    // Persist the single changed field to the backend (fire-and-forget).
    if (PERSISTED.includes(key as keyof BackendSettings)) {
      api.updateSettings({ [key]: value } as Partial<BackendSettings>).catch(() => {});
    }
  },
  hydrate: async () => {
    try {
      const remote = await api.getSettings();
      set({ ...remote, accent: remote.accent as SettingsState["accent"], density: remote.density as SettingsState["density"], hydrated: true });
    } catch {
      set({ hydrated: true });
    }
  },
}));
