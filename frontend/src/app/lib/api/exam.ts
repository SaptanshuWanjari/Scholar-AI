import { request, json } from "./client";

// ---- Exam ----
export interface ExamQuestionOut {
  id: string;
  type: "mcq" | "truefalse" | "short" | "long";
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  prompt: string;
  options?: string[];
  answer?: string;
}

export interface ExamSession {
  sessionId: string;
  questions: ExamQuestionOut[];
  grounded: boolean;
  durationMinutes?: number;
  remainingSeconds?: number | null;
  submitted?: boolean;
}

export interface ExamStatus {
  sessionId: string;
  submitted: boolean;
  expired: boolean;
  durationMinutes: number;
  remainingSeconds: number | null;
}

export interface ExamResult {
  score: number;
  correct: number;
  total: number;
  topicPerformance: { topic: string; score: number }[];
  difficultyAnalysis: { level: string; correct: number; total: number }[];
  review: { id: string; prompt: string; given: string; expected: string; correct: boolean; topic: string }[];
  recommendedRevisions: string[];
  timedOut?: boolean;
}

export interface ExamListItem {
  sessionId: string;
  topic: string;
  course: string | null;
  questionCount: number;
  startedAt: string;
  submitted: boolean;
}

// ---- PYQ ----
export interface PyqPaper {
  id: number;
  course: string;
  title: string;
  year: number | null;
  questionCount: number;
  createdAt: string;
}

export interface PyqQuestion {
  id: number;
  text: string;
  topic: string;
  subtopics: string[];
  difficulty: string;
  type: string;
  marks: number | null;
  year: number | null;
}

export interface PyqTopicFreq {
  topic: string;
  occurrences: number;
  frequency: string;
  trend: string;
  importance: number;
  accuracy: number | null;
  styles: string[];
  subtopics: string[];
}

export interface PyqDifferenceSuggestion {
  a: string;
  b: string;
  topic: string;
  count: number;
  example: string;
}

export interface PyqPattern {
  type: string;
  label: string;
  pct: number;
  count: number;
  examples: string[];
}

export interface PyqYearTrend {
  topic: string;
  years: { year: number; count: number }[];
}

export interface PyqRevisionRisk {
  topic: string;
  occurrences: number;
  accuracy: number;
  risk: string;
  score: number;
}

export interface PyqAnalysis {
  course: string;
  papers: number;
  totalQuestions: number;
  yearsLabel: string;
  summary: {
    topicsIdentified?: number;
    recurringTopics?: number;
    questionTypes?: number;
    avgDifficulty?: string;
    coverage?: number;
    readiness?: number;
  };
  topicFrequency: PyqTopicFreq[];
  patterns: PyqPattern[];
  difficulty: { level: string; count: number }[];
  marksDistribution: { marks: number; count: number }[];
  yearTrends: PyqYearTrend[];
  revisionRisk: PyqRevisionRisk[];
  readiness: {
    coverage?: number;
    readiness?: number;
    weakTopics?: string[];
    strongTopics?: string[];
  };
}

export const examApi = {
  // ---- Exam ----
  generateExam(opts: { topic?: string; course?: string | null; document?: string | null; difficulty?: "Easy" | "Medium" | "Hard"; count?: number; types?: string[]; pyqCourse?: string | null; durationMinutes?: number }): Promise<ExamSession> {
    return request<ExamSession>("/api/exams/generate", json(opts));
  },
  listExams(): Promise<ExamListItem[]> {
    return request<ExamListItem[]>("/api/exams");
  },
  getExam(sessionId: string): Promise<ExamSession> {
    return request<ExamSession>(`/api/exams/${sessionId}`);
  },
  submitExam(sessionId: string, answers: Record<string, string>, timeSpent?: number): Promise<ExamResult> {
    return request<ExamResult>(`/api/exams/${sessionId}/submit`, json({ answers, timeSpent }));
  },
  examStatus(sessionId: string): Promise<ExamStatus> {
    return request<ExamStatus>(`/api/exams/${sessionId}/status`);
  },

  // ---- PYQ ----
  uploadPyqPaper(file: File, course: string, year?: number | null): Promise<{ paper: PyqPaper; extracted: number }> {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("course", course);
    if (year != null) fd.append("year", String(year));
    return request<{ paper: PyqPaper; extracted: number }>("/api/pyq/papers/upload", { method: "POST", body: fd });
  },
  listPyqPapers(course?: string): Promise<PyqPaper[]> {
    const p = new URLSearchParams();
    if (course && course !== "all") p.set("course", course);
    const qs = p.toString();
    return request<PyqPaper[]>(`/api/pyq/papers${qs ? `?${qs}` : ""}`);
  },
  deletePyqPaper(id: number): Promise<void> {
    return request<void>(`/api/pyq/papers/${id}`, { method: "DELETE" });
  },
  getPyqAnalysis(course: string): Promise<PyqAnalysis> {
    return request<PyqAnalysis>(`/api/pyq/analysis?course=${encodeURIComponent(course)}`);
  },
  listPyqQuestions(course: string, filters?: { year?: number; topic?: string; difficulty?: string; type?: string; q?: string }): Promise<PyqQuestion[]> {
    const p = new URLSearchParams({ course });
    if (filters?.year != null) p.set("year", String(filters.year));
    if (filters?.topic) p.set("topic", filters.topic);
    if (filters?.difficulty) p.set("difficulty", filters.difficulty);
    if (filters?.type) p.set("type", filters.type);
    if (filters?.q) p.set("q", filters.q);
    return request<PyqQuestion[]>(`/api/pyq/questions?${p.toString()}`);
  },
  getPyqDifferenceSuggestions(course: string): Promise<PyqDifferenceSuggestion[]> {
    return request<PyqDifferenceSuggestion[]>(`/api/pyq/difference-suggestions?course=${encodeURIComponent(course)}`);
  },
  patchPyqQuestion(id: number, patch: Partial<Omit<PyqQuestion, "id">>): Promise<PyqQuestion> {
    return request<PyqQuestion>(`/api/pyq/questions/${id}`, { ...json(patch), method: "PATCH" });
  },
  deletePyqQuestion(id: number): Promise<void> {
    return request<void>(`/api/pyq/questions/${id}`, { method: "DELETE" });
  },
  syncPyqToKG(course: string): Promise<{ created: number; updated: number }> {
    return request<{ created: number; updated: number }>(
      `/api/pyq/sync-knowledge-graph?course=${encodeURIComponent(course)}`,
      { method: "POST" }
    );
  },
};
