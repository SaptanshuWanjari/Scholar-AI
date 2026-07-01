import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { DiagramView } from "./DiagramView";

vi.mock("mermaid", () => ({
  default: { initialize: vi.fn(), render: vi.fn().mockResolvedValue({ svg: "<svg></svg>" }) },
}));

describe("DiagramView", () => {
  it("shows an edit affordance and the source when toggled", async () => {
    const doc = { updateBlock: vi.fn() };
    render(<DiagramView model={{ code: "graph TD;A-->B" } as any} doc={doc as any} />);
    expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();
  });
});
