import { create } from "zustand";

export type OutlineEntry = { blockId: string; level: number; text: string; page: number };

interface NotebookV2UIState {
  notebookId: string | null;
  title: string;
  subtitle: string;
  sidebarOpen: boolean;
  readingMode: boolean;
  spreadIndex: number;
  outline: OutlineEntry[];
  setNotebookMeta: (m: { id: string; title: string; subtitle?: string }) => void;
  toggleSidebar: () => void;
  setReadingMode: (b: boolean) => void;
  setSpreadIndex: (n: number) => void;
  setOutline: (o: OutlineEntry[]) => void;
}

export const useNotebookV2Store = create<NotebookV2UIState>((set) => ({
  notebookId: null,
  title: "",
  subtitle: "",
  sidebarOpen: true,
  readingMode: false,
  spreadIndex: 0,
  outline: [],
  setNotebookMeta: ({ id, title, subtitle }) =>
    set({ notebookId: id, title, subtitle: subtitle ?? "" }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setReadingMode: (b) => set({ readingMode: b }),
  setSpreadIndex: (n) => set({ spreadIndex: Math.max(0, n) }),
  setOutline: (o) => set({ outline: o }),
}));
