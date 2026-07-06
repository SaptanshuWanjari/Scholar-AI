import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FlashcardCard } from "../FlashcardCard";
import type { Flashcard } from "../../lib/types";

vi.mock("motion/react", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

vi.mock("@paper-ui/core", () => ({
  SketchBorder: ({ children }: any) => <>{children}</>,
}));

vi.mock("@/paper-ui/components/badges", () => ({
  PaperBadge: ({ children }: any) => <span>{children}</span>,
}));

vi.mock("../AddToNotebookMenu", () => ({
  AddToNotebookMenu: () => null,
}));

const card: Flashcard = {
  id: "c1",
  type: "basic",
  front: "What is TCP?",
  back: "Transmission Control Protocol",
  deck: "Networking",
  due: "today",
  ease: "new",
  interval: 0,
  sm2_ease: 2.5,
};

describe("FlashcardCard", () => {
  it("shows front by default", () => {
    render(<FlashcardCard card={card} />);
    expect(screen.getByText("What is TCP?")).toBeInTheDocument();
  });

  it("flip reveals back", () => {
    render(<FlashcardCard card={card} />);
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByText("Transmission Control Protocol")).toBeInTheDocument();
  });

  it("review buttons emit events", () => {
    const onDelete = vi.fn();
    render(<FlashcardCard card={card} onDelete={onDelete} />);
    fireEvent.click(screen.getByTitle("Delete card"));
    expect(onDelete).toHaveBeenCalledWith(card);
  });
});
