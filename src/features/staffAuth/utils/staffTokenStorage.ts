import type { StaffProfile } from '../types/staffAuthType.ts';

export const STAFF_ACCESS_TOKEN_KEY = 'staff_access_token';
export const STAFF_REFRESH_TOKEN_KEY = 'staff_refresh_token';
export const STAFF_PROFILE_KEY = 'staff_profile';

export function getStaffAccessToken(): string | null {
  try {
    return localStorage.getItem(STAFF_ACCESS_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setStaffAccessToken(token: string): void {
  try {
    localStorage.setItem(STAFF_ACCESS_TOKEN_KEY, token);
  } catch {
    // Ignore storage quota or security errors
  }
}

export function getStaffRefreshToken(): string | null {
  try {
    return localStorage.getItem(STAFF_REFRESH_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setStaffRefreshToken(token: string): void {
  try {
    localStorage.setItem(STAFF_REFRESH_TOKEN_KEY, token);
  } catch {
    // Ignore storage quota or security errors
  }
}

export function getStaffProfile(): StaffProfile | null {
  try {
    const raw = localStorage.getItem(STAFF_PROFILE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StaffProfile;
  } catch {
    return null;
  }
}

export function setStaffProfile(profile: StaffProfile): void {
  try {
    localStorage.setItem(STAFF_PROFILE_KEY, JSON.stringify(profile));
  } catch {
    // Ignore storage quota or security errors
  }
}

export function clearStaffAuthTokens(): void {
  try {
    localStorage.removeItem(STAFF_ACCESS_TOKEN_KEY);
    localStorage.removeItem(STAFF_REFRESH_TOKEN_KEY);
    localStorage.removeItem(STAFF_PROFILE_KEY);
  } catch {
    // Ignore storage quota or security errors
  }
}
