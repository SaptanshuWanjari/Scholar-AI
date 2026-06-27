import type { DriveStep } from "driver.js";

export const knowledgeTour: DriveStep[] = [
  {
    popover: {
      title: "Knowledge Explorer 🧠",
      description:
        "Navigate your personal knowledge graph — the concepts and connections ScholarAI discovered across your study materials.",
    },
  },
  {
    element: '[data-tour="knowledge-sidebar"]',
    popover: {
      title: "Explore & Filter",
      description:
        "Search for concepts and narrow the graph by course, source type, or collection. Your recent and saved concepts live here too.",
      side: "right",
    },
  },
  {
    element: '[data-tour="knowledge-graph"]',
    popover: {
      title: "Concept Graph",
      description:
        "Each node is a concept and each link is a relationship. Click a node to inspect it, or double-click to open its full detail page.",
      side: "left",
    },
  },
  {
    element: '[data-tour="knowledge-inspector"]',
    popover: {
      title: "Concept Inspector",
      description:
        "When you select a concept, this panel shows its sources, references, and AI actions like generating flashcards or summaries.",
      side: "left",
    },
  },
  {
    popover: {
      title: "That's it",
      description:
        "Pick a concept in the graph, inspect it, and generate study assets right from the panel. Replay this tour anytime from the Help (?) menu.",
    },
  },
];
