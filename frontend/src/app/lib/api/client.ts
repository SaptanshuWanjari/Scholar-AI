
export const BASE: string = (import.meta as any).env?.VITE_API_BASE_URL ?? "";

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, init);
  if (!res.ok) {
    let detail = res.statusText;
    try {
      const body = await res.json();
      if (Array.isArray(body.detail)) {
        detail = body.detail.map((e: any) => `${e.loc?.join(".") || "Field"}: ${e.msg}`).join(", ");
      } else {
        detail = body.detail ?? detail;
      }
    } catch {
      /* non-JSON error body */
    }
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
