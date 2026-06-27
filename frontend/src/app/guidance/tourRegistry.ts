import type { DriveStep } from "driver.js";
import { dashboardTour } from "./tours/dashboard.tour";
import { documentsTour } from "./tours/documents.tour";
import { askTour } from "./tours/ask.tour";
import { flashcardsTour } from "./tours/flashcards.tour";
import { readingTour } from "./tours/reading.tour";
import { knowledgeTour } from "./tours/knowledge.tour";
import { examTour } from "./tours/exam.tour";
import { revisionTour } from "./tours/revision.tour";
import { teachTour } from "./tours/teach.tour";

/**
 * A page tour. `id` doubles as the route path so first-visit auto-start can look
 * a tour up by location with zero per-page wiring. Adding a tour to a new page =
 * create a `*.tour.ts`, add `data-tour` attrs to the page, register it here.
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
  "/flashcards": def("/flashcards", "Flashcards tour", flashcardsTour),
  "/reading": def("/reading", "Reading tour", readingTour),
  "/knowledge": def("/knowledge", "Knowledge Explorer tour", knowledgeTour),
  "/exam": def("/exam", "Exam tour", examTour),
  "/revision": def("/revision", "Revision tour", revisionTour),
  "/teach": def("/teach", "Teach Me tour", teachTour),
};

/** Find the tour registered for an exact route path, if any. */
export function getTourForPath(path: string): TourDef | undefined {
  return tours[path];
}
