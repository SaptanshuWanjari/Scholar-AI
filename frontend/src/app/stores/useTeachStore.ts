import { create } from "zustand";
import { toast } from "sonner";
import {
  api,
  type FlashcardSet,
  type GeneratedQuiz,
  type GeneratedDiagram,
  type GeneratedMindmap,
  type GeneratedRevision,
  type ConsistencyReport,
  type ArtifactRecommendation,
} from "../lib/api";
import type { GeneratedDifference, Source, Course, DocumentItem } from "../lib/types";
import { usePromptEnhancerStore } from "./usePromptEnhancerStore";

export type Depth = "quick" | "standard" | "deep";

// The lazily-generated artifacts (Overview + Sources are handled separately).
export type ArtifactKey = "notes" | "flashcards" | "quiz" | "mindmap" | "diagram" | "difference";

export type ViewKey = "overview" | ArtifactKey | "sources" | "consistency";

export type SlotStatus = "idle" | "queued" | "loading" | "done" | "error";

export const ARTIFACT_KEYS: ArtifactKey[] = [
  "notes",
  "flashcards",
  "quiz",
  "mindmap",
  "diagram",
  "difference",
];

interface ArtifactSlot {
  status: SlotStatus;
  data: unknown | null;
  error: string | null;
}

const idleSlot = (): ArtifactSlot => ({ status: "idle", data: null, error: null });

