const BASE = "/api";

function token(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("admin_token");
}

async function request<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const t = token();
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(t ? { Authorization: `Bearer ${t}` } : {}),
      ...(options.headers ?? {}),
    },
  });

  if (res.status === 401) {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    window.location.href = "/admin/login";
    return undefined as T;
  }

  return res.json() as Promise<T>;
}

export const api = {
  get:    <T = unknown>(path: string)                     => request<T>(path),
  post:   <T = unknown>(path: string, body: unknown)      => request<T>(path, { method: "POST",   body: JSON.stringify(body) }),
  put:    <T = unknown>(path: string, body: unknown)      => request<T>(path, { method: "PUT",    body: JSON.stringify(body) }),
  delete: <T = unknown>(path: string)                     => request<T>(path, { method: "DELETE" }),
};

export function saveAuth(token: string, user: unknown) {
  localStorage.setItem("admin_token", token);
  localStorage.setItem("admin_user", JSON.stringify(user));
}

export function clearAuth() {
  localStorage.removeItem("admin_token");
  localStorage.removeItem("admin_user");
}

export function getStoredUser() {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(localStorage.getItem("admin_user") ?? "null");
  } catch {
    return null;
  }
}
