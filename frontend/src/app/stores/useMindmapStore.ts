import { create } from "zustand";
import { toast } from "sonner";
import { api, type GeneratedMindmap } from "../lib/api";
import { usePromptEnhancerStore } from "./usePromptEnhancerStore";
import { useNotificationStore } from "./useNotificationStore";

export const ALL_COURSES = "__all__";

interface MindmapState {
  // Inputs + generation result live in the store so an in-flight generation
  // keeps running and its result is preserved across page navigation.
  topic: string;
  course: string; // ALL_COURSES or a course name
  document: string | null;
  loading: boolean;
  mindmap: GeneratedMindmap | null;
  setField: <K extends keyof MindmapState>(key: K, value: MindmapState[K]) => void;
  generate: () => Promise<void>;
}

export const useMindmapStore = create<MindmapState>((set, get) => ({
  topic: "",
  course: ALL_COURSES,
  document: null,
  loading: false,
  mindmap: null,
  setField: (key, value) => set({ [key]: value } as Partial<MindmapState>),
  generate: async () => {
    const { topic, course, document, loading } = get();
    if (loading) return;
    const trimmed = topic.trim();
    if (!trimmed) {
      toast.error("Enter a topic to generate a mind map");
      return;
    }
    const enhResult = await usePromptEnhancerStore.getState().analyze(trimmed, course === ALL_COURSES ? null : course, "mindmap");
    if (enhResult.action === "edit") {
      set({ topic: enhResult.prompt });
      return;
    }
    if (enhResult.action === "use_suggested") {
      set({ topic: enhResult.prompt });
    }
    const finalTopic = get().topic.trim();
    set({ loading: true });
    try {
      const ragMode = (await import("./useSettingsStore")).useSettingsStore.getState().ragMode;
      const result = await api.generateMindmap(finalTopic, course === ALL_COURSES ? null : course, document, ragMode);
      if (!result.grounded || !result.text?.trim()) {
        const errMsg = "No grounded mind map could be generated for this topic";
        toast.error(errMsg);
        useNotificationStore.getState().add({ title: "Mind map generation failed", status: "error", message: errMsg });
        set({ mindmap: null });
        return;
      }
      set({ mindmap: result });
      toast.success("Mind map generated");
      useNotificationStore.getState().add({ title: "Mind map generated", status: "success" });
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Failed to generate mind map";
      toast.error(errMsg);
      useNotificationStore.getState().add({ title: "Mind map generation failed", status: "error", message: errMsg });
    } finally {
      set({ loading: false });
    }
  },
}));
