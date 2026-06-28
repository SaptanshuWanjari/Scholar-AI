// ─── node data shape ────────────────────────────────────────────────────────

export interface ConceptData extends Record<string, unknown> {
  label: string;
  description: string;
  size: "large" | "medium" | "small";
  refCount: number;
  sourceCount: number;
  cluster: string;
  masteryStatus: "Unknown" | "Learning" | "Weak" | "Needs Revision" | "Mastered";
  masteryScore: number;
  importance: number;
  artifactCounts: { flashcards: number; whiteboards: number; revisions: number; packages: number };
}

// ─── left panel data ─────────────────────────────────────────────────────────

export const explorerCollections = [
  { id: "rag-col", label: "RAG", count: 14 },
  { id: "lc-col", label: "LangChain", count: 8 },
  { id: "lg-col", label: "LangGraph", count: 6 },
  { id: "agent-col", label: "Agent Systems", count: 11 },
  { id: "prompt-col", label: "Prompt Engineering", count: 5 },
  { id: "vdb-col", label: "Vector Databases", count: 7 },
  { id: "mcp-col", label: "MCP", count: 4 },
  { id: "eval-col", label: "Evaluation", count: 6 },
];

export const recentConcepts = [
  "Chunking", "Embeddings", "Hybrid Search", "Agent Memory", "Tool Calling",
];

import { Microscope, Target, TrendingDown, Clock } from "lucide-react";

export const savedViews = [
  { id: "sv1", label: "My Research", icon: Microscope },
  { id: "sv2", label: "Exam Topics", icon: Target },
  { id: "sv3", label: "Weak Areas", icon: TrendingDown },
  { id: "sv4", label: "Recently Added", icon: Clock },
];

export const sourceFilters = [
  "Documents", "Notes", "Answers", "Flashcards", "Quizzes", "Diagrams", "Mind Maps",
];

export const relatedDiscoveries: Record<string, string[]> = {
  "agent-memory": ["Conversation Memory", "Vector Memory", "Knowledge Graph Memory", "Long-Term Memory", "State Management"],
  rag: ["Self-RAG", "Corrective RAG", "Modular RAG", "Graph RAG", "Agentic RAG"],
  retrieval: ["Sparse Retrieval", "Dense Retrieval", "Multi-hop Retrieval", "Iterative Retrieval"],
};
