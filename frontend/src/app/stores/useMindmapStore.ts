import { create } from "zustand";
import { toast } from "sonner";
import { api, type GeneratedMindmap } from "../lib/api";

export const ALL_COURSES = "__all__";

interface MindmapState {
  // Inputs + generation result live in the store so an in-flight generation
  // keeps running and its result is preserved across page navigation.
  topic: string;
  course: string; // ALL_COURSES or a course name
  loading: boolean;
  mindmap: GeneratedMindmap | null;
  setField: <K extends keyof MindmapState>(key: K, value: MindmapState[K]) => void;
  generate: () => Promise<void>;
}

export const useMindmapStore = create<MindmapState>((set, get) => ({
  topic: "",
  course: ALL_COURSES,
  loading: false,
  mindmap: null,
  setField: (key, value) => set({ [key]: value } as Partial<MindmapState>),
  generate: async () => {
    const { topic, course, loading } = get();
    if (loading) return;
    const trimmed = topic.trim();
    if (!trimmed) {
      toast.error("Enter a topic to generate a mind map");
      return;
    }
    set({ loading: true });
    try {
      const result = await api.generateMindmap(trimmed, course === ALL_COURSES ? null : course);
      if (!result.grounded || !result.text?.trim()) {
        toast.error("No grounded mind map could be generated for this topic");
        set({ mindmap: null });
        return;
      }
      set({ mindmap: result });
      toast.success("Mind map generated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to generate mind map");
    } finally {
      set({ loading: false });
    }
  },
}));
