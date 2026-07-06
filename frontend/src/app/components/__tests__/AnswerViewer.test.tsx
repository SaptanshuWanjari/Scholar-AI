import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AnswerViewer } from "../AnswerViewer";
import type { ChatMessage } from "../../lib/types";

vi.mock("motion/react", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

vi.mock("@paper-ui/core", () => ({
  PaperIconCircle: ({ children }: any) => <div>{children}</div>,
}));

vi.mock("@paper-ui/components/loading", () => ({
  Spinner: () => <span>spinner</span>,
  Shimmer: Object.assign(
    ({ children }: any) => <div>{children}</div>,
    { Line: ({ width }: any) => <div style={{ width }}>line</div> }
  ),
}));

vi.mock("@paper-ui/components/buttons", () => ({
  GhostButton: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>{children}</button>
  ),
}));

vi.mock("@paper-ui/utils", () => ({
  cn: (...args: any[]) => args.filter(Boolean).join(" "),
}));

vi.mock("../MarkdownRenderer", () => ({
  MarkdownRenderer: ({ content, onCitationClick }: any) => (
    <div>
      {content}
      <button onClick={() => onCitationClick?.(0)}>citation</button>
    </div>
  ),
}));

vi.stubGlobal("navigator", {
  ...global.navigator,
  clipboard: { writeText: vi.fn() },
});

afterEach(() => {
  vi.unstubAllGlobals();
});

const message: ChatMessage = {
  id: "a1",
  role: "assistant",
  content: "The answer is **42**.",
  sources: [
    { id: "s1", title: "Guide", page: 1, course: "Math", snippet: "...", similarity: 0.9 },
  ],
};

describe("AnswerViewer", () => {
  it("renders markdown content", () => {
    render(<AnswerViewer message={message} />);
    expect(screen.getByText("The answer is **42**.")).toBeInTheDocument();
    expect(screen.getByText("1 sources cited")).toBeInTheDocument();
  });

  it("shows sources", () => {
    render(<AnswerViewer message={message} />);
    expect(screen.getByText("1 sources cited")).toBeInTheDocument();
  });

  it("toggles citations", () => {
    const onCitationClick = vi.fn();
    render(<AnswerViewer message={message} onCitationClick={onCitationClick} />);
    fireEvent.click(screen.getByText("citation"));
    expect(onCitationClick).toHaveBeenCalledWith(0);
  });
});
