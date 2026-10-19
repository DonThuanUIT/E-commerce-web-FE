import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { staffService } from '../services/staffService';
import type {
  ChangeStaffRoleCommand,
  CreateStaffCommand,
  SetStaffPasswordCommand,
  StaffQueryParams,
} from '../types/staffType';

export const staffKeys = {
  all: ['staff'] as const,
  lists: () => [...staffKeys.all, 'list'] as const,
  list: (filters: StaffQueryParams) => [...staffKeys.lists(), filters] as const,
  details: () => [...staffKeys.all, 'detail'] as const,
  detail: (id: string) => [...staffKeys.details(), id] as const,
  roles: ['staff-roles'] as const,
};

/**
 * Hook to query paginated staff members.
 */
export function useStaffList(params: StaffQueryParams = {}) {
  return useQuery({
    queryKey: staffKeys.list(params),
    queryFn: () => staffService.getStaffList(params),
  });
}

/**
 * Hook to query available staff roles.
 */
export function useStaffRoles() {
  return useQuery({
    queryKey: staffKeys.roles,
    queryFn: () => staffService.getRoles(),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to create a new staff member.
 */
export function useCreateStaff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (command: CreateStaffCommand) =>
      staffService.createStaff(command),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.lists() });
    },
  });
}

/**
 * Hook to lock a staff member.
 */
export function useLockStaff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => staffService.lockStaff(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.lists() });
    },
  });
}

/**
 * Hook to unlock a staff member.
 */
export function useUnlockStaff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => staffService.unlockStaff(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.lists() });
    },
  });
}

/**
 * Hook to change a staff member's role.
 */
export function useChangeStaffRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      command,
    }: {
      id: string;
      command: ChangeStaffRoleCommand;
    }) => staffService.changeRole(id, command),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffKeys.lists() });
    },
  });
}

/**
 * Hook to resend invitation email.
 */
export function useResendInvitation() {
  return useMutation({
    mutationFn: (id: string) => staffService.resendInvitation(id),
  });
}

/**
 * Hook to set initial password.
 */
export function useSetStaffPassword() {
  return useMutation({
    mutationFn: (command: SetStaffPasswordCommand) =>
      staffService.setPassword(command),
  });
}
