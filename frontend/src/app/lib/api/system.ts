import type { PromptItem, QualityScore } from "../types";
import { request, json } from "./client";

export interface BackendSettings {
  name: string;
  fastModel: string;
  reasoningModel: string;
  embeddingModel: string;
  visionModel: string;
  temperature: number;
  topK: number;
  similarityThreshold: number;
  streaming: boolean;
  citationsInline: boolean;
  accent: string;
  density: string;
  industry: string;
  role: string;
  goals: string;
  interests: string;
  learningPreferences: string;
  ragMode: string;
  usePromptEnhancer: boolean;
  maxConcurrent: number;
}

export interface ModelsList {
  fastModels: string[];
  reasoningModels: string[];
  embeddingModels: string[];
  visionModels: string[];
}

export interface EmbeddingStatus {
  currentModel: string;
  storedModel: string | null;
  storedDimension: number | null;
  currentDimension: number;
  mismatch: boolean;
  documentCount: number;
  chunkCount: number;
  estimatedReindexTime: string;
}

export interface HealthStatus {
  status: string;
  ollama_reachable?: boolean;
  embed_available?: boolean;
  embed_model?: string;
}

// ---- Prompt Enhancer ----
export interface PromptAnalysis {
  score: number;
  label: "poor" | "fair" | "good" | "excellent";
  should_enhance: boolean;
  suggested_prompt: string | null;
  improvements: string[] | null;
}

// ---- Background jobs ----
export interface JobItem {
  id: string;
  kind: string;
  status: "queued" | "running" | "done" | "failed";
  label: string;
  result: Record<string, any> | null;
  error: string | null;
  createdAt: string;
  updatedAt: string;
}

export const systemApi = {
  // ---- Settings / models ----
  getSettings(): Promise<BackendSettings> {
    return request<BackendSettings>("/api/settings");
  },
  updateSettings(patch: Partial<BackendSettings>): Promise<BackendSettings> {
    return request<BackendSettings>("/api/settings", { ...json(patch), method: "PUT" });
  },
  listModels(): Promise<ModelsList> {
    return request<ModelsList>("/api/models/list");
  },

  // ---- Prompts ----
  listPromptCategories(): Promise<Array<{ key: string; label: string; description: string }>> {
    return request("/api/prompts/categories");
  },
  listPrompts(category?: string): Promise<PromptItem[]> {
    const q = category ? `?category=${category}` : "";
    return request<PromptItem[]>(`/api/prompts/${q}`);
  },
  createPrompt(body: { category: string; name: string; style: string; body: string }): Promise<PromptItem> {
    return request<PromptItem>("/api/prompts/", json(body));
  },
  activatePrompt(id: number): Promise<PromptItem> {
    return request<PromptItem>(`/api/prompts/${id}/activate`, { method: "PUT" });
  },
  deletePrompt(id: number): Promise<void> {
    return request<void>(`/api/prompts/${id}`, { method: "DELETE" });
  },

  // ---- Background jobs ----
  listJobs(): Promise<JobItem[]> {
    return request<JobItem[]>("/api/jobs");
  },
  getJob(id: string): Promise<JobItem> {
    return request<JobItem>(`/api/jobs/${id}`);
  },
  pollJobUntilDone(id: string, intervalMs = 1000): Promise<JobItem> {
    return new Promise((resolve, reject) => {
      const tick = () => {
        request<JobItem>(`/api/jobs/${id}`)
          .then((job) => {
            if (job.status === "done" || job.status === "failed") {
              resolve(job);
            } else {
              setTimeout(tick, intervalMs);
            }
          })
          .catch(reject);
      };
      tick();
    });
  },
  deleteJob(id: string): Promise<void> {
    return request<void>(`/api/jobs/${id}`, { method: "DELETE" });
  },

  // ---- Prompt Enhancer ----
  analyzePrompt(topic: string, course?: string | null, route?: string | null): Promise<PromptAnalysis> {
    return request<PromptAnalysis>("/api/prompt/analyze", json({ topic, course: course ?? null, route: route ?? null }));
  },

  // ---- Health ----
  health(): Promise<HealthStatus> {
    return request<HealthStatus>("/api/health");
  },
  checkSystemHealth(): Promise<{ reasoning: string; vision: string; embedding: string; ocr: string }> {
    return request<{ reasoning: string; vision: string; embedding: string; ocr: string }>("/api/system/health");
  },

  // ---- Onboarding ----
  onboardingAnalysis(): Promise<import('../../context/OnboardingContext').OnboardingAnalysis> {
    return request<import('../../context/OnboardingContext').OnboardingAnalysis>("/api/onboarding/analysis");
  },

  // ---- Embedding status ----
  embeddingStatus(): Promise<EmbeddingStatus> {
    return request<EmbeddingStatus>("/api/embedding/status");
  },

  // ---- Backup ----
  createBackup(): Promise<{ status: string; backup: { path: string; stamp: string; size_mb: number } }> {
    return request("/api/admin/backup", { method: "POST" });
  },
  listBackups(): Promise<Array<{ path: string; stamp: string; size_mb: number }>> {
    return request("/api/admin/backups");
  },
};
