import type { RouteObject } from 'react-router-dom';
import LoginPage from '../pages/auth/login/page';
import RegisterPage from '../pages/auth/register/page';

/**
 * Registers the login and registration pages at their `/auth` URLs.
 *
 * Both pages currently render empty feature placeholders. These routes do not
 * perform authentication checks or redirect visitors.
 */
export const authRoutes: RouteObject[] = [
  { path: '/auth/login', Component: LoginPage },
  { path: '/auth/register', Component: RegisterPage },
];
