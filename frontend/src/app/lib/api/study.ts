import type { Flashcard, Quiz, DiagramItem, GeneratedDifference, DifferenceTableItem, QualityScore, Source } from "../types";
import { request, json, BASE } from "./client";

// ---- Flashcards ----
export interface FlashcardSet {
  deck: string;
  course: string | null;
  grounded: boolean;
  cards: Flashcard[];
  quality?: QualityScore;
}

export interface DeckOut {
  id: string;
  name: string;
  course: string;
  color: string;
  cards: number;
  mastered: number;
  quality?: QualityScore;
}

export interface SavedRevision {
  id: string;
  title: string;
  topic: string;
  course: string;
  format: "notes" | "concepts" | "formulas" | "summary";
  content: string;
  quality?: QualityScore;
  timestamp: number;
}

// ---- Quizzes ----
export interface GeneratedQuiz extends Quiz {
  grounded: boolean;
}

// ---- Diagrams ----
export interface GeneratedDiagram extends DiagramItem {
  grounded: boolean;
}

// ---- Mindmaps ----
export interface GeneratedMindmap {
  id: string;
  title: string;
  course: string;
  text: string;
  grounded: boolean;
  quality?: QualityScore;
}

// ---- Revision ----
export interface GeneratedRevision {
  title: string;
  markdown: string;
  grounded: boolean;
  quality?: QualityScore;
}

