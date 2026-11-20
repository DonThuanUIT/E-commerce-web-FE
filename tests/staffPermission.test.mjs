import assert from 'node:assert/strict';
import test from 'node:test';
import { useStaffAuthStore } from '../src/features/staffAuth/stores/useStaffAuthStore.ts';
import { hasStaffPermission } from '../src/features/staffAuth/hooks/useStaffPermission.ts';

test('hasStaffPermission verifies permissions correctly', () => {
  // Test when unauthenticated / null staff
  assert.equal(hasStaffPermission(null, 'staff:read'), false);
  assert.equal(
    hasStaffPermission(undefined, ['staff:read', 'staff:write']),
    false,
  );

  const mockStaff = {
    id: 'b0000000-0000-0000-0000-000000000001',
    email: 'manager@atelier.local',
    fullName: 'Product Manager',
    status: 'ACTIVE',
    role: {
      id: 'role-02',
      code: 'PRODUCT_MANAGER',
      name: 'Product Manager',
    },
    permissions: ['product:read', 'product:write', 'category:read'],
  };

  // Single permission
  assert.equal(hasStaffPermission(mockStaff, 'product:read'), true);
  assert.equal(hasStaffPermission(mockStaff, 'staff:read'), false);

  // Any mode (default)
  assert.equal(
    hasStaffPermission(mockStaff, ['staff:read', 'product:read'], 'any'),
    true,
  );
  assert.equal(
    hasStaffPermission(mockStaff, ['staff:read', 'staff:write'], 'any'),
    false,
  );

  // All mode
  assert.equal(
    hasStaffPermission(mockStaff, ['product:read', 'product:write'], 'all'),
    true,
  );
  assert.equal(
    hasStaffPermission(mockStaff, ['product:read', 'staff:write'], 'all'),
    false,
  );
});

test('useStaffAuthStore hasPermission and hasAnyPermission work correctly', () => {
  useStaffAuthStore.setState({
    staff: {
      id: 'b0000000-0000-0000-0000-000000000001',
      email: 'admin@atelier.local',
      fullName: 'System Administrator',
      status: 'ACTIVE',
      role: {
        id: 'role-01',
        code: 'ADMIN',
        name: 'Administrator',
      },
      permissions: ['staff:read', 'staff:write', 'audit:read'],
    },
    isAuthenticated: true,
  });

  const store = useStaffAuthStore.getState();
  assert.equal(store.hasPermission('staff:read'), true);
  assert.equal(store.hasPermission('product:write'), false);
  assert.equal(store.hasAnyPermission(['product:write', 'audit:read']), true);
  assert.equal(
    store.hasAnyPermission(['product:write', 'category:write']),
    false,
  );

  // Reset store
  useStaffAuthStore.setState({ staff: null, isAuthenticated: false });
});
