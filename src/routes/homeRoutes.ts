import type { RouteObject } from 'react-router-dom';
import HomePage from '../pages/home/page';

/** Maps the root URL `/` directly to the home page without a redirect. */
export const homeRoutes: RouteObject[] = [{ path: '/', Component: HomePage }];
