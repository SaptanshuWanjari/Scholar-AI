export interface NotebookMeta {
  id: string;
  name: string;
  emoji: string;
  notes: number;
  lastEdited: string;
  color: string;
}

export const notebooks: NotebookMeta[] = [
  { id: "nb1", name: "Machine Learning", emoji: "🧠", notes: 18, lastEdited: "2h ago", color: "#4f4d7a" },
  { id: "nb2", name: "Organic Chemistry", emoji: "⚗️", notes: 12, lastEdited: "Yesterday", color: "#3f6b6f" },
  { id: "nb3", name: "Operating Systems", emoji: "🖥️", notes: 9, lastEdited: "3d ago", color: "#a3771f" },
  { id: "nb4", name: "Research Ideas", emoji: "💡", notes: 24, lastEdited: "1w ago", color: "#3f7a4e" },
  { id: "nb5", name: "Exam Prep", emoji: "🎯", notes: 7, lastEdited: "1w ago", color: "#9f3a36" },
];

export const collections = [
  { id: "col1", name: "Deep Learning", count: 6 },
  { id: "col2", name: "Reaction Kinetics", count: 4 },
  { id: "col3", name: "Concurrency", count: 3 },
];

export const tags = [
  "attention",
  "gradients",
  "backprop",
  "thermodynamics",
  "deadlock",
  "exam-critical",
];

export const recentNotes = [
  { id: "rn1", title: "Transformers", notebook: "Machine Learning" },
  { id: "rn2", title: "SN1 vs SN2 Pathways", notebook: "Organic Chemistry" },
  { id: "rn3", title: "Process Scheduling", notebook: "Operating Systems" },
];

export type NotebookBlock =
  | { type: "heading"; level: 1 | 2; text: string }
  | { type: "text"; text: string }
  | { type: "callout"; tone: "note" | "warning" | "insight"; text: string }
  | { type: "code"; lang: string; code: string }
  | { type: "ai-answer"; question: string; answer: string; confidence: number; sources: number }
  | { type: "mermaid"; code: string }
  | { type: "flashdeck"; name: string; count: number; cards: { front: string; back: string }[] }
  | { type: "quiz-results"; title: string; score: number; total: number }
  | { type: "table"; headers: string[]; rows: string[][] };

export interface NotebookPage {
  notebookId: string;
  title: string;
  subtitle: string;
  updated: string;
  blocks: NotebookBlock[];
}

export const activeNotebookPage: NotebookPage = {
  notebookId: "nb1",
  title: "Transformers",
  subtitle: "Understanding self-attention and sequence modeling.",
  updated: "Edited 2 hours ago",
  blocks: [
    {
      type: "text",
      text: "Transformers replaced recurrence with **self-attention**, allowing every token to attend to every other token in a sequence in parallel. This is the architecture behind modern large language models.",
    },
    {
      type: "callout",
      tone: "insight",
      text: "Key idea: attention is a learned, content-based weighting over the entire sequence — no fixed window, no recurrence.",
    },
    { type: "heading", level: 2, text: "Self-Attention" },
    {
      type: "text",
      text: "Each token is projected into a Query, Key and Value vector. Attention scores are the scaled dot-products of queries with keys, passed through a softmax, then used to weight the values.",
    },
    {
      type: "code",
      lang: "python",
      code: "scores = (Q @ K.T) / sqrt(d_k)\nweights = softmax(scores, axis=-1)\noutput = weights @ V",
    },
    {
      type: "ai-answer",
      question: "Why do Transformers scale attention by √dₖ?",
      answer:
        "Scaling by **√dₖ** keeps the dot-product magnitudes stable as dimensionality grows. Without it, large dot products push softmax into regions with vanishing gradients, slowing learning [1].",
      confidence: 0.93,
      sources: 3,
    },
    { type: "heading", level: 2, text: "Architecture Overview" },
    {
      type: "mermaid",
      code: `graph TD
  A[Input Embedding] --> B[Positional Encoding]
  B --> C[Multi-Head Attention]
  C --> D[Add & Norm]
  D --> E[Feed Forward]
  E --> F[Add & Norm]
  F --> G[Output]`,
    },
    {
      type: "table",
      headers: ["Component", "Purpose"],
      rows: [
        ["Multi-Head Attention", "Attend to multiple representation subspaces"],
        ["Positional Encoding", "Inject token order information"],
        ["Feed Forward", "Per-token non-linear transformation"],
        ["Residual + LayerNorm", "Stabilize deep training"],
      ],
    },
    {
      type: "flashdeck",
      name: "Transformer Essentials",
      count: 8,
      cards: [
        { front: "What does the Query vector represent?", back: "What a token is looking for in other tokens." },
        { front: "Why multi-head attention?", back: "To capture different relationship types in parallel subspaces." },
        { front: "Role of positional encoding?", back: "Restores sequence order lost by parallel attention." },
      ],
    },
    {
      type: "quiz-results",
      title: "Transformer Fundamentals Quiz",
      score: 9,
      total: 10,
    },
  ],
};

export const inspector = {
  details: { created: "Jun 14, 2026", type: "Concept Note", notebook: "Machine Learning" },
  wordCount: 642,
  readingTime: "3 min",
  linkedSources: [
    "Attention Is All You Need (2017)",
    "Transformers Architecture.pdf",
    "Lecture 11 — Sequence Models",
  ],
  generatedAssets: [
    { label: "AI Answers", count: 1 },
    { label: "Diagrams", count: 1 },
    { label: "Flashcards", count: 8 },
    { label: "Quizzes", count: 1 },
  ],
  citations: 3,
  relatedTopics: ["Attention", "RNNs", "BERT", "Positional Encoding", "Tokenization"],
  revisionStatus: "In progress",
};
