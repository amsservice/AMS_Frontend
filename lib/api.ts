


const API_BASE_URL = "http://localhost:4000";

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  const token = localStorage.getItem("accessToken");

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });

  // ⚠️ Handle empty 401 body safely
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "unauthorized");
  }

  return data;
}
