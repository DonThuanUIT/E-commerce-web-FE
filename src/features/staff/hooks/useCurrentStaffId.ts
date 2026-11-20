import { useStaffAuthStore } from '../../staffAuth/stores/useStaffAuthStore';

/**
 * Hook to retrieve the current logged-in staff ID for authorization and self-action guards.
 * Reads from the authenticated staff store with fallback to dev environment variable.
 */
export function useCurrentStaffId(): string | undefined {
  const staff = useStaffAuthStore((state) => state.staff);
  return staff?.id || import.meta.env.VITE_DEV_STAFF_ID?.trim() || undefined;
}
