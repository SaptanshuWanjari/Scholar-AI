import type { Source } from "../types";
import { request, json } from "./client";

// ---- Teach Me ----
export interface TeachOverview {
  title: string;
  markdown: string;
  grounded: boolean;
  sources: Source[];
}

export interface TeachDraft {
  session_id: string;
  title: string;
  draft_markdown: string;
  grounded: boolean;
  sources: Source[];
}

export interface TeachArtifacts {
  notes?: Record<string, unknown> | null;
  flashcards?: Record<string, unknown> | null;
  quiz?: Record<string, unknown> | null;
  mindmap?: Record<string, unknown> | null;
  diagram?: Record<string, unknown> | null;
  difference?: Record<string, unknown> | null;
}

export interface PackageMeta {
  id: string;
  title: string;
  course: string;
  depth: string;
  artifactCount: number;
  createdAt: string;
  notebookId?: string | null;
}

export interface PackageFull {
  id: string;
  title: string;
  course: string;
  depth: string;
  overview: { markdown?: string; grounded?: boolean };
  artifacts: Record<string, any>;
  sources: Source[];
  createdAt: string;
  updatedAt: string;
  notebookId?: string | null;
}

// ---- Cross-artifact consistency ----
export interface ArtifactCoverage {
  artifact: string;
  coverage: number;
  covered: string[];
  weak: string[];
  missing: string[];
}

export interface ConsistencySuggestion {
  artifactType: string;
  label: string;
  issue: string;
  concepts: string[];
}

export interface ConsistencyReport {
  canonicalConcepts: string[];
  overallCoverage: number;
  artifacts: ArtifactCoverage[];
  underrepresented: string[];
  overrepresented: string[];
  recommendations: string[];
  suggestions?: ConsistencySuggestion[];
}

export const teachApi = {
  // ---- Teach Me ----
  generateOverview(topic: string, depth: "quick" | "standard" | "deep" = "standard", course?: string | null, document?: string | null): Promise<TeachDraft> {
    return request<TeachDraft>("/api/teach/overview", json({ topic, depth, course: course ?? null, document: document ?? null }));
  },
  resumeTeach(sessionId: string, approvedNotes: string, artifactsToGenerate: string[]): Promise<TeachArtifacts> {
    return request<TeachArtifacts>(`/api/teach/${sessionId}/resume`, json({
      approved_notes_markdown: approvedNotes,
      artifacts_to_generate: artifactsToGenerate,
    }));
  },
  listPackages(): Promise<PackageMeta[]> {
    return request<PackageMeta[]>("/api/teach/packages");
  },
  getPackage(id: string): Promise<PackageFull> {
    return request<PackageFull>(`/api/teach/packages/${id}`);
  },
  savePackage(pkg: { title: string; course?: string | null; depth: string; overview: Record<string, any>; artifacts: Record<string, any>; sources: Source[]; notebookId?: string | null }): Promise<PackageFull> {
    return request<PackageFull>("/api/teach/packages", json(pkg));
  },
  deletePackage(id: string): Promise<void> {
    return request<void>(`/api/teach/packages/${id}`, { method: "DELETE" });
  },

  // ---- Cross-artifact consistency ----
  analyzeConsistency(sourceText: string, artifacts: Record<string, any>): Promise<ConsistencyReport> {
    return request<ConsistencyReport>("/api/consistency/analyze", json({ sourceText, artifacts }));
  },
  analyzeLibraryConsistency(course: string, document?: string | null): Promise<ConsistencyReport> {
    return request<ConsistencyReport>("/api/consistency/library", json({ course, document: document ?? null }));
  },
  applyConsistencyFix(course: string, artifactType: string, concepts: string[]): Promise<{ applied: boolean; artifactType: string; preview: string; message: string }> {
    return request("/api/consistency/apply", json({ course, artifactType, concepts }));
  },
};
