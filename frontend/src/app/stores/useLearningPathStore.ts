import { create } from "zustand";
import { toast } from "sonner";
import {
  api,
  type LearningPath,
  type LearningPathMeta,
  type ConceptStatus,
} from "../lib/api";
import type { Course, DocumentItem } from "../lib/types";

interface LearningPathState {
  phase: "input" | "roadmap";
  topic: string;
  course: string; // "none" or course name
  document: string | null;

  courses: Course[];
  documents: DocumentItem[];
  _listsLoaded: boolean;

  generating: boolean;
  path: LearningPath | null;
  saved: LearningPathMeta[];

  setField: <K extends keyof LearningPathState>(key: K, value: LearningPathState[K]) => void;
  setCourse: (c: string) => void;
  setDocument: (d: string | null) => void;
  fetchCoursesAndDocs: () => void;
  fetchSaved: () => void;
  generate: () => Promise<void>;
  loadPath: (id: string) => Promise<void>;
  deletePath: (id: string) => Promise<void>;
  setConceptStatus: (conceptTitle: string, status: ConceptStatus) => Promise<void>;
  reset: () => void;
}

export const useLearningPathStore = create<LearningPathState>((set, get) => ({
  phase: "input",
  topic: "",
  course: "none",
  document: null,

  courses: [],
  documents: [],
  _listsLoaded: false,

  generating: false,
  path: null,
  saved: [],

  setField: (key, value) => set({ [key]: value } as Partial<LearningPathState>),
  setCourse: (c) => set({ course: c, document: null }),
  setDocument: (d) => set({ document: d }),

  fetchCoursesAndDocs: () => {
    if (get()._listsLoaded) return;
    Promise.all([api.listCourses(), api.listDocuments()])
      .then(([courses, documents]) => set({ courses, documents, _listsLoaded: true }))
      .catch(() => {});
  },

  fetchSaved: () => {
    api.listLearningPaths()
      .then((saved) => set({ saved }))
      .catch(() => {});
  },

  generate: async () => {
    const { topic, course, document } = get();
    const t = topic.trim();
    if (!t) {
      toast.error("Enter a topic to generate a learning path");
      return;
    }
    set({ generating: true });
    try {
      const path = await api.generateLearningPath({
        topic: t,
        course: course === "none" ? null : course,
        document,
      });
      set({ path, phase: "roadmap", generating: false });
      get().fetchSaved();
    } catch (err) {
      set({ generating: false });
      toast.error(err instanceof Error ? err.message : "Couldn't generate learning path");
    }
  },

  loadPath: async (id: string) => {
    set({ generating: true });
    try {
      const path = await api.getLearningPath(id);
      set({ path, phase: "roadmap", generating: false, topic: path.title });
    } catch (err) {
      set({ generating: false });
      toast.error(err instanceof Error ? err.message : "Couldn't load learning path");
    }
  },

  deletePath: async (id: string) => {
    try {
      await api.deleteLearningPath(id);
      set((s) => ({
        saved: s.saved.filter((p) => p.id !== id),
        path: s.path?.id === id ? null : s.path,
        phase: s.path?.id === id ? "input" : s.phase,
      }));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't delete learning path");
    }
  },

  setConceptStatus: async (conceptTitle: string, status: ConceptStatus) => {
    const { path } = get();
    if (!path) return;
    try {
      const updated = await api.updateConceptStatus(path.id, conceptTitle, status);
      set({ path: updated });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't update status");
    }
  },

  reset: () => set({ phase: "input", path: null, topic: "" }),
}));
