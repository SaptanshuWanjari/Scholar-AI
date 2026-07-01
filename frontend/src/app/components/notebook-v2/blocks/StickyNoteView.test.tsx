import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { StickyNoteView } from "./StickyNoteView";

describe("StickyNoteView", () => {
  it("renders sticky text", () => {
    const doc = { updateBlock: vi.fn() };
    render(
      <StickyNoteView
        model={{ text: "Remember this", color: "yellow", pin: "push-pin", align: "inline" } as any}
        doc={doc as any}
      />
    );
    expect(screen.getByText("Remember this")).toBeInTheDocument();
  });
});
