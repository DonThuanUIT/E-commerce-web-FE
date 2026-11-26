import React from 'react';
import { SizeChartManagement } from '../../../features/sizeChart';
import { StaffProtectedRoute } from '../../../features/staffAuth/components/staffProtectedRoute';
import { AdminLayout } from '../adminLayout';

export const SizeChartAdminPage: React.FC = () => {
  return (
    <StaffProtectedRoute requiredPermission="product:read">
      <AdminLayout>
        <SizeChartManagement />
      </AdminLayout>
    </StaffProtectedRoute>
  );
};
