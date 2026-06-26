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
  difference_tables: number;
  revisions: number;
  concepts: number;
  total_artifacts: number;
  last_updated: string | null;
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
  mermaid: string;
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

export interface CodeExample {
  id: number;
  document_id: number;
  course: string;
  title: string;
  language: string;
  topic: string;
  difficulty: string;
  example_type: string;
  page_number: number;
  code: string;
  explanation: string;
  purpose: string;
  inputs: string;
  outputs: string;
  time_complexity: string;
  space_complexity: string;
  common_mistakes: string;
  important_notes: string;
  related_concepts: string[];
  used_in_quiz: boolean;
  used_in_pyq: boolean;
  created_at: string;
}
