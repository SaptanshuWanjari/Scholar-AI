// Typed HTTP client for the ScholarCLI FastAPI backend.
// Domain-split modules — import { api } from "../lib/api".
// In dev, requests go to `/api/*` which Vite proxies to the backend
// (see vite.config.ts). Override with VITE_API_BASE_URL for production.

export { request, fetcher, BASE } from "./client";
export type * from "./client";

export { coursesApi, type ArtifactRecommendation } from "./courses";
export { documentsApi, type PaginatedSourcesOut, type SearchResult } from "./documents";
export { askApi, type AskResponse, type TraceData, type TraceChunk, type TraceAnalytics, type TraceSourceStat, type ChatSessionMeta, type ChatMessageRow, type ChatSessionFull } from "./ask";
export { studyApi, type FlashcardSet, type DeckOut, type SavedRevision, type GeneratedQuiz, type GeneratedDiagram, type GeneratedMindmap, type GeneratedRevision } from "./study";
export { notebooksApi, type NotebookMeta, type NotebookFull, type NotebookDeduplicateResponse, type NotebookAppendResponse, type Collection, type ReadingDoc, type ReadingSection, type ReadingParagraph } from "./notebooks";
export { examApi, type ExamQuestionOut, type ExamSession, type ExamStatus, type ExamResult, type PyqPaper, type PyqQuestion, type PyqTopicFreq, type PyqDifferenceSuggestion, type PyqPattern, type PyqYearTrend, type PyqRevisionRisk, type PyqAnalysis } from "./exam";
export { knowledgeApi, type DashboardData, type KGNode, type KGEdge, type KGGraph, type KGSidebar, type ConceptInspector, type DepLink, type DepConceptInspector, type ReadinessMissing, type Readiness, type ConceptStatus, type LearningPathConcept, type LearningPathStage, type LearningPathOverview, type NextRecommendation, type LearningProgress, type LearningAnalytics, type LearningPath, type LearningPathMeta } from "./knowledge";
export { whiteboardsApi } from "./whiteboards";
export { teachApi, type TeachOverview, type TeachDraft, type TeachArtifacts, type PackageMeta, type PackageFull, type ArtifactCoverage, type ConsistencySuggestion, type ConsistencyReport } from "./teach";
export { systemApi, type BackendSettings, type ModelsList, type HealthStatus, type PromptAnalysis, type JobItem } from "./system";

import { coursesApi } from "./courses";
import { documentsApi } from "./documents";
import { askApi } from "./ask";
import { studyApi } from "./study";
import { notebooksApi } from "./notebooks";
import { examApi } from "./exam";
import { knowledgeApi } from "./knowledge";
import { whiteboardsApi } from "./whiteboards";
import { teachApi } from "./teach";
import { systemApi } from "./system";

export const api = {
  ...coursesApi,
  ...documentsApi,
  ...askApi,
  ...studyApi,
  ...notebooksApi,
  ...examApi,
  ...knowledgeApi,
  ...whiteboardsApi,
  ...teachApi,
  ...systemApi,
};