function freshArtifacts(): Record<ArtifactKey, ArtifactSlot> {
  return {
    notes: idleSlot(),
    flashcards: idleSlot(),
    quiz: idleSlot(),
    mindmap: idleSlot(),
    diagram: idleSlot(),
    difference: idleSlot(),
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
  course: string;
  document: string | null;
  selected: Record<ArtifactKey, boolean>;

  courses: Course[];
  documents: DocumentItem[];
  _listsLoaded: boolean;

  packageId: string | null;
  pkgCourse: string;
  activeView: ViewKey;

  overview: GeneratedRevision | null; // { title, markdown, grounded }
  overviewStatus: SlotStatus;
  sources: Source[];

  artifacts: Record<ArtifactKey, ArtifactSlot>;

  // Cross-artifact consistency analysis (on-demand).
  consistency: ConsistencyReport | null;
  consistencyStatus: SlotStatus;

  // Artifact recommendations from AI.
  recommendations: Record<ArtifactKey, ArtifactRecommendation> | null;
  recommendationsLoading: boolean;

  // Live progress for the "what's generating now" UI.
  generating: boolean;
  currentTask: ViewKey | null;

  saving: boolean;

  setField: <K extends keyof TeachState>(key: K, value: TeachState[K]) => void;
  toggleArtifact: (key: ArtifactKey) => void;
  fetchRecommendations: (topic: string) => Promise<void>;
  applyRecommendations: () => void;
  selectAll: () => void;
  clearSelection: () => void;
  startGenerate: () => Promise<void>;
  retryArtifact: (key: ArtifactKey) => Promise<void>;
  runConsistency: () => Promise<void>;
  openView: (view: ViewKey) => void;
  savePackage: () => Promise<void>;
  loadPackage: (id: string) => Promise<void>;
  reset: () => void;

  setCourse: (c: string) => void;
  setDocument: (d: string | null) => void;
  fetchCoursesAndDocs: () => void;
}

export const useTeachStore = create<TeachState>((set, get) => ({
  phase: "input",
  topic: "",
  depth: "standard",
  course: "none",
  document: null,
  courses: [],
  documents: [],
  _listsLoaded: false,
  selected: {
    notes: true,
    flashcards: true,
    quiz: true,
    mindmap: true,
    diagram: true,
    difference: true,
  },

  packageId: null,
  pkgCourse: "",
  activeView: "overview",

  overview: null,
  overviewStatus: "idle",
  sources: [],

  artifacts: freshArtifacts(),

  consistency: null,
  consistencyStatus: "idle",

  recommendations: null,
  recommendationsLoading: false,

  generating: false,
  currentTask: null,

  saving: false,

  setField: (key, value) => set({ [key]: value } as Partial<TeachState>),

  setCourse: (c) => set({ course: c, document: null }),
  setDocument: (d) => set({ document: d }),

  fetchCoursesAndDocs: () => {
    if (get()._listsLoaded) return;
    Promise.all([api.listCourses(), api.listDocuments()])
      .then(([courses, documents]) => set({ courses, documents, _listsLoaded: true }))
      .catch(() => {});
  },

  toggleArtifact: (key) =>
    set((s) => ({ selected: { ...s.selected, [key]: !s.selected[key] } })),

  fetchRecommendations: async (topic: string) => {
    set({ recommendationsLoading: true });
    try {
      const recs = await api.recommendArtifacts(topic);
      const map = {} as Record<ArtifactKey, ArtifactRecommendation>;
      for (const r of recs) {
        map[r.artifact as ArtifactKey] = r;
      }
      set({ recommendations: map, recommendationsLoading: false });
    } catch {
      set({ recommendationsLoading: false });
    }
  },

  applyRecommendations: () => {
    const { recommendations } = get();
    if (!recommendations) return;
    const selected = {} as Record<ArtifactKey, boolean>;
    for (const key of ARTIFACT_KEYS) {
      selected[key] = (recommendations[key]?.stars ?? 3) >= 4;
    }
    set({ selected });
  },

  selectAll: () => {
    const selected = {} as Record<ArtifactKey, boolean>;
    for (const key of ARTIFACT_KEYS) selected[key] = true;
    set({ selected });
  },

  clearSelection: () => {
    const selected = {} as Record<ArtifactKey, boolean>;
    for (const key of ARTIFACT_KEYS) selected[key] = false;
    set({ selected });
  },

  startGenerate: async () => {
    const { topic, depth, selected } = get();
    const trimmed = topic.trim();
    if (!trimmed) {
      toast.error("Enter a topic to teach");
      return;
    }

    const enhResult = await usePromptEnhancerStore.getState().analyze(trimmed, get().course === "none" ? null : get().course, "teach");
    if (enhResult.action === "edit") {
      set({ topic: enhResult.prompt });
      return;
    }
    if (enhResult.action === "use_suggested") {
      set({ topic: enhResult.prompt });
    }
    const finalTopic = get().topic.trim();

    // Seed the workspace: overview loading, selected artifacts queued.
    const artifacts = freshArtifacts();
    for (const key of ARTIFACT_KEYS) {
      if (selected[key]) artifacts[key].status = "queued";
    }
    set({
      phase: "workspace",
      activeView: "overview",
      packageId: null,
      overview: null,
      overviewStatus: "loading",
      sources: [],
      artifacts,
      generating: true,
      currentTask: "overview",
    });

    // 1) Overview (and the sources that drive the Sources view).
    try {
      const selectedCourse = get().course === "none" ? null : get().course;
      const result = await api.generateOverview(finalTopic, depth, selectedCourse, get().document);
      set({
        overview: { title: result.title, markdown: result.markdown, grounded: result.grounded },
        sources: result.sources,
        overviewStatus: "done",
      });
    } catch (err) {
      set({ overviewStatus: "error" });
      toast.error(err instanceof Error ? err.message : "Failed to generate overview");
    }

    // 2) Each selected artifact, one at a time (clear progress + one model
    //    loaded at a time on local Ollama).
    for (const key of ARTIFACT_KEYS) {
      if (!get().selected[key]) continue;
      set({ currentTask: key });
      await generateArtifact(key, set, get);
    }

    set({ generating: false, currentTask: null });
  },

  retryArtifact: async (key) => {
    if (get().artifacts[key].status === "loading") return;
    await generateArtifact(key, set, get);
  },

  runConsistency: async () => {
    const { overview, sources, artifacts, consistencyStatus } = get();
    if (consistencyStatus === "loading") return;
    // Canonical source = overview + retrieved source snippets.
    const sourceText = [overview?.markdown ?? "", ...sources.map((s) => s.snippet)]
      .filter(Boolean)
      .join("\n\n");
    if (!sourceText.trim()) {
      toast.error("Generate the package first");
      return;
    }
    const payload: Record<string, unknown> = {};
    for (const key of ARTIFACT_KEYS) {
      if (artifacts[key].data) payload[key] = artifacts[key].data;
    }
    set({ consistencyStatus: "loading" });
    try {
      const report = await api.analyzeConsistency(sourceText, payload);
      set({ consistency: report, consistencyStatus: "done" });
    } catch (err) {
      set({ consistencyStatus: "error" });
      toast.error(err instanceof Error ? err.message : "Failed to analyze consistency");
    }
  },

  openView: (view) => {
    set({ activeView: view });
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
          artifacts[key] = { status: "done", data, error: null };
          selected[key] = true;
        }
      }
      set({
        phase: "workspace",
        topic: pkg.title,
        depth: (pkg.depth as Depth) || "standard",
        packageId: pkg.id,
        pkgCourse: pkg.course ?? "",
        activeView: "overview",
        overview: {
          title: pkg.title,
          markdown: pkg.overview?.markdown ?? "",
          grounded: pkg.overview?.grounded ?? false,
        },
        overviewStatus: "done",
        sources: pkg.sources ?? [],
        artifacts,
        selected,
        consistency: null,
        consistencyStatus: "idle",
        generating: false,
        currentTask: null,
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to open package");
    }
  },

  reset: () =>
    set({
      phase: "input",
      packageId: null,
      pkgCourse: "",
      activeView: "overview",
      overview: null,
      overviewStatus: "idle",
      sources: [],
      artifacts: freshArtifacts(),
      consistency: null,
      consistencyStatus: "idle",
      recommendations: null,
      recommendationsLoading: false,
      generating: false,
      currentTask: null,
    }),
}));

