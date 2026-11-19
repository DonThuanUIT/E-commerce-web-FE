import assert from 'node:assert/strict';
import test from 'node:test';
import { staffAuthService } from '../src/features/staffAuth/services/staffAuthService.ts';
import { staffAxios } from '../src/features/staffAuth/services/staffAxios.ts';

test('staffAuthService.login sends credentials and returns StaffAuthResponse', async () => {
  const originalAdapter = staffAxios.defaults.adapter;
  staffAxios.defaults.adapter = async (config) => {
    assert.equal(config.method, 'post');
    assert.equal(config.url, '/v1/auth/staff/login');
    const body = JSON.parse(config.data);
    assert.equal(body.email, 'admin@atelier.local');
    assert.equal(body.password, 'Admin@123456');

    return {
      config,
      data: {
        success: true,
        data: {
          accessToken: 'mock-staff-access-token',
          refreshToken: 'mock-staff-refresh-token',
          tokenType: 'Bearer',
          expiresIn: 3600,
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
            permissions: ['staff:read', 'staff:write'],
          },
        },
        error: null,
      },
      status: 200,
      statusText: 'OK',
      headers: {},
    };
  };

  try {
    const result = await staffAuthService.login({
      email: 'admin@atelier.local',
      password: 'Admin@123456',
    });

    assert.equal(result.accessToken, 'mock-staff-access-token');
    assert.equal(result.refreshToken, 'mock-staff-refresh-token');
    assert.equal(result.staff.email, 'admin@atelier.local');
    assert.equal(result.staff.role.code, 'ADMIN');
    assert.equal(result.staff.permissions.length, 2);
  } finally {
    staffAxios.defaults.adapter = originalAdapter;
  }
});

test('staffAuthService.refresh sends refreshToken and returns new tokens', async () => {
  const originalAdapter = staffAxios.defaults.adapter;
  staffAxios.defaults.adapter = async (config) => {
    assert.equal(config.method, 'post');
    assert.equal(config.url, '/v1/auth/staff/refresh');
    const body = JSON.parse(config.data);
    assert.equal(body.refreshToken, 'old-refresh-token');

    return {
      config,
      data: {
        success: true,
        data: {
          accessToken: 'new-staff-access-token',
          refreshToken: 'new-staff-refresh-token',
          tokenType: 'Bearer',
          expiresIn: 3600,
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
            permissions: ['staff:read'],
          },
        },
        error: null,
      },
      status: 200,
      statusText: 'OK',
      headers: {},
    };
  };

  try {
    const result = await staffAuthService.refresh('old-refresh-token');
    assert.equal(result.accessToken, 'new-staff-access-token');
    assert.equal(result.refreshToken, 'new-staff-refresh-token');
  } finally {
    staffAxios.defaults.adapter = originalAdapter;
  }
});

test('staffAuthService.logout sends logout request', async () => {
  let loggedOut = false;
  const originalAdapter = staffAxios.defaults.adapter;
  staffAxios.defaults.adapter = async (config) => {
    assert.equal(config.method, 'post');
    assert.equal(config.url, '/v1/auth/staff/logout');
    const body = JSON.parse(config.data);
    assert.equal(body.refreshToken, 'refresh-token-to-revoke');
    loggedOut = true;

    return {
      config,
      data: { success: true, data: null, error: null },
      status: 200,
      statusText: 'OK',
      headers: {},
    };
  };

  try {
    await staffAuthService.logout('refresh-token-to-revoke');
    assert.equal(loggedOut, true);
  } finally {
    staffAxios.defaults.adapter = originalAdapter;
  }
});
