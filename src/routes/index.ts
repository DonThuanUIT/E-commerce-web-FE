import { createBrowserRouter } from 'react-router-dom';
import { authRoutes } from './authRoutes';
import { homeRoutes } from './homeRoutes';
import { productRoutes } from './productRoutes';
import { staffRoutes } from './staffRoutes';
import { auditLogRoutes } from './auditLogRoutes';

/**
 * Shared browser-history router composing all application routes.
 */
export const router = createBrowserRouter([
  ...homeRoutes,
  ...authRoutes,
  ...productRoutes,
  ...staffRoutes,
  ...auditLogRoutes,
]);
