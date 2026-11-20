import React from 'react';
import { StaffManagement } from '../../../features/staff';
import { StaffProtectedRoute } from '../../../features/staffAuth/components/staffProtectedRoute';
import { AdminLayout } from '../adminLayout';

export const StaffAdminPage: React.FC = () => {
  return (
    <StaffProtectedRoute requiredPermission="staff:read">
      <AdminLayout>
        <StaffManagement />
      </AdminLayout>
    </StaffProtectedRoute>
  );
};
