import type { StickyNote, NoteCategory, NoteRect } from "../types";
import { request, json } from "./client";

// Sticky notes belong to the optional "reading-annotations" plugin and work
// independently of the Excalidraw plugin.
export const readingApi = {
  getNotes(documentId: string): Promise<StickyNote[]> {
    return request<StickyNote[]>(`/api/reading/${documentId}/notes`);
  },
  createNote(
    documentId: string,
    data: {
      content: string;
      category?: NoteCategory;
      pageNumber?: number;
      boundingBox?: NoteRect | null;
      notebookId?: string | null;
    },
  ): Promise<StickyNote> {
    return request<StickyNote>(`/api/reading/${documentId}/notes`, json({
      content: data.content,
      category: data.category ?? "general",
      page_number: data.pageNumber ?? 1,
      bounding_box: data.boundingBox ?? null,
      notebook_id: data.notebookId ?? null,
    }));
  },
  updateNote(
    documentId: string,
    noteId: string,
    patch: { content?: string; category?: NoteCategory },
  ): Promise<StickyNote> {
    return request<StickyNote>(`/api/reading/${documentId}/notes/${noteId}`, {
      ...json(patch),
      method: "PATCH",
    });
  },
  deleteNote(documentId: string, noteId: string): Promise<void> {
    return request<void>(`/api/reading/${documentId}/notes/${noteId}`, { method: "DELETE" });
  },
};
