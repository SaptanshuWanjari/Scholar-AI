import type { DriveStep } from "driver.js";

export const dashboardTour: DriveStep[] = [
  {
    popover: {
      title: "Welcome to ScholarAI 👋",
      description:
        "This is your Dashboard — a snapshot of your learning. Let's take a 30-second tour of what you can do here.",
    },
  },
  {
    element: '[data-tour="dashboard-actions"]',
    popover: {
      title: "Start here",
      description:
        "Jump straight into Ask AI for source-grounded answers, or Teach Me to learn a concept interactively.",
      side: "bottom",
      align: "end",
    },
  },
  {
    element: '[data-tour="dashboard-metrics"]',
    popover: {
      title: "Your progress at a glance",
      description:
        "Documents, flashcards, quizzes and study sessions update as you work — a quick pulse on your momentum.",
      side: "top",
    },
  },
  {
    element: '[data-tour="dashboard-recent"]',
    popover: {
      title: "Pick up where you left off",
      description:
        "Recently added documents show up here. Click through to keep studying without hunting for files.",
      side: "top",
    },
  },
  {
    element: '[data-tour="global-search"]',
    popover: {
      title: "Go anywhere fast",
      description:
        "Press ⌘K (or click here) any time to search and jump to any page or document.",
      side: "bottom",
    },
  },
  {
    popover: {
      title: "That's the gist",
      description:
        "Workflow: add documents → ask questions or generate study material → review with flashcards & quizzes. Replay this tour any time from the Help (?) menu in the top bar.",
    },
  },
];
