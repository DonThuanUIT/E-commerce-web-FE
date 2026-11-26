import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { customerTokenStorage } from '../utils/customerTokenStorage';

interface CustomerProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Route guard ensuring the visitor has an active customer access token.
 * Redirects unauthenticated visitors to `/auth/login?redirect=...`.
 */
export const CustomerProtectedRoute: React.FC<CustomerProtectedRouteProps> = ({
  children,
}) => {
  const location = useLocation();
  const token = customerTokenStorage.getAccessToken();

  if (!token) {
    const redirectTarget = `${location.pathname}${location.search}`;
    return (
      <Navigate
        to={`/auth/login?redirect=${encodeURIComponent(redirectTarget)}`}
        replace
      />
    );
  }

  return <>{children}</>;
};
