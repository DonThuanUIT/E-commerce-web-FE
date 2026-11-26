import type { RouteObject } from 'react-router-dom';
import AddressesPage from '../pages/account/addresses/page';

/**
 * Registers customer account routes including the delivery address book.
 */
export const addressRoutes: RouteObject[] = [
  { path: '/account/addresses', Component: AddressesPage },
];
