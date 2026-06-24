import { create } from "zustand";
import { toast } from "sonner";
import {
  api,
  type FlashcardSet,
  type GeneratedQuiz,
  type GeneratedDiagram,
  type GeneratedMindmap,
  type GeneratedRevision,
} from "../lib/api";
import type { GeneratedDifference, Source } from "../lib/types";

export type Depth = "quick" | "standard" | "deep";

// The lazily-generated artifacts (Overview + Sources are handled separately).
export type ArtifactKey = "notes" | "flashcards" | "quiz" | "mindmap" | "diagram" | "difference";

export type ViewKey = "overview" | ArtifactKey | "sources";

export const ARTIFACT_KEYS: ArtifactKey[] = [
  "notes",
  "flashcards",
  "quiz",
  "mindmap",
  "diagram",
  "difference",
];

interface ArtifactSlot {
  data: unknown | null;
  loading: boolean;
  error: string | null;
}

const emptySlot = (): ArtifactSlot => ({ data: null, loading: false, error: null });

function freshArtifacts(): Record<ArtifactKey, ArtifactSlot> {
  return {
    notes: emptySlot(),
    flashcards: emptySlot(),
    quiz: emptySlot(),
    mindmap: emptySlot(),
    diagram: emptySlot(),
    difference: emptySlot(),
  };
}

const DEPTH_COUNT: Record<Depth, number> = { quick: 6, standard: 8, deep: 12 };
const DEPTH_DIFFICULTY: Record<Depth, "Easy" | "Medium" | "Hard"> = {
  quick: "Easy",
  standard: "Medium",
  deep: "Hard",
};

interface TeachState {
  phase: "input" | "workspace";
  topic: string;
  depth: Depth;
  selected: Record<ArtifactKey, boolean>;

  packageId: string | null;
  activeView: ViewKey;

  overview: GeneratedRevision | null; // { title, markdown, grounded }
  overviewLoading: boolean;
  overviewError: string | null;
  sources: Source[];

  artifacts: Record<ArtifactKey, ArtifactSlot>;
  saving: boolean;

  setField: <K extends keyof TeachState>(key: K, value: TeachState[K]) => void;
  toggleArtifact: (key: ArtifactKey) => void;
  startGenerate: () => Promise<void>;
  openView: (view: ViewKey) => void;
  savePackage: () => Promise<void>;
  loadPackage: (id: string) => Promise<void>;
  reset: () => void;
}

export const useTeachStore = create<TeachState>((set, get) => ({
  phase: "input",
  topic: "",
  depth: "standard",
  selected: {
    notes: true,
    flashcards: true,
    quiz: true,
    mindmap: true,
    diagram: true,
    difference: true,
  },

  packageId: null,
  activeView: "overview",

  overview: null,
  overviewLoading: false,
  overviewError: null,
  sources: [],

  artifacts: freshArtifacts(),
  saving: false,

  setField: (key, value) => set({ [key]: value } as Partial<TeachState>),

  toggleArtifact: (key) =>
    set((s) => ({ selected: { ...s.selected, [key]: !s.selected[key] } })),

  startGenerate: async () => {
    const { topic, depth } = get();
    const trimmed = topic.trim();
    if (!trimmed) {
      toast.error("Enter a topic to teach");
      return;
    }
    set({
      phase: "workspace",
      activeView: "overview",
      packageId: null,
      overview: null,
      overviewError: null,
      overviewLoading: true,
      sources: [],
      artifacts: freshArtifacts(),
    });
    try {
      const result = await api.generateOverview(trimmed, depth);
      set({
        overview: { title: result.title, markdown: result.markdown, grounded: result.grounded },
        sources: result.sources,
      });
    } catch (err) {
      set({ overviewError: err instanceof Error ? err.message : "Failed to generate overview" });
    } finally {
      set({ overviewLoading: false });
    }
  },

  openView: (view) => {
    set({ activeView: view });
    if (view === "overview" || view === "sources") return;
    const { artifacts, selected } = get();
    const slot = artifacts[view];
    if (!selected[view] || slot.loading || slot.data) return;
    void generateArtifact(view, set, get);
  },

  savePackage: async () => {
    const { topic, depth, overview, sources, artifacts, saving } = get();
    if (saving) return;
    if (!overview) {
      toast.error("Nothing to save yet");
      return;
    }
    set({ saving: true });
    try {
      const artifactPayload: Record<string, unknown> = {};
      for (const key of ARTIFACT_KEYS) {
        if (artifacts[key].data) artifactPayload[key] = artifacts[key].data;
      }
      const saved = await api.savePackage({
        title: topic.trim(),
        depth,
        overview: { markdown: overview.markdown, grounded: overview.grounded },
        artifacts: artifactPayload,
        sources,
      });
      set({ packageId: saved.id });
      toast.success("Learning package saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save package");
    } finally {
      set({ saving: false });
    }
  },

  loadPackage: async (id) => {
    try {
      const pkg = await api.getPackage(id);
      const artifacts = freshArtifacts();
      const selected: Record<ArtifactKey, boolean> = {
        notes: false,
        flashcards: false,
        quiz: false,
        mindmap: false,
        diagram: false,
        difference: false,
      };
      for (const key of ARTIFACT_KEYS) {
        const data = pkg.artifacts?.[key];
        if (data) {
          artifacts[key] = { data, loading: false, error: null };
          selected[key] = true;
        }
      }
      set({
        phase: "workspace",
        topic: pkg.title,
        depth: (pkg.depth as Depth) || "standard",
        packageId: pkg.id,
        activeView: "overview",
        overview: {
          title: pkg.title,
          markdown: pkg.overview?.markdown ?? "",
          grounded: pkg.overview?.grounded ?? false,
        },
        overviewLoading: false,
        overviewError: null,
        sources: pkg.sources ?? [],
        artifacts,
        selected,
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to open package");
    }
  },

  reset: () =>
    set({
      phase: "input",
      packageId: null,
      activeView: "overview",
      overview: null,
      overviewLoading: false,
      overviewError: null,
      sources: [],
      artifacts: freshArtifacts(),
    }),
}));

// Generate a single artifact and store it in its slot. Kept outside the store
// object so openView/loadPackage can share it.
async function generateArtifact(
  key: ArtifactKey,
  set: (partial: Partial<TeachState> | ((s: TeachState) => Partial<TeachState>)) => void,
  get: () => TeachState,
): Promise<void> {
  const { topic, depth } = get();
  const t = topic.trim();
  const setSlot = (slot: Partial<ArtifactSlot>) =>
    set((s) => ({ artifacts: { ...s.artifacts, [key]: { ...s.artifacts[key], ...slot } } }));

  setSlot({ loading: true, error: null });
  try {
    let data: FlashcardSet | GeneratedQuiz | GeneratedDiagram | GeneratedMindmap | GeneratedRevision | GeneratedDifference;
    switch (key) {
      case "notes":
        data = await api.generateRevision({ topic: t, format: "notes" });
        break;
      case "flashcards":
        data = await api.generateFlashcards(t, null, null, DEPTH_COUNT[depth]);
        break;
      case "quiz":
        data = await api.generateQuiz(t, null, null, DEPTH_DIFFICULTY[depth]);
        break;
      case "mindmap":
        data = await api.generateMindmap(t);
        break;
      case "diagram":
        data = await api.generateDiagram(t);
        break;
      case "difference":
        data = await api.generateDifference(t);
        break;
    }
    setSlot({ data, loading: false });
  } catch (err) {
    setSlot({ loading: false, error: err instanceof Error ? err.message : "Generation failed" });
  }
}
