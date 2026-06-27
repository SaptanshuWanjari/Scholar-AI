import { driver, type DriveStep } from "driver.js";
import "driver.js/dist/driver.css";
import "./tour.css";
import { tours } from "./tourRegistry";
import { useGuidanceStore } from "./useGuidanceStore";

/**
 * Thin wrapper around driver.js. `startTour` runs a registered tour by id and is
 * unconditional (used for manual replay from the Help menu). First-visit gating
 * (prefs + seen flags) lives in TourAutoStart, not here.
 */
export function useTour() {
  const startTour = (tourId: string) => {
    const def = tours[tourId];
    if (!def) return;

    // Skip steps whose target element is not mounted so the tour never points at
    // nothing; steps with no `element` (intro/summary cards) are always kept.
    const steps: DriveStep[] = def.steps.filter(
      (s) => !s.element || document.querySelector(s.element as string)
    );
    if (steps.length === 0) return;

    const d = driver({
      showProgress: true,
      allowClose: true,
      overlayOpacity: 0.55,
      stagePadding: 6,
      stageRadius: 8,
      nextBtnText: "Next",
      prevBtnText: "Back",
      doneBtnText: "Finish",
      steps,
      onDestroyed: () => {
        useGuidanceStore.getState().markTourSeen(tourId);
      },
    });
    d.drive();
  };

  return { startTour };
}
