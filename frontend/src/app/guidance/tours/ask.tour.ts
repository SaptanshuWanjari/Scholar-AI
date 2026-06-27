import type { DriveStep } from "driver.js";

export const askTour: DriveStep[] = [
  {
    popover: {
      title: "Ask AI ✨",
      description:
        "Get source-grounded answers drawn straight from your own materials, complete with citations you can trust.",
    },
  },
  {
    element: '[data-tour="ask-scope"]',
    popover: {
      title: "Narrow the focus",
      description:
        "Limit answers to a specific course or document, or leave it on All to search across everything you've ingested.",
      side: "bottom",
    },
  },
  {
    element: '[data-tour="ask-input"]',
    popover: {
      title: "Ask anything",
      description:
        "Type your question here in plain language. Press Enter to send, or Shift+Enter to add a new line.",
      side: "top",
    },
  },
  {
    element: '[data-tour="ask-send"]',
    popover: {
      title: "Send it off",
      description:
        "Submit your question and watch the answer build in real time from your knowledge base.",
      side: "top",
    },
  },
  {
    element: '[data-tour="ask-sources"]',
    popover: {
      title: "Check the sources",
      description:
        "Every answer cites where it came from. Open this panel to inspect the exact passages behind each response.",
      side: "left",
    },
  },
  {
    popover: {
      title: "That's it",
      description:
        "Pick a scope, ask your question, and verify the cited sources. Replay this tour anytime from the Help (?) menu.",
    },
  },
];
