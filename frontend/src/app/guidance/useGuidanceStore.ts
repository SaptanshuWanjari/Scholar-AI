import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Persistent state for the contextual guidance system (tours, tips, prefs).
 * Stored in localStorage under `scholar_guidance_state`. The Settings "Nuke Data"
 * action runs `localStorage.clear()` which wipes this; `resetAll()` clears the
 * in-memory copy so the UI reflects a clean first-visit state immediately.
 */

interface GuidancePrefs {
  toursEnabled: boolean;
  tipsEnabled: boolean;
}

interface GuidanceState {
  prefs: GuidancePrefs;
  /** tourId -> ISO timestamp the tour was completed/dismissed */
  toursSeen: Record<string, string>;
  /** tipId -> true once dismissed */
  tipsDismissed: Record<string, true>;

  setPref: <K extends keyof GuidancePrefs>(key: K, value: GuidancePrefs[K]) => void;
  markTourSeen: (id: string) => void;
  isTourSeen: (id: string) => boolean;
  dismissTip: (id: string) => void;
  isTipDismissed: (id: string) => boolean;
  resetAll: () => void;
}

const initial = {
  prefs: { toursEnabled: true, tipsEnabled: true },
  toursSeen: {} as Record<string, string>,
  tipsDismissed: {} as Record<string, true>,
};

export const useGuidanceStore = create<GuidanceState>()(
  persist(
    (set, get) => ({
      ...initial,

      setPref: (key, value) =>
        set((s) => ({ prefs: { ...s.prefs, [key]: value } })),

      markTourSeen: (id) =>
        set((s) => ({
          toursSeen: { ...s.toursSeen, [id]: new Date().toISOString() },
        })),

      isTourSeen: (id) => Boolean(get().toursSeen[id]),

      dismissTip: (id) =>
        set((s) => ({ tipsDismissed: { ...s.tipsDismissed, [id]: true } })),

      isTipDismissed: (id) => Boolean(get().tipsDismissed[id]),

      resetAll: () =>
        set({
          prefs: { ...initial.prefs },
          toursSeen: {},
          tipsDismissed: {},
        }),
    }),
    { name: "scholar_guidance_state" }
  )
);
