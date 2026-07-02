import { create } from "zustand";
import { toast } from "@/app/lib/toast";
import { api } from "../lib/api";
import type { Course, DifferenceTableItem, DocumentItem, GeneratedDifference } from "../lib/types";
import { usePromptEnhancerStore } from "./usePromptEnhancerStore";
import { useNotificationStore } from "./useNotificationStore";

interface DifferencesState {
  topic: string;
  course: string;       // "none" or course name
  document: string | null;
  loading: boolean;
  output: GeneratedDifference | null;
  showRaw: boolean;
  suggestions: string[];
  saved: DifferenceTableItem[];
  courses: Course[];
  documents: DocumentItem[];
  _suggestionsLoaded: boolean;
  _listsLoaded: boolean;

  setTopic: (t: string) => void;
  setCourse: (c: string) => void;
  setDocument: (d: string | null) => void;
  setShowRaw: (v: boolean) => void;
  generate: () => Promise<void>;
  fetchSuggestions: () => void;
  fetchSaved: () => void;
  fetchCoursesAndDocs: () => void;
  saveTable: () => Promise<void>;
  deleteTable: (id: number) => Promise<void>;
  loadSaved: (item: DifferenceTableItem) => void;
}

export const useDifferencesStore = create<DifferencesState>((set, get) => ({
  topic: "",
  course: "none",
  document: null,
  loading: false,
  output: null,
  showRaw: false,
  suggestions: [],
  saved: [],
  courses: [],
  documents: [],
  _suggestionsLoaded: false,
  _listsLoaded: false,

  setTopic: (t) => set({ topic: t }),
  setCourse: (c) => set({ course: c, document: null }),
  setDocument: (d) => set({ document: d }),
  setShowRaw: (v) => set({ showRaw: v }),

  fetchSuggestions: () => {
    if (get()._suggestionsLoaded) return;
    api
      .getDifferenceSuggestions()
      .then((s) => set({ suggestions: s, _suggestionsLoaded: true }))
      .catch(() => {});
  },

  fetchSaved: () => {
    api
      .listDifferences()
      .then((s) => set({ saved: s }))
      .catch(() => {});
  },

  fetchCoursesAndDocs: () => {
    if (get()._listsLoaded) return;
    Promise.all([api.listCourses(), api.listDocuments()])
      .then(([courses, documents]) => set({ courses, documents, _listsLoaded: true }))
      .catch(() => {});
  },

  generate: async () => {
    const { topic, course, document, loading } = get();
    const t = topic.trim();
    if (!t || loading) return;
    const selectedCourse = course === "none" ? null : course;
    const enhResult = await usePromptEnhancerStore.getState().analyze(t, selectedCourse, "differences");
    if (enhResult.action === "edit") {
      set({ topic: enhResult.prompt });
      return;
    }
    if (enhResult.action === "use_suggested") {
      set({ topic: enhResult.prompt });
    }
    const finalTopic = get().topic.trim();
    set({ loading: true, output: null });
    try {
      const result = await api.generateDifference(finalTopic, selectedCourse, document);
      set({ output: result });
      useNotificationStore.getState().add({ title: "Comparison table generated", status: "success" });
    } catch {
      toast.error("Failed to generate comparison");
      useNotificationStore.getState().add({ title: "Comparison generation failed", status: "error" });
    } finally {
      set({ loading: false });
    }
  },

  saveTable: async () => {
    const { output, course } = get();
    if (!output) return;
    const selectedCourse = course === "none" ? null : course;
    try {
      const item = await api.saveDifference(output.title, output.content, selectedCourse, output.quality);
      set({ saved: [item, ...get().saved] });
      toast.success("Saved");
    } catch {
      toast.error("Failed to save");
    }
  },

  deleteTable: async (id) => {
    try {
      await api.deleteDifference(id);
      set({ saved: get().saved.filter((s) => s.id !== id) });
      toast.success("Deleted");
    } catch {
      toast.error("Failed to delete");
    }
  },

  loadSaved: (item) => {
    set({
      output: { title: item.title, content: item.content, grounded: true, quality: item.quality },
      topic: item.title,
    });
  },
}));
