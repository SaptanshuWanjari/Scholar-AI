import { create } from "zustand";
import { toast } from "sonner";
import { api } from "../lib/api";
import type { WhiteboardFull, WhiteboardItem } from "../lib/types";

export const ALL_COURSES = "__all__";

interface WhiteboardState {
  list: WhiteboardItem[];
  loading: boolean;
  load: (course?: string | null) => Promise<void>;
  create: (title: string, course?: string | null) => Promise<WhiteboardFull | null>;
  archive: (id: string) => Promise<void>;
  moveToBin: (id: string) => Promise<void>;
  restore: (id: string) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

export const useWhiteboardStore = create<WhiteboardState>((set, get) => ({
  list: [],
  loading: false,
  load: async (course) => {
    set({ loading: true });
    try {
      const list = await api.listWhiteboards(course && course !== ALL_COURSES ? course : null);
      set({ list });
    } catch {
      toast.error("Failed to load whiteboards");
    } finally {
      set({ loading: false });
    }
  },
  create: async (title, course) => {
    try {
      const wb = await api.createWhiteboard({
        title,
        course: course && course !== ALL_COURSES ? course : null,
      });
      return wb;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create whiteboard");
      return null;
    }
  },
  archive: async (id) => {
    try {
      await api.updateWhiteboard(id, { status: "archived" });
      set((state) => ({
        list: state.list.map((w) => w.id === id ? { ...w, status: "archived" } : w)
      }));
      toast.success("Whiteboard archived");
    } catch {
      toast.error("Failed to archive whiteboard");
    }
  },
  moveToBin: async (id) => {
    try {
      const now = new Date().toISOString();
      await api.updateWhiteboard(id, { status: "binned" });
      set((state) => ({
        list: state.list.map((w) => w.id === id ? { ...w, status: "binned", deletedAt: now } : w)
      }));
      toast.success("Moved to bin");
    } catch {
      toast.error("Failed to move to bin");
    }
  },
  restore: async (id) => {
    try {
      await api.updateWhiteboard(id, { status: "saved" });
      set((state) => ({
        list: state.list.map((w) => w.id === id ? { ...w, status: "saved", deletedAt: null } : w)
      }));
      toast.success("Whiteboard restored");
    } catch {
      toast.error("Failed to restore whiteboard");
    }
  },
  remove: async (id) => {
    try {
      await api.deleteWhiteboard(id);
      set({ list: get().list.filter((w) => w.id !== id) });
      toast.success("Whiteboard deleted");
    } catch {
      toast.error("Failed to delete whiteboard");
    }
  },
}));
