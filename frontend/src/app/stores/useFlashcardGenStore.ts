import { create } from "zustand";
import { toast } from "sonner";
import type { Flashcard } from "../lib/types";
import { api } from "../lib/api";

const NO_GROUNDED_MESSAGE =
  "No grounded flashcards — try uploading documents or a different topic.";

type View = "grid" | "list" | "study";

interface FlashcardGenState {
  // View mode + generation inputs kept in the store so they survive navigation.
  view: View;
  topic: string;
  course: string | null; // null = all courses
  // Generation state — lives in the store, NOT the component, so an in-flight
  // generation keeps running and its result is preserved across page changes.
  generating: boolean;
  // The freshly generated (unsaved) cards. The empty array means "no generated
  // set is currently active".
  cards: Flashcard[];
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
  generating: false,
  cards: [],
  ungrounded: false,
  generatedDeckName: null,
  activeDeck: null,
  setField: (key, value) => set({ [key]: value } as Partial<FlashcardGenState>),
  setCards: (cards) => set({ cards }),
  clearGenerated: () =>
    set({ cards: [], ungrounded: false, generatedDeckName: null, activeDeck: null }),
  generate: async () => {
    const { topic, course, generating } = get();
    const value = topic.trim();
    if (!value || generating) return;
    set({ generating: true, ungrounded: false });
    try {
      const result = await api.generateFlashcards(value, course);
      if (!result.grounded || result.cards.length === 0) {
        set({
          cards: [],
          activeDeck: null,
          generatedDeckName: null,
          ungrounded: true,
        });
        toast.error(NO_GROUNDED_MESSAGE);
        return;
      }
      set({
        cards: result.cards,
        activeDeck: null,
        generatedDeckName: result.deck,
        ungrounded: false,
      });
      toast.success(`Generated ${result.cards.length} flashcards`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to generate flashcards");
    } finally {
      set({ generating: false });
    }
  },
}));
