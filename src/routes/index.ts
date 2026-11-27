import { createBrowserRouter } from 'react-router-dom';
import { addressRoutes } from './addressRoutes';
import { authRoutes } from './authRoutes';
import { homeRoutes } from './homeRoutes';
import { productRoutes } from './productRoutes';
import { staffRoutes } from './staffRoutes';
import { auditLogRoutes } from './auditLogRoutes';
import { wishlistRoutes } from './wishlistRoutes';

/**
 * Shared browser-history router composing all application routes.
 */
export const router = createBrowserRouter([
  ...homeRoutes,
  ...authRoutes,
  ...addressRoutes,
  ...productRoutes,
  ...wishlistRoutes,
  ...staffRoutes,
  ...auditLogRoutes,
]);
