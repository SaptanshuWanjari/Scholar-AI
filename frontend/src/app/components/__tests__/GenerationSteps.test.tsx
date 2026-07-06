import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { GenerationSteps } from "../GenerationSteps";

vi.mock("motion/react", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe("GenerationSteps", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders steps", () => {
    render(<GenerationSteps steps={["Plan", "Draft", "Review"]} loading />);
    expect(screen.getByText("Plan")).toBeInTheDocument();
    expect(screen.getByText("Draft")).toBeInTheDocument();
    expect(screen.getByText("Review")).toBeInTheDocument();
  });

  it("expands trace when loading starts", () => {
    const { rerender } = render(<GenerationSteps steps={["Plan", "Draft"]} loading={false} />);
    expect(screen.queryByText("Plan")).not.toBeInTheDocument();
    rerender(<GenerationSteps steps={["Plan", "Draft"]} loading />);
    expect(screen.getByText("Plan")).toBeInTheDocument();
  });
});
