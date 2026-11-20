import React from 'react';
import { AuditLogManagement } from '../../../features/auditLog';
import { StaffProtectedRoute } from '../../../features/staffAuth/components/staffProtectedRoute';
import { AdminLayout } from '../adminLayout';

export const AuditLogAdminPage: React.FC = () => {
  return (
    <StaffProtectedRoute requiredPermission="audit:read">
      <AdminLayout>
        <AuditLogManagement />
      </AdminLayout>
    </StaffProtectedRoute>
  );
};
