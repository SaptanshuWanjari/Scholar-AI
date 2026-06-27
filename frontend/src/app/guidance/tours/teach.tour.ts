import type { DriveStep } from "driver.js";

export const teachTour: DriveStep[] = [
  {
    popover: {
      title: "Teach Me 💡",
      description:
        "Turn any topic into a complete learning workspace — learn concepts interactively, all in one place.",
    },
  },
  {
    element: '[data-tour="teach-input"]',
    popover: {
      title: "Name your topic",
      description:
        "Type whatever you want to learn here. Suggestions and tailored recommendations appear as you go.",
      side: "bottom",
    },
  },
  {
    element: '[data-tour="teach-artifacts"]',
    popover: {
      title: "Choose what to generate",
      description:
        "Pick the study artifacts you want — notes, flashcards, quiz, mind map and more. Use the recommendations to focus on what helps most.",
      side: "top",
    },
  },
  {
    element: '[data-tour="teach-generate"]',
    popover: {
      title: "Build the package",
      description:
        "Generate your learning package in one click. We check prerequisites first, then assemble everything you selected.",
      side: "top",
    },
  },
  {
    popover: {
      title: "That's it",
      description:
        "Enter a topic, pick your artifacts, and generate your workspace. Replay this tour anytime from the Help (?) menu.",
    },
  },
];
