import { AuthenticatedOperative } from "../types/auth";

const STORAGE_KEY = "aura_fer_operative_auth_v1";

export function getStoredOperative(): AuthenticatedOperative | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.photoDataUrl && parsed.isHumanVerified) {
      return parsed as AuthenticatedOperative;
    }
  } catch (err) {
    console.warn("Failed to parse stored operative identity:", err);
  }
  return null;
}

export function saveStoredOperative(operative: AuthenticatedOperative): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(operative));
  } catch (err) {
    console.warn("Failed to persist operative identity:", err);
  }
}

export function clearStoredOperative(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn("Failed to remove stored operative identity:", err);
  }
}
