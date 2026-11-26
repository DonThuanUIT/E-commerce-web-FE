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

test('addressService GET /v1/customer-addresses returns list with default first', async () => {
  const addresses = [
    {
      id: 'addr-1',
      customerId: 'cust-1',
      recipientName: 'Nguyen Van A',
      phone: '0912345678',
      province: 'TP. Hồ Chí Minh',
      district: 'Quận 1',
      ward: 'Phường Bến Nghé',
      addressLine: '123 Le Loi',
      isDefault: true,
      createdAt: '2026-11-26T00:00:00Z',
      updatedAt: '2026-11-26T00:00:00Z',
    },
  ];

  const client = createMockClient(async (config) => {
    assert.equal(config.method, 'get');
    assert.equal(config.url, '/v1/customer-addresses');
    return {
      config,
      data: { success: true, data: addresses, error: null },
      status: 200,
      headers: {},
    };
  });

  const res = await client.get('/v1/customer-addresses');
  assert.equal(res.data.success, true);
  assert.equal(res.data.data.length, 1);
  assert.equal(res.data.data[0].isDefault, true);
});

test('addressService POST /v1/customer-addresses creates address', async () => {
  const payload = {
    recipientName: 'Tran Thi B',
    phone: '+84987654321',
    province: 'Thành phố Hà Nội',
    district: 'Quận Ba Đình',
    ward: 'Phường Kim Mã',
    addressLine: '10 Kim Ma',
    isDefault: true,
  };

  const client = createMockClient(async (config) => {
    assert.equal(config.method, 'post');
    assert.equal(config.url, '/v1/customer-addresses');
    assert.deepEqual(JSON.parse(config.data), payload);
    return {
      config,
      data: {
        success: true,
        data: { id: 'addr-2', customerId: 'cust-1', ...payload },
        error: null,
      },
      status: 201,
      headers: {},
    };
  });

  const res = await client.post('/v1/customer-addresses', payload);
  assert.equal(res.status, 201);
  assert.equal(res.data.data.id, 'addr-2');
});

test('addressService handles 409 CANNOT_DELETE_DEFAULT_ADDRESS as ApiRequestError', async () => {
  const client = createMockClient(async (config) => {
    const errorResponse = {
      config,
      data: {
        success: false,
        data: null,
        error: {
          status: 409,
          code: 'CANNOT_DELETE_DEFAULT_ADDRESS',
          message: 'Cannot delete the only default address',
          timestamp: '2026-11-26T00:00:00Z',
          path: '/api/v1/customer-addresses/addr-1',
          fieldErrors: [],
        },
      },
      status: 409,
      headers: {},
    };
    throw new axios.AxiosError(
      'Conflict',
      'ERR_BAD_REQUEST',
      config,
      undefined,
      errorResponse,
    );
  });

  await assert.rejects(
    client.delete('/v1/customer-addresses/addr-1'),
    (err) => {
      assert.ok(err instanceof ApiRequestError);
      assert.equal(err.status, 409);
      assert.equal(err.code, 'CANNOT_DELETE_DEFAULT_ADDRESS');
      return true;
    },
  );
});
