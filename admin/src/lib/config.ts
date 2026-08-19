export const WEBSITE_URL =
  import.meta.env.VITE_WEBSITE_URL ??
  (import.meta.env.DEV ? "http://localhost:5173" : "/");
