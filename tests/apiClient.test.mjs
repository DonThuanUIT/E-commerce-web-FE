import assert from 'node:assert/strict';
import test from 'node:test';
import axios, { AxiosError, CanceledError } from 'axios';
import { setupResponseInterceptor } from '../src/config/interceptors/responseInterceptor.ts';
import { ApiRequestError } from '../src/shared/api/apiRequestError.ts';

const serverError = {
  status: 400,
  code: 'VALIDATION_ERROR',
  message: 'Invalid input',
  timestamp: '2026-10-10T00:00:00Z',
  path: '/api/users',
  fieldErrors: [{ field: 'email', message: 'Invalid email' }],
};

function createClient(adapter) {
  const client = axios.create({ adapter });
  setupResponseInterceptor(client);
  return client;
}

function response(config, data, status = 200) {
  return {
    config,
    data,
    status,
    statusText: '',
    headers: { 'x-test': 'kept' },
  };
}

test('preserves envelopes, falsy data, raw bodies and no-content responses', async () => {
  for (const data of [null, false, 0, '', { id: 'user-id' }]) {
    const payload = { success: true, data, error: null };
    const client = createClient(async (config) => response(config, payload));
    const result = await client.get('/users');
    assert.deepEqual(result.data, payload);
    assert.equal(result.status, 200);
    assert.equal(result.headers['x-test'], 'kept');
  }

  for (const [body, status] of [
    ['raw body', 200],
    ['', 204],
  ]) {
    const client = createClient(async (config) =>
      response(config, body, status),
    );
    const result = await client.get('/users');
    assert.equal(result.data, body);
    assert.equal(result.status, status);
  }
});

test('preserves backend error fields and original Axios error as cause', async () => {
  let original;
  const client = createClient(async (config) => {
    original = new AxiosError(
      'Request failed',
      'ERR_BAD_REQUEST',
      config,
      undefined,
      response(config, { success: false, data: null, error: serverError }, 400),
    );
    throw original;
  });

  await assert.rejects(client.get('/users'), (error) => {
    assert.ok(error instanceof ApiRequestError);
    for (const [key, value] of Object.entries(serverError)) {
      assert.deepEqual(error[key], value);
    }
    assert.equal(error.cause, original);
    return true;
  });
});

test('rejects a failure envelope even when the HTTP status is 200', async () => {
  const client = createClient(async (config) =>
    response(config, { success: false, data: null, error: serverError }),
  );
  await assert.rejects(client.get('/users'), {
    name: 'ApiRequestError',
    code: 'VALIDATION_ERROR',
  });
});

test('uses safe HTTP errors for HTML, empty and malformed response bodies', async () => {
  for (const body of [
    '<html>private proxy diagnostics</html>',
    null,
    {
      success: false,
      data: null,
      error: { ...serverError, fieldErrors: [null] },
    },
  ]) {
    const client = createClient(async (config) => {
      throw new AxiosError(
        'private diagnostics',
        'ERR_BAD_RESPONSE',
        config,
        undefined,
        response(config, body, 502),
      );
    });
    await assert.rejects(client.get('/users'), (error) => {
      assert.ok(error instanceof ApiRequestError);
      assert.equal(error.status, 502);
      assert.equal(error.code, 'HTTP_502');
      assert.deepEqual(error.fieldErrors, []);
      assert.equal(error.message.includes('private'), false);
      return true;
    });
  }
});

test('normalizes network and timeout failures without exposing raw messages', async () => {
  for (const code of ['ERR_NETWORK', 'ECONNABORTED', 'ETIMEDOUT']) {
    const client = createClient(async () => {
      throw new AxiosError('private diagnostics', code);
    });
    await assert.rejects(client.get('/users'), (error) => {
      assert.ok(error instanceof ApiRequestError);
      assert.equal(error.code, code);
      assert.equal(error.status, 0);
      assert.equal(error.message.includes('private'), false);
      if (code !== 'ERR_NETWORK') {
        assert.match(error.message, /hết thời gian chờ/);
      }
      return true;
    });
  }
});

test('preserves Axios cancellation and AbortSignal cancellation', async () => {
  const canceled = new CanceledError('Canceled');
  const client = createClient(async () => {
    throw canceled;
  });
  await assert.rejects(client.get('/users'), (error) => error === canceled);
  await assert.rejects(
    client.get('/users', { signal: AbortSignal.abort() }),
    (error) => axios.isCancel(error),
  );
});

test('normalizes unknown thrown values', async () => {
  const original = new Error('private diagnostics');
  const client = createClient(async () => {
    throw original;
  });
  await assert.rejects(client.get('/users'), (error) => {
    assert.ok(error instanceof ApiRequestError);
    assert.equal(error.code, 'UNKNOWN_ERROR');
    assert.equal(error.cause, original);
    assert.equal(error.message.includes('private'), false);
    return true;
  });
});
