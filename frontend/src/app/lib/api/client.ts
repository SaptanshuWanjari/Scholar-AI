import { useLogStore } from "../../stores/useLogStore";

export const BASE: string = (import.meta as any).env?.VITE_API_BASE_URL ?? "";

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, init);
  if (!res.ok) {
    let detail = res.statusText;
    try {
      const body = await res.json();
      detail = body.detail ?? detail;
    } catch {
      /* non-JSON error body */
    }
    useLogStore.getState().addLog("error", `API Error: ${path}`, detail);
    throw new Error(detail);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const fetcher = (url: string) => request<any>(url);

export function json(body: unknown): RequestInit {
  return {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}
