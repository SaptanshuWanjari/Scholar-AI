import { create } from "zustand";
import { api } from "../lib/api";
import type { PromptAnalysis } from "../lib/api";
import { useSettingsStore } from "./useSettingsStore";

export type EnhancerResult =
  | { action: "use_suggested"; prompt: string }
  | { action: "generate_anyway" }
  | { action: "edit"; prompt: string };

interface PromptEnhancerState {
  open: boolean;
  analyzing: boolean;
  score: number | null;
  label: PromptAnalysis["label"] | null;
  suggestedPrompt: string | null;
  editedSuggestion: string;
  improvements: string[];
  _resolve: ((result: EnhancerResult) => void) | null;

  analyze: (topic: string, course?: string | null, route?: string | null) => Promise<EnhancerResult>;
  resolve: (result: EnhancerResult) => void;
  setEditedSuggestion: (v: string) => void;
  close: () => void;
}

export const usePromptEnhancerStore = create<PromptEnhancerState>((set, get) => ({
  open: false,
  analyzing: false,
  score: null,
  label: null,
  suggestedPrompt: null,
  editedSuggestion: "",
  improvements: [],
  _resolve: null,

  analyze: (topic, course, route) =>
    new Promise<EnhancerResult>((promiseResolve) => {
      if (!useSettingsStore.getState().usePromptEnhancer) {
        promiseResolve({ action: "generate_anyway" });
        return;
      }
      set({ analyzing: true });
      api
        .analyzePrompt(topic, course, route)
        .then((res) => {
          set({ analyzing: false });
          if (!res.should_enhance) {
            promiseResolve({ action: "generate_anyway" });
            return;
          }
          set({
            open: true,
            score: res.score,
            label: res.label,
            suggestedPrompt: res.suggested_prompt,
            editedSuggestion: res.suggested_prompt ?? topic,
            improvements: res.improvements ?? [],
            _resolve: promiseResolve,
          });
        })
        .catch(() => {
          set({ analyzing: false });
          // On error, let generation proceed normally
          promiseResolve({ action: "generate_anyway" });
        });
    }),

  resolve: (result) => {
    const { _resolve } = get();
    set({ open: false, _resolve: null });
    _resolve?.(result);
  },

  setEditedSuggestion: (v) => set({ editedSuggestion: v }),

  close: () => {
    const { _resolve } = get();
    set({ open: false, _resolve: null });
    _resolve?.({ action: "generate_anyway" });
  },
}));
