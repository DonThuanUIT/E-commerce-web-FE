import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useStaffAuthStore } from '../stores/useStaffAuthStore.ts';

interface StaffProtectedRouteProps {
  requiredPermission?: string | string[];
  children?: React.ReactNode;
}

export const StaffProtectedRoute: React.FC<StaffProtectedRouteProps> = ({
  requiredPermission,
  children,
}) => {
  const location = useLocation();
  const isAuthenticated = useStaffAuthStore((state) => state.isAuthenticated);
  const initialize = useStaffAuthStore((state) => state.initialize);
  const hasPermission = useStaffAuthStore((state) => state.hasPermission);
  const hasAnyPermission = useStaffAuthStore((state) => state.hasAnyPermission);

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (!isAuthenticated) {
    const redirectTarget = encodeURIComponent(
      location.pathname + location.search,
    );
    return <Navigate to={`/admin/login?redirect=${redirectTarget}`} replace />;
  }

  if (requiredPermission) {
    const isAllowed = Array.isArray(requiredPermission)
      ? hasAnyPermission(requiredPermission)
      : hasPermission(requiredPermission);

    if (!isAllowed) {
      return (
        <div className="min-h-screen bg-surface-container-low flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-md rounded-xl bg-surface-container-lowest border border-error p-8 text-center text-on-surface shadow-xl">
            <h2 className="font-headline-sm text-error uppercase mb-2">
              Access Denied (403)
            </h2>
            <p className="font-body-sm text-secondary mb-6">
              You do not have the required permissions to access this console
              section.
            </p>
            <a
              href="/admin/staff"
              className="inline-block py-2.5 px-5 bg-primary text-on-primary font-label-md uppercase tracking-wider rounded-lg hover:bg-neutral-800 transition"
            >
              Return to Console
            </a>
          </div>
        </div>
      );
    }
  }

  return <>{children || <Outlet />}</>;
};
