import type { DriveStep } from "driver.js";
import { tourIcons, tourTitle } from "../tourIcons";

export const dashboardTour: DriveStep[] = [
  {
    popover: {
      title: tourTitle(tourIcons.sparkles, "Welcome to ScholarAI"),
      description:
        "Your home base. The flow is simple: add study material, then ask questions or generate flashcards, quizzes and revision sheets grounded in it.",
    },
  },
  {
    element: '[data-tour="global-search"]',
    popover: {
      title: tourTitle(tourIcons.command, "Jump anywhere with ⌘K"),
      description:
        "Press ⌘K from any page to search your documents or jump straight to a tool — the fastest way around the app.",
      side: "bottom",
    },
  },
];
