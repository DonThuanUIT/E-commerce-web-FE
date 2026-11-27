import type { RouteObject } from 'react-router-dom';
import WishlistPage from '../pages/account/wishlist/page';

/**
 * Route definitions for customer wishlist.
 */
export const wishlistRoutes: RouteObject[] = [
  { path: '/account/wishlist', Component: WishlistPage },
  { path: '/wishlist', Component: WishlistPage },
];
