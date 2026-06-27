import type { DriveStep } from "driver.js";
import { dashboardTour } from "./tours/dashboard.tour";
import { documentsTour } from "./tours/documents.tour";
import { askTour } from "./tours/ask.tour";
import { knowledgeTour } from "./tours/knowledge.tour";

/**
 * A page tour. `id` doubles as the route path so first-visit auto-start can look
 * a tour up by location with zero per-page wiring. Adding a tour to a new page =
 * create a `*.tour.ts`, add `data-tour` attrs to the page, register it here.
 *
 * Tours are intentionally lean: they only highlight things that aren't
 * self-evident from the UI. Obvious controls (inputs, send buttons, the main
 * content area) are deliberately left out.
 */
export interface TourDef {
  id: string;
  /** Route path this tour belongs to (matched by TourAutoStart). */
  routePath: string;
  /** Human label shown in the Help menu replay entry. */
  title: string;
  steps: DriveStep[];
  /** Set false to require manual replay only (no first-visit auto-start). */
  autoStart?: boolean;
}

function def(
  routePath: string,
  title: string,
  steps: DriveStep[],
  autoStart = true
): TourDef {
  return { id: routePath, routePath, title, steps, autoStart };
}

export const tours: Record<string, TourDef> = {
  "/": def("/", "Dashboard tour", dashboardTour),
  "/documents": def("/documents", "Documents tour", documentsTour),
  "/ask": def("/ask", "Ask AI tour", askTour),
  "/knowledge": def("/knowledge", "Knowledge Explorer tour", knowledgeTour),
};

/** Find the tour registered for an exact route path, if any. */
export function getTourForPath(path: string): TourDef | undefined {
  return tours[path];
}
