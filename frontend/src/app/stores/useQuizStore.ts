import { create } from "zustand";
import { toast } from "@/app/lib/toast";
import type { Quiz } from "../lib/types";
import { api } from "../lib/api";
import { usePromptEnhancerStore } from "./usePromptEnhancerStore";
import { useNotificationStore } from "./useNotificationStore";

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
  // Time limit selected in builder (minutes); null = untimed.
  timeLimit: number | null;
  // Absolute deadline timestamp (ms). Set at quiz start, cleared on submit/back.
  deadline: number | null;

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
  timeLimit: null,
  deadline: null,

  setField: (key, value) => set({ [key]: value } as Partial<QuizState>),

  generate: async () => {
    const { topic, course, document, difficulty, generating } = get();
    if (generating) return;
    const value = topic.trim();
    if (!value) return;

    const enhResult = await usePromptEnhancerStore.getState().analyze(value, course === "all" ? null : course, "quiz");
    if (enhResult.action === "edit") {
      set({ topic: enhResult.prompt });
      return;
    }
    if (enhResult.action === "use_suggested") {
      set({ topic: enhResult.prompt });
    }
    const finalTopic = get().topic.trim();

    set({ generating: true });
    try {
      const ragMode = (await import("./useSettingsStore")).useSettingsStore.getState().ragMode;
      const quiz = await api.generateQuiz(
        finalTopic,
        course === "all" ? null : course,
        document,
        difficulty,
        ragMode,
      );
      if (!quiz.grounded || quiz.questions.length === 0) {
        toast.error(GROUNDED_ERROR);
        useNotificationStore.getState().add({ title: "Quiz generation failed", status: "error", message: GROUNDED_ERROR });
        return;
      }
      const { timeLimit } = get();
      set({
        active: quiz,
        answers: {},
        idx: 0,
        stage: "player",
        deadline: timeLimit ? Date.now() + timeLimit * 60 * 1000 : null,
      });
      useNotificationStore.getState().add({ title: `Quiz ready — ${quiz.questions.length} questions`, status: "success" });
    } catch (e) {
      const errMsg = e instanceof Error ? e.message : "Failed to generate quiz";
      toast.error(errMsg);
      useNotificationStore.getState().add({ title: "Quiz generation failed", status: "error", message: errMsg });
    } finally {
      set({ generating: false });
    }
  },

  start: (quiz) => {
    const { timeLimit } = get();
    set({
      active: quiz,
      answers: {},
      idx: 0,
      stage: "player",
      deadline: timeLimit ? Date.now() + timeLimit * 60 * 1000 : null,
    });
  },

  answer: (qid, value) => {
    set((s) => ({ answers: { ...s.answers, [qid]: value } }));
    const { active, idx } = get();
    if (active) {
      if (_sessionTimer) clearTimeout(_sessionTimer);
      _sessionTimer = setTimeout(() => {
        const { answers: latest, idx: currentIdx } = get();
        api.patchQuizSession(active.id, {
          session_answers: latest,
          session_current_question: currentIdx,
        }).catch(() => {});
        _sessionTimer = null;
      }, 2000);
    }
  },

  goTo: (idx) => {
    set({ idx });
    const { active } = get();
    if (active) {
      if (_sessionTimer) clearTimeout(_sessionTimer);
      _sessionTimer = setTimeout(() => {
        const { answers: latest, idx: currentIdx } = get();
        api.patchQuizSession(active.id, {
          session_answers: latest,
          session_current_question: currentIdx,
        }).catch(() => {});
        _sessionTimer = null;
      }, 2000);
    }
  },

  submit: (answers) => {
    const { active } = get();
    if (_sessionTimer) {
      clearTimeout(_sessionTimer);
      _sessionTimer = null;
    }
    if (active) {
      api.clearQuizSession(active.id).catch(() => {});
    }
    set({ answers, stage: "results", deadline: null });
  },

  backToBuilder: () => {
    if (_sessionTimer) {
      clearTimeout(_sessionTimer);
      _sessionTimer = null;
    }
    set({ stage: "builder", deadline: null });
  },

  reset: () => {
    if (_sessionTimer) {
      clearTimeout(_sessionTimer);
      _sessionTimer = null;
    }
    set({ stage: "builder", active: null, answers: {}, idx: 0, deadline: null });
  },

  restoreSession: (quiz) => {
    set({
      active: quiz,
      answers: (quiz.session_answers as Record<string, string>) ?? {},
      idx: quiz.session_current_question ?? 0,
      stage: "player",
      deadline: null, // don't restore a timer for resumed sessions
    });
  },
}));
