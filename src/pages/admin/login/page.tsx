import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { StaffLoginForm } from '../../../features/staffAuth/components/staffLoginForm.tsx';
import { useStaffAuthStore } from '../../../features/staffAuth/stores/useStaffAuthStore.ts';
import { getDefaultAdminRoute } from '../../../features/staffAuth/utils/rbacNavigation.ts';

export const StaffAdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isAuthenticated = useStaffAuthStore((state) => state.isAuthenticated);
  const staff = useStaffAuthStore((state) => state.staff);
  const redirectParam = searchParams.get('redirect');
  const targetUrl = redirectParam || getDefaultAdminRoute(staff?.permissions);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(targetUrl, { replace: true });
    }
  }, [isAuthenticated, navigate, targetUrl]);

  return <StaffLoginForm />;
};
