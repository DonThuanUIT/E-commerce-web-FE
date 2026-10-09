import { isCancel, type AxiosInstance } from 'axios';
import {
  ApiRequestError,
  normalizeApiError,
  readApiError,
} from '../../shared/api/apiRequestError.ts';

/**
 * Registers response handling on an existing Axios client.
 *
 * Fulfilled responses with a validated CNWeb failure envelope reject with
 * {@link ApiRequestError}; other fulfilled responses retain their original data,
 * status and headers. Rejected requests pass through {@link normalizeApiError},
 * except Axios cancellations, which retain their identity for `isCancel` checks.
 *
 * Each call adds an interceptor; call once per client during setup. This handler
 * does not retry requests or perform UI navigation.
 *
 * @param {AxiosInstance} instance - Client receiving the response handlers.
 * @returns {void} Registers response handlers for subsequent client requests.
 */
export function setupResponseInterceptor(instance: AxiosInstance): void {
  instance.interceptors.response.use(
    (response) => {
      const error = readApiError(response.data);
      if (error) throw new ApiRequestError(error);
      return response;
    },
    (error: unknown) =>
      Promise.reject(isCancel(error) ? error : normalizeApiError(error)),
  );
}
