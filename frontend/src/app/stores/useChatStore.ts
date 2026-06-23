import { create } from "zustand";
import { toast } from "sonner";
import type { ChatMessage } from "../lib/types";
import { api } from "../lib/api";

interface ChatState {
  messages: ChatMessage[];
  isStreaming: boolean;
  course: string | null;
  document: string | null;
  setCourse: (course: string | null) => void;
  setDocument: (document: string | null) => void;
  ask: (question: string, opts?: { stream?: boolean }) => Promise<void>;
  reset: () => void;
}

let controller: AbortController | null = null;

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isStreaming: false,
  course: null,
  document: null,
  setCourse: (course) => set({ course }),
  setDocument: (document) => set({ document }),
  reset: () => {
    controller?.abort();
    controller = null;
    set({ messages: [], isStreaming: false });
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
