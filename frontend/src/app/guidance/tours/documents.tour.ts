import type { DriveStep } from "driver.js";
import { tourIcons, tourTitle } from "../tourIcons";

export const documentsTour: DriveStep[] = [
  {
    element: '[data-tour="documents-upload"]',
    popover: {
      title: tourTitle(tourIcons.upload, "Everything starts here"),
      description:
        "Files you add are automatically indexed and become searchable across every tool — Ask AI, flashcards, quizzes and more. Text-based PDFs work best.",
      side: "bottom",
    },
  },
  {
    element: '[data-tour="documents-toolbar"]',
    popover: {
      title: tourTitle(tourIcons.filter, "Organize by course"),
      description:
        "Filter documents by course here, so you can later scope answers and study sets to a single subject.",
      side: "bottom",
    },
  },
];
