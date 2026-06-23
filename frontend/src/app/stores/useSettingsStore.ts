import { create } from "zustand";

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
  set: <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  fastModel: "llama3.1:8b",
  reasoningModel: "llama3.1:70b",
  embeddingModel: "nomic-embed-text",
  temperature: 0.4,
  topK: 4,
  similarityThreshold: 0.72,
  streaming: true,
  citationsInline: true,
  accent: "violet",
  density: "comfortable",
  set: (key, value) => set({ [key]: value } as Partial<SettingsState>),
}));
