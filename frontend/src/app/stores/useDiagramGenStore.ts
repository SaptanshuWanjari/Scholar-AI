import { create } from "zustand";
import { toast } from "@/app/lib/toast";
import { api } from "../lib/api";
import type { DiagramItem } from "../lib/types";
import { usePromptEnhancerStore } from "./usePromptEnhancerStore";
import { useNotificationStore } from "./useNotificationStore";

interface DiagramGenState {
  // Generation inputs + in-flight flag + last produced diagram live in the
  // store, so a generation started here keeps running and its result is
  // preserved when navigating away from the page and back.
  topic: string;
  course: string; // "none" or a course name
  document: string | null;
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
  document: null,
  type: "flowchart",
  generating: false,
  generated: null,
  activeId: null,
  setField: (key, value) => set({ [key]: value } as Partial<DiagramGenState>),
  generate: async () => {
    const { topic, course, document, type, generating } = get();
    if (generating) return null;
    const t = topic.trim();
    if (!t) {
      toast.error("Enter a topic to generate a diagram");
      return null;
    }
    const enhResult = await usePromptEnhancerStore.getState().analyze(t, course === "none" ? null : course, type === "plantuml" ? "plantuml" : "mermaid");
    if (enhResult.action === "edit") {
      set({ topic: enhResult.prompt });
      return null;
    }
    if (enhResult.action === "use_suggested") {
      set({ topic: enhResult.prompt });
    }
    const finalTopic = get().topic.trim();
    set({ generating: true });
    try {
      const ragMode = (await import("./useSettingsStore")).useSettingsStore.getState().ragMode;
      const result = await api.generateDiagram(finalTopic, course === "none" ? null : course, document, type, ragMode);
      if (!result.grounded || !result.mermaid?.trim()) {
        const errMsg = !result.grounded ? "Couldn't ground a diagram for that topic" : "The generated diagram was empty";
        toast.error(errMsg);
        useNotificationStore.getState().add({ title: "Diagram generation failed", status: "error", message: errMsg });
        return null;
      }
      const diagram: DiagramItem = {
        id: result.id,
        title: result.title,
        course: result.course,
        kind: result.kind,
        mermaid: result.mermaid,
        quality: result.quality,
      };
      set({ generated: diagram, activeId: diagram.id });
      toast.success("Diagram generated");
      useNotificationStore.getState().add({ title: "Diagram generated", status: "success" });
      return diagram;
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Failed to generate diagram";
      toast.error(errMsg);
      useNotificationStore.getState().add({ title: "Diagram generation failed", status: "error", message: errMsg });
      return null;
    } finally {
      set({ generating: false });
    }
  },
}));
