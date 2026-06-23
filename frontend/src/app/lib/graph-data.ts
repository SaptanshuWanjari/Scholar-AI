import type { Node, Edge } from "@xyflow/react";

// ─── node data shape ────────────────────────────────────────────────────────

export interface ConceptData {
  label: string;
  description: string;
  size: "large" | "medium" | "small";
  refCount: number;
  sourceCount: number;
  cluster: "rag" | "agent" | "infra" | "eval";
}

// ─── nodes ──────────────────────────────────────────────────────────────────

export const conceptNodes: Node<ConceptData>[] = [
  {
    id: "rag",
    type: "concept",
    position: { x: 500, y: 310 },
    data: { label: "RAG", description: "Retrieval-Augmented Generation: grounds LLM answers in retrieved document context.", size: "large", refCount: 42, sourceCount: 11, cluster: "rag" },
  },
  {
    id: "chunking",
    type: "concept",
    position: { x: 200, y: 80 },
    data: { label: "Chunking", description: "Splitting documents into semantically coherent passages before embedding.", size: "medium", refCount: 18, sourceCount: 6, cluster: "rag" },
  },
  {
    id: "embeddings",
    type: "concept",
    position: { x: 600, y: 80 },
    data: { label: "Embeddings", description: "Dense vector representations of text that capture semantic meaning.", size: "medium", refCount: 22, sourceCount: 7, cluster: "rag" },
  },
  {
    id: "langchain",
    type: "concept",
    position: { x: 380, y: 155 },
    data: { label: "LangChain", description: "Orchestration framework for building LLM pipelines and RAG applications.", size: "medium", refCount: 14, sourceCount: 5, cluster: "infra" },
  },
  {
    id: "vector-dbs",
    type: "concept",
    position: { x: 80, y: 240 },
    data: { label: "Vector DBs", description: "Specialized stores for embedding vectors enabling ANN similarity search.", size: "medium", refCount: 16, sourceCount: 6, cluster: "infra" },
  },
  {
    id: "tool-calling",
    type: "concept",
    position: { x: 1030, y: 155 },
    data: { label: "Tool Calling", description: "Structured mechanism for LLMs to invoke external functions and APIs.", size: "medium", refCount: 12, sourceCount: 4, cluster: "agent" },
  },
  {
    id: "hybrid-search",
    type: "concept",
    position: { x: 130, y: 360 },
    data: { label: "Hybrid Search", description: "Combining dense vector similarity with sparse BM25 keyword retrieval.", size: "medium", refCount: 11, sourceCount: 4, cluster: "rag" },
  },
  {
    id: "agent-memory",
    type: "concept",
    position: { x: 850, y: 275 },
    data: { label: "Agent Memory", description: "Persistence mechanisms that let agents retain and recall prior context.", size: "large", refCount: 28, sourceCount: 9, cluster: "agent" },
  },
  {
    id: "mcp",
    type: "concept",
    position: { x: 1110, y: 310 },
    data: { label: "MCP", description: "Model Context Protocol: standardized interface for tool and resource access.", size: "small", refCount: 8, sourceCount: 3, cluster: "agent" },
  },
  {
    id: "re-ranking",
    type: "concept",
    position: { x: 295, y: 455 },
    data: { label: "Re-ranking", description: "Cross-encoder scoring of retrieved passages to improve result precision.", size: "medium", refCount: 9, sourceCount: 3, cluster: "rag" },
  },
  {
    id: "retrieval",
    type: "concept",
    position: { x: 540, y: 475 },
    data: { label: "Retrieval", description: "ANN lookup in a vector store returning the top-K most similar chunks.", size: "large", refCount: 31, sourceCount: 10, cluster: "rag" },
  },
  {
    id: "langgraph",
    type: "concept",
    position: { x: 820, y: 455 },
    data: { label: "LangGraph", description: "Graph-based framework for building stateful, multi-step agent workflows.", size: "medium", refCount: 13, sourceCount: 5, cluster: "agent" },
  },
  {
    id: "context-window",
    type: "concept",
    position: { x: 340, y: 595 },
    data: { label: "Context Window", description: "The finite token budget that constrains how much context an LLM can attend to.", size: "small", refCount: 7, sourceCount: 3, cluster: "infra" },
  },
  {
    id: "evaluation",
    type: "concept",
    position: { x: 610, y: 605 },
    data: { label: "Evaluation", description: "Measuring RAG pipeline quality via faithfulness, relevancy and recall metrics.", size: "medium", refCount: 15, sourceCount: 5, cluster: "eval" },
  },
  {
    id: "prompt-eng",
    type: "concept",
    position: { x: 870, y: 595 },
    data: { label: "Prompt Engineering", description: "Crafting instructions and few-shot examples to guide LLM behaviour.", size: "small", refCount: 6, sourceCount: 3, cluster: "infra" },
  },
];

