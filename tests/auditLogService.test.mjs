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

test('auditLogService.getAuditLogs returns paginated audit records with filters', async () => {
  const mockLogs = {
    items: [
      {
        id: 'log-001',
        actorType: 1,
        actorId: 'admin-uuid-1',
        action: 'CHANGE_ROLE',
        entityType: 'STAFF',
        entityId: 'staff-uuid-2',
        beforeState: { role: 'STAFF' },
        afterState: { role: 'MANAGER' },
        ip: '127.0.0.1',
        userAgent: 'Chrome',
        createdAt: '2026-10-19T10:00:00Z',
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
    assert.equal(config.url, '/v1/admin/audit-logs');
    assert.equal(config.params?.action, 'CHANGE_ROLE');
    assert.equal(config.params?.entityType, 'STAFF');

    return {
      config,
      data: { success: true, data: mockLogs, error: null },
      status: 200,
      statusText: 'OK',
      headers: {},
    };
  });

  const response = await client.get('/v1/admin/audit-logs', {
    params: { action: 'CHANGE_ROLE', entityType: 'STAFF' },
  });

  assert.equal(response.status, 200);
  assert.equal(response.data.data.items.length, 1);
  assert.equal(response.data.data.items[0].action, 'CHANGE_ROLE');
  assert.deepEqual(response.data.data.items[0].beforeState, { role: 'STAFF' });
  assert.deepEqual(response.data.data.items[0].afterState, { role: 'MANAGER' });
});

test('auditLogService.getAuditLogById fetches single log detail', async () => {
  const logId = 'log-xyz-777';
  const detailLog = {
    id: logId,
    actorType: 1,
    actorId: 'admin-uuid-1',
    action: 'CREATE',
    entityType: 'PRODUCT',
    entityId: 'prod-001',
    beforeState: null,
    afterState: { title: 'Blazer', price: 2000000 },
    ip: '113.161.72.10',
    userAgent: 'Safari',
    createdAt: '2026-10-19T11:00:00Z',
  };

  const client = createMockClient(async (config) => {
    assert.equal(config.method, 'get');
    assert.equal(config.url, `/v1/admin/audit-logs/${logId}`);

    return {
      config,
      data: { success: true, data: detailLog, error: null },
      status: 200,
      statusText: 'OK',
      headers: {},
    };
  });

  const response = await client.get(`/v1/admin/audit-logs/${logId}`);
  assert.equal(response.data.data.id, logId);
  assert.equal(response.data.data.entityType, 'PRODUCT');
});

test('auditLogService rejects on 404 with ApiRequestError', async () => {
  const client = createMockClient(async (config) => {
    const errorResponse = {
      config,
      data: {
        success: false,
        data: null,
        error: {
          status: 404,
          code: 'AUDIT_LOG_NOT_FOUND',
          message: 'Audit log record not found with the provided ID',
          timestamp: '2026-10-19T12:00:00Z',
          path: '/api/v1/admin/audit-logs/unknown-id',
          fieldErrors: [],
        },
      },
      status: 404,
      statusText: 'Not Found',
      headers: {},
    };

    throw new axios.AxiosError(
      'Not Found',
      'ERR_BAD_REQUEST',
      config,
      undefined,
      errorResponse,
    );
  });

  await assert.rejects(client.get('/v1/admin/audit-logs/unknown-id'), (err) => {
    assert.ok(err instanceof ApiRequestError);
    assert.equal(err.status, 404);
    assert.equal(err.code, 'AUDIT_LOG_NOT_FOUND');
    return true;
  });
});
