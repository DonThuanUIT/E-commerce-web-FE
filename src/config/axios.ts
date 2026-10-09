import axios from 'axios';
import { setupResponseInterceptor } from './interceptors/responseInterceptor';

/** Shared API client. URLs are relative to the configured API root. */
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BE_API_URL?.trim() || '/api',
  timeout: 10_000,
  headers: {
    Accept: 'application/json',
    'Accept-Language': 'vi',
  },
});

setupResponseInterceptor(axiosInstance);
