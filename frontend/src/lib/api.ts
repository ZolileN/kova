const API_BASE = "http://localhost:8000/api/v1";

export async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Unauthorized, redirect to login
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "API Error");
  }

  return response.json();
}
