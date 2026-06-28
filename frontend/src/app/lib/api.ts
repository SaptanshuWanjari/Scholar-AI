// Typed HTTP client for the ScholarCLI FastAPI backend.
// In dev, requests go to `/api/*` which Vite proxies to the backend
// (see vite.config.ts). Override with VITE_API_BASE_URL for production.

import type { ArtifactItem, Course, CourseStats, DiagramItem, DifferenceTableItem, DocumentItem, Flashcard, GeneratedDifference, QualityScore, Quiz, Source, PromptItem, WhiteboardItem, WhiteboardFull, WhiteboardRevision, WhiteboardScene } from "./types";
import { useLogStore } from "../stores/useLogStore";

const BASE: string = (import.meta as any).env?.VITE_API_BASE_URL ?? "";

export interface FlashcardSet {
  deck: string;
  course: string | null;
  grounded: boolean;
  cards: Flashcard[];
  quality?: QualityScore;
}

export interface GeneratedQuiz extends Quiz {
  grounded: boolean;
}

export interface GeneratedDiagram extends DiagramItem {
  grounded: boolean;
}

export interface GeneratedMindmap {
  id: string;
  title: string;
  course: string;
  text: string;
  grounded: boolean;
  quality?: QualityScore;
}

export interface GeneratedRevision {
  title: string;
  markdown: string;
  grounded: boolean;
  quality?: QualityScore;
}

export interface ArtifactRecommendation {
  artifact: "notes" | "flashcards" | "quiz" | "mindmap" | "diagram" | "difference";
  stars: number;
  reason: string;
}

export interface PromptAnalysis {
  score: number;
  label: "poor" | "fair" | "good" | "excellent";
  should_enhance: boolean;
  suggested_prompt: string | null;
  improvements: string[] | null;
}

export interface SavedRevision {
  id: string;
  title: string;
  topic: string;
  course: string;
  format: "notes" | "concepts" | "formulas" | "summary";
  content: string;
  quality?: QualityScore;
  timestamp: number;
}


// ---- Teach Me ----
export interface TeachOverview {
  title: string;
  markdown: string;
  grounded: boolean;
  sources: Source[];
}

export interface TeachDraft {
  session_id: string;
  title: string;
  draft_markdown: string;
  grounded: boolean;
  sources: Source[];
}

export interface TeachArtifacts {
  notes?: Record<string, unknown> | null;
  flashcards?: Record<string, unknown> | null;
  quiz?: Record<string, unknown> | null;
  mindmap?: Record<string, unknown> | null;
  diagram?: Record<string, unknown> | null;
  difference?: Record<string, unknown> | null;
}

export interface PackageMeta {
  id: string;
  title: string;
  course: string;
  depth: string;
  artifactCount: number;
  createdAt: string;
}

export interface PackageFull {
  id: string;
  title: string;
  course: string;
  depth: string;
  overview: { markdown?: string; grounded?: boolean };
  artifacts: Record<string, any>;
  sources: Source[];
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedSourcesOut {
  sources: Source[];
  total: number;
}

export interface SearchResult {
  id: string;
  group: string;
  title: string;
  snippet: string;
  course: string;
}

export interface DeckOut {
  id: string;
  name: string;
  course: string;
  color: string;
  cards: number;
  mastered: number;
  quality?: QualityScore;
}

export interface NotebookMeta {
  id: string;
  name: string;
  course: string;
  color: string;
  notes: number;
  lastEdited: string;
}

export interface NotebookFull {
  id: string;
  title: string;
  subtitle: string;
  course: string;
  color: string;
  blocks: any[];
  updated: string;
  is_draft: boolean;
}

export interface NotebookDeduplicateResponse {
  redundant: boolean;
  similarity: number;
  existing_block_index: number | null;
  flagged_content: string | null;
}

export interface NotebookAppendResponse {
  appended: boolean;
  redundant: boolean;
  similarity: number;
  existing_block_index: number | null;
  block_index: number | null;
}

export interface ReadingParagraph {
  text: string;
  page: number | null;
}

export interface ReadingSection {
  id: string;
  number: string;
  title: string;
  paragraphs: ReadingParagraph[];
}

export interface ReadingDoc {
  id: string;
  title: string;
  author: string;
  kind: string;
  pages: number;
  sections: ReadingSection[];
  highlights: {
    id: string;
    text: string;
    page_number: number;
    rects: { x: number; y: number; width: number; height: number }[];
  }[];
  bookmarks: { id: string; section: string; note: string }[];
  progress: number;
}

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

// ---- PYQ analysis ----
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

export interface KGNode {
  id: string;
  label: string;
  description: string;
  size: "large" | "medium" | "small";
  refCount: number;
  sourceCount: number;
  cluster: string;
  masteryStatus: "Unknown" | "Learning" | "Weak" | "Needs Revision" | "Mastered";
  masteryScore: number;
  importance: number;
  artifactCounts: { flashcards: number; whiteboards: number; revisions: number; packages: number };
  depConceptId: number | null;
}

export interface KGEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  edgeType?: "semantic" | "prerequisite";
  confidence?: number;
}

export interface KGGraph {
  nodes: KGNode[];
  edges: KGEdge[];
}

