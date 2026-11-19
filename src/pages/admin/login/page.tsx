import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { StaffLoginForm } from '../../../features/staffAuth/components/staffLoginForm.tsx';
import { useStaffAuthStore } from '../../../features/staffAuth/stores/useStaffAuthStore.ts';

export const StaffAdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isAuthenticated = useStaffAuthStore((state) => state.isAuthenticated);
  const redirectUrl = searchParams.get('redirect') || '/admin/staff';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectUrl, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectUrl]);

  return <StaffLoginForm />;
};
