import { isAxiosError } from 'axios';
import type { ApiError, FieldViolation } from '../types/apiType.ts';

/**
 * Request failure exposing CNWeb error details through the standard Error shape.
 *
 * The inherited message is suitable for display. The optional cause retains the
 * original failure for diagnostics. Construction copies the supplied metadata
 * without validation and retains the original field-error array reference.
 */
export class ApiRequestError extends Error implements ApiError {
  /** HTTP status, or 0 when normalization has no HTTP response. */
  readonly status: number;
  /** Server error identifier or client-generated fallback code. */
  readonly code: string;
  /** Server timestamp or the ISO timestamp created during normalization. */
  readonly timestamp: string;
  /** Server-supplied request path, if available; may be null. */
  readonly path?: string | null;
  /** Validation messages associated with request fields; empty for general errors. */
  readonly fieldErrors: FieldViolation[];

  /**
   * Wraps supplied failure details without changing their message or field errors.
   *
   * @param {ApiError} details - Validated server details or a client fallback.
   * @param {unknown} [cause] - Original failure retained as the error cause.
   */
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

/**
 * Narrows an unknown value to a non-null object for subsequent property checks.
 *
 * Arrays and class instances also pass; callers must validate required fields.
 *
 * @param {unknown} value - Untrusted value to inspect.
 * @returns {boolean} Whether the value is a non-null object, narrowing its type.
 */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

/**
 * Checks the string fields required by a server validation entry.
 *
 * @param {unknown} value - Untrusted item from a response's field-error array.
 * @returns {boolean} Whether field and message are strings, narrowing the entry.
 * Additional properties are allowed.
 */
function isFieldViolation(value: unknown): value is FieldViolation {
  return (
    isRecord(value) &&
    typeof value.field === 'string' &&
    typeof value.message === 'string'
  );
}

/**
 * Extracts failure details only from a structurally valid CNWeb error envelope.
 *
 * Requires `success: false`, null data, correctly typed error fields and a valid
 * field-error array. Path may be absent or null. This checks field types rather
 * than interpreting status codes or parsing timestamp contents.
 *
 * @param {unknown} payload - Response body, including non-JSON or missing data.
 * @returns {ApiError | null} New details, or null for successful/invalid envelopes.
 * The field-error array is reused; the response body is not mutated.
 */
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

/**
 * Converts a caught failure into a consistent error suitable for application UI.
 *
 * Existing {@link ApiRequestError} instances are returned unchanged. Axios errors
 * with a valid failure envelope retain server details, but the HTTP response
 * status takes precedence over the envelope's status. Other Axios failures use
 * safe Vietnamese HTTP, timeout or network messages with empty field errors.
 * Unknown failures use status 0 and `UNKNOWN_ERROR`.
 *
 * Newly created errors retain the original value as their cause. Client fallback
 * timestamps are generated at normalization time. Callers must bypass this helper
 * for cancellations when preserving Axios cancellation identity is required.
 *
 * @param {unknown} error - Axios error, normalized error or unknown thrown value.
 * @returns {ApiRequestError} Original normalized error or a new unthrown wrapper.
 */
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
