import assert from 'node:assert/strict';
import test from 'node:test';
import axios from 'axios';
import { setupResponseInterceptor } from '../src/config/interceptors/responseInterceptor.ts';
import { ApiRequestError } from '../src/shared/api/apiRequestError.ts';

function createMockClient(adapter) {
  const client = axios.create({ adapter });
  setupResponseInterceptor(client);
  return client;
}

test('authService handles successful registration response', async () => {
  const userPayload = {
    id: 'user-uuid-1234',
    email: 'customer@example.com',
    fullName: 'Nguyen Van A',
    status: '1',
    createdAt: '2026-10-17T22:00:00Z',
  };

  const client = createMockClient(async (config) => {
    assert.equal(config.method, 'post');
    assert.equal(config.url, '/v1/auth/register');
    const data = JSON.parse(config.data);
    assert.equal(data.email, 'customer@example.com');
    assert.equal(data.fullName, 'Nguyen Van A');
    assert.equal(data.password, 'Password123');

    return {
      config,
      data: { success: true, data: userPayload, error: null },
      status: 201,
      statusText: 'Created',
      headers: {},
    };
  });

  const response = await client.post('/v1/auth/register', {
    email: 'customer@example.com',
    fullName: 'Nguyen Van A',
    password: 'Password123',
  });

  assert.equal(response.status, 201);
  assert.equal(response.data.success, true);
  assert.deepEqual(response.data.data, userPayload);
});

test('authService rejects on 409 EMAIL_ALREADY_REGISTERED with ApiRequestError', async () => {
  const client = createMockClient(async (config) => {
    const errorResponse = {
      config,
      data: {
        success: false,
        data: null,
        error: {
          status: 409,
          code: 'EMAIL_ALREADY_REGISTERED',
          message: 'Email is already registered in the system',
          timestamp: '2026-10-17T22:00:00Z',
          path: '/api/v1/auth/register',
          fieldErrors: [],
        },
      },
      status: 409,
      statusText: 'Conflict',
      headers: {},
    };

    const err = new axios.AxiosError(
      'Request failed with status code 409',
      'ERR_BAD_REQUEST',
      config,
      undefined,
      errorResponse,
    );
    throw err;
  });

  await assert.rejects(
    client.post('/v1/auth/register', {
      email: 'existing@example.com',
      fullName: 'Nguyen Van A',
      password: 'Password123',
    }),
    (err) => {
      assert.ok(err instanceof ApiRequestError);
      assert.equal(err.status, 409);
      assert.equal(err.code, 'EMAIL_ALREADY_REGISTERED');
      assert.equal(err.message, 'Email is already registered in the system');
      return true;
    },
  );
});
