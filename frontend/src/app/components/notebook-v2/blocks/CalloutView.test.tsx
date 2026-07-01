import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { CalloutView } from "./CalloutView";

describe("CalloutView", () => {
  it("renders tone label and text", () => {
    const doc = { updateBlock: vi.fn() };
    render(<CalloutView model={{ tone: "insight", text: "Key idea" } as any} doc={doc as any} />);
    expect(screen.getByText("Key idea")).toBeInTheDocument();
    expect(screen.getByText(/insight/i)).toBeInTheDocument();
  });
});
