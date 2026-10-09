import { isCancel, type AxiosInstance } from 'axios';
import {
  ApiRequestError,
  normalizeApiError,
  readApiError,
} from '../../shared/api/apiRequestError.ts';

/** Keeps AxiosResponse intact and normalizes failures, except cancellations. */
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
