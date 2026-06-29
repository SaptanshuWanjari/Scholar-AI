import { create } from "zustand";
import { api, type BackendSettings } from "../lib/api";

interface SettingsState {
  name: string;
  fastModel: string;
  reasoningModel: string;
  embeddingModel: string;
  visionModel: string;
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
  ragMode: "strict" | "fallback";
  usePromptEnhancer: boolean;
  maxConcurrent: number;
  hydrated: boolean;
  set: <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => void;
  hydrate: () => Promise<void>;
}

const PERSISTED: (keyof BackendSettings)[] = [
  "name",
  "fastModel",
  "reasoningModel",
  "embeddingModel",
  "visionModel",
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
  "ragMode",
  "usePromptEnhancer",
  "maxConcurrent",
];

export const useSettingsStore = create<SettingsState>((set) => ({
  name: "",
  fastModel: "qwen3:8b",
  reasoningModel: "gemma4:12b",
  embeddingModel: "qwen3-embedding:0.6b",
  visionModel: "qwen2.5vl:3b",
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
  ragMode: "fallback",
  usePromptEnhancer: true,
  maxConcurrent: 3,
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
      set({
        ...remote,
        accent: remote.accent as SettingsState["accent"],
        density: remote.density as SettingsState["density"],
        ragMode: remote.ragMode as SettingsState["ragMode"],
        hydrated: true,
      });
    } catch {
      set({ hydrated: true });
    }
  },
}));