export const studyApi = {
  // ---- Flashcards ----
  generateFlashcards(topic: string, course?: string | null, document?: string | null, count = 8, ragMode = "fallback"): Promise<FlashcardSet> {
    return request<FlashcardSet>("/api/flashcards/generate", json({ topic, course: course ?? null, document: document ?? null, count, rag_mode: ragMode }));
  },
  listDecks(): Promise<DeckOut[]> {
    return request<DeckOut[]>("/api/decks");
  },
  saveDeck(name: string, course: string | null, cards: Flashcard[], color?: string, quality?: QualityScore, source?: string): Promise<DeckOut> {
    return request<DeckOut>("/api/decks", json({ name, course, cards, color, quality, source }));
  },
  deleteDeck(id: string): Promise<void> {
    return request<void>(`/api/decks/${id}`, { method: "DELETE" });
  },
  listSavedFlashcards(deck?: string, course?: string): Promise<Flashcard[]> {
    const p = new URLSearchParams();
    if (deck) p.set("deck", deck);
    if (course) p.set("course", course);
    const qs = p.toString();
    return request<Flashcard[]>(`/api/flashcards${qs ? `?${qs}` : ""}`);
  },
  reviewCard(id: string, ease: "new" | "learning" | "mastered", due?: string): Promise<Flashcard> {
    return request<Flashcard>(`/api/flashcards/${id}`, { ...json({ ease, due }), method: "PUT" });
  },
  reviewCardSm2(id: string, quality: number): Promise<Flashcard> {
    return request<Flashcard>(`/api/flashcards/${id}/review`, { ...json({ quality }), method: "POST" });
  },
  deleteCard(id: string): Promise<void> {
    return request<void>(`/api/flashcards/${id}`, { method: "DELETE" });
  },

  // ---- Quizzes ----
  generateQuiz(topic: string, course?: string | null, document?: string | null, difficulty: "Easy" | "Medium" | "Hard" = "Medium", ragMode = "fallback"): Promise<GeneratedQuiz> {
    return request<GeneratedQuiz>("/api/quizzes/generate", json({ topic, course: course ?? null, document: document ?? null, difficulty, rag_mode: ragMode }));
  },
  listSavedQuizzes(): Promise<Quiz[]> {
    return request<Quiz[]>("/api/quizzes");
  },
  saveQuiz(quiz: { title: string; course?: string | null; difficulty: string; questions: Quiz["questions"]; quality?: QualityScore; source?: string }): Promise<Quiz> {
    return request<Quiz>("/api/quizzes", json(quiz));
  },
  deleteQuiz(id: string): Promise<void> {
    return request<void>(`/api/quizzes/${id}`, { method: "DELETE" });
  },
  patchQuizSession(id: string, payload: { session_answers: Record<string, string>; session_current_question: number }): Promise<void> {
    return request<void>(`/api/quizzes/${id}/session`, { ...json(payload), method: "PATCH" });
  },
  clearQuizSession(id: string): Promise<void> {
    return request<void>(`/api/quizzes/${id}/session`, { method: "DELETE" });
  },
  submitQuiz(id: string, answers: Record<string, string>): Promise<{ correct: number; total: number; score: number }> {
    return request(`/api/quizzes/${id}/submit`, json({ answers }));
  },

  // ---- Diagrams ----
  generateDiagram(topic: string, course?: string | null, document?: string | null, type?: string, ragMode = "fallback"): Promise<GeneratedDiagram> {
    return request<GeneratedDiagram>("/api/diagrams/generate", json({ topic, course: course ?? null, document: document ?? null, type, rag_mode: ragMode }));
  },
  listDiagrams(): Promise<DiagramItem[]> {
    return request<DiagramItem[]>("/api/diagrams");
  },
  deleteDiagram(id: string): Promise<void> {
    return request<void>(`/api/diagrams/${id}`, { method: "DELETE" });
  },

  // ---- Mindmaps ----
  generateMindmap(topic: string, course?: string | null, document?: string | null, ragMode = "fallback"): Promise<GeneratedMindmap> {
    return request<GeneratedMindmap>("/api/mindmaps/generate", json({ topic, course: course ?? null, document: document ?? null, rag_mode: ragMode }));
  },
  listMindmaps(): Promise<GeneratedMindmap[]> {
    return request<GeneratedMindmap[]>("/api/mindmaps");
  },
  deleteMindmap(id: string): Promise<void> {
    return request<void>(`/api/mindmaps/${id}`, { method: "DELETE" });
  },

  // ---- Revision ----
  generateRevision(opts: { topic?: string; course?: string | null; document?: string | null; format: "notes" | "concepts" | "formulas" | "summary"; ragMode?: string }): Promise<GeneratedRevision> {
    const { ragMode, ...rest } = opts;
    return request<GeneratedRevision>("/api/revision/generate", json({ ...rest, rag_mode: ragMode ?? "fallback" }));
  },
  async revisionStream(
    opts: { topic?: string; course?: string | null; document?: string | null; format: "notes" | "concepts" | "formulas" | "summary"; ragMode?: string },
    handlers: {
      onToken: (chunk: string) => void;
      onDone?: (meta: { grounded: boolean; title: string; quality?: QualityScore }) => void;
      onError?: (message: string) => void;
      signal?: AbortSignal;
    },
  ): Promise<void> {
    const { ragMode, ...restOpts } = opts;
    const res = await fetch(`${BASE}/api/revision/generate/stream`, {
      ...json({ ...restOpts, rag_mode: ragMode ?? "fallback" }),
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
        else if (evt.type === "done") handlers.onDone?.({ grounded: evt.grounded, title: evt.title ?? "", quality: evt.quality });
        else if (evt.type === "error") {
          handlers.onError?.(evt.value);
        }
      }
    }
  },
  listRevisions(): Promise<SavedRevision[]> {
    return request<SavedRevision[]>("/api/revisions");
  },
  saveRevision(rev: { title: string; topic: string; course?: string | null; format: string; content: string; quality?: QualityScore }): Promise<SavedRevision> {
    return request<SavedRevision>("/api/revisions", json(rev));
  },
  deleteRevision(id: string): Promise<void> {
    return request<void>(`/api/revisions/${id}`, { method: "DELETE" });
  },

  // ---- Differences ----
  generateDifference(topic: string, course?: string | null, document?: string | null): Promise<GeneratedDifference> {
    return request<GeneratedDifference>("/api/differences/generate", json({ topic, course: course ?? null, document: document ?? null }));
  },
  getDifferenceSuggestions(): Promise<string[]> {
    return request<string[]>("/api/differences/suggestions");
  },
  listDifferences(): Promise<DifferenceTableItem[]> {
    return request<DifferenceTableItem[]>("/api/differences");
  },
  saveDifference(title: string, content: string, course?: string | null, quality?: QualityScore): Promise<DifferenceTableItem> {
    return request<DifferenceTableItem>("/api/differences", json({ title, content, course: course ?? null, quality }));
  },
  deleteDifference(id: number): Promise<void> {
    return request<void>(`/api/differences/${id}`, { method: "DELETE" });
  },
};
