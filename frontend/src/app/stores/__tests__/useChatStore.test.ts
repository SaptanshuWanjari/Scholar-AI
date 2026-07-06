import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act } from "@testing-library/react";
import { useChatStore } from "../useChatStore";

const mockApi = vi.hoisted(() => ({
  ask: vi.fn(),
  askStream: vi.fn(),
  createChatSession: vi.fn(),
  listChatSessions: vi.fn(),
  getChatSession: vi.fn(),
  deleteChatSession: vi.fn(),
}));

const mockPromptEnhancerStore = vi.hoisted(() => ({
  analyze: vi.fn(),
}));

const mockNotificationStore = vi.hoisted(() => ({
  add: vi.fn(),
}));

vi.mock("../../lib/api", () => ({
  api: mockApi,
}));

vi.mock("../usePromptEnhancerStore", () => ({
  usePromptEnhancerStore: {
    getState: () => mockPromptEnhancerStore,
  },
}));

vi.mock("../useNotificationStore", () => ({
  useNotificationStore: {
    getState: () => mockNotificationStore,
  },
}));

describe("useChatStore", () => {
  function resetStore() {
    useChatStore.setState({
      messages: [],
      isStreaming: false,
      course: null,
      document: null,
      sessions: [],
      activeSessionId: null,
      socratic: false,
      highlightsOnly: false,
    });
  }

  beforeEach(() => {
    resetStore();
    vi.clearAllMocks();
    mockPromptEnhancerStore.analyze.mockResolvedValue({ action: "use_original" });
    mockApi.listChatSessions.mockResolvedValue([]);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("starts with empty messages", () => {
    expect(useChatStore.getState().messages).toEqual([]);
  });

  it("non-streaming ask appends user and assistant messages", async () => {
    mockApi.createChatSession.mockResolvedValue({ id: "session-1" });
    mockApi.ask.mockResolvedValue({
      id: "a-1",
      content: "Answer text",
      sources: [],
      confidence: 0.8,
      grounded: true,
      route: "quick_qa",
    });

    await act(async () => {
      await useChatStore.getState().ask("question", { stream: false });
    });

    const messages = useChatStore.getState().messages;
    expect(messages).toHaveLength(2);
    expect(messages[0].role).toBe("user");
    expect(messages[0].content).toBe("question");
    expect(messages[1].role).toBe("assistant");
    expect(messages[1].content).toBe("Answer text");
    expect(messages[1].streaming).toBe(false);
  });

  it("streaming ask patches content as tokens arrive", async () => {
    mockApi.createChatSession.mockResolvedValue({ id: "session-1" });
    mockApi.askStream.mockImplementation(async (_question, handlers) => {
      handlers.onToken("Hello");
      handlers.onToken(" world");
      handlers.onDone?.({ sources: [], grounded: true, route: "quick_qa" });
    });

    await act(async () => {
      await useChatStore.getState().ask("question", { stream: true });
    });

    const messages = useChatStore.getState().messages;
    const assistant = messages.find((m) => m.role === "assistant");
    expect(assistant?.content).toBe("Hello world");
    expect(assistant?.streaming).toBe(false);
  });

  it("sets error content on stream failure", async () => {
    mockApi.createChatSession.mockResolvedValue({ id: "session-1" });
    mockApi.askStream.mockImplementation(async (_question, handlers) => {
      handlers.onError("Server error");
    });

    await act(async () => {
      await useChatStore.getState().ask("question", { stream: true });
    });

    const assistant = useChatStore.getState().messages.find((m) => m.role === "assistant");
    expect(assistant?.content).toContain("Server error");
  });

  it("auto-creates session on first message", async () => {
    mockApi.createChatSession.mockResolvedValue({ id: "new-session" });
    mockApi.ask.mockResolvedValue({ content: "ok", sources: [], grounded: true, route: "quick_qa" });

    await act(async () => {
      await useChatStore.getState().ask("hi", { stream: false });
    });

    expect(mockApi.createChatSession).toHaveBeenCalledWith(undefined);
    expect(useChatStore.getState().activeSessionId).toBe("new-session");
  });

  it("does not send while already streaming", async () => {
    useChatStore.setState({ isStreaming: true });
    await act(async () => {
      await useChatStore.getState().ask("hi");
    });
    expect(mockApi.ask).not.toHaveBeenCalled();
    expect(mockApi.askStream).not.toHaveBeenCalled();
  });

  it("deletes session and clears messages if active", async () => {
    useChatStore.setState({ activeSessionId: "s1", messages: [{ id: "1", role: "user", content: "x" }] });
    mockApi.deleteChatSession.mockResolvedValue(undefined);

    await act(async () => {
      await useChatStore.getState().deleteSession("s1");
    });

    expect(useChatStore.getState().activeSessionId).toBeNull();
    expect(useChatStore.getState().messages).toEqual([]);
  });
});
