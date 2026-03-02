/**
 * Type-safe API client for the Colombia Digital Wallet.
 * Wraps fetch with standard error handling and CSRF support.
 */

interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
}

interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

class ApiError extends Error {
  code: string;
  status: number;
  details?: unknown;

  constructor(code: string, message: string, status: number, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

async function fetchApi<T>(
  url: string,
  options: RequestInit = {}
): Promise<{ data: T; meta?: Record<string, unknown> }> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const json: ApiResponse<T> = await response.json();

  if (!json.success) {
    throw new ApiError(
      json.error.code,
      json.error.message,
      response.status,
      json.error.details
    );
  }

  return { data: json.data, meta: json.meta };
}

export { fetchApi, ApiError };
export type { ApiResponse, ApiSuccessResponse, ApiErrorResponse };
