import { useEffect } from "react";
import { useLocation } from "react-router";
import { getTourForPath } from "../tourRegistry";
import { useGuidanceStore } from "../useGuidanceStore";
import { useTour } from "../useTour";

/**
 * Mounted once inside AppLayout. On each route change it auto-starts the page's
 * tour the first time it's visited — provided tours are enabled and the tour
 * hasn't been seen. A short delay lets the page's DOM (and tour targets) mount.
 */
export function TourAutoStart() {
  const { pathname } = useLocation();
  const { startTour } = useTour();

  useEffect(() => {
    const def = getTourForPath(pathname);
    if (!def || def.autoStart === false) return;

    const state = useGuidanceStore.getState();
    if (!state.prefs.toursEnabled) return;
    if (state.isTourSeen(def.id)) return;

    const timer = setTimeout(() => startTour(def.id), 700);
    return () => clearTimeout(timer);
    // startTour is stable enough; re-run only on path change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return null;
}
