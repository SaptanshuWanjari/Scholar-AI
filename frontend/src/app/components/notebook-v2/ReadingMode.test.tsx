import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ReadingMode } from "./ReadingMode";

vi.mock("../../lib/blocksuite/project-flat", () => ({
  projectDocToFlat: () => [
    { type: "heading", level: 1, text: "Page A" },
    { type: "page-break", label: "" },
    { type: "heading", level: 1, text: "Page B" },
  ],
}));

describe("ReadingMode", () => {
  it("renders the first spread with two pages", () => {
    render(<ReadingMode doc={{} as any} />);
    expect(screen.getByText("Page A")).toBeInTheDocument();
    expect(screen.getByText("Page B")).toBeInTheDocument();
  });
});
