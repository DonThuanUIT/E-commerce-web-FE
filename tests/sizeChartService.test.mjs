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

test('sizeChartService GET /v1/admin/size-charts returns paginated response', async () => {
  const pageData = {
    items: [
      {
        id: 'chart-1',
        name: 'Polo Shirt',
        rows: [
          {
            id: 'row-1',
            sizeCode: 'M',
            chestMin: 88,
            chestMax: 96,
            waistMin: 76,
            waistMax: 84,
            hipMin: null,
            hipMax: null,
            heightMin: 165,
            heightMax: 175,
            weightMin: 56,
            weightMax: 66,
          },
        ],
        createdAt: '2026-11-26T00:00:00Z',
        updatedAt: '2026-11-26T00:00:00Z',
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
    assert.equal(config.url, '/v1/admin/size-charts');
    assert.equal(config.params.keyword, 'Polo');
    return {
      config,
      data: { success: true, data: pageData, error: null },
      status: 200,
      headers: {},
    };
  });

  const res = await client.get('/v1/admin/size-charts', {
    params: { keyword: 'Polo', page: 0, size: 20 },
  });
  assert.equal(res.data.success, true);
  assert.equal(res.data.data.items.length, 1);
  assert.equal(res.data.data.items[0].name, 'Polo Shirt');
});

test('sizeChartService DELETE rejects 409 SIZE_CHART_IN_USE as ApiRequestError', async () => {
  const client = createMockClient(async (config) => {
    const errorResponse = {
      config,
      data: {
        success: false,
        data: null,
        error: {
          status: 409,
          code: 'SIZE_CHART_IN_USE',
          message: 'Size chart is currently assigned to one or more products',
          timestamp: '2026-11-26T00:00:00Z',
          path: '/api/v1/admin/size-charts/chart-1',
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
    client.delete('/v1/admin/size-charts/chart-1'),
    (err) => {
      assert.ok(err instanceof ApiRequestError);
      assert.equal(err.status, 409);
      assert.equal(err.code, 'SIZE_CHART_IN_USE');
      return true;
    },
  );
});
