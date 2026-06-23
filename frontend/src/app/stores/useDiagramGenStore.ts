import { create } from "zustand";
import { toast } from "sonner";
import { api } from "../lib/api";
import type { DiagramItem } from "../lib/types";

interface DiagramGenState {
  // Generation inputs + in-flight flag + last produced diagram live in the
  // store, so a generation started here keeps running and its result is
  // preserved when navigating away from the page and back.
  topic: string;
  course: string; // "none" or a course name
  type: string;
  generating: boolean;
  generated: DiagramItem | null; // most recent successful generation
  activeId: string | null; // id of the diagram open in the viewer (survives nav)
  setField: <K extends keyof DiagramGenState>(key: K, value: DiagramGenState[K]) => void;
  generate: () => Promise<DiagramItem | null>;
}

export const useDiagramGenStore = create<DiagramGenState>((set, get) => ({
  topic: "",
  course: "none",
  type: "flowchart",
  generating: false,
  generated: null,
  activeId: null,
  setField: (key, value) => set({ [key]: value } as Partial<DiagramGenState>),
  generate: async () => {
    const { topic, course, type, generating } = get();
    if (generating) return null;
    const t = topic.trim();
    if (!t) {
      toast.error("Enter a topic to generate a diagram");
      return null;
    }
    set({ generating: true });
    try {
      const result = await api.generateDiagram(t, course === "none" ? null : course, type);
      if (!result.grounded || !result.mermaid?.trim()) {
        toast.error(
          !result.grounded ? "Couldn't ground a diagram for that topic" : "The generated diagram was empty",
        );
        return null;
      }
      const diagram: DiagramItem = {
        id: result.id,
        title: result.title,
        course: result.course,
        kind: result.kind,
        mermaid: result.mermaid,
      };
      set({ generated: diagram, activeId: diagram.id });
      toast.success("Diagram generated");
      return diagram;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to generate diagram");
      return null;
    } finally {
      set({ generating: false });
    }
  },
}));
