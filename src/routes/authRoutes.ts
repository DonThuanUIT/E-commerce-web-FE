import type { RouteObject } from 'react-router-dom';
import LoginPage from '../pages/auth/login/page';
import RegisterPage from '../pages/auth/register/page';

export const authRoutes: RouteObject[] = [
  { path: '/auth/login', Component: LoginPage },
  { path: '/auth/register', Component: RegisterPage },
];
