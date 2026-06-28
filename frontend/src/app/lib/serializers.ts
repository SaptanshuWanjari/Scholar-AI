// Universal artifact -> Markdown serializers.
//
// Every "Add to Notebook" action converts a structured study artifact into a
// clean Markdown string that is stored as a single `text` notebook block. The
// notebook's MarkdownRenderer renders GFM tables and ```mermaid fences natively
// (the latter via DiagramViewer), so one Markdown block can represent any
// artifact type. Serialization is fully client-side to save backend compute.

import { parseMindmapText } from "../components/MindMapTree";

export const ARTIFACT_TYPES = {
  flashcard: "flashcard",
  flashdeck: "flashdeck",
  quiz: "quiz",
  diagram: "diagram",
  mindmap: "mindmap",
  difference: "difference",
  revision: "revision",
} as const;

export type ArtifactType = (typeof ARTIFACT_TYPES)[keyof typeof ARTIFACT_TYPES];

// ---- Flashcards ----

export interface FlashcardLike {
  front: string;
  back: string;
}

export function serializeFlashcard(card: FlashcardLike): string {
  return `**Q:** ${card.front.trim()}\n\n**A:** ${card.back.trim()}`;
}

export function serializeFlashcards(cards: FlashcardLike[], name?: string): string {
  const heading = name ? `## ${name}\n\n` : "";
  return heading + cards.map(serializeFlashcard).join("\n\n---\n\n");
}

// ---- Quizzes ----

export interface QuizQuestionLike {
  prompt: string;
  answer: string;
  explanation?: string;
}

export function serializeQuizQuestion(q: QuizQuestionLike): string {
  const context = q.explanation?.trim() ? `\n*Context: ${q.explanation.trim()}*` : "";
  return `**Question:** ${q.prompt.trim()}\n**Correct Answer:** ${q.answer.trim()}${context}`;
}

export function serializeQuizQuestions(questions: QuizQuestionLike[], title?: string): string {
  const heading = title ? `## ${title}\n\n` : "";
  return heading + questions.map(serializeQuizQuestion).join("\n\n---\n\n");
}

// ---- Diagrams ----

export function serializeDiagram(mermaid: string, title?: string): string {
  const heading = title ? `## ${title}\n\n` : "";
  return `${heading}\`\`\`mermaid\n${mermaid.trim()}\n\`\`\``;
}

// ---- Mind maps ----

interface MindmapNodeLike {
  label: string;
  children: MindmapNodeLike[];
}

function mindmapNodesToMarkdown(nodes: MindmapNodeLike[], depth = 0): string {
  return nodes
    .map((node) => {
      const indent = "  ".repeat(depth);
      const line = `${indent}- ${node.label}`;
      const children = node.children.length
        ? "\n" + mindmapNodesToMarkdown(node.children, depth + 1)
        : "";
      return line + children;
    })
    .join("\n");
}

export function serializeMindmap(text: string, title?: string): string {
  const heading = title ? `## ${title}\n\n` : "";
  return heading + mindmapNodesToMarkdown(parseMindmapText(text) as MindmapNodeLike[]);
}

// ---- Differences / Revision (already Markdown) ----

export function serializeMarkdownContent(content: string, title?: string): string {
  const body = content.trim();
  if (!title) return body;
  // Avoid duplicating a heading the content may already start with.
  return body.startsWith("#") ? body : `## ${title}\n\n${body}`;
}

export const serializeDifference = serializeMarkdownContent;
export const serializeRevision = serializeMarkdownContent;

// ---- Dispatch ----

/**
 * Serialize a raw artifact payload by type. The shape of `content` depends on
 * `artifactType`; callers pass the matching raw object/string.
 */
export function serializeArtifact(artifactType: string, content: unknown): string {
  switch (artifactType) {
    case ARTIFACT_TYPES.flashcard:
      return serializeFlashcard(content as FlashcardLike);
    case ARTIFACT_TYPES.flashdeck: {
      const c = content as { name?: string; cards: FlashcardLike[] };
      return serializeFlashcards(c.cards, c.name);
    }
    case ARTIFACT_TYPES.quiz: {
      if (Array.isArray(content)) return serializeQuizQuestions(content as QuizQuestionLike[]);
      const c = content as { title?: string; questions: QuizQuestionLike[] };
      if (c.questions) return serializeQuizQuestions(c.questions, c.title);
      return serializeQuizQuestion(content as QuizQuestionLike);
    }
    case ARTIFACT_TYPES.diagram: {
      const c = content as { title?: string; mermaid: string };
      return serializeDiagram(c.mermaid, c.title);
    }
    case ARTIFACT_TYPES.mindmap: {
      const c = content as { title?: string; text: string };
      return serializeMindmap(c.text, c.title);
    }
    case ARTIFACT_TYPES.difference:
    case ARTIFACT_TYPES.revision: {
      const c = content as { title?: string; content: string };
      return serializeMarkdownContent(c.content, c.title);
    }
    default:
      return typeof content === "string" ? content : JSON.stringify(content);
  }
}

const ARTIFACT_LABELS: Record<string, string> = {
  flashcard: "Flashcard",
  flashdeck: "Flashcard Deck",
  quiz: "Quiz",
  diagram: "Diagram",
  mindmap: "Mind Map",
  difference: "Difference Table",
  revision: "Revision Notes",
  whiteboard: "Whiteboard",
};

export function artifactLabel(artifactType: string): string {
  return ARTIFACT_LABELS[artifactType] ?? artifactType;
}
