// Development requests use Vite's proxy to the local payment server.
// Set VITE_API_BASE_URL to explicitly use another backend.
export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ??
  (import.meta.env.DEV ? "" : "https://api.havenway-travels.cv")
).replace(/\/+$/, "");
