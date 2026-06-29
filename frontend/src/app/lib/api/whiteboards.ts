import type { WhiteboardItem, WhiteboardFull, WhiteboardRevision, WhiteboardScene, QualityScore } from "../types";
import { request, json } from "./client";

export const whiteboardsApi = {
  listWhiteboards(course?: string | null): Promise<WhiteboardItem[]> {
    const p = new URLSearchParams();
    if (course && course !== "all") p.set("course", course);
    const qs = p.toString();
    return request<WhiteboardItem[]>(`/api/whiteboards${qs ? `?${qs}` : ""}`);
  },
  getWhiteboard(id: string): Promise<WhiteboardFull> {
    return request<WhiteboardFull>(`/api/whiteboards/${id}`);
  },
  createWhiteboard(data: { title: string; course?: string | null; scene?: WhiteboardScene; thumbnail?: string | null; source?: string }): Promise<WhiteboardFull> {
    return request<WhiteboardFull>("/api/whiteboards", json({
      title: data.title,
      course: data.course ?? null,
      scene: data.scene ?? {},
      thumbnail: data.thumbnail ?? null,
      source: data.source ?? "manual",
    }));
  },
  updateWhiteboard(id: string, patch: { title?: string; course?: string | null; scene?: WhiteboardScene; thumbnail?: string | null; status?: string }): Promise<WhiteboardFull> {
    return request<WhiteboardFull>(`/api/whiteboards/${id}`, { ...json(patch), method: "PUT" });
  },
  deleteWhiteboard(id: string): Promise<void> {
    return request<void>(`/api/whiteboards/${id}`, { method: "DELETE" });
  },
  listWhiteboardRevisions(id: string): Promise<WhiteboardRevision[]> {
    return request<WhiteboardRevision[]>(`/api/whiteboards/${id}/revisions`);
  },
  saveWhiteboardRevision(id: string, scene: WhiteboardScene, changeSummary = ""): Promise<WhiteboardRevision> {
    return request<WhiteboardRevision>(`/api/whiteboards/${id}/revisions`, json({ scene, change_summary: changeSummary }));
  },
  restoreWhiteboardRevision(id: string, revisionNumber: number): Promise<WhiteboardFull> {
    return request<WhiteboardFull>(`/api/whiteboards/${id}/restore/${revisionNumber}`, { method: "POST" });
  },
  generateWhiteboard(opts: { topic: string; course?: string | null; document?: string | null; type?: string; ragMode?: string }): Promise<{ title: string; mermaid: string; grounded: boolean }> {
    return request<{ title: string; mermaid: string; grounded: boolean }>("/api/whiteboards/generate", json({
      topic: opts.topic,
      course: opts.course ?? null,
      document: opts.document ?? null,
      type: opts.type ?? null,
      rag_mode: opts.ragMode ?? "fallback",
    }));
  },
  assistWhiteboard(action: "explain" | "expand", text: string, course?: string | null, document?: string | null): Promise<{ text: string; mermaid: string }> {
    return request<{ text: string; mermaid: string }>("/api/whiteboards/assist", json({ action, text, course: course ?? null, document: document ?? null }));
  },
};
