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
  socratic: boolean;
  setCourse: (course: string | null) => void;
  setDocument: (document: string | null) => void;
  setSocratic: (v: boolean) => void;
  ask: (question: string, opts?: { stream?: boolean; ragMode?: string }) => Promise<void>;
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
  socratic: false,
  setCourse: (course) => set({ course }),
  setDocument: (document) => set({ document }),
  setSocratic: (v) => set({ socratic: v }),
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
  ask: async (question: string, opts?: { stream?: boolean; ragMode?: string }) => {
    if (get().isStreaming) return;
    const stream = opts?.stream ?? true;
    const ragMode = opts?.ragMode ?? "fallback";
    const course = get().course;
    const document = get().document;
    const socratic = get().socratic;

    // Auto-create a session on first message of a new conversation.
    let sessionId = get().activeSessionId;
    if (!sessionId) {
      try {
        const sess = await api.createChatSession(course ?? undefined);
        sessionId = sess.id;
        set({ activeSessionId: sessionId });
        const sessions = await api.listChatSessions();
        set({ sessions });
      } catch {
        sessionId = null;
      }
    }

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
        }, sessionId, ragMode, socratic);
      } else {
        const res = await api.ask(question, course, document, sessionId, ragMode, socratic);
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
      try {
        const sessions = await api.listChatSessions();
        set({ sessions });
      } catch { /* ignore */ }
    }
  },
}));

