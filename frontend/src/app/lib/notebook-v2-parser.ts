import type { NotebookFull, NotebookMeta } from "./api";
import type { V2Notebook, V2Page, V2Block, V2BlockType } from "./notebook-v2.types";

let _id = 0;
function uid(prefix = "b") {
  return `${prefix}-${Date.now()}-${++_id}`;
}

export function parseBackendNotebook(nb: NotebookFull): V2Notebook {
  const pages: V2Page[] = [];
  
  if (!nb.blocks || nb.blocks.length === 0) {
    pages.push({ id: uid("p"), title: "Page 1", blocks: [] });
  } else {
    // Basic pagination: 6 blocks per page
    const BLOCKS_PER_PAGE = 6;
    for (let i = 0; i < nb.blocks.length; i += BLOCKS_PER_PAGE) {
      const pageBlocks = nb.blocks.slice(i, i + BLOCKS_PER_PAGE).map(convertBlock);
      pages.push({
        id: uid("p"),
        title: `Page ${Math.floor(i / BLOCKS_PER_PAGE) + 1}`,
        blocks: pageBlocks,
      });
    }
  }

  return {
    id: nb.id.toString(),
    title: nb.title || "Untitled Notebook",
    subtitle: nb.subtitle || "",
    metadata: {
      course: nb.course,
      color: nb.color || "#4f4d7a",
      createdAt: nb.updated, // API doesn't have created, using updated
      updatedAt: nb.updated,
      wordCount: 0, // calculate later if needed
      isDraft: nb.is_draft || false,
    },
    pages,
  };
}

function convertBlock(b: any): V2Block {
  // Try to map the old block format to the new V2Block format
  const type = b.type as V2BlockType;
  
  let content: any = {};
  
  if (type === "heading") {
    content = { level: b.level || 1, text: b.text || "" };
  } else if (type === "text") {
    content = { text: b.text || "", source: b.source };
  } else if (type === "callout") {
    content = { tone: b.tone || "note", text: b.text || "" };
  } else if (type === "code") {
    content = { lang: b.lang || "", code: b.code || "" };
  } else if (type === "ai-answer") {
    content = {
      question: b.question || "",
      answer: b.answer || "",
      confidence: b.confidence || 0,
      sources: b.sources || 0,
    };
  } else if (type === "mermaid") {
    content = { code: b.code || "" };
  } else if (type === "table") {
    content = { headers: b.headers || [], rows: b.rows || [] };
  } else if (type === "whiteboard") {
    content = { whiteboardId: b.whiteboardId, title: b.title || "Whiteboard", thumbnail: b.thumbnail };
  } else if (type === "image") {
    content = { url: b.url || "", alt: b.alt, width: b.width, height: b.height };
  } else if (type === "flashdeck") {
    content = { name: b.name || "", count: b.count || 0, cards: b.cards || [] };
  } else if (type === "quiz-results") {
    content = { title: b.title || "", score: b.score || 0, total: b.total || 0 };
  }

  return {
    id: uid(),
    type,
    content,
    metadata: {
      isCollapsed: b.collapsed || false,
      stickyNotes: [], // Old reading notes will need separate conversion if we want them as stickies
    },
  };
}

export function serializeV2Notebook(nb: V2Notebook): any[] {
  // Flatten pages back into a single array for the backend
  return nb.pages.flatMap(p => p.blocks.map(serializeBlock));
}

function serializeBlock(b: V2Block): any {
  return {
    type: b.type,
    ...b.content,
  };
}
