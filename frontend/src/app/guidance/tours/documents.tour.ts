import type { DriveStep } from "driver.js";

export const documentsTour: DriveStep[] = [
  {
    popover: {
      title: "Documents 📄",
      description:
        "This is your study library — every PDF, Markdown or text file you add gets indexed here so the AI can read and learn from it.",
    },
  },
  {
    element: '[data-tour="documents-upload"]',
    popover: {
      title: "Add your materials",
      description:
        "Drop files here or click Browse to upload. Each document is indexed so it becomes searchable and ready for chat, quizzes and flashcards.",
      side: "bottom",
    },
  },
  {
    element: '[data-tour="documents-toolbar"]',
    popover: {
      title: "Find & filter",
      description:
        "Search by name and narrow the list to a single course. Uploads also go into the course you pick here.",
      side: "bottom",
    },
  },
  {
    element: '[data-tour="documents-list"]',
    popover: {
      title: "Your library",
      description:
        "Every document lives here with its status, course and size. Watch for the Indexed badge — that means it's ready to use.",
      side: "top",
    },
  },
  {
    popover: {
      title: "That's it",
      description:
        "Upload your materials, wait for them to index, then head to chat or quizzes to put them to work. Replay this tour anytime from the Help (?) menu.",
    },
  },
];
