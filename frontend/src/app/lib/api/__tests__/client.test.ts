import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { request, fetcher, json } from "../client";

describe("request", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns parsed JSON on success", async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ id: "1", name: "Test" }),
    });

    const result = await request<{ id: string; name: string }>("/api/test");
    expect(result).toEqual({ id: "1", name: "Test" });
  });

  it("returns undefined on 204", async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      status: 204,
    });

    const result = await request<void>("/api/test");
    expect(result).toBeUndefined();
  });

  it("throws with status text on plain error", async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
      json: async () => ({ detail: "boom" }),
    });

    await expect(request("/api/test")).rejects.toThrow("boom");
  });

  it("formats validation error array", async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 422,
      statusText: "Unprocessable Entity",
      json: async () => ({
        detail: [
          { loc: ["body", "name"], msg: "required" },
          { loc: ["body", "email"], msg: "invalid" },
        ],
      }),
    });

    await expect(request("/api/test")).rejects.toThrow(
      "body.name: required, body.email: invalid",
    );
  });

  it("falls back to statusText when json detail missing", async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: "Not Found",
      json: async () => ({ unexpected: true }),
    });

    await expect(request("/api/test")).rejects.toThrow("Not Found");
  });
});

describe("fetcher", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("delegates to request", async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ data: [1, 2, 3] }),
    });

    const result = await fetcher("/api/list");
    expect(result).toEqual({ data: [1, 2, 3] });
  });
});

describe("json", () => {
  it("builds POST request init with JSON body", () => {
    const init = json({ name: "test" });
    expect(init.method).toBe("POST");
    expect(init.headers).toEqual({ "Content-Type": "application/json" });
    expect(init.body).toBe(JSON.stringify({ name: "test" }));
  });
});
