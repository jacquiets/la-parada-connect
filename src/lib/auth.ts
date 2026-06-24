import type { UserProfile } from "./api";

const TOKEN_KEY = "lp_access_token";
const USER_KEY = "lp_user";

// ─── Token ────────────────────────────────────────────────────────────────────

export function saveToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

// ─── User ─────────────────────────────────────────────────────────────────────

export function saveUser(user: UserProfile): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getUser(): UserProfile | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UserProfile;
  } catch {
    return null;
  }
}

export function clearUser(): void {
  localStorage.removeItem(USER_KEY);
}

// ─── Session ──────────────────────────────────────────────────────────────────

export function isAuthenticated(): boolean {
  return Boolean(getToken());
}

export function logout(): void {
  clearToken();
  clearUser();
}
