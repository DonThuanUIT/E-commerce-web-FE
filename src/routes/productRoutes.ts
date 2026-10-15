import type { RouteObject } from 'react-router-dom';
import ProductDetailPage from '../pages/product/detail/page';

/**
 * Route definitions for product browsing and detail pages.
 */
export const productRoutes: RouteObject[] = [
  { path: '/products/:slug', Component: ProductDetailPage },
  { path: '/products', Component: ProductDetailPage },
];
