import type { DriveStep } from "driver.js";

export const revisionTour: DriveStep[] = [
  {
    popover: {
      title: "Revision Mode 📝",
      description:
        "Turn your uploaded materials into exam-ready study sheets in a few clicks.",
    },
  },
  {
    element: '[data-tour="revision-format"]',
    popover: {
      title: "Pick a Format",
      description:
        "Choose what kind of sheet to build — exam notes, key concepts, a formula explorer, or a quick summary.",
      side: "right",
    },
  },
  {
    element: '[data-tour="revision-source"]',
    popover: {
      title: "Set Your Source",
      description:
        "Enter a topic and optionally narrow it to a specific course or document. Provide at least a topic or a course.",
      side: "right",
    },
  },
  {
    element: '[data-tour="revision-generate"]',
    popover: {
      title: "Generate",
      description:
        "Build your study sheet from the selected materials. You can stop generation at any time.",
      side: "top",
    },
  },
  {
    element: '[data-tour="revision-preview"]',
    popover: {
      title: "Preview & Export",
      description:
        "Your generated sheet appears here. Use Export to download it as markdown for offline review.",
      side: "bottom",
    },
  },
  {
    popover: {
      title: "That's it",
      description:
        "Pick a format, add a topic, generate, then export. Replay this tour anytime from the Help (?) menu.",
    },
  },
];
