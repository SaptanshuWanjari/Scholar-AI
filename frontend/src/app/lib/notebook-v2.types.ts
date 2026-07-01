/**
 * Notebook V2 — Type definitions
 *
 * Extends the existing NotebookBlock union with:
 *  - Per-block unique `id`
 *  - Per-block `metadata` (collapse state, sticky notes)
 *  - Page-level grouping
 *  - Notebook-level container with multi-page support
 */

// ────────────────────────────────────────────────
// Sticky Note (child of a block)
// ────────────────────────────────────────────────

export type StickyColor = "yellow" | "pink" | "green" | "blue" | "purple";

export interface StickyNoteData {
  id: string;
  text: string;
  color: StickyColor;
  createdAt: string;
}

// ────────────────────────────────────────────────
// Block types
// ────────────────────────────────────────────────

export type V2BlockType =
  | "text"
  | "heading"
  | "ai-answer"
  | "code"
  | "callout"
  | "mermaid"
  | "table"
  | "whiteboard"
  | "image"
  | "flashdeck"
  | "quiz-results";

/** Payload shapes keyed by block type */
export interface BlockPayloads {
  heading: { level: 1 | 2 | 3; text: string };
  text: { text: string; source?: { type: string; id: string } };
  callout: { tone: "note" | "warning" | "insight"; text: string };
  code: { lang: string; code: string };
  "ai-answer": {
    question: string;
    answer: string;
    confidence: number;
    sources: number;
  };
  mermaid: { code: string };
  table: { headers: string[]; rows: string[][] };
  whiteboard: { whiteboardId: string; title: string; thumbnail?: string };
  image: { url: string; alt?: string; width?: number; height?: number };
  flashdeck: {
    name: string;
    count: number;
    cards: { front: string; back: string }[];
  };
  "quiz-results": { title: string; score: number; total: number };
}

export interface V2BlockMeta {
  isCollapsed: boolean;
  stickyNotes: StickyNoteData[];
}

export interface V2Block<T extends V2BlockType = V2BlockType> {
  id: string;
  type: T;
  content: T extends keyof BlockPayloads ? BlockPayloads[T] : never;
  metadata: V2BlockMeta;
}

// ────────────────────────────────────────────────
// Page
// ────────────────────────────────────────────────

export interface V2Page {
  id: string;
  title: string;
  blocks: V2Block[];
}

// ────────────────────────────────────────────────
// Notebook
// ────────────────────────────────────────────────

export interface V2NotebookMeta {
  course?: string;
  color: string;
  createdAt: string;
  updatedAt: string;
  wordCount: number;
  isDraft: boolean;
}

export interface V2Notebook {
  id: string;
  title: string;
  subtitle?: string;
  metadata: V2NotebookMeta;
  pages: V2Page[];
}

// ────────────────────────────────────────────────
// Outline (derived, not stored)
// ────────────────────────────────────────────────

export interface OutlineEntry {
  pageId: string;
  pageTitle: string;
  headings: { blockId: string; level: number; text: string }[];
}
