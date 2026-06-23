import { create } from "zustand";
import { toast } from "sonner";
import { api, type ConceptInspector } from "../lib/api";

interface ActionResult {
  title: string;
  body: string;
  mono: boolean;
}

interface ConceptActionState {
  // The in-flight action + its produced text result live in the store so they
  // survive navigating away from the Knowledge page and back. Both are tagged
  // with the concept id they belong to, so the panel only shows for that concept.
  running: string | null; // action label
  runningConceptId: string | null;
  result: ActionResult | null;
  resultConceptId: string | null;
  clearResult: () => void;
  runAction: (
    concept: ConceptInspector,
    conceptId: string,
    label: string,
    navigate: (to: string) => void,
  ) => Promise<void>;
}

export const useConceptActionStore = create<ConceptActionState>((set, get) => ({
  running: null,
  runningConceptId: null,
  result: null,
  resultConceptId: null,
  clearResult: () => set({ result: null, resultConceptId: null }),
  runAction: async (concept, conceptId, label, navigate) => {
    if (get().running) return;
    const name = concept.name;
    set({ running: label, runningConceptId: conceptId, result: null, resultConceptId: null });
    const open = (to: string) => ({ label: "Open", onClick: () => navigate(to) });
    try {
      if (label === "Explain Concept") {
        const r = await api.ask(`Explain the concept: ${name}`);
        set({ result: { title: `Explain: ${name}`, body: r.content, mono: false }, resultConceptId: conceptId });
      } else if (label === "Generate Summary") {
        const r = await api.generateRevision({ topic: name, format: "summary" });
        set({ result: { title: `Summary: ${name}`, body: r.markdown, mono: false }, resultConceptId: conceptId });
      } else if (label === "Generate Mind Map") {
        const r = await api.generateMindmap(name);
        set({ result: { title: `Mind Map: ${name}`, body: r.text, mono: true }, resultConceptId: conceptId });
      } else if (label === "Generate Flashcards") {
        const r = await api.generateFlashcards(name);
        if (!r.cards.length) {
          toast.error("No grounded flashcards for this concept");
        } else {
          await api.saveDeck(name, null, r.cards);
          toast.success(`${r.cards.length} flashcards saved`, { action: open("/flashcards") });
        }
      } else if (label === "Generate Quiz") {
        const r = await api.generateQuiz(name);
        if (!r.questions.length) {
          toast.error("No grounded quiz for this concept");
        } else {
          await api.saveQuiz({ title: name, difficulty: r.difficulty, questions: r.questions });
          toast.success("Quiz saved", { action: open("/quiz") });
        }
      } else if (label === "Generate Diagram") {
        const r = await api.generateDiagram(name);
        if (!r.grounded || !r.mermaid.trim()) {
          toast.error("Couldn't generate a diagram");
        } else {
          toast.success("Diagram generated", { action: open("/diagrams") });
        }
      } else if (label === "Add To Notebook") {
        const ex = await api.ask(`Explain the concept: ${name}`);
        const nb = await api.createNotebook(name);
        await api.updateNotebook(nb.id, {
          blocks: [
            { type: "heading", level: 1, text: name },
            { type: "ai-answer", question: `Explain ${name}`, answer: ex.content, confidence: 1, sources: 0 },
          ],
        });
        toast.success("Added to notebook", { action: open("/notebooks") });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : `${label} failed`);
    } finally {
      set({ running: null, runningConceptId: null });
    }
  },
}));
