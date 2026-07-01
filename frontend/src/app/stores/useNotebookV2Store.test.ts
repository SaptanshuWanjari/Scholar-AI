import { describe, it, expect, beforeEach } from "vitest";
import { useNotebookV2Store } from "./useNotebookV2Store";

describe("useNotebookV2Store (UI-only)", () => {
  beforeEach(() => useNotebookV2Store.setState(useNotebookV2Store.getInitialState()));
  it("toggles sidebar and sets reading mode", () => {
    const s = useNotebookV2Store.getState();
    s.toggleSidebar();
    expect(useNotebookV2Store.getState().sidebarOpen).toBe(false);
    s.setReadingMode(true);
    expect(useNotebookV2Store.getState().readingMode).toBe(true);
  });
  it("holds no block content", () => {
    expect("notebook" in useNotebookV2Store.getState()).toBe(false);
  });
});
