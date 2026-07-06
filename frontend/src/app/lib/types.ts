export type DocStatus = "indexed" | "processing" | "failed";
export type DocType = "pdf" | "docx" | "markdown" | "text";

export interface Course {
  id: string;
  name: string;
  code: string;
  color: string;
  documents: number;
  flashcards: number;
  progress: number;
  systemPrompt?: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  type: DocType;
  course: string;
  sizeKb: number;
  pages: number;
  addedAt: string;
  status: DocStatus;
  jobId?: string;
}

export type SourceType = "text" | "ocr" | "table" | "image" | "diagram";

export interface Source {
  id: string;
  title: string;
  page: number;
  course: string;
  snippet: string;
  similarity: number;
  sourceType?: SourceType;
  imageUrl?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
  confidence?: number;
  streaming?: boolean;
}

export interface CourseStats {
  documents: number;
  flashcards: number;
  quizzes: number;
  notebooks: number;
  diagrams: number;
  mindmaps: number;
  whiteboards: number;
  difference_tables: number;
  revisions: number;
  concepts: number;
  total_artifacts: number;
  last_updated: string | null;
}

export interface WhiteboardItem {
  id: string;
  title: string;
  course: string;
  source: string; // manual | ai | imported | selection
  status: string; // draft | saved | archived
  thumbnail?: string | null;
  revisions: number;
  updated: string;
  createdAt: string;
  deletedAt?: string | null;
  documentId?: string | null;
  pageNumber?: number | null;
}

// ---- Reading-mode sticky notes (reading-annotations plugin) ----
export type NoteCategory = "insight" | "question" | "formula" | "confusing" | "general";

export interface NoteRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface StickyNote {
  id: string;
  document_id: string;
  page_number: number;
  bounding_box?: NoteRect | null;
  content: string;
  category: NoteCategory;
  created_at: string;
  updated_at: string;
}

// A full Excalidraw scene: { elements, appState, files }. Kept loosely typed
// so we don't couple to Excalidraw's internal element shapes.
export type WhiteboardScene = Record<string, any>;

export interface WhiteboardFull {
  id: string;
  title: string;
  course: string;
  scene: WhiteboardScene;
  thumbnail?: string | null;
  source: string;
  status: string;
  quality?: QualityScore;
  updated: string;
  createdAt: string;
  deletedAt?: string | null;
}

export interface WhiteboardRevision {
  id: string;
  whiteboardId: string;
  revisionNumber: number;
  changeSummary: string;
  scene: WhiteboardScene;
  createdAt: string;
}

export interface ArtifactItem {
  id: string;
  title: string;
  type: string;
  created_at: string;
  source_doc_title?: string;
}

// Objective artifact quality estimate (backend api/quality.py). Sub-scores are
// 0..100; dimensions that don't apply to an artifact are omitted.
export interface QualityScore {
  overall: number;
  coverage?: number;
  grounding?: number;
  structure?: number;
  balance?: number;
  diversity?: number;
  redundancy?: number;
  sourceChunks: number;
  documents: number;
  notes: string[];
}

export interface Flashcard {
  id: string;
  type: "basic" | "cloze";
  front: string;
  back: string;
  deck: string;
  due: string;
  ease: "new" | "learning" | "mastered";
  interval: number;
  sm2_ease: number;
}

export interface Deck {
  id: string;
  name: string;
  course: string;
  cards: number;
  mastered: number;
  color: string;
}

export interface QuizQuestion {
  id: string;
  type: "mcq" | "truefalse" | "short";
  prompt: string;
  options?: string[];
  answer: string;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  course: string;
  questions: QuizQuestion[];
  difficulty: "Easy" | "Medium" | "Hard";
  quality?: QualityScore;
  session_answers?: Record<string, string> | null;
  session_current_question?: number | null;
  session_started_at?: string | null;
}

export interface DiagramItem {
  id: string;
  title: string;
  course: string;
  kind: string;
  syntax: string;
  quality?: QualityScore;
}

export interface TopicNode {
  id: string;
  label: string;
  children?: TopicNode[];
  docId?: string;
}

export interface ActivityItem {
  id: string;
  kind: "ask" | "flashcard" | "quiz" | "document" | "diagram";
  text: string;
  time: string;
}

export interface PromptItem {
  id: number;
  category: string;
  name: string;
  style: string;
  body: string;
  built_in: boolean;
  active: boolean;
}

export interface GeneratedDifference {
  title: string;
  content: string;
  grounded: boolean;
  quality?: QualityScore;
}

export interface DifferenceTableItem {
  id: number;
  title: string;
  course: string;
  content: string;
  createdAt: string;
  quality?: QualityScore;
}
