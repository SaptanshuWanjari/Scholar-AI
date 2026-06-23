// Typed HTTP client for the ScholarCLI FastAPI backend.
// In dev, requests go to `/api/*` which Vite proxies to the backend
// (see vite.config.ts). Override with VITE_API_BASE_URL for production.

import type { Course, DocumentItem, Source } from "./types";

const BASE: string = (import.meta as any).env?.VITE_API_BASE_URL ?? "";

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

export interface BackendSettings {
  fastModel: string;
  reasoningModel: string;
  embeddingModel: string;
  temperature: number;
  topK: number;
  similarityThreshold: number;
  streaming: boolean;
  citationsInline: boolean;
  accent: string;
  density: string;
}

export interface ModelsList {
  fastModels: string[];
  reasoningModels: string[];
  embeddingModels: string[];
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, init);
  if (!res.ok) {
    let detail = res.statusText;
    try {
      const body = await res.json();
      detail = body.detail ?? detail;
    } catch {
      /* non-JSON error body */
    }
    throw new Error(detail);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

function json(body: unknown): RequestInit {
  return {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}

export const api = {
  // ---- Ask / chat ----
  ask(question: string, course?: string | null): Promise<AskResponse> {
    return request<AskResponse>("/api/ask", json({ question, course: course ?? null }));
  },

  /** Stream an answer token-by-token over SSE. Returns the final metadata. */
  async askStream(
    question: string,
    course: string | null | undefined,
    handlers: {
      onToken: (chunk: string) => void;
      onDone?: (meta: { sources: Source[]; confidence: number | null; grounded: boolean }) => void;
      onError?: (message: string) => void;
      signal?: AbortSignal;
    },
  ): Promise<void> {
    const res = await fetch(`${BASE}/api/ask/stream`, {
      ...json({ question, course: course ?? null }),
      signal: handlers.signal,
    });
    if (!res.ok || !res.body) {
      handlers.onError?.(`Request failed (${res.status})`);
      return;
    }
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    // eslint-disable-next-line no-constant-condition
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
        try {
          evt = JSON.parse(line.slice(5).trim());
        } catch {
          continue;
        }
        if (evt.type === "token") handlers.onToken(evt.value);
        else if (evt.type === "done")
          handlers.onDone?.({ sources: evt.sources, confidence: evt.confidence, grounded: evt.grounded });
        else if (evt.type === "error") handlers.onError?.(evt.value);
      }
    }
  },

  // ---- Courses ----
  listCourses(): Promise<Course[]> {
    return request<Course[]>("/api/courses");
  },
  createCourse(name: string): Promise<Course> {
    return request<Course>("/api/courses", json({ name }));
  },

  // ---- Documents ----
  listDocuments(course?: string, search?: string): Promise<DocumentItem[]> {
    const p = new URLSearchParams();
    if (course && course !== "all") p.set("course", course);
    if (search) p.set("search", search);
    const qs = p.toString();
    return request<DocumentItem[]>(`/api/documents${qs ? `?${qs}` : ""}`);
  },
  uploadDocument(file: File, course: string): Promise<DocumentItem> {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("course", course);
    return request<DocumentItem>("/api/documents/upload", { method: "POST", body: fd });
  },
  deleteDocument(id: string): Promise<void> {
    return request<void>(`/api/documents/${id}`, { method: "DELETE" });
  },

  // ---- Sources / search ----
  searchSources(q: string, course?: string, limit = 5): Promise<Source[]> {
    const p = new URLSearchParams({ q, limit: String(limit) });
    if (course && course !== "all") p.set("course", course);
    return request<Source[]>(`/api/sources/search?${p.toString()}`);
  },

  // ---- Trace ----
  getTrace(): Promise<TraceData> {
    return request<TraceData>("/api/trace/last");
  },

  // ---- Settings / models ----
  getSettings(): Promise<BackendSettings> {
    return request<BackendSettings>("/api/settings");
  },
  updateSettings(patch: Partial<BackendSettings>): Promise<BackendSettings> {
    return request<BackendSettings>("/api/settings", { ...json(patch), method: "PUT" });
  },
  listModels(): Promise<ModelsList> {
    return request<ModelsList>("/api/models/list");
  },
};
