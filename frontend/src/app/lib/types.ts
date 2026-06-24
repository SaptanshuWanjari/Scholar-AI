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
}

export interface Source {
  id: string;
  title: string;
  page: number;
  course: string;
  snippet: string;
  similarity: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
  confidence?: number;
  streaming?: boolean;
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
}

export interface DiagramItem {
  id: string;
  title: string;
  course: string;
  kind: string;
  mermaid: string;
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
}

export interface DifferenceTableItem {
  id: number;
  title: string;
  course: string;
  content: string;
  createdAt: string;
}
