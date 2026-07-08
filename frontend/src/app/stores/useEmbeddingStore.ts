import { create } from "zustand";
import { api, type EmbeddingStatus } from "../lib/api";

interface EmbeddingState extends EmbeddingStatus {
  loaded: boolean;
  dismissed: boolean;
  reindexing: boolean;
  fetch: () => Promise<void>;
  dismiss: () => void;
  setReindexing: (v: boolean) => void;
}

export const useEmbeddingStore = create<EmbeddingState>((set) => ({
  currentModel: "",
  storedModel: null,
  storedDimension: null,
  currentDimension: 0,
  mismatch: false,
  documentCount: 0,
  chunkCount: 0,
  estimatedReindexTime: "",
  loaded: false,
  dismissed: false,
  reindexing: false,
  async fetch() {
    try {
      const s = await api.embeddingStatus();
      set({ ...s, loaded: true });
    } catch {
      set({ loaded: true, mismatch: false });
    }
  },
  dismiss() {
    set({ dismissed: true });
  },
  setReindexing(v) {
    set({ reindexing: v });
  },
}));
