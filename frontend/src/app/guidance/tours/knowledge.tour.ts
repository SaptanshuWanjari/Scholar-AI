import type { DriveStep } from "driver.js";
import { tourIcons, tourTitle } from "../tourIcons";

export const knowledgeTour: DriveStep[] = [
  {
    element: '[data-tour="knowledge-graph"]',
    popover: {
      title: tourTitle(tourIcons.network, "Your notes as a concept map"),
      description:
        "ScholarAI links ideas across your documents into a graph. Click a node to explore how concepts connect, or double-click to open its detail page.",
      side: "left",
    },
  },
  {
    element: '[data-tour="knowledge-inspector"]',
    popover: {
      title: tourTitle(tourIcons.panelRight, "Inspect & act on a concept"),
      description:
        "Select a concept to see its sources and references — and generate flashcards or summaries for it right from this panel.",
      side: "left",
    },
  },
];
