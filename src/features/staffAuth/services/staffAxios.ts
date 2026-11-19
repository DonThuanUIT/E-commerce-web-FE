import axios, { type InternalAxiosRequestConfig } from 'axios';
import {
  ApiRequestError,
  normalizeApiError,
  readApiError,
} from '../../../shared/api/apiRequestError.ts';
import type { ApiResponse } from '../../../shared/types/apiType.ts';
import type { StaffAuthResponse } from '../types/staffAuthType.ts';
import {
  clearStaffAuthTokens,
  getStaffAccessToken,
  getStaffRefreshToken,
  setStaffAccessToken,
  setStaffRefreshToken,
} from '../utils/staffTokenStorage.ts';

const apiBaseUrl =
  typeof import.meta !== 'undefined' && import.meta.env
    ? import.meta.env.VITE_BE_API_URL?.trim()
    : undefined;

export const staffAxios = axios.create({
  baseURL: apiBaseUrl || '/api',
  timeout: 10_000,
  headers: {
    Accept: 'application/json',
    'Accept-Language': 'vi',
  },
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null = null): void {
  failedQueue.forEach((promise) => {
    if (token) {
      promise.resolve(token);
    } else {
      promise.reject(error);
    }
  });
  failedQueue = [];
}

// Request interceptor: attach staff access token if present
staffAxios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getStaffAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor: envelope validation & 401 auto-refresh
staffAxios.interceptors.response.use(
  (response) => {
    const error = readApiError(response.data);
    if (error) {
      throw new ApiRequestError(error);
    }
    return response;
  },
  async (error: unknown) => {
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    const normalizedError = normalizeApiError(error);
    const originalRequest = (error as { config?: InternalAxiosRequestConfig })
      ?.config;

    // Check if 401 Unauthorized and request is eligible for token refresh
    if (
      normalizedError.status === 401 &&
      originalRequest &&
      !(originalRequest as unknown as { _retry?: boolean })._retry &&
      !originalRequest.url?.includes('/v1/auth/staff/login') &&
      !originalRequest.url?.includes('/v1/auth/staff/refresh')
    ) {
      const refreshToken = getStaffRefreshToken();
      if (!refreshToken) {
        clearStaffAuthTokens();
        return Promise.reject(normalizedError);
      }

      (originalRequest as unknown as { _retry: boolean })._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((newToken) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }
            return staffAxios(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const refreshResponse = await axios.post<
          ApiResponse<StaffAuthResponse>
        >(
          `${apiBaseUrl || '/api'}/v1/auth/staff/refresh`,
          { refreshToken },
          {
            headers: {
              Accept: 'application/json',
              'Accept-Language': 'vi',
            },
          },
        );

        if (
          refreshResponse.data?.success &&
          refreshResponse.data.data?.accessToken
        ) {
          const newAuth = refreshResponse.data.data;
          setStaffAccessToken(newAuth.accessToken);
          if (newAuth.refreshToken) {
            setStaffRefreshToken(newAuth.refreshToken);
          }

          processQueue(null, newAuth.accessToken);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAuth.accessToken}`;
          }
          return staffAxios(originalRequest);
        } else {
          throw new Error('Refresh token invalid');
        }
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        clearStaffAuthTokens();
        return Promise.reject(normalizeApiError(refreshErr));
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(normalizedError);
  },
);
