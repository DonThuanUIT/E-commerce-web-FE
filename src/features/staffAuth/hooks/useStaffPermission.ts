import type { StaffProfile } from '../types/staffAuthType.ts';
import { useStaffAuthStore } from '../stores/useStaffAuthStore.ts';

/**
 * Pure function to evaluate whether a staff member profile holds
 * the required permission(s).
 */
export function hasStaffPermission(
  staff: StaffProfile | null | undefined,
  permission?: string | string[],
  mode: 'any' | 'all' = 'any',
): boolean {
  if (!staff || !Array.isArray(staff.permissions)) {
    return false;
  }

  // If no permission specified, access is granted to any authenticated staff
  if (!permission || (Array.isArray(permission) && permission.length === 0)) {
    return true;
  }

  const staffPermissions = staff.permissions;

  if (typeof permission === 'string') {
    return staffPermissions.includes(permission);
  }

  if (mode === 'all') {
    return permission.every((p) => staffPermissions.includes(p));
  }

  return permission.some((p) => staffPermissions.includes(p));
}

/**
 * Hook to evaluate whether the currently authenticated staff member holds
 * the required permission(s).
 */
export function useStaffPermission(
  permission?: string | string[],
  mode: 'any' | 'all' = 'any',
): boolean {
  const staff = useStaffAuthStore((state) => state.staff);
  return hasStaffPermission(staff, permission, mode);
}
