import type { DriveStep } from "driver.js";

export const readingTour: DriveStep[] = [
  {
    popover: {
      title: "Reading 📖",
      description: "A focused reading space where your documents come alive with AI assistance.",
    },
  },
  {
    element: '[data-tour="reading-doc"]',
    popover: {
      title: "Pick a document",
      description: "Choose any indexed document here to load it into the reader.",
      side: "right",
    },
  },
  {
    element: '[data-tour="reading-reader"]',
    popover: {
      title: "Reading pane",
      description:
        "Read your document here. Select any passage to highlight, bookmark, or get an AI explanation.",
      side: "left",
    },
  },
  {
    element: '[data-tour="reading-lens"]',
    popover: {
      title: "Academic Lens",
      description:
        "Tune explanations to your level — Beginner, Intermediate, or Expert — and AI adapts its depth to match.",
      side: "left",
    },
  },
  {
    element: '[data-tour="reading-context"]',
    popover: {
      title: "AI context panel",
      description:
        "Your selected text and its AI explanation appear here, so insights stay alongside what you're reading.",
      side: "left",
    },
  },
  {
    popover: {
      title: "That's it",
      description:
        "Pick a document, read, then select text to highlight or explain at your chosen lens. Replay this tour anytime from the Help (?) menu.",
    },
  },
];
