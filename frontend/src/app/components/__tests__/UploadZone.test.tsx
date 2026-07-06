import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { UploadZone } from "../UploadZone";

vi.mock("motion/react", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

vi.mock("@paper-ui/core", () => ({
  PaperCard: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}));

vi.mock("@paper-ui/components/buttons", () => ({
  PaperButton: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>{children}</button>
  ),
  GhostButton: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>{children}</button>
  ),
}));

describe("UploadZone", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders dropzone", () => {
    render(<UploadZone onUploadFile={vi.fn()} />);
    expect(screen.getByText("Drop files to upload")).toBeInTheDocument();
    expect(screen.getByText("Browse files")).toBeInTheDocument();
  });

  it("file selection calls onUploadFile", async () => {
    const onUpload = vi.fn().mockResolvedValue(undefined);
    const file = new File(["content"], "notes.md", { type: "text/markdown" });

    const { container } = render(<UploadZone onUploadFile={onUpload} accept=".md" />);
    const input = container.querySelector("input[type=file]") as HTMLInputElement;
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(onUpload).toHaveBeenCalledWith(file);
    });
  });

  it("invalid file type shows error", async () => {
    const onUpload = vi.fn().mockRejectedValue(new Error("Unsupported file type"));
    const file = new File(["content"], "image.png", { type: "image/png" });

    const { container } = render(<UploadZone onUploadFile={onUpload} accept=".pdf,.md" />);
    const input = container.querySelector("input[type=file]") as HTMLInputElement;
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText("Unsupported file type")).toBeInTheDocument();
    });
  });
});