export interface DashboardData {
  metrics: { documents: number; flashcards: number; quizzesTaken: number; studySessions: number };
  studyActivity: { day: string; minutes: number; cards: number }[];
  recentSessions: { id: string; title: string; course: string; duration: string; date: string }[];
  activity: { id: string; kind: string; text: string; time: string }[];
  weakTopics: { id: string; topic: string; course: string; mastery: number }[];
  suggestedRevision: { id: string; topic: string; reason: string; course: string }[];
}

export interface Collection {
  id: string;
  name: string;
  count: number;
}

export interface KGSidebar {
  collections: { id: string; label: string; count: number }[];
  recentConcepts: string[];
  sourceFilters: string[];
}

export interface ConceptInspector {
  id: string;
  name: string;
  confidence: number;
  refCount: number;
  sourceCount: number;
  description: string;
  definition: string;
  aiSummary: string;
  relatedConcepts: string[];
  referencedIn: Record<string, number>;
  citations: { source: string; detail: string }[];
}

// ---- Concept Dependency Engine ----
export interface DepLink {
  id: string;
  name: string;
  difficulty: string;
  masteryStatus: string;
}

export interface DepConceptInspector {
  id: string;
  name: string;
  definition: string;
  difficulty: string;
  importance: number;
  estStudyTimeMin: number;
  depth: number;
  pyqFrequency: number;
  masteryStatus: string;
  masteryScore: number;
  prerequisites: DepLink[];
  dependents: DepLink[];
}

export interface ReadinessMissing {
  id: string;
  name: string;
  masteryStatus: string;
  reason: string;
}

export interface Readiness {
  concept: string | null;
  ready: boolean;
  missing: ReadinessMissing[];
}

// ---- Cross-artifact consistency ----
export interface ArtifactCoverage {
  artifact: string;
  coverage: number;
  covered: string[];
  weak: string[];
  missing: string[];
}

export interface ConsistencySuggestion {
  artifactType: string;
  label: string;
  issue: string;
  concepts: string[];
}

export interface ConsistencyReport {
  canonicalConcepts: string[];
  overallCoverage: number;
  artifacts: ArtifactCoverage[];
  underrepresented: string[];
  overrepresented: string[];
  recommendations: string[];
  suggestions?: ConsistencySuggestion[];
}

// ---- Chat history ----
export interface ChatSessionMeta {
  id: string;
  title: string;
  course: string;
  messageCount: number;
  updatedAt: string;
}

export interface ChatMessageRow {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources: Source[];
  createdAt: string;
}

export interface ChatSessionFull extends ChatSessionMeta {
  messages: ChatMessageRow[];
}

// ---- Background jobs ----
export interface JobItem {
  id: string;
  kind: string;
  status: "queued" | "running" | "done" | "failed";
  label: string;
  result: Record<string, any> | null;
  error: string | null;
  createdAt: string;
  updatedAt: string;
}

// ---- Prompt A/B experiments ----
// ---- Trace analytics ----
export interface TraceSourceStat {
  source: string;
  weakCount: number;
  downCount: number;
  total: number;
  avgSimilarity: number;
}

export interface TraceAnalytics {
  totalFlags: number;
  sources: TraceSourceStat[];
}

export interface AskResponse {
  id: string;
  role: "assistant";
  content: string;
  sources: Source[];
  confidence: number | null;
  grounded: boolean;
  route: string | null;
}

export interface TraceChunk {
  id: string;
  source: string;
  page: number;
  similarity: number;
  tokens: number;
  text: string;
}

export interface TraceData {
  query: string | null;
  route: string | null;
  grounded: boolean;
  embeddingModel: string;
  vectorStore: string;
  topK: number;
  documents: number;
  retrievedChunks: number;
  avgSimilarity: number;
  chunks: TraceChunk[];
}

export interface BackendSettings {
  fastModel: string;
  reasoningModel: string;
  embeddingModel: string;
  visionModel: string;
  temperature: number;
  topK: number;
  similarityThreshold: number;
  streaming: boolean;
  citationsInline: boolean;
  accent: string;
  density: string;
  industry: string;
  role: string;
  goals: string;
  interests: string;
  learningPreferences: string;
  ragMode: string;
  usePromptEnhancer: boolean;
  maxConcurrent: number;
}

export interface ModelsList {
  fastModels: string[];
  reasoningModels: string[];
  embeddingModels: string[];
  visionModels: string[];
}

// ---- Learning Path ----
export type ConceptStatus =
  | "not_started"
  | "in_progress"
  | "completed"
  | "needs_revision"
  | "weak_area";

export interface LearningPathConcept {
  title: string;
  summary: string;
  difficulty: string;
  estimatedMinutes: number;
  prerequisites: string[];
  unlocks: string[];
  status: ConceptStatus;
}

export interface LearningPathStage {
  title: string;
  summary: string;
  concepts: LearningPathConcept[];
}

export interface LearningPathOverview {
  difficulty: string;
  conceptCount: number;
  estimatedHours: number;
  studySessions: number;
  recommendedPace: string;
}

export interface NextRecommendation {
  conceptTitle: string;
  reason: string;
  estimatedMinutes: number;
}

