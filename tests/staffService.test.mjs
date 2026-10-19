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
        roleName: 'Quản trị viên',
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
    roleName: 'Quản lý vận hành',
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
    roleName: 'Nhân viên',
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
          message: 'Không thể khoá tài khoản quản trị viên duy nhất',
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
      'Không thể khoá tài khoản quản trị viên duy nhất',
    );
    return true;
  });
});
