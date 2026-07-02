import { request } from "./client";

export interface TrashItem {
  id: string;
  artifact_type: string;
  artifact_id: string;
  title: string;
  subtitle?: string;
  course_id?: number;
  course_name?: string;
  deleted_at: string;
  archived: boolean;
}

export interface TrashListResponse {
  items: TrashItem[];
}

export const trashApi = {
  list(): Promise<TrashListResponse> {
    return request<TrashListResponse>("/api/trash");
  },

  restore(artifactType: string, artifactId: string): Promise<{ restored: boolean }> {
    return request(`/api/trash/${artifactType}/${artifactId}/restore`, {
      method: "POST",
    });
  },

  permanentDelete(artifactType: string, artifactId: string): Promise<{ deleted: boolean }> {
    return request(`/api/trash/${artifactType}/${artifactId}`, {
      method: "DELETE",
    });
  },

  archive(artifactType: string, artifactId: string, archived: boolean): Promise<{ archived: boolean }> {
    return request(`/api/trash/${artifactType}/${artifactId}/archive`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ archived }),
    });
  },

  purge(): Promise<{ purged: number }> {
    return request("/api/trash/purge", { method: "DELETE" });
  },
};
