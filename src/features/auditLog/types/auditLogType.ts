import type { PageResponse } from '../../../shared/types/apiType';

/**
 * Public read model for an audit log entry.
 */
export interface AuditLog {
  id: string;
  actorType: number;
  actorId: string;
  action: string;
  entityType: string;
  entityId: string;
  beforeState: Record<string, unknown> | null;
  afterState: Record<string, unknown> | null;
  ip: string;
  userAgent: string;
  createdAt: string;
}

/**
 * Query parameters for filtering and paginating audit logs.
 */
export interface AuditLogQueryParams {
  actorId?: string;
  entityType?: string;
  entityId?: string;
  action?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  size?: number;
}

export type AuditLogQuery = AuditLogQueryParams;
export type AuditLogPageResponse = PageResponse<AuditLog>;
