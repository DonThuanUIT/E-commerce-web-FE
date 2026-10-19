import React from 'react';
import { AuditLogManagement } from '../../../features/auditLog';
import { AdminLayout } from '../adminLayout';

export const AuditLogAdminPage: React.FC = () => {
  return (
    <AdminLayout>
      <AuditLogManagement />
    </AdminLayout>
  );
};
