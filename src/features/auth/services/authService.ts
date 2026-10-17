import { axiosInstance } from '../../../config/axios';
import type { ApiResponse } from '../../../shared/types/apiType';
import type { RegisterUserRequest, RegisteredUser } from '../types/auth';

/**
 * Service to handle customer authentication & registration REST endpoints.
 */
export const authService = {
  /**
   * Registers a new customer account.
   *
   * @param request - Registration parameters (fullName, email, password)
   * @param signal - Optional AbortSignal for request cancellation
   * @returns Newly created user information
   */
  async register(
    request: RegisterUserRequest,
    signal?: AbortSignal,
  ): Promise<RegisteredUser> {
    const response = await axiosInstance.post<ApiResponse<RegisteredUser>>(
      '/v1/auth/register',
      request,
      { signal },
    );

    if (response.data && response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error(
      response.data?.error?.message || 'Đăng ký tài khoản không thành công',
    );
  },
};
