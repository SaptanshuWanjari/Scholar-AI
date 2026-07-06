import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { askApi } from "../ask";
import type { Source } from "../../types";

describe("askApi", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("ask returns typed response", async () => {
    const mockResponse = {
      id: "a-1",
      role: "assistant" as const,
      content: "TCP slow start...",
      sources: [{ id: "s1", title: "Networks", page: 1, course: "Networks", snippet: "...", similarity: 0.9, sourceType: "text" }],
      confidence: 0.9,
      grounded: true,
      route: "quick_qa",
    };

    (fetch as any).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockResponse,
    });

    const result = await askApi.ask("What is TCP slow start?", "Networks", null, null, "fallback", false);
    expect(result).toEqual(mockResponse);

    const call = (fetch as any).mock.calls[0];
    expect(call[0]).toContain("/api/ask");
    const body = JSON.parse(call[1].body);
    expect(body.question).toBe("What is TCP slow start?");
    expect(body.course).toBe("Networks");
  });

  it("askStream calls onToken and onDone", async () => {
    const events = [
      { type: "token", value: "Hello" },
      { type: "token", value: " world" },
      { type: "done", sources: [{ id: "s1", title: "Networks", page: 1, course: "Networks", snippet: "...", similarity: 0.9, sourceType: "text" }], grounded: true, route: "quick_qa" },
    ];

    const encoder = new TextEncoder();
    const chunks = events
      .map((e) => `data: ${JSON.stringify(e)}\n\n`)
      .join("");

    (fetch as any).mockResolvedValueOnce({
      ok: true,
      body: {
        getReader: () => {
          let done = false;
          return {
            read: async () => {
              if (done) return { done: true, value: undefined };
              done = true;
              return { done: false, value: encoder.encode(chunks) };
            },
          };
        },
      },
    });

    const tokens: string[] = [];
    let doneMeta: any = null;

    await askApi.askStream(
      "hi",
      {
        onToken: (chunk) => tokens.push(chunk),
        onDone: (meta) => {
          doneMeta = meta;
        },
      },
    );

    expect(tokens).toEqual(["Hello", " world"]);
    expect(doneMeta).toEqual({
      sources: expect.any(Array),
      grounded: true,
      route: "quick_qa",
    });
  });

  it("askStream calls onError for non-ok response", async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Server Error",
    });

    const onError = vi.fn<(message: string) => void>();
    const onToken = vi.fn<(chunk: string) => void>();
    await askApi.askStream("hi", { onToken, onError });
    expect(onError).toHaveBeenCalledWith("Request failed (500)");
  });

  it("listChatSessions returns sessions", async () => {
    const sessions = [{ id: "1", title: "Chat 1", course: "", messageCount: 0, updatedAt: "" }];
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => sessions,
    });

    const result = await askApi.listChatSessions();
    expect(result).toEqual(sessions);
  });

  it("createChatSession sends course and title", async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: async () => ({ id: "2", title: "New", course: "Networks", messageCount: 0, updatedAt: "" }),
    });

    const result = await askApi.createChatSession("Networks", "New");
    expect(result.id).toBe("2");
    const call = (fetch as any).mock.calls[0];
    expect(call[0]).toContain("/api/chat/sessions");
    expect(JSON.parse(call[1].body)).toEqual({ course: "Networks", title: "New" });
  });

  it("deleteChatSession calls DELETE", async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      status: 204,
    });

    await askApi.deleteChatSession("1");
    const call = (fetch as any).mock.calls[0];
    expect(call[0]).toContain("/api/chat/sessions/1");
    expect(call[1].method).toBe("DELETE");
  });
});
