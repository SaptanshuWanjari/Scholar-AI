import type { DriveStep } from "driver.js";

export const flashcardsTour: DriveStep[] = [
  {
    popover: {
      title: "Flashcards 🃏",
      description:
        "Spaced-repetition cards generated straight from your own materials, so you review what matters most.",
    },
  },
  {
    element: '[data-tour="flashcards-generate"]',
    popover: {
      title: "Generate a set",
      description:
        "Enter a topic and optionally scope it to a course or document, then hit Generate to create source-grounded cards.",
      side: "bottom",
    },
  },
  {
    element: '[data-tour="flashcards-decks"]',
    popover: {
      title: "Your decks",
      description:
        "Saved decks live here with their mastery progress. Click one to open its cards and pick up your reviews.",
      side: "top",
    },
  },
  {
    element: '[data-tour="flashcards-views"]',
    popover: {
      title: "Switch views",
      description:
        "Browse cards as a grid or list, or jump into Study mode to review them one at a time.",
      side: "bottom",
    },
  },
  {
    element: '[data-tour="flashcards-rate"]',
    popover: {
      title: "Rate your recall",
      description:
        "In Study mode, mark each card Hard or Easy so spaced repetition can schedule when you see it next.",
      side: "top",
    },
  },
  {
    popover: {
      title: "That's it",
      description:
        "Generate a set, save it as a deck, and study with honest ratings. Replay this tour anytime from the Help (?) menu.",
    },
  },
];
