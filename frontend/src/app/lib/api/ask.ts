import type { Source } from "../types";
import { request, json, BASE } from "./client";

// ---- Ask ----
export interface AskResponse {
  id: string;
  role: "assistant";
  content: string;
  sources: Source[];
  confidence: number | null;
  grounded: boolean;
  route: string | null;
}

export interface TraceChunk {
  id: string;
  source: string;
  page: number;
  similarity: number;
  tokens: number;
  text: string;
}

export interface TraceData {
  query: string | null;
  route: string | null;
  grounded: boolean;
  embeddingModel: string;
  vectorStore: string;
  topK: number;
  documents: number;
  retrievedChunks: number;
  avgSimilarity: number;
  chunks: TraceChunk[];
}

export interface TraceAnalytics {
  totalFlags: number;
  sources: TraceSourceStat[];
}

export interface TraceSourceStat {
  source: string;
  weakCount: number;
  downCount: number;
  total: number;
  avgSimilarity: number;
}

// ---- Chat ----
export interface ChatSessionMeta {
  id: string;
  title: string;
  course: string;
  messageCount: number;
  updatedAt: string;
}

export interface ChatMessageRow {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources: Source[];
  createdAt: string;
}

export interface ChatSessionFull extends ChatSessionMeta {
  messages: ChatMessageRow[];
}

export const askApi = {
  ask(question: string, course?: string | null, document?: string | null, sessionId?: string | null, ragMode?: string, socratic?: boolean): Promise<AskResponse> {
    return request<AskResponse>("/api/ask", json({ question, course: course ?? null, document: document ?? null, sessionId: sessionId ?? null, rag_mode: ragMode ?? "fallback", socratic: socratic ?? false }));
  },

  async askStream(
    question: string,
    handlers: {
      onToken: (chunk: string) => void;
      onDone?: (meta: { sources: Source[]; confidence?: number; grounded: boolean; route: string }) => void;
      onError?: (message: string) => void;
      signal?: AbortSignal;
    },
    course?: string | null,
    document?: string | null,
    route?: string | null,
    searchQuery?: string | null,
    sessionId?: string | null,
    ragMode = "fallback",
    socratic = false,
    highlightsOnly = false,
  ): Promise<void> {
    const res = await fetch(`${BASE}/api/ask/stream`, {
      ...json({ question, course, document, route, search_query: searchQuery, sessionId, rag_mode: ragMode, socratic, highlights_only: highlightsOnly }),
      signal: handlers.signal,
    });
    if (!res.ok || !res.body) {
      const msg = `Request failed (${res.status})`;
      handlers.onError?.(msg);
      return;
    }
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      let idx: number;
      while ((idx = buffer.indexOf("\n\n")) >= 0) {
        const raw = buffer.slice(0, idx);
        buffer = buffer.slice(idx + 2);
        const line = raw.split("\n").find((l) => l.startsWith("data:"));
        if (!line) continue;
        let evt: any;
        try { evt = JSON.parse(line.slice(5).trim()); } catch { continue; }
        if (evt.type === "token") handlers.onToken(evt.value);
        else if (evt.type === "done")
          handlers.onDone?.({ sources: evt.sources, confidence: evt.confidence, grounded: evt.grounded, route: evt.route ?? "" });
        else if (evt.type === "error") {
          handlers.onError?.(evt.value);
        }
      }
    }
  },

  // ---- Trace ----
  getTrace(): Promise<TraceData> {
    return request<TraceData>("/api/trace/last");
  },
  getTraceAnalytics(): Promise<TraceAnalytics> {
    return request<TraceAnalytics>("/api/trace/analytics");
  },
  sendChunkFeedback(source: string, chunkId = "", query = "", similarity = 0): Promise<void> {
    return request<void>("/api/trace/feedback", json({ source, chunkId, query, similarity }));
  },

  // ---- Chat history ----
  listChatSessions(): Promise<ChatSessionMeta[]> {
    return request<ChatSessionMeta[]>("/api/chat/sessions");
  },
  createChatSession(course?: string | null, title?: string | null): Promise<ChatSessionMeta> {
    return request<ChatSessionMeta>("/api/chat/sessions", json({ course: course ?? null, title: title ?? null }));
  },
  getChatSession(id: string): Promise<ChatSessionFull> {
    return request<ChatSessionFull>(`/api/chat/sessions/${id}`);
  },
  deleteChatSession(id: string): Promise<void> {
    return request<void>(`/api/chat/sessions/${id}`, { method: "DELETE" });
  },
};
