import { createBrowserRouter } from 'react-router-dom';
import { authRoutes } from './authRoutes';
import { homeRoutes } from './homeRoutes';
import { productRoutes } from './productRoutes';

/**
 * Shared browser-history router composing home, auth, and product detail routes.
 *
 * Created once when this module loads and supplied to the application provider.
 * Page files are registered explicitly through the imported route groups.
 */
export const router = createBrowserRouter([
  ...homeRoutes,
  ...authRoutes,
  ...productRoutes,
]);
