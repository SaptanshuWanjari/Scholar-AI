import type { QualityScore, Source } from "../types";
import { request, json } from "./client";

// ---- Knowledge Graph ----
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

// ---- Learning Path ----
export type ConceptStatus = "not_started" | "in_progress" | "completed" | "needs_revision" | "weak_area";

export interface LearningPathConcept {
  title: string;
  summary: string;
  difficulty: string;
  estimatedMinutes: number;
  prerequisites: string[];
  unlocks: string[];
  status: ConceptStatus;
  masteryStatus?: string;
  depConceptId?: string;
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

// ---- Dashboard ----
export interface DashboardData {
  metrics: { documents: number; flashcards: number; flashcardsDue: number; quizzesTaken: number; studySessions: number };
  studyActivity: { day: string; minutes: number; cards: number }[];
  recentSessions: { id: string; title: string; course: string; duration: string; date: string }[];
  recentArtifacts: { id: string; title: string; type: string; url: string; time: string }[];
  activity: { id: string; kind: string; text: string; time: string }[];
  weakTopics: { id: string; topic: string; course: string; mastery: number }[];
  suggestedRevision: { id: string; topic: string; reason: string; course: string }[];
  recentBookmarks: { id: string; section: string; note: string; docTitle: string; docId: string }[];
}

export const knowledgeApi = {
  // ---- Dashboard ----
  getDashboard(): Promise<DashboardData> {
    return request<DashboardData>("/api/dashboard");
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
  getKnowledgeSidebar(course?: string | null): Promise<KGSidebar> {
    const p = new URLSearchParams();
    if (course) p.set("course", course);
    const qs = p.toString();
    return request<KGSidebar>(`/api/knowledge/sidebar${qs ? `?${qs}` : ""}`);
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
};
