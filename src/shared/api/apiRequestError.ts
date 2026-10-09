import { isAxiosError } from 'axios';
import type { ApiError, FieldViolation } from '../types/apiType.ts';

/** Normalized request failure. Status is zero when no HTTP response exists. */
export class ApiRequestError extends Error implements ApiError {
  readonly status: number;
  readonly code: string;
  readonly timestamp: string;
  readonly path?: string | null;
  readonly fieldErrors: FieldViolation[];

  constructor(details: ApiError, cause?: unknown) {
    super(details.message, { cause });
    this.name = 'ApiRequestError';
    this.status = details.status;
    this.code = details.code;
    this.timestamp = details.timestamp;
    this.path = details.path;
    this.fieldErrors = details.fieldErrors;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isFieldViolation(value: unknown): value is FieldViolation {
  return (
    isRecord(value) &&
    typeof value.field === 'string' &&
    typeof value.message === 'string'
  );
}

/** Reads a validated CNWeb failure envelope; other response shapes return null. */
export function readApiError(payload: unknown): ApiError | null {
  if (
    !isRecord(payload) ||
    payload.success !== false ||
    payload.data !== null
  ) {
    return null;
  }

  const error = payload.error;
  if (
    !isRecord(error) ||
    typeof error.status !== 'number' ||
    typeof error.code !== 'string' ||
    typeof error.message !== 'string' ||
    typeof error.timestamp !== 'string' ||
    (error.path != null && typeof error.path !== 'string') ||
    !Array.isArray(error.fieldErrors) ||
    !error.fieldErrors.every(isFieldViolation)
  ) {
    return null;
  }

  return {
    status: error.status,
    code: error.code,
    message: error.message,
    timestamp: error.timestamp,
    path: error.path,
    fieldErrors: error.fieldErrors,
  };
}

/** Preserves server details and uses safe messages for transport/unknown errors. */
export function normalizeApiError(error: unknown): ApiRequestError {
  if (error instanceof ApiRequestError) return error;

  if (isAxiosError<unknown>(error)) {
    const status = error.response?.status ?? 0;
    const serverError = readApiError(error.response?.data);
    if (serverError) {
      return new ApiRequestError({ ...serverError, status }, error);
    }

    const isTimeout =
      error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT';

    return new ApiRequestError(
      {
        status,
        code: status ? `HTTP_${status}` : error.code || 'NETWORK_ERROR',
        message: status
          ? 'Không thể hoàn tất yêu cầu. Vui lòng thử lại.'
          : isTimeout
            ? 'Yêu cầu đã hết thời gian chờ. Vui lòng thử lại.'
            : 'Không thể kết nối đến máy chủ. Vui lòng thử lại.',
        timestamp: new Date().toISOString(),
        fieldErrors: [],
      },
      error,
    );
  }

  return new ApiRequestError(
    {
      status: 0,
      code: 'UNKNOWN_ERROR',
      message: 'Đã xảy ra lỗi. Vui lòng thử lại.',
      timestamp: new Date().toISOString(),
      fieldErrors: [],
    },
    error,
  );
}
