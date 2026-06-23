import { create } from "zustand";
import { toast } from "sonner";
import { api } from "../lib/api";

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
  // Generation state — lives in the store, NOT the component, so an in-flight
  // generation keeps running and its result is preserved across page changes.
  loading: boolean;
  output: string | null;
  title: string | null;
  ungrounded: boolean;
  setField: <K extends keyof RevisionState>(key: K, value: RevisionState[K]) => void;
  generate: () => Promise<void>;
  stop: () => void;
}

// Module-scoped so the stream survives component unmount (page navigation).
let controller: AbortController | null = null;

export const useRevisionStore = create<RevisionState>((set, get) => ({
  format: "notes",
  topic: "",
  course: "none",
  loading: false,
  output: null,
  title: null,
  ungrounded: false,
  setField: (key, value) => set({ [key]: value } as Partial<RevisionState>),
  stop: () => {
    controller?.abort();
    controller = null;
    set({ loading: false });
  },
  generate: async () => {
    const { topic, course, format, loading } = get();
    if (loading) return;
    const t = topic.trim();
    const selectedCourse = course === "none" ? null : course;
    if (!t && !selectedCourse) {
      toast.error("Enter a topic or pick a course to generate a study sheet");
      return;
    }

    controller?.abort();
    const ctrl = new AbortController();
    controller = ctrl;

    set({ loading: true, output: null, title: null, ungrounded: false });

    let streamed = "";
    try {
      await api.revisionStream(
        { topic: t || undefined, course: selectedCourse, format },
        {
          signal: ctrl.signal,
          onToken: (chunk) => {
            streamed += chunk;
            set({ output: streamed });
          },
          onDone: ({ grounded, title }) => {
            const notCovered = !grounded || looksNotCovered(streamed);
            set({ title: title || null, ungrounded: notCovered });
            if (notCovered) {
              toast.warning("This topic may not be covered by your uploaded documents");
            } else {
              toast.success("Study sheet generated");
            }
          },
          onError: (msg) => {
            toast.error(msg || "Failed to generate study sheet");
          },
        },
      );
    } catch (err) {
      if ((err as any)?.name !== "AbortError") {
        toast.error(err instanceof Error ? err.message : "Failed to generate study sheet");
      }
    } finally {
      if (controller === ctrl) controller = null;
      set({ loading: false });
    }
  },
}));
