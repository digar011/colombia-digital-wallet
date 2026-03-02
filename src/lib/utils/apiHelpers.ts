import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { logApiRequest } from '@/lib/utils/logger';

// ─── Standard API Response Types ────────────────────────────────────────────

interface ApiSuccessResponse<T = unknown> {
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

type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

// ─── Response Helpers ───────────────────────────────────────────────────────

/**
 * Creates a standardized success response.
 *
 * Usage:
 *   return createApiResponse(data, 200, { page: 1, total: 100 });
 */
export function createApiResponse<T>(
  data: T,
  status = 200,
  meta?: Record<string, unknown>
): NextResponse<ApiSuccessResponse<T>> {
  const body: ApiSuccessResponse<T> = { success: true, data };
  if (meta) body.meta = meta;
  return NextResponse.json(body, { status });
}

/**
 * Creates a standardized error response.
 *
 * Usage:
 *   return createErrorResponse('NOT_FOUND', 'Citizen not found', 404);
 */
export function createErrorResponse(
  code: string,
  message: string,
  status = 500,
  details?: unknown
): NextResponse<ApiErrorResponse> {
  const body: ApiErrorResponse = {
    success: false,
    error: { code, message },
  };
  if (details !== undefined) body.error.details = details;
  return NextResponse.json(body, { status });
}

// ─── Common Error Factories ─────────────────────────────────────────────────

export const ApiErrors = {
  notFound: (resource = 'Resource') =>
    createErrorResponse('NOT_FOUND', `${resource} no encontrado`, 404),

  unauthorized: (message = 'No autorizado') =>
    createErrorResponse('UNAUTHORIZED', message, 401),

  forbidden: (message = 'Acceso denegado') =>
    createErrorResponse('FORBIDDEN', message, 403),

  badRequest: (message = 'Solicitud invalida') =>
    createErrorResponse('BAD_REQUEST', message, 400),

  validationError: (details: unknown) =>
    createErrorResponse('VALIDATION_ERROR', 'Error de validacion', 422, details),

  internalError: (message = 'Error interno del servidor') =>
    createErrorResponse('INTERNAL_ERROR', message, 500),
};

// ─── Auth Wrapper ───────────────────────────────────────────────────────────

type ApiHandler = (
  request: NextRequest,
  context: { userId: string }
) => Promise<NextResponse>;

/**
 * Wraps an API handler with authentication checks and request logging.
 *
 * Usage:
 *   export const GET = withAuth(async (request, { userId }) => {
 *     const data = await fetchData(userId);
 *     return createApiResponse(data);
 *   });
 */
export function withAuth(handler: ApiHandler) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const start = Date.now();
    const method = request.method;
    const path = request.nextUrl.pathname;

    // Extract auth token from cookie
    const authToken = request.cookies.get('auth-token')?.value;
    if (!authToken) {
      logApiRequest(method, path, undefined, 401, Date.now() - start);
      return ApiErrors.unauthorized();
    }

    // In mock mode, extract user ID from token format: "demo-token-{timestamp}" or "test-token-{timestamp}"
    const userId = authToken.startsWith('demo-token-') || authToken.startsWith('test-token-')
      ? 'mock-user'
      : authToken;

    try {
      const response = await handler(request, { userId });
      const status = response.status;
      logApiRequest(method, path, userId, status, Date.now() - start);
      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      logApiRequest(method, path, userId, 500, Date.now() - start);
      return ApiErrors.internalError(message);
    }
  };
}

// ─── Type Exports ───────────────────────────────────────────────────────────

export type { ApiResponse, ApiSuccessResponse, ApiErrorResponse };
