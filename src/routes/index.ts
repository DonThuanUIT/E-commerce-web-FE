import { createBrowserRouter } from 'react-router-dom';
import { authRoutes } from './authRoutes';
import { homeRoutes } from './homeRoutes';

/**
 * Shared browser-history router composing the home and authentication routes.
 *
 * Created once when this module loads and supplied to the application provider.
 * Page files are registered explicitly through the imported route groups.
 */
export const router = createBrowserRouter([...homeRoutes, ...authRoutes]);
