import { create } from "zustand";
import { toast } from "sonner";
import { api, type PyqAnalysis, type PyqDifferenceSuggestion, type PyqPaper, type PyqQuestion } from "../lib/api";
import { useNotificationStore } from "./useNotificationStore";

export interface PyqFilters {
  year?: number;
  topic?: string;
  difficulty?: string;
  type?: string;
  q?: string;
}

interface PyqState {
  course: string; // selected course (never "all" — analysis is per-course)
  analysis: PyqAnalysis | null;
  papers: PyqPaper[];
  questions: PyqQuestion[];
  differences: PyqDifferenceSuggestion[];
  filters: PyqFilters;

  // UI
  selectedTopic: string | null;
  selectedPattern: string | null;

  // in-flight
  loading: boolean;
  uploading: boolean;

  setField: <K extends keyof PyqState>(key: K, value: PyqState[K]) => void;
  setFilter: <K extends keyof PyqFilters>(key: K, value: PyqFilters[K]) => void;
  selectCourse: (course: string) => Promise<void>;
  refresh: () => Promise<void>;
  fetchQuestions: () => Promise<void>;
  uploadPaper: (file: File, year?: number | null) => Promise<void>;
  deletePaper: (id: number) => Promise<void>;
  updateQuestion: (id: number, patch: Partial<Omit<PyqQuestion, 'id'>>) => Promise<void>;
  deleteQuestion: (id: number) => Promise<void>;
  syncToKG: () => Promise<{ created: number; updated: number } | undefined>;
}

export const usePyqStore = create<PyqState>((set, get) => ({
  course: "",
  analysis: null,
  papers: [],
  questions: [],
  differences: [],
  filters: {},
  selectedTopic: null,
  selectedPattern: null,
  loading: false,
  uploading: false,

  setField: (key, value) => set({ [key]: value } as Partial<PyqState>),
  setFilter: (key, value) =>
    set((s) => ({ filters: { ...s.filters, [key]: value || undefined } })),

  selectCourse: async (course) => {
    set({ course, analysis: null, papers: [], questions: [], differences: [], filters: {}, selectedTopic: null, selectedPattern: null });
    if (course) await get().refresh();
  },

  refresh: async () => {
    const { course } = get();
    if (!course) return;
    set({ loading: true });
    try {
      const [analysis, papers, differences] = await Promise.all([
        api.getPyqAnalysis(course),
        api.listPyqPapers(course),
        api.getPyqDifferenceSuggestions(course),
      ]);
      set({ analysis, papers, differences });
      await get().fetchQuestions();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load PYQ analysis");
    } finally {
      set({ loading: false });
    }
  },

  fetchQuestions: async () => {
    const { course, filters } = get();
    if (!course) return;
    try {
      const questions = await api.listPyqQuestions(course, filters);
      set({ questions });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load questions");
    }
  },

  uploadPaper: async (file, year) => {
    const { course } = get();
    if (!course) {
      toast.error("Select a course first");
      return;
    }
    set({ uploading: true });
    try {
      const res = await api.uploadPyqPaper(file, course, year);
      const successMsg = `Extracted ${res.extracted} questions from ${res.paper.title}`;
      toast.success(successMsg);
      useNotificationStore.getState().add({ title: successMsg, status: "success" });
      await get().refresh();
    } catch (e) {
      const errMsg = e instanceof Error ? e.message : "Upload failed";
      toast.error(errMsg);
      useNotificationStore.getState().add({ title: "PYQ upload failed", status: "error", message: errMsg });
    } finally {
      set({ uploading: false });
    }
  },

  deletePaper: async (id) => {
    try {
      await api.deletePyqPaper(id);
      toast.success("Paper removed");
      await get().refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to delete paper");
    }
  },

  updateQuestion: async (id, patch) => {
    try {
      const updated = await api.patchPyqQuestion(id, patch);
      set((s) => ({ questions: s.questions.map((q) => (q.id === id ? updated : q)) }));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to update question");
    }
  },

  deleteQuestion: async (id) => {
    try {
      await api.deletePyqQuestion(id);
      set((s) => ({ questions: s.questions.filter((q) => q.id !== id) }));
      toast.success("Question removed");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to delete question");
    }
  },

  syncToKG: async () => {
    const { course } = get();
    if (!course) return undefined;
    try {
      return await api.syncPyqToKG(course);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to sync to knowledge graph");
      return undefined;
    }
  },
}));