// ─── edges ──────────────────────────────────────────────────────────────────

const edgeBase = {
  type: "smoothstep",
  style: { stroke: "#c8c2b5", strokeWidth: 1.5 },
  labelStyle: { fontSize: 9, fill: "#79736a", fontFamily: "Inter, sans-serif" },
  labelBgStyle: { fill: "#f6f5f1", fillOpacity: 0.9 },
  labelBgPadding: [3, 2] as [number, number],
  labelBgBorderRadius: 3,
};

export const conceptEdges: Edge[] = [
  { id: "e-chunk-rag", source: "chunking", target: "rag", label: "feeds", ...edgeBase },
  { id: "e-embed-rag", source: "embeddings", target: "rag", label: "feeds", ...edgeBase },
  { id: "e-lc-rag", source: "langchain", target: "rag", label: "implements", ...edgeBase },
  { id: "e-vdb-rag", source: "vector-dbs", target: "rag", label: "stores for", ...edgeBase },
  { id: "e-hs-rag", source: "hybrid-search", target: "rag", label: "improves", ...edgeBase },
  { id: "e-prompt-rag", source: "prompt-eng", target: "rag", label: "influences", ...edgeBase },
  { id: "e-rag-ret", source: "rag", target: "retrieval", label: "uses", ...edgeBase },
  { id: "e-rag-mem", source: "rag", target: "agent-memory", label: "augments", ...edgeBase },
  { id: "e-rag-eval", source: "rag", target: "evaluation", label: "measured by", ...edgeBase },
  { id: "e-chunk-vdb", source: "chunking", target: "vector-dbs", label: "populates", ...edgeBase },
  { id: "e-embed-vdb", source: "embeddings", target: "vector-dbs", label: "indexed in", ...edgeBase },
  { id: "e-vdb-ret", source: "vector-dbs", target: "retrieval", label: "enables", ...edgeBase },
  { id: "e-hs-ret", source: "hybrid-search", target: "retrieval", label: "improves", ...edgeBase },
  { id: "e-ret-rank", source: "retrieval", target: "re-ranking", label: "feeds", ...edgeBase },
  { id: "e-ret-eval", source: "retrieval", target: "evaluation", label: "scored by", ...edgeBase },
  { id: "e-tool-mem", source: "tool-calling", target: "agent-memory", label: "extends", ...edgeBase },
  { id: "e-mcp-tool", source: "mcp", target: "tool-calling", label: "standardizes", ...edgeBase },
  { id: "e-mem-lg", source: "agent-memory", target: "langgraph", label: "managed by", ...edgeBase },
  { id: "e-ctx-rag", source: "context-window", target: "rag", label: "limits", ...edgeBase },
  { id: "e-ctx-mem", source: "context-window", target: "agent-memory", label: "constrains", ...edgeBase },
];

// ─── inspector data ──────────────────────────────────────────────────────────

export interface ConceptInspector {
  id: string;
  name: string;
  confidence: number;
  refCount: number;
  sourceCount: number;
  description: string;
  definition: string;
  aiSummary: string;
  relatedConcepts: string[];
  referencedIn: {
    documents: number;
    notes: number;
    flashcards: number;
    quizzes: number;
    answers: number;
    diagrams: number;
  };
  citations: { source: string; detail: string }[];
}

