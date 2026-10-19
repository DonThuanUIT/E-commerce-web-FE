import React from 'react';
import type { RouteObject } from 'react-router-dom';
import { StaffAdminPage } from '../pages/admin/staff/page';
import { StaffSetPasswordPage } from '../pages/auth/staff/setPassword/page';
import { PlaceholderAdminPage } from '../pages/admin/placeholderPage';

/**
 * Route definitions for Staff Management, Password Setup, and Admin Operations Placeholders.
 */
export const staffRoutes: RouteObject[] = [
  {
    path: '/admin/staff',
    element: React.createElement(StaffAdminPage),
  },
  {
    path: '/auth/staff/set-password',
    element: React.createElement(StaffSetPasswordPage),
  },
  // Upcoming placeholder routes for full Aside navigation
  {
    path: '/admin/overview',
    element: React.createElement(PlaceholderAdminPage),
  },
  {
    path: '/admin/products',
    element: React.createElement(PlaceholderAdminPage),
  },
  {
    path: '/admin/inventory',
    element: React.createElement(PlaceholderAdminPage),
  },
  {
    path: '/admin/orders',
    element: React.createElement(PlaceholderAdminPage),
  },
  {
    path: '/admin/returns',
    element: React.createElement(PlaceholderAdminPage),
  },
  {
    path: '/admin/customers',
    element: React.createElement(PlaceholderAdminPage),
  },
  {
    path: '/admin/marketing',
    element: React.createElement(PlaceholderAdminPage),
  },
  {
    path: '/admin/settings',
    element: React.createElement(PlaceholderAdminPage),
  },
];
