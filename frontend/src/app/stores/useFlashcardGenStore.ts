import { create } from "zustand";
import { toast } from "sonner";
import type { Flashcard, QualityScore } from "../lib/types";
import { api } from "../lib/api";
import { usePromptEnhancerStore } from "./usePromptEnhancerStore";
import { useNotificationStore } from "./useNotificationStore";

const NO_GROUNDED_MESSAGE =
  "No grounded flashcards — try uploading documents or a different topic.";

type View = "grid" | "list" | "study";

interface FlashcardGenState {
  // View mode + generation inputs kept in the store so they survive navigation.
  view: View;
  topic: string;
  course: string | null; // null = all courses
  document: string | null;
  // Generation state — lives in the store, NOT the component, so an in-flight
  // generation keeps running and its result is preserved across page changes.
  generating: boolean;
  // The freshly generated (unsaved) cards. The empty array means "no generated
  // set is currently active".
  cards: Flashcard[];
  // Objective quality estimate for the freshly generated (unsaved) set.
  quality?: QualityScore;
  ungrounded: boolean;
  // The deck name proposed by the generate flow (used as default save name).
  generatedDeckName: string | null;
  // Name of the deck the generated cards were saved as, or null while unsaved.
  // Kept here so the page can distinguish an unsaved generated set from a saved
  // one even after navigation.
  activeDeck: string | null;
  setField: <K extends keyof FlashcardGenState>(key: K, value: FlashcardGenState[K]) => void;
  setCards: (cards: Flashcard[]) => void;
  generate: () => Promise<void>;
  clearGenerated: () => void;
}

export const useFlashcardGenStore = create<FlashcardGenState>((set, get) => ({
  view: "grid",
  topic: "",
  course: null,
  document: null,
  generating: false,
  cards: [],
  quality: undefined,
  ungrounded: false,
  generatedDeckName: null,
  activeDeck: null,
  setField: (key, value) => set({ [key]: value } as Partial<FlashcardGenState>),
  setCards: (cards) => set({ cards }),
  clearGenerated: () =>
    set({ cards: [], quality: undefined, ungrounded: false, generatedDeckName: null, activeDeck: null }),
  generate: async () => {
    const { topic, course, document, generating } = get();
    const value = topic.trim();
    if (!value || generating) return;
    const enhResult = await usePromptEnhancerStore.getState().analyze(value, course, "flashcards");
    if (enhResult.action === "edit") {
      set({ topic: enhResult.prompt });
      return;
    }
    if (enhResult.action === "use_suggested") {
      set({ topic: enhResult.prompt });
    }
    const finalTopic = get().topic.trim();
    set({ generating: true, ungrounded: false });
    try {
      const ragMode = (await import("./useSettingsStore")).useSettingsStore.getState().ragMode;
      const result = await api.generateFlashcards(finalTopic, course, document, 8, ragMode);
      if (!result.grounded || result.cards.length === 0) {
        set({
          cards: [],
          quality: undefined,
          activeDeck: null,
          generatedDeckName: null,
          ungrounded: true,
        });
        toast.error(NO_GROUNDED_MESSAGE);
        useNotificationStore.getState().add({ title: "Flashcard generation failed", status: "error", message: NO_GROUNDED_MESSAGE });
        return;
      }
      set({
        cards: result.cards,
        quality: result.quality,
        activeDeck: null,
        generatedDeckName: result.deck,
        ungrounded: false,
      });
      const successMsg = `Generated ${result.cards.length} flashcards`;
      toast.success(successMsg);
      useNotificationStore.getState().add({ title: successMsg, status: "success" });
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Failed to generate flashcards";
      toast.error(errMsg);
      useNotificationStore.getState().add({ title: "Flashcard generation failed", status: "error", message: errMsg });
    } finally {
      set({ generating: false });
    }
  },
}));
