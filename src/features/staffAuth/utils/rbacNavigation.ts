/**
 * Resolves the default landing URL for a staff member based on their granted RBAC permissions.
 * Prioritizes active operational modules that the user has permission to read.
 */
export function getDefaultAdminRoute(permissions: string[] = []): string {
  if (permissions.includes('staff:read')) {
    return '/admin/staff';
  }
  if (permissions.includes('product:read')) {
    return '/admin/products';
  }
  if (permissions.includes('inventory:read')) {
    return '/admin/inventory';
  }
  if (
    permissions.includes('order:read') ||
    permissions.includes('shipment:read')
  ) {
    return '/admin/orders';
  }
  if (permissions.includes('audit:read')) {
    return '/admin/audit-logs';
  }
  return '/admin/overview';
}