// Generate a single artifact and store it in its slot. Kept outside the store
// object so the pipeline, retry and loadPackage can share it.
async function generateArtifact(
  key: ArtifactKey,
  set: (partial: Partial<TeachState> | ((s: TeachState) => Partial<TeachState>)) => void,
  get: () => TeachState,
): Promise<void> {
  const { topic, depth } = get();
  const t = topic.trim();
  const setSlot = (slot: Partial<ArtifactSlot>) =>
    set((s) => ({ artifacts: { ...s.artifacts, [key]: { ...s.artifacts[key], ...slot } } }));

  setSlot({ status: "loading", error: null });
  try {
    const selectedCourse = get().course === "none" ? null : get().course;
    const doc = get().document;
    let data: FlashcardSet | GeneratedQuiz | GeneratedDiagram | GeneratedMindmap | GeneratedRevision | GeneratedDifference;
    switch (key) {
      case "notes":
        data = await api.generateRevision({ topic: t, course: selectedCourse, document: doc, format: "notes" });
        break;
      case "flashcards":
        data = await api.generateFlashcards(t, selectedCourse, doc, DEPTH_COUNT[depth]);
        break;
      case "quiz":
        data = await api.generateQuiz(t, selectedCourse, doc, DEPTH_DIFFICULTY[depth]);
        break;
      case "mindmap":
        data = await api.generateMindmap(t, selectedCourse, doc);
        break;
      case "diagram":
        data = await api.generateDiagram(t, selectedCourse, doc);
        break;
      case "difference":
        data = await api.generateDifference(t, selectedCourse, doc);
        break;
    }
    setSlot({ status: "done", data });
  } catch (err) {
    setSlot({ status: "error", error: err instanceof Error ? err.message : "Generation failed" });
  }
}
