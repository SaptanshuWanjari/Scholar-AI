/**
 * Notebook V2 — Zustand Store
 *
 * Manages multi-page notebook state: pages, blocks, sticky notes.
 * Pattern follows project convention: interface = state + actions, `create<I>((set, get) => …)`.
 */

import { create } from "zustand";
import type {
  V2Notebook,
  V2Page,
  V2Block,
  V2BlockType,
  StickyNoteData,
  StickyColor,
  BlockPayloads,
} from "../lib/notebook-v2.types";
import { api } from "../lib/api";

// ────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────

let _id = 0;
function uid(prefix = "b") {
  return `${prefix}-${Date.now()}-${++_id}`;
}

function emptyBlock<T extends V2BlockType>(
  type: T,
  content: BlockPayloads[T],
): V2Block<T> {
  return {
    id: uid(),
    type,
    content,
    metadata: { isCollapsed: false, stickyNotes: [] },
  };
}

function emptyPage(title = "Untitled"): V2Page {
  return { id: uid("p"), title, blocks: [] };
}

// ────────────────────────────────────────────────
// Store interface
// ────────────────────────────────────────────────

interface NotebookV2State {
  notebook: V2Notebook | null;
  activePageId: string | null;

  // Derived convenience
  activePage: () => V2Page | null;

  // Notebook
  loadNotebook: (nb: V2Notebook) => void;
  createDemoNotebook: () => void;

  // Page CRUD
  addPage: (title?: string, index?: number) => void;
  deletePage: (pageId: string) => void;
  renamePage: (pageId: string, title: string) => void;
  setActivePage: (pageId: string) => void;
  movePage: (fromIndex: number, toIndex: number) => void;

  // Block CRUD
  addBlock: <T extends V2BlockType>(
    pageId: string,
    type: T,
    content: BlockPayloads[T],
    index?: number,
  ) => void;
  updateBlockContent: (
    pageId: string,
    blockId: string,
    content: Partial<BlockPayloads[V2BlockType]>,
  ) => void;
  deleteBlock: (pageId: string, blockId: string) => void;
  moveBlock: (
    pageId: string,
    fromIndex: number,
    toIndex: number,
  ) => void;
  toggleCollapse: (pageId: string, blockId: string) => void;
  duplicateBlock: (pageId: string, blockId: string) => void;

  // Sticky notes (child of block)
  addStickyNote: (
    pageId: string,
    blockId: string,
    text: string,
    color?: StickyColor,
  ) => void;
  updateStickyNote: (
    pageId: string,
    blockId: string,
    noteId: string,
    text: string,
  ) => void;
  deleteStickyNote: (
    pageId: string,
    blockId: string,
    noteId: string,
  ) => void;

  // AI Deduplication
  checkDeduplication: (
    pageId: string,
    blockId: string,
    text: string,
  ) => Promise<void>;
}

// ────────────────────────────────────────────────
// Store
// ────────────────────────────────────────────────

