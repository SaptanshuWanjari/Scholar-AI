import { create } from "zustand";
import type { ChatMessage } from "../lib/types";
import { sampleAnswer, sources } from "../lib/mock-data";

interface ChatState {
  messages: ChatMessage[];
  isStreaming: boolean;
  ask: (question: string) => void;
  reset: () => void;
}

let timer: ReturnType<typeof setInterval> | null = null;

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isStreaming: false,
  reset: () => {
    if (timer) clearInterval(timer);
    set({ messages: [], isStreaming: false });
  },
  ask: (question: string) => {
    if (get().isStreaming) return;
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
      sources,
      confidence: 0.91,
      streaming: true,
    };
    set((s) => ({
      messages: [...s.messages, userMsg, assistantMsg],
      isStreaming: true,
    }));

    // Simulate token streaming
    const full = sampleAnswer;
    const tokens = full.split(/(\s+)/);
    let i = 0;
    if (timer) clearInterval(timer);
    timer = setInterval(() => {
      i += 3;
      const partial = tokens.slice(0, i).join("");
      const done = i >= tokens.length;
      set((s) => ({
        messages: s.messages.map((m) =>
          m.id === assistantId
            ? { ...m, content: done ? full : partial, streaming: !done }
            : m,
        ),
        isStreaming: !done,
      }));
      if (done && timer) {
        clearInterval(timer);
        timer = null;
      }
    }, 28);
  },
}));
