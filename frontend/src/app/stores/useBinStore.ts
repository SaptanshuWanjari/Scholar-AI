import { create } from "zustand";
import { trashApi, TrashItem } from "../lib/api/trash";

interface BinState {
  items: TrashItem[];
  count: number;
  grouped: Record<string, TrashItem[]>;
  loading: boolean;
  fetchItems: () => Promise<void>;
  restoreItem: (artifactType: string, artifactId: string) => Promise<void>;
  archiveItem: (artifactType: string, artifactId: string, archived: boolean) => Promise<void>;
  permanentDelete: (artifactType: string, artifactId: string) => Promise<void>;
  purgeAll: () => Promise<void>;
}

export const useBinStore = create<BinState>((set, get) => ({
  items: [],
  count: 0,
  grouped: {},
  loading: false,

  fetchItems: async () => {
    set({ loading: true });
    try {
      const data = await trashApi.list();
      const grouped: Record<string, TrashItem[]> = {};
      for (const item of data.items) {
        if (!grouped[item.artifact_type]) {
          grouped[item.artifact_type] = [];
        }
        grouped[item.artifact_type].push(item);
      }
      set({ items: data.items, count: data.items.length, grouped, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  restoreItem: async (artifactType, artifactId) => {
    await trashApi.restore(artifactType, artifactId);
    const { items } = get();
    const filtered = items.filter(
      (i) => !(i.artifact_type === artifactType && i.artifact_id === artifactId)
    );
    const grouped: Record<string, TrashItem[]> = {};
    for (const item of filtered) {
      if (!grouped[item.artifact_type]) grouped[item.artifact_type] = [];
      grouped[item.artifact_type].push(item);
    }
    set({ items: filtered, count: filtered.length, grouped });
  },

  archiveItem: async (artifactType, artifactId, archived) => {
    await trashApi.archive(artifactType, artifactId, archived);
    const items = get().items.map((i) =>
      i.artifact_type === artifactType && i.artifact_id === artifactId
        ? { ...i, archived }
        : i
    );
    set({ items });
  },

  permanentDelete: async (artifactType, artifactId) => {
    await trashApi.permanentDelete(artifactType, artifactId);
    const items = get().items.filter(
      (i) => !(i.artifact_type === artifactType && i.artifact_id === artifactId)
    );
    const grouped: Record<string, TrashItem[]> = {};
    for (const item of items) {
      if (!grouped[item.artifact_type]) grouped[item.artifact_type] = [];
      grouped[item.artifact_type].push(item);
    }
    set({ items, count: items.length, grouped });
  },

  purgeAll: async () => {
    await trashApi.purge();
    set({ items: [], count: 0, grouped: {} });
  },
}));
