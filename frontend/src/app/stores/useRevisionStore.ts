import { create } from "zustand";
import { toast } from "@/app/lib/toast";
import { api, type SavedRevision } from "../lib/api";
import type { QualityScore } from "../lib/types";
import { useNotificationStore } from "./useNotificationStore";

export type RevisionFormat = "notes" | "concepts" | "formulas" | "summary";

/** Heuristic: detect a backend "this topic isn't in your documents" message. */
function looksNotCovered(markdown: string): boolean {
  const text = markdown.trim().toLowerCase();
  if (!text) return true;
  return (
    text.includes("not covered") ||
    text.includes("no relevant") ||
    text.includes("couldn't find") ||
    text.includes("could not find") ||
    text.includes("no information") ||
    text.includes("not found in")
  );
}

interface RevisionState {
  // Inputs (kept in the store so selections survive navigation too).
  format: RevisionFormat;
  topic: string;
  course: string; // "none" or a course name
  document: string | null;
  // Generation state — lives in the store, NOT the component, so an in-flight
  // generation keeps running and its result is preserved across page changes.
  loading: boolean;
  output: string | null;
  title: string | null;
  // Objective quality estimate from the stream's `done` event.
  quality?: QualityScore;
  ungrounded: boolean;
  savedRevisions: SavedRevision[];
  setField: <K extends keyof RevisionState>(key: K, value: RevisionState[K]) => void;
  generate: () => Promise<void>;
  stop: () => void;
  fetchRevisions: () => Promise<void>;
  saveRevision: (auto?: boolean) => Promise<void>;
  deleteRevision: (id: string) => Promise<void>;
  loadRevision: (id: string) => void;
}

// Module-scoped so the stream survives component unmount (page navigation).
let controller: AbortController | null = null;

export const useRevisionStore = create<RevisionState>((set, get) => ({
  format: "notes",
  topic: "",
  course: "none",
  document: null,
  loading: false,
  output: null,
  title: null,
  quality: undefined,
  ungrounded: false,
  savedRevisions: [],
  setField: (key, value) => set({ [key]: value } as Partial<RevisionState>),
  stop: () => {
    controller?.abort();
    controller = null;
    set({ loading: false });
  },
  fetchRevisions: async () => {
    try {
      const revs = await api.listRevisions();
      set({ savedRevisions: revs as SavedRevision[] });
    } catch (err) {
      console.error("Failed to load revisions", err);
    }
  },
  saveRevision: async (auto = false) => {
    const { output, title, topic, course, format, quality, savedRevisions } = get();
    if (!output) return;
    
    // Prevent duplicate saves if we just auto-saved this output
    if (auto && savedRevisions.length > 0 && savedRevisions[0].content === output) {
      return;
    }

    try {
      const newRev = await api.saveRevision({
        title: title || "Untitled Revision",
        topic,
        course: course === "none" ? null : course,
        format,
        content: output,
        quality,
      });
      // @ts-ignore
      set({ savedRevisions: [newRev, ...get().savedRevisions] });
      if (!auto) {
        toast.success("Revision saved");
      }
    } catch (err) {
      toast.error("Failed to save revision");
    }
  },
  deleteRevision: async (id: string) => {
    try {
      await api.deleteRevision(id);
      set((state) => ({
        savedRevisions: state.savedRevisions.filter((r) => r.id !== id),
      }));
      toast.success("Revision deleted");
    } catch (err) {
      toast.error("Failed to delete revision");
    }
  },
  loadRevision: (id: string) => {
    const { savedRevisions } = get();
    const rev = savedRevisions.find((r) => r.id === id);
    if (rev) {
      set({
        output: rev.content,
        title: rev.title,
        topic: rev.topic,
        course: rev.course,
        format: rev.format,
        quality: undefined,
        ungrounded: false,
      });
      toast.success("Revision loaded");
    }
  },
  generate: async () => {
    const { topic, course, document, format, loading } = get();
    if (loading) return;
    const t = topic.trim();
    const selectedCourse = course === "none" ? null : course;
    if (!t && !selectedCourse) {
      toast.error("Enter a topic or pick a course to generate a study sheet");
      return;
    }

    const finalTopic = t;

    controller?.abort();
    const ctrl = new AbortController();
    controller = ctrl;

    set({ loading: true, output: null, title: null, quality: undefined, ungrounded: false });

    let streamed = "";
    try {
      const ragMode = (await import("./useSettingsStore")).useSettingsStore.getState().ragMode;
      await api.revisionStream(
        { topic: finalTopic || undefined, course: selectedCourse, document, format, ragMode },
        {
          signal: ctrl.signal,
          onToken: (chunk) => {
            streamed += chunk;
            set({ output: streamed });
          },
          onDone: ({ grounded, title, quality }) => {
            const notCovered = !grounded || looksNotCovered(streamed);
            set({ title: title || null, quality, ungrounded: notCovered });
            if (notCovered) {
              toast.warning("This topic may not be covered by your uploaded documents");
              useNotificationStore.getState().add({ title: "Study sheet generated (may not be grounded)", status: "success" });
            } else {
              toast.success("Study sheet generated and auto-saved");
              useNotificationStore.getState().add({ title: "Study sheet generated and auto-saved", status: "success" });
            }
            get().saveRevision(true);
          },
          onError: (msg) => {
            const errMsg = msg || "Failed to generate study sheet";
            toast.error(errMsg);
            useNotificationStore.getState().add({ title: "Study sheet generation failed", status: "error", message: errMsg });
          },
        },
      );
    } catch (err) {
      if ((err as any)?.name !== "AbortError") {
        const errMsg = err instanceof Error ? err.message : "Failed to generate study sheet";
        toast.error(errMsg);
        useNotificationStore.getState().add({ title: "Study sheet generation failed", status: "error", message: errMsg });
      }
    } finally {
      if (controller === ctrl) controller = null;
      set({ loading: false });
    }
  },
}));
