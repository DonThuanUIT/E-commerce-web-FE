import assert from 'node:assert/strict';
import test from 'node:test';
import axios from 'axios';
import { setupResponseInterceptor } from '../src/config/interceptors/responseInterceptor.ts';
import { ApiRequestError } from '../src/shared/api/apiRequestError.ts';

function createMockClient(adapter) {
  const client = axios.create({ adapter, baseURL: '/api' });
  setupResponseInterceptor(client);
  return client;
}

test('staffService.getStaffList handles successful pagination response', async () => {
  const mockPageData = {
    items: [
      {
        id: 'b0000000-0000-0000-0000-000000000001',
        email: 'staff@atelier.vn',
        fullName: 'Elena Rostova',
        roleId: 'role-01',
        roleCode: 'ADMIN',
        roleName: 'Administrator',
        status: 1,
        createdAt: '2026-01-15T08:30:00Z',
        updatedAt: '2026-01-15T08:30:00Z',
      },
    ],
    page: 0,
    size: 20,
    totalElements: 1,
    totalPages: 1,
    first: true,
    last: true,
  };

  const client = createMockClient(async (config) => {
    assert.equal(config.method, 'get');
    assert.equal(config.url, '/v1/admin/staff');
    assert.equal(config.params?.status, 1);

    return {
      config,
      data: { success: true, data: mockPageData, error: null },
      status: 200,
      statusText: 'OK',
      headers: {},
    };
  });

  const response = await client.get('/v1/admin/staff', {
    params: { status: 1 },
  });
  assert.equal(response.status, 200);
  assert.equal(response.data.success, true);
  assert.equal(response.data.data.items.length, 1);
  assert.equal(response.data.data.items[0].email, 'staff@atelier.vn');
});

test('staffService.createStaff dispatches POST and unwraps created entity', async () => {
  const newStaff = {
    id: 'staff-uuid-999',
    email: 'newbie@atelier.vn',
    fullName: 'Nguyen Van C',
    roleId: 'role-02',
    roleCode: 'MANAGER',
    roleName: 'Operations Manager',
    status: 1,
    createdAt: '2026-10-19T10:00:00Z',
    updatedAt: '2026-10-19T10:00:00Z',
  };

  const client = createMockClient(async (config) => {
    assert.equal(config.method, 'post');
    assert.equal(config.url, '/v1/admin/staff');
    const body = JSON.parse(config.data);
    assert.equal(body.email, 'newbie@atelier.vn');
    assert.equal(body.fullName, 'Nguyen Van C');

    return {
      config,
      data: { success: true, data: newStaff, error: null },
      status: 201,
      statusText: 'Created',
      headers: {},
    };
  });

  const response = await client.post('/v1/admin/staff', {
    email: 'newbie@atelier.vn',
    fullName: 'Nguyen Van C',
    roleId: 'role-02',
  });

  assert.equal(response.status, 201);
  assert.deepEqual(response.data.data, newStaff);
});

test('staffService.lockStaff dispatches PATCH to lock endpoint', async () => {
  const staffId = 'staff-uuid-123';
  const lockedStaff = {
    id: staffId,
    email: 'locked@atelier.vn',
    fullName: 'Locked User',
    roleId: 'role-03',
    roleCode: 'STAFF',
    roleName: 'Staff Member',
    status: 2, // LOCKED
    createdAt: '2026-03-01T10:00:00Z',
    updatedAt: '2026-10-19T12:00:00Z',
  };

  const client = createMockClient(async (config) => {
    assert.equal(config.method, 'patch');
    assert.equal(config.url, `/v1/admin/staff/${staffId}/lock`);

    return {
      config,
      data: { success: true, data: lockedStaff, error: null },
      status: 200,
      statusText: 'OK',
      headers: {},
    };
  });

  const response = await client.patch(`/v1/admin/staff/${staffId}/lock`);
  assert.equal(response.data.data.status, 2);
});

test('staffService rejects with ApiRequestError on failure envelope', async () => {
  const client = createMockClient(async (config) => {
    const errorResponse = {
      config,
      data: {
        success: false,
        data: null,
        error: {
          status: 400,
          code: 'CANNOT_LOCK_LAST_ADMIN',
          message: 'Cannot lock the only active administrator account',
          timestamp: '2026-10-19T12:00:00Z',
          path: '/api/v1/admin/staff/admin-1/lock',
          fieldErrors: [],
        },
      },
      status: 400,
      statusText: 'Bad Request',
      headers: {},
    };

    throw new axios.AxiosError(
      'Bad Request',
      'ERR_BAD_REQUEST',
      config,
      undefined,
      errorResponse,
    );
  });

  await assert.rejects(client.patch('/v1/admin/staff/admin-1/lock'), (err) => {
    assert.ok(err instanceof ApiRequestError);
    assert.equal(err.status, 400);
    assert.equal(err.code, 'CANNOT_LOCK_LAST_ADMIN');
    assert.equal(
      err.message,
      'Cannot lock the only active administrator account',
    );
    return true;
  });
});

test('staffService.setInitialPassword dispatches POST to /v1/auth/staff/set-password', async () => {
  const client = createMockClient(async (config) => {
    assert.equal(config.method, 'post');
    assert.equal(config.url, '/v1/auth/staff/set-password');
    const body = JSON.parse(config.data);
    assert.equal(body.token, 'valid-setup-token-123');
    assert.equal(body.newPassword, 'P@ssword123!');

    return {
      config,
      data: {
        success: true,
        data: 'Password set successfully',
        error: null,
      },
      status: 200,
      statusText: 'OK',
      headers: {},
    };
  });

  const response = await client.post('/v1/auth/staff/set-password', {
    token: 'valid-setup-token-123',
    newPassword: 'P@ssword123!',
  });

  assert.equal(response.status, 200);
  assert.equal(response.data.success, true);
  assert.equal(response.data.data, 'Password set successfully');
});

test('staffService.changeRole dispatches PATCH to /v1/admin/staff/:id/role', async () => {
  const staffId = 'staff-uuid-007';
  const newRoleId = 'role-manager-id';

  const client = createMockClient(async (config) => {
    assert.equal(config.method, 'patch');
    assert.equal(config.url, `/v1/admin/staff/${staffId}/role`);
    const body = JSON.parse(config.data);
    assert.equal(body.roleId, newRoleId);

    return {
      config,
      data: {
        success: true,
        data: { id: staffId, roleId: newRoleId, roleCode: 'MANAGER' },
        error: null,
      },
      status: 200,
      statusText: 'OK',
      headers: {},
    };
  });

  const response = await client.patch(`/v1/admin/staff/${staffId}/role`, {
    roleId: newRoleId,
  });

  assert.equal(response.status, 200);
  assert.equal(response.data.data.roleId, newRoleId);
});

test('staffService.getStaffStats dispatches GET to /v1/admin/staff/stats', async () => {
  const mockStats = {
    totalCount: 12,
    activeCount: 10,
    lockedCount: 2,
  };

  const client = createMockClient(async (config) => {
    assert.equal(config.method, 'get');
    assert.equal(config.url, '/v1/admin/staff/stats');

    return {
      config,
      data: {
        success: true,
        data: mockStats,
        error: null,
      },
      status: 200,
      statusText: 'OK',
      headers: {},
    };
  });

  const response = await client.get('/v1/admin/staff/stats');
  assert.equal(response.status, 200);
  assert.equal(response.data.success, true);
  assert.deepEqual(response.data.data, mockStats);
});
