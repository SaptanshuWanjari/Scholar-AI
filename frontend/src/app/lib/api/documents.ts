import type { DocumentItem, Source } from "../types";
import { request, json } from "./client";

export interface PaginatedSourcesOut {
  sources: Source[];
  total: number;
}

export interface SearchResult {
  id: string;
  group: string;
  title: string;
  snippet: string;
  course: string;
}

export const documentsApi = {
  listDocuments(course?: string, search?: string): Promise<DocumentItem[]> {
    const p = new URLSearchParams();
    if (course && course !== "all") p.set("course", course);
    if (search) p.set("search", search);
    const qs = p.toString();
    return request<DocumentItem[]>(`/api/documents${qs ? `?${qs}` : ""}`);
  },
  uploadDocument(file: File, course?: string): Promise<DocumentItem> {
    const fd = new FormData();
    fd.append("file", file);
    if (course) fd.append("course", course);
    return request<DocumentItem>("/api/documents/upload", { method: "POST", body: fd });
  },
  updateDocument(id: string, course: string): Promise<DocumentItem> {
    return request<DocumentItem>(`/api/documents/${id}`, { ...json({ course }), method: "PATCH" });
  },
  deleteDocument(id: string): Promise<void> {
    return request<void>(`/api/documents/${id}`, { method: "DELETE" });
  },

  // ---- Sources / search ----
  searchSources(q: string, course?: string, limit = 5, offset = 0): Promise<PaginatedSourcesOut> {
    const p = new URLSearchParams({ q, limit: String(limit), offset: String(offset) });
    if (course && course !== "all") p.set("course", course);
    return request<PaginatedSourcesOut>(`/api/sources/search?${p.toString()}`);
  },
  reindexAll(): Promise<{ id: string; kind: string; status: string; label: string; error?: string }> {
    return request("/api/documents/reindex-all", { method: "POST" });
  },
  search(q: string, type = "all", course = "all", topic = "all"): Promise<SearchResult[]> {
    const p = new URLSearchParams({ q, type, course, topic });
    return request<SearchResult[]>(`/api/search?${p.toString()}`);
  },
};
