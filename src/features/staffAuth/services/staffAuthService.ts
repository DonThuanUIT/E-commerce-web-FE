import { staffAxios } from './staffAxios.ts';
import type { ApiResponse } from '../../../shared/types/apiType.ts';
import type {
  StaffAuthResponse,
  StaffLoginRequest,
  StaffRefreshRequest,
  StaffLogoutRequest,
} from '../types/staffAuthType.ts';

export const staffAuthService = {
  /**
   * Dispatches administrative login request.
   */
  async login(credentials: StaffLoginRequest): Promise<StaffAuthResponse> {
    const response = await staffAxios.post<ApiResponse<StaffAuthResponse>>(
      '/v1/auth/staff/login',
      credentials,
    );

    if (response.data && response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data?.error?.message || 'Login failed');
  },

  /**
   * Refreshes administrative JWT tokens.
   */
  async refresh(refreshToken: string): Promise<StaffAuthResponse> {
    const payload: StaffRefreshRequest = { refreshToken };
    const response = await staffAxios.post<ApiResponse<StaffAuthResponse>>(
      '/v1/auth/staff/refresh',
      payload,
    );

    if (response.data && response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data?.error?.message || 'Token refresh failed');
  },

  /**
   * Revokes staff active session and tokens.
   */
  async logout(refreshToken?: string): Promise<void> {
    const payload: StaffLogoutRequest = { refreshToken };
    await staffAxios.post<ApiResponse<void>>('/v1/auth/staff/logout', payload);
  },
};
