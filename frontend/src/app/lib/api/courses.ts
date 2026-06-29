import type { Course, CourseStats, ArtifactItem } from "../types";
import { request, json } from "./client";
import type { PackageMeta } from "./teach";

export interface ArtifactRecommendation {
  artifact: "notes" | "flashcards" | "quiz" | "mindmap" | "diagram" | "difference";
  stars: number;
  reason: string;
}

export const coursesApi = {
  listCourses(): Promise<Course[]> {
    return request<Course[]>("/api/courses");
  },
  createCourse(name: string, systemPrompt?: string): Promise<Course> {
    return request<Course>("/api/courses", json({ name, systemPrompt }));
  },
  updateCourse(id: string, name: string, systemPrompt?: string): Promise<Course> {
    return request<Course>(`/api/courses/${id}`, { ...json({ name, systemPrompt }), method: "PUT" });
  },
  deleteCourse(id: string): Promise<void> {
    return request<void>(`/api/courses/${id}`, { method: "DELETE" });
  },
  getCourseStats(id: string): Promise<CourseStats> {
    return request<CourseStats>(`/api/courses/${id}/stats`);
  },
  getCourseArtifacts(id: string, type?: string): Promise<ArtifactItem[]> {
    const p = new URLSearchParams();
    if (type) p.set("type", type);
    const qs = p.toString();
    return request<ArtifactItem[]>(`/api/courses/${id}/artifacts${qs ? `?${qs}` : ""}`);
  },
  reindexCourse(id: string): Promise<{ id: string; kind: string; status: string; label: string }> {
    return request(`/api/courses/${id}/reindex`, { method: "POST" });
  },
  generateCoursePackage(id: string): Promise<PackageMeta> {
    return request<PackageMeta>(`/api/courses/${id}/package`, { method: "POST" });
  },

  // ---- Artifact Recommendations ----
  recommendArtifacts(topic: string): Promise<ArtifactRecommendation[]> {
    return request<{ recommendations: ArtifactRecommendation[] }>("/api/artifacts/recommend", json({ topic }))
      .then((r) => r.recommendations);
  },
};
