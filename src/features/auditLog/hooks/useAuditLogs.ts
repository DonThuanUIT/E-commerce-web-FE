import { useQuery } from '@tanstack/react-query';
import { auditLogService } from '../services/auditLogService';
import type { AuditLogQueryParams } from '../types/auditLogType';

export const auditLogKeys = {
  all: ['audit-logs'] as const,
  lists: () => [...auditLogKeys.all, 'list'] as const,
  list: (filters: AuditLogQueryParams) =>
    [...auditLogKeys.lists(), filters] as const,
  details: () => [...auditLogKeys.all, 'detail'] as const,
  detail: (id: string) => [...auditLogKeys.details(), id] as const,
};

/**
 * Hook to query paginated audit logs with optional filters.
 */
export function useAuditLogs(params: AuditLogQueryParams = {}) {
  return useQuery({
    queryKey: auditLogKeys.list(params),
    queryFn: () => auditLogService.getAuditLogs(params),
  });
}

/**
 * Hook to query audit log details by ID.
 */
export function useAuditLogDetail(id: string | null) {
  return useQuery({
    queryKey: auditLogKeys.detail(id || ''),
    queryFn: () => {
      if (!id) throw new Error('ID không hợp lệ');
      return auditLogService.getAuditLogById(id);
    },
    enabled: Boolean(id),
  });
}
