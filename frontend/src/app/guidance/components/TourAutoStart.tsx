import { useEffect } from "react";
import { useLocation } from "react-router";
import { getTourForPath } from "../tourRegistry";
import { useGuidanceStore } from "../useGuidanceStore";
import { useTour } from "../useTour";

/** How long to keep polling for a tour's targets before giving up (ms). */
const WAIT_LIMIT = 2500;

/**
 * Mounted once inside AppLayout. On each route change it auto-starts the page's
 * tour the first time it's visited — provided tours are enabled and the tour
 * hasn't been seen yet.
 *
 * Many pages render their content asynchronously, so instead of a fixed delay we
 * poll until at least one of the tour's target elements is actually in the DOM,
 * then start. If none appear within WAIT_LIMIT we bail WITHOUT marking the tour
 * seen, so it gets another chance on the next visit (or once content loads).
 */
export function TourAutoStart() {
  const { pathname } = useLocation();
  const { startTour } = useTour();

  useEffect(() => {
    const def = getTourForPath(pathname);
    if (!def || def.autoStart === false) return;

    const state = useGuidanceStore.getState();
    if (!state.prefs.toursEnabled || state.isTourSeen(def.id)) return;

    const selectors = def.steps
      .map((s) => s.element)
      .filter((el): el is string => typeof el === "string");

    let cancelled = false;
    const startedAt = performance.now();

    const tryStart = () => {
      if (cancelled) return;
      const ready =
        selectors.length === 0 ||
        selectors.some((sel) => document.querySelector(sel));
      if (ready) {
        startTour(def.id);
        return;
      }
      if (performance.now() - startedAt > WAIT_LIMIT) return;
      requestAnimationFrame(tryStart);
    };

    // Let the route's first paint happen, then begin polling for targets.
    const timer = setTimeout(() => requestAnimationFrame(tryStart), 250);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
    // startTour is stable; re-run only on path change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return null;
}
