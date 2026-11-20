import React, { useEffect } from 'react';
import {
  Navigate,
  Outlet,
  useLocation,
  Link,
  useNavigate,
} from 'react-router-dom';
import { useStaffAuthStore } from '../stores/useStaffAuthStore.ts';
import { getDefaultAdminRoute } from '../utils/rbacNavigation.ts';

interface StaffProtectedRouteProps {
  requiredPermission?: string | string[];
  children?: React.ReactNode;
}

export const StaffProtectedRoute: React.FC<StaffProtectedRouteProps> = ({
  requiredPermission,
  children,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = useStaffAuthStore((state) => state.isAuthenticated);
  const staff = useStaffAuthStore((state) => state.staff);
  const logout = useStaffAuthStore((state) => state.logout);
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
      const targetRoute = getDefaultAdminRoute(staff?.permissions);

      return (
        <div className="min-h-screen bg-surface-container-low flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-md rounded-xl bg-surface-container-lowest border border-error p-8 text-center text-on-surface shadow-xl">
            <h2 className="font-headline-sm text-error uppercase mb-2">
              Access Denied (403)
            </h2>
            <p className="font-body-sm text-secondary mb-6">
              Your role ({staff?.roleCode || 'Current Role'}) does not have the
              required permissions to access this console section.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                to={targetRoute}
                className="w-full py-2.5 px-5 bg-primary text-on-primary font-label-md uppercase tracking-wider rounded-lg hover:bg-neutral-800 transition text-center"
              >
                Go to Accessible Workspace
              </Link>
              <button
                type="button"
                onClick={async () => {
                  await logout();
                  navigate('/admin/login', { replace: true });
                }}
                className="w-full py-2 px-4 border border-[#e5e7eb] hover:bg-surface-container font-label-sm text-secondary uppercase tracking-wider rounded-lg transition cursor-pointer"
              >
                Sign In With Different Account
              </button>
            </div>
          </div>
        </div>
      );
    }
  }

  return <>{children || <Outlet />}</>;
};
