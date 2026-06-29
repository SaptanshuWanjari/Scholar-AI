import { request, json } from "./client";

// ---- Notebooks ----
export interface NotebookMeta {
  id: string;
  name: string;
  course: string;
  color: string;
  notes: number;
  lastEdited: string;
}

export interface NotebookFull {
  id: string;
  title: string;
  subtitle: string;
  course: string;
  color: string;
  blocks: any[];
  updated: string;
  is_draft: boolean;
}

export interface NotebookDeduplicateResponse {
  redundant: boolean;
  similarity: number;
  existing_block_index: number | null;
  flagged_content: string | null;
}

export interface NotebookAppendResponse {
  appended: boolean;
  redundant: boolean;
  similarity: number;
  existing_block_index: number | null;
  block_index: number | null;
}

export interface Collection {
  id: string;
  name: string;
  count: number;
}

// ---- Reading ----
export interface ReadingParagraph {
  text: string;
  page: number | null;
}

export interface ReadingSection {
  id: string;
  number: string;
  title: string;
  paragraphs: ReadingParagraph[];
}

export interface ReadingDoc {
  id: string;
  title: string;
  author: string;
  kind: string;
  pages: number;
  sections: ReadingSection[];
  highlights: {
    id: string;
    text: string;
    page_number: number;
    rects: { x: number; y: number; width: number; height: number }[];
  }[];
  bookmarks: { id: string; section: string; note: string }[];
  progress: number;
}

export const notebooksApi = {
  // ---- Notebooks ----
  listNotebooks(): Promise<NotebookMeta[]> {
    return request<NotebookMeta[]>("/api/notebooks");
  },
  getNotebook(id: string): Promise<NotebookFull> {
    return request<NotebookFull>(`/api/notebooks/${id}`);
  },
  createNotebook(title: string, course?: string | null): Promise<NotebookFull> {
    return request<NotebookFull>("/api/notebooks", json({ title, course }));
  },
  updateNotebook(id: string, patch: { title?: string; subtitle?: string; blocks?: any[]; color?: string; is_draft?: boolean }): Promise<NotebookFull> {
    return request<NotebookFull>(`/api/notebooks/${id}`, { ...json(patch), method: "PUT" });
  },
  deleteNotebook(id: string): Promise<void> {
    return request<void>(`/api/notebooks/${id}`, { method: "DELETE" });
  },
  notebookAssist(action: "explain" | "summarize" | "improve", text: string, course?: string | null): Promise<{ text: string }> {
    return request<{ text: string }>("/api/notebooks/assist", json({ action, text, course: course ?? null }));
  },
  notebookDeduplicate(notebookId: number, text: string): Promise<NotebookDeduplicateResponse> {
    return request<NotebookDeduplicateResponse>("/api/notebooks/deduplicate", json({ notebook_id: notebookId, text }));
  },
  appendToNotebook(notebookId: string, markdownContent: string, artifactType: string, sourceId: string, force = false): Promise<NotebookAppendResponse> {
    return request<NotebookAppendResponse>(
      `/api/notebooks/${notebookId}/append`,
      json({ markdown_content: markdownContent, artifact_type: artifactType, source_id: sourceId, force }),
    );
  },
  listNotebookCollections(): Promise<Collection[]> {
    return request<Collection[]>("/api/notebooks/collections");
  },
  listNotebookTags(): Promise<string[]> {
    return request<string[]>("/api/notebooks/tags");
  },

  // ---- Reading ----
  getReading(documentId: string): Promise<ReadingDoc> {
    return request<ReadingDoc>(`/api/reading/${documentId}`);
  },
  addHighlight(documentId: string, text: string, pageNumber: number, rects: { x: number; y: number; width: number; height: number }[], annotation?: string): Promise<ReadingDoc> {
    return request<ReadingDoc>(`/api/reading/${documentId}/highlights`, json({ text, page_number: pageNumber, rects, annotation }));
  },
  addBookmark(documentId: string, section: string, note: string): Promise<ReadingDoc> {
    return request<ReadingDoc>(`/api/reading/${documentId}/bookmarks`, json({ section, note }));
  },
  readingLens(documentId: string, text: string, level: string): Promise<{ level: string; text: string }> {
    const p = new URLSearchParams({ text, level });
    return request<{ level: string; text: string }>(`/api/reading/${documentId}/lens?${p.toString()}`);
  },
};
