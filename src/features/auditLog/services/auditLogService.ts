import { axiosInstance } from '../../../config/axios';
import type { ApiResponse } from '../../../shared/types/apiType';
import type {
  AuditLog,
  AuditLogPageResponse,
  AuditLogQueryParams,
} from '../types/auditLogType';

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
    const response = await axiosInstance.get<ApiResponse<AuditLogPageResponse>>(
      '/v1/admin/audit-logs',
      { params },
    );

    if (response.data && response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(
      response.data?.error?.message || 'Không thể tải nhật ký kiểm toán',
    );
  },

  /**
   * Retrieves single audit log entry by ID, including complete before/after snapshots.
   */
  async getAuditLogById(id: string): Promise<AuditLog> {
    const response = await axiosInstance.get<ApiResponse<AuditLog>>(
      `/v1/admin/audit-logs/${id}`,
    );

    if (response.data && response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(
      response.data?.error?.message ||
        'Không tìm thấy chi tiết nhật ký kiểm toán',
    );
  },
};
