import { create } from "zustand";

type Tab = "overview" | "documents" | "artifacts" | "settings";

interface CourseWorkspaceState {
  selectedCourseId: string | null;
  activeTab: Tab;
  artifactTypeFilter: string | null;
  setSelectedCourse: (id: string | null) => void;
  setActiveTab: (tab: Tab) => void;
  setArtifactTypeFilter: (type: string | null) => void;
}

export const useCourseWorkspaceStore = create<CourseWorkspaceState>((set) => ({
  selectedCourseId: null,
  activeTab: "overview",
  artifactTypeFilter: null,
  setSelectedCourse: (id) => set({ selectedCourseId: id, activeTab: "overview", artifactTypeFilter: null }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setArtifactTypeFilter: (type) => set({ artifactTypeFilter: type }),
}));
