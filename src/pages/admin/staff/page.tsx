import React from 'react';
import { StaffManagement } from '../../../features/staff';
import { AdminLayout } from '../adminLayout';

export const StaffAdminPage: React.FC = () => {
  return (
    <AdminLayout>
      <StaffManagement />
    </AdminLayout>
  );
};