export interface LearningProgress {
  conceptsDone: number;
  conceptsTotal: number;
  studyHoursDone: number;
  studyHoursTotal: number;
  percent: number;
}

export interface LearningAnalytics {
  strongestStage: string | null;
  weakestStage: string | null;
  mostRevisedTopic: string | null;
  highestMistakeTopic: string | null;
  conceptsSkipped: number;
  avgCompletionMinutes: number;
}

export interface LearningPath {
  id: string;
  title: string;
  course: string;
  document: string;
  overview: LearningPathOverview;
  stages: LearningPathStage[];
  sources: Source[];
  grounded: boolean;
  archived: boolean;
  nextRecommendation: NextRecommendation | null;
  progress: LearningProgress;
  analytics: LearningAnalytics;
  createdAt: string;
}

export interface LearningPathMeta {
  id: string;
  title: string;
  course: string;
  conceptCount: number;
  archived: boolean;
  createdAt: string;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, init);
  if (!res.ok) {
    let detail = res.statusText;
    try {
      const body = await res.json();
      detail = body.detail ?? detail;
    } catch {
      /* non-JSON error body */
    }
    useLogStore.getState().addLog("error", `API Error: ${path}`, detail);
    throw new Error(detail);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const fetcher = (url: string) => request<any>(url);

function json(body: unknown): RequestInit {
  return {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}

export const api = {
  // ---- Ask / chat ----
  ask(question: string, course?: string | null, document?: string | null, sessionId?: string | null, ragMode?: string, socratic?: boolean): Promise<AskResponse> {
    return request<AskResponse>("/api/ask", json({ question, course: course ?? null, document: document ?? null, sessionId: sessionId ?? null, rag_mode: ragMode ?? "fallback", socratic: socratic ?? false }));
  },

  /** Stream an answer token-by-token over SSE. Returns the final metadata. */
  async askStream(
    question: string,
    course: string | null | undefined,
    document: string | null | undefined,
    handlers: {
      onToken: (chunk: string) => void;
      onDone?: (meta: { sources: Source[]; confidence: number | null; grounded: boolean }) => void;
      onError?: (message: string) => void;
      signal?: AbortSignal;
    },
    sessionId?: string | null,
    ragMode?: string,
    socratic?: boolean,
  ): Promise<void> {
    const res = await fetch(`${BASE}/api/ask/stream`, {
      ...json({ question, course: course ?? null, document: document ?? null, sessionId: sessionId ?? null, rag_mode: ragMode ?? "fallback", socratic: socratic ?? false }),
      signal: handlers.signal,
    });
    if (!res.ok || !res.body) {
      const msg = `Request failed (${res.status})`;
      useLogStore.getState().addLog("error", `RAG/Generation Stream Error`, msg);
      handlers.onError?.(msg);
      return;
    }
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      let idx: number;
      while ((idx = buffer.indexOf("\n\n")) >= 0) {
        const raw = buffer.slice(0, idx);
        buffer = buffer.slice(idx + 2);
        const line = raw.split("\n").find((l) => l.startsWith("data:"));
        if (!line) continue;
        let evt: any;
        try {
          evt = JSON.parse(line.slice(5).trim());
        } catch {
          continue;
        }
        if (evt.type === "token") handlers.onToken(evt.value);
        else if (evt.type === "done")
          handlers.onDone?.({ sources: evt.sources, confidence: evt.confidence, grounded: evt.grounded });
        else if (evt.type === "error") {
          useLogStore.getState().addLog("error", `Generation Stream Error`, evt.value);
          handlers.onError?.(evt.value);
        }
      }
    }
  },

  // ---- Courses ----
  listCourses(): Promise<Course[]> {
    return request<Course[]>("/api/courses");
  },
  createCourse(name: string, systemPrompt?: string): Promise<Course> {
    return request<Course>("/api/courses", json({ name, systemPrompt }));
  },
  updateCourse(id: string, name: string, systemPrompt?: string): Promise<Course> {
    return request<Course>(`/api/courses/${id}`, { ...json({ name, systemPrompt }), method: "PUT" });
  },
  deleteCourse(id: string): Promise<void> {
    return request<void>(`/api/courses/${id}`, { method: "DELETE" });
  },
  getCourseStats(id: string): Promise<CourseStats> {
    return request<CourseStats>(`/api/courses/${id}/stats`);
  },
  getCourseArtifacts(id: string, type?: string): Promise<ArtifactItem[]> {
    const p = new URLSearchParams();
    if (type) p.set("type", type);
    const qs = p.toString();
    return request<ArtifactItem[]>(`/api/courses/${id}/artifacts${qs ? `?${qs}` : ""}`);
  },
  reindexCourse(id: string): Promise<{ id: string; kind: string; status: string; label: string }> {
    return request(`/api/courses/${id}/reindex`, { method: "POST" });
  },
  generateCoursePackage(id: string): Promise<PackageMeta> {
    return request<PackageMeta>(`/api/courses/${id}/package`, { method: "POST" });
  },

  // ---- Documents ----
  listDocuments(course?: string, search?: string): Promise<DocumentItem[]> {
    const p = new URLSearchParams();
    if (course && course !== "all") p.set("course", course);
    if (search) p.set("search", search);
    const qs = p.toString();
    return request<DocumentItem[]>(`/api/documents${qs ? `?${qs}` : ""}`);
  },
  uploadDocument(file: File, course?: string): Promise<DocumentItem> {
    const fd = new FormData();
    fd.append("file", file);
    if (course) fd.append("course", course);
    return request<DocumentItem>("/api/documents/upload", { method: "POST", body: fd });
  },
  updateDocument(id: string, course: string): Promise<DocumentItem> {
    return request<DocumentItem>(`/api/documents/${id}`, { ...json({ course }), method: "PATCH" });
  },
  deleteDocument(id: string): Promise<void> {
    return request<void>(`/api/documents/${id}`, { method: "DELETE" });
  },

  // ---- Sources / search ----
  searchSources(q: string, course?: string, limit = 5, offset = 0): Promise<PaginatedSourcesOut> {
    const p = new URLSearchParams({ q, limit: String(limit), offset: String(offset) });
    if (course && course !== "all") p.set("course", course);
    return request<PaginatedSourcesOut>(`/api/sources/search?${p.toString()}`);
  },

  // ---- Generative study features ----
  generateFlashcards(topic: string, course?: string | null, document?: string | null, count = 8, ragMode = "fallback"): Promise<FlashcardSet> {
    return request<FlashcardSet>("/api/flashcards/generate", json({ topic, course: course ?? null, document: document ?? null, count, rag_mode: ragMode }));
  },
  generateQuiz(
    topic: string,
    course?: string | null,
    document?: string | null,
    difficulty: "Easy" | "Medium" | "Hard" = "Medium",
    ragMode = "fallback",
  ): Promise<GeneratedQuiz> {
    return request<GeneratedQuiz>("/api/quizzes/generate", json({ topic, course: course ?? null, document: document ?? null, difficulty, rag_mode: ragMode }));
  },
  generateDiagram(topic: string, course?: string | null, document?: string | null, type?: string, ragMode = "fallback"): Promise<GeneratedDiagram> {
    return request<GeneratedDiagram>("/api/diagrams/generate", json({ topic, course: course ?? null, document: document ?? null, type, rag_mode: ragMode }));
  },
  listDiagrams(): Promise<DiagramItem[]> {
    return request<DiagramItem[]>("/api/diagrams");
  },
  deleteDiagram(id: string): Promise<void> {
    return request<void>(`/api/diagrams/${id}`, { method: "DELETE" });
  },
  generateMindmap(topic: string, course?: string | null, document?: string | null, ragMode = "fallback"): Promise<GeneratedMindmap> {
    return request<GeneratedMindmap>("/api/mindmaps/generate", json({ topic, course: course ?? null, document: document ?? null, rag_mode: ragMode }));
  },
  listMindmaps(): Promise<GeneratedMindmap[]> {
    return request<GeneratedMindmap[]>("/api/mindmaps");
  },
  deleteMindmap(id: string): Promise<void> {
    return request<void>(`/api/mindmaps/${id}`, { method: "DELETE" });
  },
  generateRevision(
    opts: { topic?: string; course?: string | null; document?: string | null; format: "notes" | "concepts" | "formulas" | "summary"; ragMode?: string },
  ): Promise<GeneratedRevision> {
    const { ragMode, ...rest } = opts;
    return request<GeneratedRevision>("/api/revision/generate", json({ ...rest, rag_mode: ragMode ?? "fallback" }));
  },
  async revisionStream(
    opts: { topic?: string; course?: string | null; document?: string | null; format: "notes" | "concepts" | "formulas" | "summary"; ragMode?: string },
    handlers: {
      onToken: (chunk: string) => void;
      onDone?: (meta: { grounded: boolean; title: string; quality?: QualityScore }) => void;
      onError?: (message: string) => void;
      signal?: AbortSignal;
    },
  ): Promise<void> {
    const { ragMode, ...restOpts } = opts;
    const res = await fetch(`${BASE}/api/revision/generate/stream`, {
      ...json({ ...restOpts, rag_mode: ragMode ?? "fallback" }),
      signal: handlers.signal,
    });
    if (!res.ok || !res.body) {
      const msg = `Request failed (${res.status})`;
      useLogStore.getState().addLog("error", `Revision Stream Error`, msg);
      handlers.onError?.(msg);
      return;
    }
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      let idx: number;
      while ((idx = buffer.indexOf("\n\n")) >= 0) {
        const raw = buffer.slice(0, idx);
        buffer = buffer.slice(idx + 2);
        const line = raw.split("\n").find((l) => l.startsWith("data:"));
        if (!line) continue;
        let evt: any;
        try { evt = JSON.parse(line.slice(5).trim()); } catch { continue; }
        if (evt.type === "token") handlers.onToken(evt.value);
        else if (evt.type === "done") handlers.onDone?.({ grounded: evt.grounded, title: evt.title ?? "", quality: evt.quality });
        else if (evt.type === "error") {
          useLogStore.getState().addLog("error", `Revision Generation Error`, evt.value);
          handlers.onError?.(evt.value);
        }
      }
    }
  },
  search(q: string, type = "all", course = "all", topic = "all"): Promise<SearchResult[]> {
    const p = new URLSearchParams({ q, type, course, topic });
    return request<SearchResult[]>(`/api/search?${p.toString()}`);
  },

  // ---- Revisions persistence ----
  listRevisions(): Promise<SavedRevision[]> {
    return request<SavedRevision[]>("/api/revisions");
  },
  saveRevision(rev: { title: string; topic: string; course?: string | null; format: string; content: string; quality?: QualityScore }): Promise<SavedRevision> {
    return request<SavedRevision>("/api/revisions", json(rev));
  },
  deleteRevision(id: string): Promise<void> {
    return request<void>(`/api/revisions/${id}`, { method: "DELETE" });
  },

  // ---- Decks / flashcard persistence ----
  listDecks(): Promise<DeckOut[]> {
    return request<DeckOut[]>("/api/decks");
  },
  saveDeck(name: string, course: string | null, cards: Flashcard[], color?: string, quality?: QualityScore): Promise<DeckOut> {
    return request<DeckOut>("/api/decks", json({ name, course, cards, color, quality }));
  },
  deleteDeck(id: string): Promise<void> {
    return request<void>(`/api/decks/${id}`, { method: "DELETE" });
  },
  listSavedFlashcards(deck?: string, course?: string): Promise<Flashcard[]> {
    const p = new URLSearchParams();
    if (deck) p.set("deck", deck);
    if (course) p.set("course", course);
    const qs = p.toString();
    return request<Flashcard[]>(`/api/flashcards${qs ? `?${qs}` : ""}`);
  },
  reviewCard(id: string, ease: "new" | "learning" | "mastered", due?: string): Promise<Flashcard> {
    return request<Flashcard>(`/api/flashcards/${id}`, { ...json({ ease, due }), method: "PUT" });
  },
  deleteCard(id: string): Promise<void> {
    return request<void>(`/api/flashcards/${id}`, { method: "DELETE" });
  },

  // ---- Saved quizzes ----
  listSavedQuizzes(): Promise<Quiz[]> {
    return request<Quiz[]>("/api/quizzes");
  },
  saveQuiz(quiz: { title: string; course?: string | null; difficulty: string; questions: Quiz["questions"]; quality?: QualityScore }): Promise<Quiz> {
    return request<Quiz>("/api/quizzes", json(quiz));
  },
  deleteQuiz(id: string): Promise<void> {
    return request<void>(`/api/quizzes/${id}`, { method: "DELETE" });
  },
  patchQuizSession(id: string, payload: { session_answers: Record<string, string>; session_current_question: number }): Promise<void> {
    return request<void>(`/api/quizzes/${id}/session`, { ...json(payload), method: "PATCH" });
  },
  clearQuizSession(id: string): Promise<void> {
    return request<void>(`/api/quizzes/${id}/session`, { method: "DELETE" });
  },

  // ---- Notebooks ----
  listNotebooks(): Promise<NotebookMeta[]> {
    return request<NotebookMeta[]>("/api/notebooks");
  },
  getNotebook(id: string): Promise<NotebookFull> {
    return request<NotebookFull>(`/api/notebooks/${id}`);
  },
  createNotebook(title: string, course?: string | null): Promise<NotebookFull> {
    return request<NotebookFull>("/api/notebooks", json({ title, course }));
  },
  updateNotebook(id: string, patch: { title?: string; subtitle?: string; blocks?: any[]; color?: string; is_draft?: boolean }): Promise<NotebookFull> {
    return request<NotebookFull>(`/api/notebooks/${id}`, { ...json(patch), method: "PUT" });
  },
  deleteNotebook(id: string): Promise<void> {
    return request<void>(`/api/notebooks/${id}`, { method: "DELETE" });
  },
  notebookAssist(action: "explain" | "summarize" | "improve", text: string, course?: string | null): Promise<{ text: string }> {
    return request<{ text: string }>("/api/notebooks/assist", json({ action, text, course: course ?? null }));
  },
  notebookDeduplicate(notebookId: number, text: string): Promise<NotebookDeduplicateResponse> {
    return request<NotebookDeduplicateResponse>("/api/notebooks/deduplicate", json({ notebook_id: notebookId, text }));
  },
  appendToNotebook(
    notebookId: string,
    markdownContent: string,
    artifactType: string,
    sourceId: string,
    force = false,
  ): Promise<NotebookAppendResponse> {
    return request<NotebookAppendResponse>(
      `/api/notebooks/${notebookId}/append`,
      json({ markdown_content: markdownContent, artifact_type: artifactType, source_id: sourceId, force }),
    );
  },

  // ---- Reading ----
  getReading(documentId: string): Promise<ReadingDoc> {
    return request<ReadingDoc>(`/api/reading/${documentId}`);
  },
  addHighlight(
    documentId: string,
    text: string,
    pageNumber: number,
    rects: { x: number; y: number; width: number; height: number }[]
  ): Promise<ReadingDoc> {
    return request<ReadingDoc>(`/api/reading/${documentId}/highlights`, json({ text, page_number: pageNumber, rects }));
  },
  addBookmark(documentId: string, section: string, note: string): Promise<ReadingDoc> {
    return request<ReadingDoc>(`/api/reading/${documentId}/bookmarks`, json({ section, note }));
  },
  readingLens(documentId: string, text: string, level: string): Promise<{ level: string; text: string }> {
    const p = new URLSearchParams({ text, level });
    return request<{ level: string; text: string }>(`/api/reading/${documentId}/lens?${p.toString()}`);
  },

  // ---- Exam ----
  generateExam(opts: { topic?: string; course?: string | null; document?: string | null; difficulty?: "Easy" | "Medium" | "Hard"; count?: number; types?: string[]; pyqCourse?: string | null; durationMinutes?: number }): Promise<ExamSession> {
    return request<ExamSession>("/api/exams/generate", json(opts));
  },
  submitExam(sessionId: string, answers: Record<string, string>, timeSpent?: number): Promise<ExamResult> {
    return request<ExamResult>(`/api/exams/${sessionId}/submit`, json({ answers, timeSpent }));
  },
  examStatus(sessionId: string): Promise<ExamStatus> {
    return request<ExamStatus>(`/api/exams/${sessionId}/status`);
  },

  // ---- PYQ analysis ----
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

  // ---- Knowledge graph ----
  buildKnowledgeGraph(course?: string | null, maxDocuments = 8): Promise<{ concepts: number; edges: number }> {
    return request<{ concepts: number; edges: number }>("/api/knowledge/build", json({ course, max_documents: maxDocuments }));
  },
  getKnowledgeGraph(course?: string | null): Promise<KGGraph> {
    const p = new URLSearchParams();
    if (course) p.set("course", course);
    const qs = p.toString();
    return request<KGGraph>(`/api/knowledge-graph${qs ? `?${qs}` : ""}`);
  },
  getConcept(id: string): Promise<ConceptInspector> {
    return request<ConceptInspector>(`/api/concepts/${id}`);
  },
  discoverConcepts(conceptId: string): Promise<string[]> {
    return request<string[]>(`/api/concepts/discover?conceptId=${conceptId}`);
  },
  mergeConcepts(keepId: number, dropId: number): Promise<ConceptInspector> {
    return request<ConceptInspector>("/api/concepts/merge", json({ keepId, dropId }));
  },
  deleteConcept(id: string): Promise<void> {
    return request<void>(`/api/concepts/${id}`, { method: "DELETE" });
  },

  // ---- Concept Dependency Engine ----
  buildDependencies(course?: string | null, maxDocuments = 8): Promise<{ concepts: number; edges: number }> {
    return request<{ concepts: number; edges: number }>("/api/dependencies/build", json({ course, max_documents: maxDocuments }));
  },
  getConceptDependencies(id: string): Promise<DepConceptInspector> {
    return request<DepConceptInspector>(`/api/dependencies/concept/${id}`);
  },
  resolveConceptDependencies(name: string, course?: string | null): Promise<DepConceptInspector> {
    const p = new URLSearchParams({ name });
    if (course) p.set("course", course);
    return request<DepConceptInspector>(`/api/dependencies/resolve?${p.toString()}`);
  },
  checkReadiness(topic: string, course?: string | null): Promise<Readiness> {
    const p = new URLSearchParams({ topic });
    if (course) p.set("course", course);
    return request<Readiness>(`/api/dependencies/readiness?${p.toString()}`);
  },

  // ---- Dashboard ----
  getDashboard(): Promise<DashboardData> {
    return request<DashboardData>("/api/dashboard");
  },

  // ---- Notebook side-panels ----
  listNotebookCollections(): Promise<Collection[]> {
    return request<Collection[]>("/api/notebooks/collections");
  },
  listNotebookTags(): Promise<string[]> {
    return request<string[]>("/api/notebooks/tags");
  },

  // ---- Knowledge graph side-panel ----
  getKnowledgeSidebar(course?: string | null): Promise<KGSidebar> {
    const p = new URLSearchParams();
    if (course) p.set("course", course);
    const qs = p.toString();
    return request<KGSidebar>(`/api/knowledge/sidebar${qs ? `?${qs}` : ""}`);
  },

  // ---- Trace ----
  getTrace(): Promise<TraceData> {
    return request<TraceData>("/api/trace/last");
  },

  // ---- Onboarding ----
  onboardingAnalysis(): Promise<import('./../context/OnboardingContext').OnboardingAnalysis> {
    return request<import('./../context/OnboardingContext').OnboardingAnalysis>("/api/onboarding/analysis");
  },

  // ---- Settings / models ----
  getSettings(): Promise<BackendSettings> {
    return request<BackendSettings>("/api/settings");
  },
  updateSettings(patch: Partial<BackendSettings>): Promise<BackendSettings> {
    return request<BackendSettings>("/api/settings", { ...json(patch), method: "PUT" });
  },
  listModels(): Promise<ModelsList> {
    return request<ModelsList>("/api/models/list");
  },
  listPromptCategories(): Promise<Array<{ key: string; label: string; description: string }>> {
    return request("/api/prompts/categories");
  },
  listPrompts(category?: string): Promise<PromptItem[]> {
    const q = category ? `?category=${category}` : "";
    return request<PromptItem[]>(`/api/prompts/${q}`);
  },
  createPrompt(body: { category: string; name: string; style: string; body: string }): Promise<PromptItem> {
    return request<PromptItem>("/api/prompts/", json(body));
  },
  activatePrompt(id: number): Promise<PromptItem> {
    return request<PromptItem>(`/api/prompts/${id}/activate`, { method: "PUT" });
  },
  deletePrompt(id: number): Promise<void> {
    return request<void>(`/api/prompts/${id}`, { method: "DELETE" });
  },
  generateDifference(topic: string, course?: string | null, document?: string | null): Promise<GeneratedDifference> {
    return request<GeneratedDifference>("/api/differences/generate", json({ topic, course: course ?? null, document: document ?? null }));
  },
  getDifferenceSuggestions(): Promise<string[]> {
    return request<string[]>("/api/differences/suggestions");
  },
  listDifferences(): Promise<DifferenceTableItem[]> {
    return request<DifferenceTableItem[]>("/api/differences");
  },
  saveDifference(title: string, content: string, course?: string | null, quality?: QualityScore): Promise<DifferenceTableItem> {
    return request<DifferenceTableItem>("/api/differences", json({ title, content, course: course ?? null, quality }));
  },
  deleteDifference(id: number): Promise<void> {
    return request<void>(`/api/differences/${id}`, { method: "DELETE" });
  },

  // ---- Artifact Recommendations ----
  recommendArtifacts(topic: string): Promise<ArtifactRecommendation[]> {
    return request<{ recommendations: ArtifactRecommendation[] }>("/api/artifacts/recommend", json({ topic }))
      .then((r) => r.recommendations);
  },

  // ---- Teach Me ----
  generateOverview(topic: string, depth: "quick" | "standard" | "deep" = "standard", course?: string | null, document?: string | null): Promise<TeachDraft> {
    return request<TeachDraft>("/api/teach/overview", json({ topic, depth, course: course ?? null, document: document ?? null }));
  },
  resumeTeach(sessionId: string, approvedNotes: string, artifactsToGenerate: string[]): Promise<TeachArtifacts> {
    return request<TeachArtifacts>(`/api/teach/${sessionId}/resume`, json({
      approved_notes_markdown: approvedNotes,
      artifacts_to_generate: artifactsToGenerate,
    }));
  },
  listPackages(): Promise<PackageMeta[]> {
    return request<PackageMeta[]>("/api/teach/packages");
  },
  getPackage(id: string): Promise<PackageFull> {
    return request<PackageFull>(`/api/teach/packages/${id}`);
  },
  savePackage(pkg: {
    title: string;
    course?: string | null;
    depth: string;
    overview: Record<string, any>;
    artifacts: Record<string, any>;
    sources: Source[];
  }): Promise<PackageFull> {
    return request<PackageFull>("/api/teach/packages", json(pkg));
  },
  deletePackage(id: string): Promise<void> {
    return request<void>(`/api/teach/packages/${id}`, { method: "DELETE" });
  },

  // ---- Cross-artifact consistency (analyze-only) ----
  analyzeConsistency(sourceText: string, artifacts: Record<string, any>): Promise<ConsistencyReport> {
    return request<ConsistencyReport>("/api/consistency/analyze", json({ sourceText, artifacts }));
  },
  analyzeLibraryConsistency(course: string, document?: string | null): Promise<ConsistencyReport> {
    return request<ConsistencyReport>("/api/consistency/library", json({ course, document: document ?? null }));
  },
  applyConsistencyFix(course: string, artifactType: string, concepts: string[]): Promise<{ applied: boolean; artifactType: string; preview: string; message: string }> {
    return request("/api/consistency/apply", json({ course, artifactType, concepts }));
  },

  // ---- Chat history ----
  listChatSessions(): Promise<ChatSessionMeta[]> {
    return request<ChatSessionMeta[]>("/api/chat/sessions");
  },
  createChatSession(course?: string | null, title?: string | null): Promise<ChatSessionMeta> {
    return request<ChatSessionMeta>("/api/chat/sessions", json({ course: course ?? null, title: title ?? null }));
  },
  getChatSession(id: string): Promise<ChatSessionFull> {
    return request<ChatSessionFull>(`/api/chat/sessions/${id}`);
  },
  deleteChatSession(id: string): Promise<void> {
    return request<void>(`/api/chat/sessions/${id}`, { method: "DELETE" });
  },

  // ---- Background jobs ----
  listJobs(): Promise<JobItem[]> {
    return request<JobItem[]>("/api/jobs");
  },
  getJob(id: string): Promise<JobItem> {
    return request<JobItem>(`/api/jobs/${id}`);
  },
  pollJobUntilDone(id: string, intervalMs = 1000): Promise<JobItem> {
    return new Promise((resolve, reject) => {
      const tick = () => {
        request<JobItem>(`/api/jobs/${id}`)
          .then((job) => {
            if (job.status === "done" || job.status === "failed") {
              resolve(job);
            } else {
              setTimeout(tick, intervalMs);
            }
          })
          .catch(reject);
      };
      tick();
    });
  },
  deleteJob(id: string): Promise<void> {
    return request<void>(`/api/jobs/${id}`, { method: "DELETE" });
  },


  // ---- Trace analytics ----
  getTraceAnalytics(): Promise<TraceAnalytics> {
    return request<TraceAnalytics>("/api/trace/analytics");
  },
  sendChunkFeedback(source: string, chunkId = "", query = "", similarity = 0): Promise<void> {
    return request<void>("/api/trace/feedback", json({ source, chunkId, query, similarity }));
  },

  // ---- Learning Path ----
  generateLearningPath(opts: { topic: string; course?: string | null; document?: string | null; ragMode?: string }): Promise<LearningPath> {
    return request<LearningPath>("/api/learning-paths/generate", json({
      topic: opts.topic,
      course: opts.course ?? null,
      document: opts.document ?? null,
      rag_mode: opts.ragMode ?? "fallback",
    }));
  },
  listLearningPaths(): Promise<LearningPathMeta[]> {
    return request<LearningPathMeta[]>("/api/learning-paths");
  },
  getLearningPath(id: string): Promise<LearningPath> {
    return request<LearningPath>(`/api/learning-paths/${id}`);
  },
  updateConceptStatus(id: string, conceptTitle: string, status: ConceptStatus): Promise<LearningPath> {
    return request<LearningPath>(`/api/learning-paths/${id}/concepts/${encodeURIComponent(conceptTitle)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  },
  archiveLearningPath(id: string, archived: boolean): Promise<LearningPath> {
    return request<LearningPath>(`/api/learning-paths/${id}/archive?archived=${archived}`, { method: "PATCH" });
  },
  deleteLearningPath(id: string): Promise<void> {
    return request<void>(`/api/learning-paths/${id}`, { method: "DELETE" });
  },

  // ---- Whiteboards (Excalidraw) ----
  listWhiteboards(course?: string | null): Promise<WhiteboardItem[]> {
    const p = new URLSearchParams();
    if (course && course !== "all") p.set("course", course);
    const qs = p.toString();
    return request<WhiteboardItem[]>(`/api/whiteboards${qs ? `?${qs}` : ""}`);
  },
  getWhiteboard(id: string): Promise<WhiteboardFull> {
    return request<WhiteboardFull>(`/api/whiteboards/${id}`);
  },
  createWhiteboard(data: { title: string; course?: string | null; scene?: WhiteboardScene; thumbnail?: string | null; source?: string }): Promise<WhiteboardFull> {
    return request<WhiteboardFull>("/api/whiteboards", json({
      title: data.title,
      course: data.course ?? null,
      scene: data.scene ?? {},
      thumbnail: data.thumbnail ?? null,
      source: data.source ?? "manual",
    }));
  },
  updateWhiteboard(id: string, patch: { title?: string; course?: string | null; scene?: WhiteboardScene; thumbnail?: string | null; status?: string }): Promise<WhiteboardFull> {
    return request<WhiteboardFull>(`/api/whiteboards/${id}`, { ...json(patch), method: "PUT" });
  },
  deleteWhiteboard(id: string): Promise<void> {
    return request<void>(`/api/whiteboards/${id}`, { method: "DELETE" });
  },
  listWhiteboardRevisions(id: string): Promise<WhiteboardRevision[]> {
    return request<WhiteboardRevision[]>(`/api/whiteboards/${id}/revisions`);
  },
  saveWhiteboardRevision(id: string, scene: WhiteboardScene, changeSummary = ""): Promise<WhiteboardRevision> {
    return request<WhiteboardRevision>(`/api/whiteboards/${id}/revisions`, json({ scene, change_summary: changeSummary }));
  },
  restoreWhiteboardRevision(id: string, revisionNumber: number): Promise<WhiteboardFull> {
    return request<WhiteboardFull>(`/api/whiteboards/${id}/restore/${revisionNumber}`, { method: "POST" });
  },
  generateWhiteboard(opts: { topic: string; course?: string | null; document?: string | null; type?: string; ragMode?: string }): Promise<{ title: string; mermaid: string; grounded: boolean }> {
    return request<{ title: string; mermaid: string; grounded: boolean }>("/api/whiteboards/generate", json({
      topic: opts.topic,
      course: opts.course ?? null,
      document: opts.document ?? null,
      type: opts.type ?? null,
      rag_mode: opts.ragMode ?? "fallback",
    }));
  },
  assistWhiteboard(action: "explain" | "expand", text: string, course?: string | null, document?: string | null): Promise<{ text: string; mermaid: string }> {
    return request<{ text: string; mermaid: string }>("/api/whiteboards/assist", json({ action, text, course: course ?? null, document: document ?? null }));
  },

  // ---- System ----
  checkSystemHealth(): Promise<{ reasoning: string, vision: string, embedding: string, ocr: string }> {
    return request<{ reasoning: string, vision: string, embedding: string, ocr: string }>("/api/system/health");
  },



  // ---- Prompt Enhancer ----
  analyzePrompt(topic: string, course?: string | null, route?: string | null): Promise<PromptAnalysis> {
    return request<PromptAnalysis>("/api/prompt/analyze", json({ topic, course: course ?? null, route: route ?? null }));
  },
};
