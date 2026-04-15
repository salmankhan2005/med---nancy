import { auth } from "./firebase";

export const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
  const isProd = import.meta.env.PROD;
  const baseUrl = import.meta.env.VITE_API_BASE_URL || (isProd ? "" : "http://localhost:3001");
  const currentUser = auth.currentUser;
  
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");

  if (currentUser) {
    const token = await currentUser.getIdToken();
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.error || `HTTP Error ${response.status}`);
  }

  return response.json();
};
