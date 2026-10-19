import React from 'react';
import type { RouteObject } from 'react-router-dom';
import { AuditLogAdminPage } from '../pages/admin/audit-logs/page';

/**
 * Route definitions for Administrative Audit Logs query portal.
 */
export const auditLogRoutes: RouteObject[] = [
  {
    path: '/admin/audit-logs',
    element: React.createElement(AuditLogAdminPage),
  },
];
