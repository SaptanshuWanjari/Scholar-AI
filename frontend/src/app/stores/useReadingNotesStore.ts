import { create } from "zustand";
import {
  Lightbulb,
  HelpCircle,
  Sigma,
  AlertTriangle,
  StickyNote as StickyNoteIcon,
  type LucideIcon,
} from "lucide-react";
import type { StickyNote, NoteCategory } from "../lib/types";

export interface CategoryMeta {
  label: string;
  emoji: string;
  icon: LucideIcon;
  /** badge / chip styling */
  chip: string;
  /** small dot / icon color */
  dot: string;
}

// Shared category config — used by the workspace pane composer, the notes
// list, and the PDF margin badges so styling stays consistent.
export const NOTE_CATEGORIES: Record<NoteCategory, CategoryMeta> = {
  insight: {
    label: "Insight",
    emoji: "💡",
    icon: Lightbulb,
    chip: "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
    dot: "text-amber-500",
  },
  question: {
    label: "Question",
    emoji: "❓",
    icon: HelpCircle,
    chip: "bg-violet-100 text-violet-800 border-violet-300 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-800",
    dot: "text-violet-500",
  },
  formula: {
    label: "Formula",
    emoji: "∑",
    icon: Sigma,
    chip: "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
    dot: "text-emerald-500",
  },
  confusing: {
    label: "Confusing",
    emoji: "⚠️",
    icon: AlertTriangle,
    chip: "bg-red-100 text-red-800 border-red-300 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800",
    dot: "text-red-500",
  },
  general: {
    label: "General",
    emoji: "📝",
    icon: StickyNoteIcon,
    chip: "bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800/60 dark:text-slate-300 dark:border-slate-700",
    dot: "text-slate-400",
  },
};

export const NOTE_CATEGORY_LIST = Object.keys(NOTE_CATEGORIES) as NoteCategory[];

interface ReadingNotesState {
  documentId: string | null;
  notes: StickyNote[];
  setNotes: (documentId: string, notes: StickyNote[]) => void;
  addNote: (note: StickyNote) => void;
  updateNote: (note: StickyNote) => void;
  removeNote: (noteId: string) => void;
  clear: () => void;
}

export const useReadingNotesStore = create<ReadingNotesState>((set) => ({
  documentId: null,
  notes: [],
  setNotes: (documentId, notes) => set({ documentId, notes }),
  addNote: (note) => set((s) => ({ notes: [...s.notes, note] })),
  updateNote: (note) =>
    set((s) => ({ notes: s.notes.map((n) => (n.id === note.id ? note : n)) })),
  removeNote: (noteId) => set((s) => ({ notes: s.notes.filter((n) => n.id !== noteId) })),
  clear: () => set({ documentId: null, notes: [] }),
}));
