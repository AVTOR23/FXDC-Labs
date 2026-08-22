const TOKEN_KEY = "fxdc_token";

const API_BASE =
  import.meta.env.VITE_API_URL ??
  (import.meta.env.DEV ? "" : "https://fxdc-camp.onrender.com");

export type ApiSuccess<T> = {
  ok: boolean;
  success: boolean;
  message: string;
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
  error?: unknown;
};

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string | null) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
    return;
  }
  localStorage.removeItem(TOKEN_KEY);
}

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<ApiSuccess<T>> {
  const token = getStoredToken();
  const headers = new Headers(init.headers);

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (!(init.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...init,
      credentials: "include",
      headers,
    });
  } catch {
    throw new Error(
      "Cannot reach the API. Start the backend with `npm run dev` in the backend folder."
    );
  }

  const payload = (await response.json().catch(() => null)) as ApiSuccess<T> | null;

  if (!response.ok) {
    throw new Error(payload?.message || "Request failed. Please try again.");
  }

  if (!payload) {
    throw new Error("Invalid server response");
  }

  return payload;
}

export function formatDate(value: unknown) {
  if (typeof value !== "string" && !(value instanceof Date)) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString();
}

export function asText(value: unknown) {
  if (Array.isArray(value)) return value.join(", ");
  if (value === null || value === undefined || value === "") return "—";
  return String(value);
}
