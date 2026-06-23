import { create } from "zustand";

interface KnowledgeBaseState {
  // Exploration/session state — kept in the store so the user's research
  // session (selected concept, search text, collection/filters, course filter,
  // panel layout) survives navigating away from the Knowledge page and back.
  // `graph`, `loading`, `building`, `courses` and `sidebar` deliberately stay
  // local in the component since they are re-fetched on mount.
  selectedId: string | null;
  drawerConceptId: string | null;
  searchQuery: string;
  activeCollection: string | null;
  course: string | null;
  leftCollapsed: boolean;
  rightCollapsed: boolean;
  // Stored as a plain array (not a Set) to keep it serializable/simple; the
  // component derives a Set locally where membership checks are needed.
  activeFilters: string[];
  // Whether the source-type filter defaults have been seeded for this session.
  // Lets `loadSidebar` apply "enable all filters" only on a fresh session and
  // never clobber a restored selection on remount.
  initializedFilters: boolean;
  setField: <K extends keyof KnowledgeBaseState>(key: K, value: KnowledgeBaseState[K]) => void;
  toggleFilter: (name: string) => void;
}

export const useKnowledgeBaseStore = create<KnowledgeBaseState>((set) => ({
  selectedId: null,
  drawerConceptId: null,
  searchQuery: "",
  activeCollection: null,
  course: null,
  leftCollapsed: false,
  rightCollapsed: false,
  activeFilters: [],
  initializedFilters: false,
  setField: (key, value) => set({ [key]: value } as Partial<KnowledgeBaseState>),
  toggleFilter: (name) =>
    set((state) => ({
      activeFilters: state.activeFilters.includes(name)
        ? state.activeFilters.filter((f) => f !== name)
        : [...state.activeFilters, name],
    })),
}));