export const useNotebookV2Store = create<NotebookV2State>((set, get) => ({
  notebook: null,
  activePageId: null,

  activePage: () => {
    const { notebook, activePageId } = get();
    if (!notebook || !activePageId) return null;
    return notebook.pages.find((p) => p.id === activePageId) ?? null;
  },

  loadNotebook: (nb) =>
    set({
      notebook: nb,
      activePageId: nb.pages[0]?.id ?? null,
    }),

  createDemoNotebook: () => {
    const coverPage = emptyPage("Cover");
    coverPage.blocks = [
      emptyBlock("heading", { level: 1, text: "Minimax Algorithm" }),
      emptyBlock("text", {
        text: "A complete study notebook covering game trees, minimax decision-making, and alpha-beta pruning.",
      }),
    ];

    const conceptsPage = emptyPage("Key Concepts");
    conceptsPage.blocks = [
      emptyBlock("heading", { level: 1, text: "Key Concepts" }),
      emptyBlock("callout", {
        tone: "insight",
        text: "Minimax is a decision rule used in zero-sum games to minimize the possible loss for a worst case scenario.",
      }),
      emptyBlock("text", {
        text: "**Max** tries to maximize the score.\n**Min** tries to minimize the score.\nThey take turns until the game ends.",
      }),
      emptyBlock("heading", { level: 2, text: "Step by Step" }),
      emptyBlock("text", {
        text: "1. MIN chooses min(3, 5) = 3\n2. MIN chooses min(2, 9) = 2\n3. MAX chooses max(3, 2) = 3\n\nHence, optimal value = 3",
      }),
      emptyBlock("code", {
        lang: "python",
        code: `def minimax(node, depth, isMax):
    if isTerminal(node) or depth == 0:
        return evaluate(node)

    if isMax:
        value = -inf
        for child in children(node):
            value = max(value, minimax(child, depth-1, False))
        return value
    else:
        value = +inf
        for child in children(node):
            value = min(value, minimax(child, depth-1, True))
        return value`,
      }),
    ];

    // Add a sticky note to the callout block
    conceptsPage.blocks[1].metadata.stickyNotes = [
      {
        id: uid("s"),
        text: "This is the foundation of game AI!",
        color: "yellow",
        createdAt: new Date().toISOString(),
      },
    ];

    const complexityPage = emptyPage("Complexity & Analysis");
    complexityPage.blocks = [
      emptyBlock("heading", { level: 1, text: "Complexity & Analysis" }),
      emptyBlock("callout", {
        tone: "warning",
        text: "Time complexity: O(b^d) where b = branching factor, d = depth of tree.",
      }),
      emptyBlock("table", {
        headers: ["Level", "Type", "Values", "Result"],
        rows: [
          ["Level 3", "Terminal", "3, 5, 2, 9", "-"],
          ["Level 2", "MIN", "(3,5), (2,9)", "3, 2"],
          ["Level 1", "MAX", "(3, 2)", "3"],
        ],
      }),
      emptyBlock("ai-answer", {
        question: "Why is alpha-beta pruning important for minimax?",
        answer:
          "Alpha-beta pruning reduces the number of nodes evaluated in the minimax tree. It stops evaluating a move when at least one possibility has been found that proves the move to be worse than a previously examined move. Best case: reduces time complexity from O(b^d) to O(b^(d/2)).",
        confidence: 0.95,
        sources: 2,
      }),
    ];

    const practicePage = emptyPage("Practice");
    practicePage.blocks = [
      emptyBlock("heading", { level: 1, text: "Practice Questions" }),
      emptyBlock("text", {
        text: "**Q1:** Given the following game tree, what will be the minimax value?\n\nMAX → MIN → [2, 4], MIN → [7, 1], MIN → [8, 3]",
      }),
      emptyBlock("callout", {
        tone: "note",
        text: "Try solving this by hand before checking the answer.",
      }),
    ];

    const nb: V2Notebook = {
      id: uid("nb"),
      title: "Minimax Algorithm",
      subtitle: "Game Trees & Decision Making",
      metadata: {
        course: "Artificial Intelligence",
        color: "#4f4d7a",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        wordCount: 0,
        isDraft: false,
      },
      pages: [coverPage, conceptsPage, complexityPage, practicePage],
    };

    set({ notebook: nb, activePageId: coverPage.id });
  },

  // ── Page actions ──────────────────────────────

  addPage: (title, index) =>
    set((s) => {
      if (!s.notebook) return s;
      const page = emptyPage(title);
      const pages = [...s.notebook.pages];
      if (index !== undefined) {
        pages.splice(index, 0, page);
      } else {
        pages.push(page);
      }
      return {
        notebook: { ...s.notebook, pages },
        activePageId: page.id,
      };
    }),

  deletePage: (pageId) =>
    set((s) => {
      if (!s.notebook) return s;
      const pages = s.notebook.pages.filter((p) => p.id !== pageId);
      const activePageId =
        s.activePageId === pageId ? (pages[0]?.id ?? null) : s.activePageId;
      return { notebook: { ...s.notebook, pages }, activePageId };
    }),

  renamePage: (pageId, title) =>
    set((s) => {
      if (!s.notebook) return s;
      const pages = s.notebook.pages.map((p) =>
        p.id === pageId ? { ...p, title } : p,
      );
      return { notebook: { ...s.notebook, pages } };
    }),

  setActivePage: (pageId) => set({ activePageId: pageId }),

  movePage: (fromIndex, toIndex) =>
    set((s) => {
      if (!s.notebook) return s;
      const pages = [...s.notebook.pages];
      const [moved] = pages.splice(fromIndex, 1);
      pages.splice(toIndex, 0, moved);
      return { notebook: { ...s.notebook, pages } };
    }),

  // ── Block actions ─────────────────────────────

  addBlock: (pageId, type, content, index) =>
    set((s) => {
      if (!s.notebook) return s;
      const block = emptyBlock(type, content);
      const pages = s.notebook.pages.map((p) => {
        if (p.id !== pageId) return p;
        const blocks = [...p.blocks];
        if (index !== undefined) {
          blocks.splice(index, 0, block);
        } else {
          blocks.push(block);
        }
        return { ...p, blocks };
      });
      return { notebook: { ...s.notebook, pages } };
    }),

  updateBlockContent: (pageId, blockId, content) => {
    set((s) => {
      if (!s.notebook) return s;
      const pages = s.notebook.pages.map((p) => {
        if (p.id !== pageId) return p;
        const blocks = p.blocks.map((b) =>
          b.id === blockId ? { ...b, content: { ...b.content, ...content } } : b,
        );
        return { ...p, blocks };
      });
      return { notebook: { ...s.notebook, pages } };
    });
    
    // Check for deduplication async
    const textToCheck = (content as any).text || (content as any).code || (content as any).answer;
    if (textToCheck && typeof textToCheck === "string") {
      get().checkDeduplication(pageId, blockId, textToCheck);
    }
  },

  deleteBlock: (pageId, blockId) =>
    set((s) => {
      if (!s.notebook) return s;
      const pages = s.notebook.pages.map((p) => {
        if (p.id !== pageId) return p;
        return { ...p, blocks: p.blocks.filter((b) => b.id !== blockId) };
      });
      return { notebook: { ...s.notebook, pages } };
    }),

  moveBlock: (pageId, fromIndex, toIndex) =>
    set((s) => {
      if (!s.notebook) return s;
      const pages = s.notebook.pages.map((p) => {
        if (p.id !== pageId) return p;
        const blocks = [...p.blocks];
        const [moved] = blocks.splice(fromIndex, 1);
        blocks.splice(toIndex, 0, moved);
        return { ...p, blocks };
      });
      return { notebook: { ...s.notebook, pages } };
    }),

  toggleCollapse: (pageId, blockId) =>
    set((s) => {
      if (!s.notebook) return s;
      const pages = s.notebook.pages.map((p) => {
        if (p.id !== pageId) return p;
        const blocks = p.blocks.map((b) =>
          b.id === blockId
            ? {
                ...b,
                metadata: {
                  ...b.metadata,
                  isCollapsed: !b.metadata.isCollapsed,
                },
              }
            : b,
        );
        return { ...p, blocks };
      });
      return { notebook: { ...s.notebook, pages } };
    }),

  duplicateBlock: (pageId, blockId) =>
    set((s) => {
      if (!s.notebook) return s;
      const pages = s.notebook.pages.map((p) => {
        if (p.id !== pageId) return p;
        const idx = p.blocks.findIndex((b) => b.id === blockId);
        if (idx === -1) return p;
        const original = p.blocks[idx];
        const clone: V2Block = {
          ...original,
          id: uid(),
          metadata: {
            ...original.metadata,
            stickyNotes: original.metadata.stickyNotes.map((n) => ({
              ...n,
              id: uid("s"),
            })),
          },
        };
        const blocks = [...p.blocks];
        blocks.splice(idx + 1, 0, clone);
        return { ...p, blocks };
      });
      return { notebook: { ...s.notebook, pages } };
    }),

  // ── Sticky note actions ───────────────────────

  addStickyNote: (pageId, blockId, text, color = "yellow") =>
    set((s) => {
      if (!s.notebook) return s;
      const note: StickyNoteData = {
        id: uid("s"),
        text,
        color,
        createdAt: new Date().toISOString(),
      };
      const pages = s.notebook.pages.map((p) => {
        if (p.id !== pageId) return p;
        const blocks = p.blocks.map((b) =>
          b.id === blockId
            ? {
                ...b,
                metadata: {
                  ...b.metadata,
                  stickyNotes: [...b.metadata.stickyNotes, note],
                },
              }
            : b,
        );
        return { ...p, blocks };
      });
      return { notebook: { ...s.notebook, pages } };
    }),

  updateStickyNote: (pageId, blockId, noteId, text) =>
    set((s) => {
      if (!s.notebook) return s;
      const pages = s.notebook.pages.map((p) => {
        if (p.id !== pageId) return p;
        const blocks = p.blocks.map((b) => {
          if (b.id !== blockId) return b;
          return {
            ...b,
            metadata: {
              ...b.metadata,
              stickyNotes: b.metadata.stickyNotes.map((n) =>
                n.id === noteId ? { ...n, text } : n,
              ),
            },
          };
        });
        return { ...p, blocks };
      });
      return { notebook: { ...s.notebook, pages } };
    }),

  deleteStickyNote: (pageId, blockId, noteId) =>
    set((s) => {
      if (!s.notebook) return s;
      const pages = s.notebook.pages.map((p) => {
        if (p.id !== pageId) return p;
        const blocks = p.blocks.map((b) => {
          if (b.id !== blockId) return b;
          return {
            ...b,
            metadata: {
              ...b.metadata,
              stickyNotes: b.metadata.stickyNotes.filter(
                (n) => n.id !== noteId,
              ),
            },
          };
        });
        return { ...p, blocks };
      });
      return { notebook: { ...s.notebook, pages } };
    }),

  checkDeduplication: async (pageId, blockId, text) => {
    const { notebook } = get();
    if (!notebook || !text.trim()) return;
    try {
      const res = await api.notebookDeduplicate(parseInt(notebook.id, 10), text);
      if (res.redundant && res.existing_block_index !== null) {
        // Flag the block in metadata
        set((s) => {
          if (!s.notebook) return s;
          const pages = s.notebook.pages.map((p) => {
            if (p.id !== pageId) return p;
            const blocks = p.blocks.map((b) =>
              b.id === blockId
                ? {
                    ...b,
                    metadata: {
                      ...b.metadata,
                      _flagged: {
                        similarity: res.similarity,
                        content: text,
                        originalIndex: res.existing_block_index,
                      },
                    } as any,
                  }
                : b,
            );
            return { ...p, blocks };
          });
          return { notebook: { ...s.notebook, pages } };
        });
      }
    } catch (e) {
      console.error("Deduplication check failed", e);
    }
  },
}));
