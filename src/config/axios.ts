import axios from 'axios';
import { setupResponseInterceptor } from './interceptors/responseInterceptor';

/**
 * Shared HTTP client for feature services using paths relative to the API root.
 *
 * Uses the trimmed `VITE_BE_API_URL`, falling back to `/api` when absent or blank.
 * Requests time out after 10 seconds and ask for JSON with Vietnamese messages.
 * Axios determines the request content type from the supplied body.
 *
 * {@link setupResponseInterceptor} preserves successful Axios responses and
 * normalizes failures while leaving cancellation errors intact. Callers read the
 * CNWeb envelope through `response.data` and handle errors in their own workflow.
 */
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BE_API_URL?.trim() || '/api',
  timeout: 10_000,
  headers: {
    Accept: 'application/json',
    'Accept-Language': 'vi',
  },
});

setupResponseInterceptor(axiosInstance);
