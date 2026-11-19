import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useStaffAuthStore } from '../stores/useStaffAuthStore.ts';

interface StaffProtectedRouteProps {
  children?: React.ReactNode;
}

export const StaffProtectedRoute: React.FC<StaffProtectedRouteProps> = ({
  children,
}) => {
  const location = useLocation();
  const isAuthenticated = useStaffAuthStore((state) => state.isAuthenticated);
  const initialize = useStaffAuthStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (!isAuthenticated) {
    const redirectTarget = encodeURIComponent(
      location.pathname + location.search,
    );
    return <Navigate to={`/admin/login?redirect=${redirectTarget}`} replace />;
  }

  return <>{children || <Outlet />}</>;
};
