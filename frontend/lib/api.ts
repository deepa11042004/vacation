const BASE = "/api";

// ── Storage helpers ────────────────────────────────────────────────────────
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("admin_token");
}

function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("admin_refresh_token");
}

export function saveAuth(accessToken: string, refreshToken: string, user: unknown) {
  localStorage.setItem("admin_token", accessToken);
  localStorage.setItem("admin_refresh_token", refreshToken);
  localStorage.setItem("admin_user", JSON.stringify(user));
}

export function clearAuth() {
  localStorage.removeItem("admin_token");
  localStorage.removeItem("admin_refresh_token");
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

// ── Token refresh ──────────────────────────────────────────────────────────
let isRefreshing = false;
let refreshQueue: Array<(newToken: string | null) => void> = [];

async function runRefresh(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  try {
    const res = await fetch(`${BASE}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data?.data?.accessToken) {
      localStorage.setItem("admin_token", data.data.accessToken);
      if (data.data.refreshToken) {
        localStorage.setItem("admin_refresh_token", data.data.refreshToken);
      }
      return data.data.accessToken;
    }
    return null;
  } catch {
    return null;
  }
}

function redirectToLogin() {
  clearAuth();
  window.location.href = "/admin/login";
}

// ── Core request ───────────────────────────────────────────────────────────
async function request<T = unknown>(
  path: string,
  options: RequestInit = {},
  isRetry = false
): Promise<T> {
  const t = getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(t ? { Authorization: `Bearer ${t}` } : {}),
      ...(options.headers ?? {}),
    },
  });

  if (res.status === 401 && !isRetry) {
    // If a refresh is already in-flight, queue this request until it resolves
    if (isRefreshing) {
      return new Promise<T>((resolve) => {
        refreshQueue.push((newToken) => {
          if (newToken) resolve(request<T>(path, options, true));
          else { redirectToLogin(); resolve(undefined as T); }
        });
      });
    }

    isRefreshing = true;
    const newToken = await runRefresh();
    isRefreshing = false;

    // Flush the queue
    refreshQueue.forEach((cb) => cb(newToken));
    refreshQueue = [];

    if (newToken) return request<T>(path, options, true);

    redirectToLogin();
    return undefined as T;
  }

  return res.json() as Promise<T>;
}

// ── Public API ─────────────────────────────────────────────────────────────
export const api = {
  get:    <T = unknown>(path: string)                => request<T>(path),
  post:   <T = unknown>(path: string, body: unknown) => request<T>(path, { method: "POST",   body: JSON.stringify(body) }),
  put:    <T = unknown>(path: string, body: unknown) => request<T>(path, { method: "PUT",    body: JSON.stringify(body) }),
  delete: <T = unknown>(path: string)                => request<T>(path, { method: "DELETE" }),
};

export async function logout() {
  try {
    const t = getToken();
    if (t) {
      await fetch(`${BASE}/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${t}` },
      });
    }
  } catch {
    // ignore — we log out client-side regardless
  }
  redirectToLogin();
}
