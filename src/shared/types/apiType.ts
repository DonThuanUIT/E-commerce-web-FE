/** Validation feedback associating a request field with its server message. */
export interface FieldViolation {
  /** Request field name or path used to associate feedback with an input. */
  field: string;
  /** Server-supplied explanation of the validation failure. */
  message: string;
}

/**
 * Failure details supplied by cnweb-server or synthesized by the HTTP client.
 *
 * Client normalization preserves validated server details when available and
 * supplies fallback messages and timestamps for transport or unknown errors.
 */
export interface ApiError {
  /** HTTP status, or 0 for client failures without an HTTP response. */
  status: number;
  /** Server error identifier or a client-generated HTTP/transport fallback code. */
  code: string;
  /** Validated server message or a safe Vietnamese fallback for display. */
  message: string;
  /** Server-provided timestamp string, or a client-generated ISO timestamp. */
  timestamp: string;
  /** Request path supplied by the server; may be omitted or null. */
  path?: string | null;
  /** Per-field validation feedback; empty when there are no field violations. */
  fieldErrors: FieldViolation[];
}

/**
 * Discriminated CNWeb response envelope for successful and failed operations.
 *
 * Narrow `success` before accessing the payload or failure details. Operations
 * with nullable successful data must include null in their payload type, such as
 * `ApiResponse<Product | null>`. This type does not validate network responses.
 *
 * @typeParam T - Successful payload, including null when the operation permits it.
 */
export type ApiResponse<T> =
  | {
      /** Identifies a successful operation and narrows data to the payload type. */
      success: true;
      /** Operation payload; nullable only when the generic type includes null. */
      data: T;
      /** Successful operations carry no failure details. */
      error: null;
    }
  | {
      /** Identifies a failed operation and narrows error to its failure details. */
      success: false;
      /** Failed operations carry no successful payload. */
      data: null;
      /** Failure details, including any field-level validation feedback. */
      error: ApiError;
    };

/**
 * Paginated payload carried inside a successful CNWeb response envelope.
 *
 * Page indexes are zero-based. Use the supplied pagination metadata to determine
 * available pages rather than assuming a short item list always means the end.
 *
 * @typeParam T - Shape of one item in the returned page.
 */
export interface PageResponse<T> {
  /** Items in the current page, in server order; may be empty. */
  items: T[];
  /** Zero-based index of the current page. */
  page: number;
  /** Page capacity reported by the server, not the current item count. */
  size: number;
  /** Total matching items across all pages. */
  totalElements: number;
  /** Total pages reported for the current query and page size. */
  totalPages: number;
  /** Whether the server identifies this page as the first page. */
  first: boolean;
  /** Whether the server identifies this page as the last page. */
  last: boolean;
}
