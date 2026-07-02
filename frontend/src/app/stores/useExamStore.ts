import { create } from "zustand";
import { toast } from "@/app/lib/toast";
import { api, type ExamResult, type ExamSession } from "../lib/api";
import { useNotificationStore } from "./useNotificationStore";

export type ExamStage = "builder" | "session" | "results";

/** Generated questions arrive as the API `ExamQuestionOut` shape; it matches `ExamQuestion`. */
type GeneratedQuestion = ExamSession["questions"][number];

interface ExamState {
  // ---- Stage / session state (must survive navigation) ----
  stage: ExamStage;
  sessionId: string | null;
  questions: GeneratedQuestion[];
  answers: Record<string, string>;
  difficultyLabel: string;
  result: ExamResult | null;

  // ---- Progress within a session (so position resumes) ----
  idx: number;
  flagged: string[];
  visited: string[];
  /** Absolute epoch-ms timestamp at which the timer hits zero. Source of truth
   * for the countdown so navigating away and back resumes the correct remaining
   * time (the component derives seconds-left from this each render/tick). */
  deadline: number | null;

  // ---- In-flight flags ----
  generating: boolean;
  submitting: boolean;

  // ---- Builder inputs (kept here so selections survive navigation too) ----
  topic: string;
  course: string; // "all" or a course name
  document: string | null;
  difficulty: string;
  count: number;
  minutes: number;
  coverage: string;
  types: string[];
  /** When set, the backend mirrors this course's PYQ topic/difficulty mix and
   * records per-topic accuracy on submit. Seeded by the PYQ Analysis page. */
  pyqCourse: string | null;

  setField: <K extends keyof ExamState>(key: K, value: ExamState[K]) => void;
  answer: (qid: string, value: string) => void;
  toggleFlag: (qid: string) => void;
  goto: (i: number) => void;
  generate: () => Promise<void>;
  submit: () => Promise<void>;
  reset: () => void;
}

export const useExamStore = create<ExamState>((set, get) => ({
  stage: "builder",
  sessionId: null,
  questions: [],
  answers: {},
  difficultyLabel: "Adaptive",
  result: null,

  idx: 0,
  flagged: [],
  visited: [],
  deadline: null,

  generating: false,
  submitting: false,

  topic: "",
  course: "all",
  document: null,
  difficulty: "Adaptive",
  count: 8,
  minutes: 20,
  coverage: "Entire Course",
  types: ["mcq"],
  pyqCourse: null,

  setField: (key, value) => set({ [key]: value } as Partial<ExamState>),

  answer: (qid, value) =>
    set((s) => ({ answers: { ...s.answers, [qid]: value } })),

  toggleFlag: (qid) =>
    set((s) => ({
      flagged: s.flagged.includes(qid)
        ? s.flagged.filter((id) => id !== qid)
        : [...s.flagged, qid],
    })),

  goto: (i) =>
    set((s) => {
      const q = s.questions[i];
      if (!q) return {};
      return {
        idx: i,
        visited: s.visited.includes(q.id) ? s.visited : [...s.visited, q.id],
      };
    }),

  generate: async () => {
    const { generating, topic, course, document, difficulty, count, minutes, types, pyqCourse } = get();
    if (generating) return;
    set({ generating: true });
    try {
      const session = await api.generateExam({
        topic: topic.trim() || undefined,
        course: course === "all" ? null : course,
        document,
        // "Adaptive" is a UI-only option; the backend expects a concrete level.
        difficulty:
          difficulty === "Easy" || difficulty === "Medium" || difficulty === "Hard"
            ? difficulty
            : undefined,
        count,
        types,
        pyqCourse,
        durationMinutes: minutes,
      });
      if (!session.grounded || session.questions.length === 0) {
        const errMsg = "Couldn't generate a grounded exam from your materials. Try another topic or course.";
        toast.error(errMsg);
        useNotificationStore.getState().add({ title: "Exam generation failed", status: "error", message: errMsg });
        return;
      }
      const successMsg = `Generated ${session.questions.length} questions`;
      toast.success(successMsg);
      useNotificationStore.getState().add({ title: successMsg, status: "success" });
      set({
        sessionId: session.sessionId,
        questions: session.questions,
        difficultyLabel: difficulty,
        answers: {},
        result: null,
        idx: 0,
        flagged: [],
        visited: [session.questions[0].id],
        deadline: Date.now() + minutes * 60 * 1000,
        stage: "session",
      });
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Failed to generate exam";
      toast.error(errMsg);
      useNotificationStore.getState().add({ title: "Exam generation failed", status: "error", message: errMsg });
    } finally {
      set({ generating: false });
    }
  },

  submit: async () => {
    const { submitting, sessionId, answers, minutes, deadline } = get();
    if (submitting || !sessionId) return;
    set({ submitting: true });
    const totalSecs = minutes * 60;
    const secsLeft = deadline
      ? Math.max(0, Math.ceil((deadline - Date.now()) / 1000))
      : 0;
    const timeSpent = totalSecs - secsLeft;
    try {
      const result = await api.submitExam(sessionId, answers, timeSpent);
      set({ result, stage: "results", submitting: false });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit exam");
      set({ submitting: false });
    }
  },

  reset: () =>
    set({
      stage: "builder",
      sessionId: null,
      questions: [],
      answers: {},
      result: null,
      idx: 0,
      flagged: [],
      visited: [],
      deadline: null,
      submitting: false,
      generating: false,
      pyqCourse: null,
    }),
}));
