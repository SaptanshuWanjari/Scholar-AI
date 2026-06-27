import type { DriveStep } from "driver.js";

export const examTour: DriveStep[] = [
  {
    popover: {
      title: "Exam 🎓",
      description:
        "Simulate a realistic, timed mock exam generated straight from your own uploaded materials.",
    },
  },
  {
    element: '[data-tour="exam-setup"]',
    popover: {
      title: "Configure your exam",
      description:
        "Set the topic, difficulty, question types, count and time limit here to shape the exam to your needs.",
      side: "top",
    },
  },
  {
    element: '[data-tour="exam-source"]',
    popover: {
      title: "Source material",
      description:
        "Scope the exam to a specific course or document so questions are grounded in exactly what you want to study.",
      side: "bottom",
    },
  },
  {
    element: '[data-tour="exam-generate"]',
    popover: {
      title: "Generate the exam",
      description:
        "Review your settings summary, then hit Generate to build the exam and drop into a timed session.",
      side: "top",
    },
  },
  {
    popover: {
      title: "That's it",
      description:
        "Configure, generate, then take your timed exam and review the results. Replay this tour anytime from the Help (?) menu.",
    },
  },
];