const inspectorMap: Record<string, ConceptInspector> = {
  "agent-memory": {
    id: "agent-memory",
    name: "Agent Memory",
    confidence: 0.92,
    refCount: 28,
    sourceCount: 7,
    description: "Persistence mechanisms that let agents retain and recall prior context.",
    definition: "Agent memory refers to data structures and storage systems that allow an LLM-based agent to persist information across interactions, recall prior reasoning steps, and build up a growing knowledge state.",
    aiSummary: "Agent memory bridges the gap between the LLM's stateless forward pass and the need for persistent, evolving knowledge. It encompasses short-term (in-context) memory, external storage (vector and key-value), and episodic recall.",
    relatedConcepts: ["State Management", "Long-Term Memory", "Tool Calling", "LangGraph"],
    referencedIn: { documents: 4, notes: 3, flashcards: 12, quizzes: 6, answers: 9, diagrams: 2 },
    citations: [
      { source: "Agent Design Patterns.pdf", detail: "Page 17 — Memory architecture overview" },
      { source: "Agent Memory Guide.md", detail: "Section 3 — Long-term storage strategies" },
      { source: "LangGraph Notes", detail: "Chapter 2 — Stateful agent graphs" },
    ],
  },
  rag: {
    id: "rag",
    name: "RAG",
    confidence: 0.97,
    refCount: 42,
    sourceCount: 11,
    description: "Retrieval-Augmented Generation: grounds LLM answers in retrieved document context.",
    definition: "RAG is an architecture that enhances LLM generation by first retrieving relevant document passages using a vector store, then conditioning the LLM's response on those passages to reduce hallucination.",
    aiSummary: "RAG is the dominant pattern for knowledge-grounded AI assistants. It combines a retrieval index over your documents with an LLM that uses the retrieved context to produce accurate, citable answers.",
    relatedConcepts: ["Chunking", "Embeddings", "Retrieval", "Evaluation", "LangChain"],
    referencedIn: { documents: 7, notes: 6, flashcards: 22, quizzes: 10, answers: 18, diagrams: 5 },
    citations: [
      { source: "RAG Fundamentals.pdf", detail: "Chapter 1 — Architecture overview" },
      { source: "LangChain Docs", detail: "RAG chain implementation" },
      { source: "Backpropagation.pdf", detail: "Related retrieval concepts, p.8" },
    ],
  },
  retrieval: {
    id: "retrieval",
    name: "Retrieval",
    confidence: 0.95,
    refCount: 31,
    sourceCount: 10,
    description: "ANN lookup in a vector store returning the top-K most similar chunks.",
    definition: "Retrieval is the step in a RAG pipeline that queries a vector database with the embedded query to find the K most semantically similar document chunks, which are then passed to the LLM as context.",
    aiSummary: "Retrieval quality is the single largest determinant of RAG answer quality. Improving it through hybrid search, re-ranking and better chunking strategies directly translates to better AI responses.",
    relatedConcepts: ["Chunking", "Embeddings", "Re-ranking", "Hybrid Search", "Vector DBs"],
    referencedIn: { documents: 5, notes: 4, flashcards: 14, quizzes: 7, answers: 12, diagrams: 3 },
    citations: [
      { source: "RAG Fundamentals.pdf", detail: "Chapter 3 — Retrieval strategies" },
      { source: "Vector DB Guide", detail: "ANN search algorithms" },
      { source: "Hybrid Search Paper", detail: "BM25 + dense retrieval comparison" },
    ],
  },
};

export function getInspector(id: string): ConceptInspector {
  if (inspectorMap[id]) return inspectorMap[id];
  const node = conceptNodes.find((n) => n.id === id);
  if (!node) throw new Error(`Unknown concept: ${id}`);
  const d = node.data;
  return {
    id,
    name: d.label,
    confidence: 0.8 + Math.random() * 0.15,
    refCount: d.refCount,
    sourceCount: d.sourceCount,
    description: d.description,
    definition: d.description,
    aiSummary: `${d.label} is a key concept in your knowledge base, referenced across ${d.refCount} artifacts in ${d.sourceCount} source documents.`,
    relatedConcepts: conceptEdges
      .filter((e) => e.source === id || e.target === id)
      .map((e) => {
        const peerId = e.source === id ? e.target : e.source;
        return conceptNodes.find((n) => n.id === peerId)?.data.label ?? peerId;
      })
      .slice(0, 5),
    referencedIn: {
      documents: Math.floor(d.sourceCount * 0.7),
      notes: Math.floor(d.refCount * 0.1),
      flashcards: Math.floor(d.refCount * 0.4),
      quizzes: Math.floor(d.refCount * 0.2),
      answers: Math.floor(d.refCount * 0.3),
      diagrams: Math.max(1, Math.floor(d.refCount * 0.06)),
    },
    citations: [
      { source: `${d.label} — Primary Source.pdf`, detail: "Chapter 1" },
      { source: "Lecture Notes", detail: `${d.label} section` },
    ],
  };
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

export const savedViews = [
  { id: "sv1", label: "My Research", icon: "🔬" },
  { id: "sv2", label: "Exam Topics", icon: "🎯" },
  { id: "sv3", label: "Weak Areas", icon: "📉" },
  { id: "sv4", label: "Recently Added", icon: "🕐" },
];

export const sourceFilters = [
  "Documents", "Notes", "Answers", "Flashcards", "Quizzes", "Diagrams", "Mind Maps",
];

export const relatedDiscoveries: Record<string, string[]> = {
  "agent-memory": ["Conversation Memory", "Vector Memory", "Knowledge Graph Memory", "Long-Term Memory", "State Management"],
  rag: ["Self-RAG", "Corrective RAG", "Modular RAG", "Graph RAG", "Agentic RAG"],
  retrieval: ["Sparse Retrieval", "Dense Retrieval", "Multi-hop Retrieval", "Iterative Retrieval"],
};
