import { describe, it, expect, vi, beforeEach } from "vitest";
import { act } from "@testing-library/react";
import { useSettingsStore } from "../useSettingsStore";
import type { BackendSettings } from "../../lib/api";

const mockApi = vi.hoisted(() => ({
  getSettings: vi.fn(),
  updateSettings: vi.fn(),
}));

vi.mock("../../lib/api", () => ({
  api: mockApi,
}));

describe("useSettingsStore", () => {
  function resetStore() {
    useSettingsStore.setState({
      name: "",
      fastModel: "qwen3:8b",
      reasoningModel: "gemma4:12b",
      embeddingModel: "qwen3-embedding:0.6b",
      visionModel: "qwen2.5vl:3b",
      temperature: 0.4,
      topK: 5,
      similarityThreshold: 0.45,
      streaming: true,
      citationsInline: true,
      accent: "violet",
      density: "comfortable",
      industry: "",
      role: "",
      goals: "",
      interests: "",
      learningPreferences: "",
      ragMode: "fallback",
      usePromptEnhancer: true,
      maxConcurrent: 3,
      hydrated: false,
    });
  }

  beforeEach(() => {
    resetStore();
    vi.clearAllMocks();
  });

  it("hydrate loads settings from api.getSettings", async () => {
    const remote: Partial<BackendSettings> = {
      name: "Ada",
      fastModel: "llama3:8b",
      accent: "cyan",
      density: "compact",
      ragMode: "strict",
    };
    mockApi.getSettings.mockResolvedValue(remote);

    await act(async () => {
      await useSettingsStore.getState().hydrate();
    });

    const state = useSettingsStore.getState();
    expect(state.name).toBe("Ada");
    expect(state.fastModel).toBe("llama3:8b");
    expect(state.accent).toBe("cyan");
    expect(state.density).toBe("compact");
    expect(state.ragMode).toBe("strict");
    expect(state.hydrated).toBe(true);
  });

  it("set updates local state and calls api.updateSettings for persisted keys", async () => {
    mockApi.updateSettings.mockResolvedValue({});

    act(() => {
      useSettingsStore.getState().set("name", "Bob");
    });

    expect(useSettingsStore.getState().name).toBe("Bob");
    await vi.waitFor(() => {
      expect(mockApi.updateSettings).toHaveBeenCalledWith({ name: "Bob" });
    });
  });

  it("failed updateSettings rolls back the local value", async () => {
    mockApi.updateSettings.mockRejectedValue(new Error("Network error"));

    act(() => {
      useSettingsStore.getState().set("temperature", 0.9);
    });

    expect(useSettingsStore.getState().temperature).toBe(0.9);
    await vi.waitFor(() => {
      expect(mockApi.updateSettings).toHaveBeenCalledWith({ temperature: 0.9 });
    });
    expect(useSettingsStore.getState().temperature).toBe(0.4);
  });
});
