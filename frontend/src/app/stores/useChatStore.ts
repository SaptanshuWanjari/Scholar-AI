import { create } from "zustand";
import { toast } from "sonner";
import type { ChatMessage } from "../lib/types";
import { api } from "../lib/api";
import type { ChatSessionMeta } from "../lib/api";

interface ChatState {
  messages: ChatMessage[];
  isStreaming: boolean;
  course: string | null;
  document: string | null;
  sessions: ChatSessionMeta[];
  activeSessionId: string | null;
  setCourse: (course: string | null) => void;
  setDocument: (document: string | null) => void;
  ask: (question: string, opts?: { stream?: boolean }) => Promise<void>;
  reset: () => void;
  loadSessions: () => Promise<void>;
  loadSession: (id: string) => Promise<void>;
  deleteSession: (id: string) => Promise<void>;
}

let controller: AbortController | null = null;

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isStreaming: false,
  course: null,
  document: null,
  sessions: [],
  activeSessionId: null,
  setCourse: (course) => set({ course }),
  setDocument: (document) => set({ document }),
  reset: () => {
    controller?.abort();
    controller = null;
    set({ messages: [], isStreaming: false, activeSessionId: null });
  },
  loadSessions: async () => {
    try {
      const sessions = await api.listChatSessions();
      set({ sessions });
    } catch {
      // silently ignore — sidebar is optional
    }
  },
  loadSession: async (id: string) => {
    try {
      const full = await api.getChatSession(id);
      const messages: ChatMessage[] = full.messages.map((row) => ({
        id: row.id,
        role: row.role,
        content: row.content,
        sources: row.sources,
        streaming: false,
      }));
      set({ messages, activeSessionId: id });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load session";
      toast.error("Load failed", { description: msg });
    }
  },
  deleteSession: async (id: string) => {
    try {
      await api.deleteChatSession(id);
      set((s) => ({
        sessions: s.sessions.filter((sess) => sess.id !== id),
        activeSessionId: s.activeSessionId === id ? null : s.activeSessionId,
        messages: s.activeSessionId === id ? [] : s.messages,
      }));
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to delete session";
      toast.error("Delete failed", { description: msg });
    }
  },
  ask: async (question: string, opts?: { stream?: boolean }) => {
    if (get().isStreaming) return;
    const stream = opts?.stream ?? true;
    const course = get().course;
    const document = get().document;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: question,
    };
    const assistantId = `a-${Date.now()}`;
    const assistantMsg: ChatMessage = {
      id: assistantId,
      role: "assistant",
      content: "",
      sources: [],
      streaming: true,
    };
    set((s) => ({
      messages: [...s.messages, userMsg, assistantMsg],
      isStreaming: true,
    }));

    const patch = (fields: Partial<ChatMessage>) =>
      set((s) => ({
        messages: s.messages.map((m) => (m.id === assistantId ? { ...m, ...fields } : m)),
      }));

    try {
      if (stream) {
        controller = new AbortController();
        let acc = "";
        await api.askStream(question, course, document, {
          signal: controller.signal,
          onToken: (chunk) => {
            acc += chunk;
            patch({ content: acc, streaming: true });
          },
          onDone: (meta) => {
            patch({
              content: acc,
              streaming: false,
              sources: meta.sources,
              confidence: meta.confidence ?? undefined,
            });
          },
          onError: (msg) => {
            patch({ content: acc || `⚠️ ${msg}`, streaming: false });
            toast.error("Answer failed", { description: msg });
          },
        });
      } else {
        const res = await api.ask(question, course, document);
        patch({
          content: res.content,
          streaming: false,
          sources: res.sources,
          confidence: res.confidence ?? undefined,
        });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Request failed";
      patch({ content: `⚠️ ${msg}`, streaming: false });
      toast.error("Answer failed", { description: msg });
    } finally {
      controller = null;
      set({ isStreaming: false });
    }
  },
}));
