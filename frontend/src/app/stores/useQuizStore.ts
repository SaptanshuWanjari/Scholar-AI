import { create } from "zustand";
import { toast } from "sonner";
import type { Quiz } from "../lib/types";
import { api } from "../lib/api";

let _sessionTimer: ReturnType<typeof setTimeout> | null = null;

export type QuizStage = "builder" | "player" | "results";
export type Difficulty = Quiz["difficulty"];

const GROUNDED_ERROR =
  "Couldn't generate a grounded quiz — try a different topic or upload documents";

interface QuizState {
  // Flow state — lives in the store so it survives page navigation.
  stage: QuizStage;
  active: Quiz | null;
  // Player progress.
  idx: number;
  answers: Record<string, string>;
  // Generation flag — kept in the store, NOT the component, so an in-flight
  // generation keeps running and its result is preserved across unmount.
  generating: boolean;
  // Builder inputs — persisted so the user returns to the same selections.
  topic: string;
  course: string; // "all" or a course name
  document: string | null;
  difficulty: Difficulty;

  setField: <K extends keyof QuizState>(key: K, value: QuizState[K]) => void;
  generate: () => Promise<void>;
  start: (quiz: Quiz) => void;
  answer: (qid: string, value: string) => void;
  goTo: (idx: number) => void;
  submit: (answers: Record<string, string>) => void;
  backToBuilder: () => void;
  reset: () => void;
  restoreSession: (quiz: Quiz) => void;
}

export const useQuizStore = create<QuizState>((set, get) => ({
  stage: "builder",
  active: null,
  idx: 0,
  answers: {},
  generating: false,
  topic: "",
  course: "all",
  document: null,
  difficulty: "Medium",

  setField: (key, value) => set({ [key]: value } as Partial<QuizState>),

  generate: async () => {
    const { topic, course, document, difficulty, generating } = get();
    if (generating) return;
    const value = topic.trim();
    if (!value) return;

    set({ generating: true });
    try {
      const quiz = await api.generateQuiz(
        value,
        course === "all" ? null : course,
        document,
        difficulty,
      );
      if (!quiz.grounded || quiz.questions.length === 0) {
        toast.error(GROUNDED_ERROR);
        return;
      }
      set({ active: quiz, answers: {}, idx: 0, stage: "player" });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to generate quiz");
    } finally {
      set({ generating: false });
    }
  },

  start: (quiz) => set({ active: quiz, answers: {}, idx: 0, stage: "player" }),

  answer: (qid, value) => {
    set((s) => ({ answers: { ...s.answers, [qid]: value } }));
    const { active, idx } = get();
    if (active && !isNaN(Number(active.id))) {
      if (_sessionTimer) clearTimeout(_sessionTimer);
      _sessionTimer = setTimeout(() => {
        const { answers: latest, idx: currentIdx } = get();
        api.patchQuizSession(active.id, {
          session_answers: latest,
          session_current_question: currentIdx,
        }).catch(() => {});
      }, 2000);
    }
  },

  goTo: (idx) => set({ idx }),

  submit: (answers) => {
    const { active } = get();
    if (active && !isNaN(Number(active.id))) {
      if (_sessionTimer) clearTimeout(_sessionTimer);
      api.clearQuizSession(active.id).catch(() => {});
    }
    set({ answers, stage: "results" });
  },

  backToBuilder: () => set({ stage: "builder" }),

  reset: () => set({ stage: "builder", active: null, answers: {}, idx: 0 }),

  restoreSession: (quiz) => {
    set({
      active: quiz,
      answers: (quiz.session_answers as Record<string, string>) ?? {},
      idx: quiz.session_current_question ?? 0,
      stage: "player",
    });
  },
}));
