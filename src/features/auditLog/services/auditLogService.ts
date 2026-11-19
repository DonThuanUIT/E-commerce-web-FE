import { staffAxios } from '../../staffAuth/services/staffAxios.ts';
import type { ApiResponse } from '../../../shared/types/apiType.ts';
import type {
  AuditLog,
  AuditLogPageResponse,
  AuditLogQueryParams,
} from '../types/auditLogType.ts';

/**
 * Administrative Audit Logs API Service.
 * Interacts directly with CNWeb_BE endpoints.
 */
export const auditLogService = {
  /**
   * Fetches paginated audit logs matching optional filters.
   */
  async getAuditLogs(
    params?: AuditLogQueryParams,
  ): Promise<AuditLogPageResponse> {
    const response = await staffAxios.get<ApiResponse<AuditLogPageResponse>>(
      '/v1/admin/audit-logs',
      { params },
    );

    if (response.data && response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(
      response.data?.error?.message || 'Failed to load audit logs',
    );
  },

  /**
   * Retrieves single audit log entry by ID, including complete before/after snapshots.
   */
  async getAuditLogById(id: string): Promise<AuditLog> {
    const response = await staffAxios.get<ApiResponse<AuditLog>>(
      `/v1/admin/audit-logs/${id}`,
    );

    if (response.data && response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(
      response.data?.error?.message || 'Audit log entry details not found',
    );
  },
};
