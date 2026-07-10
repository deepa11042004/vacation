const BASE = "/api";

export function getMemberToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("member_token");
}

export function getMemberRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("member_refresh_token");
}

export function saveMemberAuth(accessToken: string, refreshToken: string, user: unknown) {
  localStorage.setItem("member_token", accessToken);
  localStorage.setItem("member_refresh_token", refreshToken);
  localStorage.setItem("member_user", JSON.stringify(user));
}

export function clearMemberAuth() {
  localStorage.removeItem("member_token");
  localStorage.removeItem("member_refresh_token");
  localStorage.removeItem("member_user");
}

export function getStoredMemberUser<T = unknown>(): T | null {
  if (typeof window === "undefined") return null;
  try { return JSON.parse(localStorage.getItem("member_user") ?? "null") as T; }
  catch { return null; }
}

let isRefreshing = false;
let refreshQueue: Array<(token: string | null) => void> = [];

async function runRefresh(): Promise<string | null> {
  const refreshToken = getMemberRefreshToken();
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
      const newAccess = data.data.accessToken;
      localStorage.setItem("member_token", newAccess);
      if (data.data.refreshToken) localStorage.setItem("member_refresh_token", data.data.refreshToken);
      return newAccess;
    }
    return null;
  } catch { return null; }
}

function redirectToLogin() {
  clearMemberAuth();
  window.location.href = "/login";
}

async function request<T = unknown>(path: string, options: RequestInit = {}, isRetry = false): Promise<T> {
  const token = getMemberToken();
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });

  if (res.status === 401 && !isRetry) {
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
    refreshQueue.forEach((cb) => cb(newToken));
    refreshQueue = [];
    if (newToken) return request<T>(path, options, true);
    redirectToLogin();
    return undefined as T;
  }

  return res.json() as Promise<T>;
}

export const memberApi = {
  get:    <T = unknown>(path: string)                 => request<T>(path),
  post:   <T = unknown>(path: string, body: unknown)  => request<T>(path, { method: "POST",   body: JSON.stringify(body) }),
  put:    <T = unknown>(path: string, body: unknown)  => request<T>(path, { method: "PUT",    body: JSON.stringify(body) }),
  delete: <T = unknown>(path: string)                 => request<T>(path, { method: "DELETE" }),
};

export async function memberLogout() {
  try {
    const token = getMemberToken();
    if (token) {
      await fetch(`${BASE}/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
    }
  } catch { /* ignore */ }
  redirectToLogin();
}
