import type { DriveStep } from "driver.js";
import { tourIcons, tourTitle } from "../tourIcons";

export const askTour: DriveStep[] = [
  {
    element: '[data-tour="ask-scope"]',
    popover: {
      title: tourTitle(tourIcons.filter, "Narrow the scope"),
      description:
        "Limit answers to a single course or document for sharper, more relevant results — or leave it on All to search everything.",
      side: "bottom",
    },
  },
  {
    element: '[data-tour="ask-sources"]',
    popover: {
      title: tourTitle(tourIcons.quote, "Answers cite their sources"),
      description:
        "Every response is grounded in your materials. Open this panel and click a citation to verify exactly where it came from.",
      side: "left",
    },
  },
];
