export interface FieldViolation {
  field: string;
  message: string;
}

/** Error body supplied by cnweb-server. */
export interface ApiError {
  status: number;
  code: string;
  message: string;
  timestamp: string;
  path?: string | null;
  fieldErrors: FieldViolation[];
}

export type ApiResponse<T> =
  | { success: true; data: T; error: null }
  | { success: false; data: null; error: ApiError };

/** Paginated payload; page indexes start at zero. */
export interface PageResponse<T> {
  items: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}
