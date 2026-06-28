import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * How the whiteboard editor persists the live canvas:
 *  - "timed"     : autosave on a fixed interval while there are pending changes
 *  - "each-edit" : autosave shortly after every edit (debounced)
 *  - "manual"    : never autosave; the user saves explicitly
 *
 * Revisions (version-history snapshots) are always manual — this only governs
 * the live-scene autosave.
 */
export type AutosaveMode = "timed" | "each-edit" | "manual";

interface WhiteboardPrefsState {
  autosaveMode: AutosaveMode;
  setAutosaveMode: (mode: AutosaveMode) => void;
}

export const useWhiteboardPrefs = create<WhiteboardPrefsState>()(
  persist(
    (set) => ({
      autosaveMode: "timed",
      setAutosaveMode: (autosaveMode) => set({ autosaveMode }),
    }),
    { name: "scholar-whiteboard-prefs" },
  ),
);
