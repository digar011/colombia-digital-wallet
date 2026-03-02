import { NextRequest } from 'next/server';
import {
  createApiResponse,
  createErrorResponse,
  ApiErrors,
  withAuth,
} from '@/lib/utils/apiHelpers';

// Suppress logger output during tests
beforeEach(() => {
  jest.spyOn(console, 'log').mockImplementation();
  jest.spyOn(console, 'warn').mockImplementation();
  jest.spyOn(console, 'error').mockImplementation();
  jest.spyOn(console, 'debug').mockImplementation();
});

afterEach(() => {
  jest.restoreAllMocks();
});

// ---------------------------------------------------------------------------
// Helper to create mock requests
// ---------------------------------------------------------------------------

function createMockRequest(
  method: string,
  path = '/api/test',
  cookies: Record<string, string> = {}
): NextRequest {
  const url = new URL(`http://localhost:3000${path}`);
  const request = new NextRequest(url, { method });
  for (const [name, value] of Object.entries(cookies)) {
    request.cookies.set(name, value);
  }
  return request;
}

// ---------------------------------------------------------------------------
// createApiResponse
// ---------------------------------------------------------------------------

describe('createApiResponse()', () => {
  it('returns a response with success: true', async () => {
    const response = createApiResponse({ id: 1, name: 'Test' });
    const body = await response.json();
    expect(body.success).toBe(true);
  });

  it('includes the data in the response body', async () => {
    const data = { id: 1, name: 'Test' };
    const response = createApiResponse(data);
    const body = await response.json();
    expect(body.data).toEqual(data);
  });

  it('defaults to status 200', () => {
    const response = createApiResponse({ ok: true });
    expect(response.status).toBe(200);
  });

  it('accepts a custom status code', () => {
    const response = createApiResponse({ created: true }, 201);
    expect(response.status).toBe(201);
  });

  it('includes meta when provided', async () => {
    const meta = { page: 1, total: 100 };
    const response = createApiResponse([], 200, meta);
    const body = await response.json();
    expect(body.meta).toEqual(meta);
  });

  it('excludes meta when not provided', async () => {
    const response = createApiResponse([]);
    const body = await response.json();
    expect(body.meta).toBeUndefined();
  });

  it('handles null data', async () => {
    const response = createApiResponse(null);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.data).toBeNull();
  });

  it('handles array data', async () => {
    const data = [1, 2, 3];
    const response = createApiResponse(data);
    const body = await response.json();
    expect(body.data).toEqual([1, 2, 3]);
  });
});

// ---------------------------------------------------------------------------
// createErrorResponse
// ---------------------------------------------------------------------------

describe('createErrorResponse()', () => {
  it('returns a response with success: false', async () => {
    const response = createErrorResponse('ERR', 'Something failed');
    const body = await response.json();
    expect(body.success).toBe(false);
  });

  it('includes the error code', async () => {
    const response = createErrorResponse('NOT_FOUND', 'Not found');
    const body = await response.json();
    expect(body.error.code).toBe('NOT_FOUND');
  });

  it('includes the error message', async () => {
    const response = createErrorResponse('ERR', 'Something broke');
    const body = await response.json();
    expect(body.error.message).toBe('Something broke');
  });

  it('defaults to status 500', () => {
    const response = createErrorResponse('ERR', 'fail');
    expect(response.status).toBe(500);
  });

  it('accepts a custom status code', () => {
    const response = createErrorResponse('NOT_FOUND', 'Not found', 404);
    expect(response.status).toBe(404);
  });

  it('includes details when provided', async () => {
    const details = { field: 'email', issue: 'invalid' };
    const response = createErrorResponse('VALIDATION', 'Invalid', 422, details);
    const body = await response.json();
    expect(body.error.details).toEqual(details);
  });

  it('excludes details when not provided', async () => {
    const response = createErrorResponse('ERR', 'fail');
    const body = await response.json();
    expect(body.error.details).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// ApiErrors factories
// ---------------------------------------------------------------------------

describe('ApiErrors', () => {
  describe('notFound()', () => {
    it('returns 404 status', () => {
      const response = ApiErrors.notFound();
      expect(response.status).toBe(404);
    });

    it('has NOT_FOUND error code', async () => {
      const response = ApiErrors.notFound();
      const body = await response.json();
      expect(body.error.code).toBe('NOT_FOUND');
    });

    it('includes the resource name in the message', async () => {
      const response = ApiErrors.notFound('Citizen');
      const body = await response.json();
      expect(body.error.message).toContain('Citizen');
    });
  });

  describe('unauthorized()', () => {
    it('returns 401 status', () => {
      const response = ApiErrors.unauthorized();
      expect(response.status).toBe(401);
    });

    it('has UNAUTHORIZED error code', async () => {
      const response = ApiErrors.unauthorized();
      const body = await response.json();
      expect(body.error.code).toBe('UNAUTHORIZED');
    });

    it('accepts a custom message', async () => {
      const response = ApiErrors.unauthorized('Token expired');
      const body = await response.json();
      expect(body.error.message).toBe('Token expired');
    });
  });

  describe('forbidden()', () => {
    it('returns 403 status', () => {
      const response = ApiErrors.forbidden();
      expect(response.status).toBe(403);
    });

    it('has FORBIDDEN error code', async () => {
      const response = ApiErrors.forbidden();
      const body = await response.json();
      expect(body.error.code).toBe('FORBIDDEN');
    });
  });

  describe('badRequest()', () => {
    it('returns 400 status', () => {
      const response = ApiErrors.badRequest();
      expect(response.status).toBe(400);
    });

    it('has BAD_REQUEST error code', async () => {
      const response = ApiErrors.badRequest();
      const body = await response.json();
      expect(body.error.code).toBe('BAD_REQUEST');
    });

    it('accepts a custom message', async () => {
      const response = ApiErrors.badRequest('Missing field');
      const body = await response.json();
      expect(body.error.message).toBe('Missing field');
    });
  });

  describe('validationError()', () => {
    it('returns 422 status', () => {
      const response = ApiErrors.validationError({ fields: ['email'] });
      expect(response.status).toBe(422);
    });

    it('has VALIDATION_ERROR error code', async () => {
      const response = ApiErrors.validationError({});
      const body = await response.json();
      expect(body.error.code).toBe('VALIDATION_ERROR');
    });

    it('includes details in the response', async () => {
      const details = { fields: ['email', 'phone'] };
      const response = ApiErrors.validationError(details);
      const body = await response.json();
      expect(body.error.details).toEqual(details);
    });
  });

  describe('internalError()', () => {
    it('returns 500 status', () => {
      const response = ApiErrors.internalError();
      expect(response.status).toBe(500);
    });

    it('has INTERNAL_ERROR error code', async () => {
      const response = ApiErrors.internalError();
      const body = await response.json();
      expect(body.error.code).toBe('INTERNAL_ERROR');
    });

    it('accepts a custom message', async () => {
      const response = ApiErrors.internalError('Database connection failed');
      const body = await response.json();
      expect(body.error.message).toBe('Database connection failed');
    });
  });
});

// ---------------------------------------------------------------------------
// withAuth
// ---------------------------------------------------------------------------

describe('withAuth()', () => {
  it('returns 401 when no auth cookie is present', async () => {
    const handler = jest.fn();
    const wrappedHandler = withAuth(handler);
    const request = createMockRequest('GET');

    const response = await wrappedHandler(request);
    expect(response.status).toBe(401);
    expect(handler).not.toHaveBeenCalled();
  });

  it('extracts "mock-user" from demo tokens', async () => {
    const handler = jest.fn().mockResolvedValue(createApiResponse({ ok: true }));
    const wrappedHandler = withAuth(handler);
    const request = createMockRequest('GET', '/api/test', {
      'auth-token': 'demo-token-1234567890',
    });

    await wrappedHandler(request);
    expect(handler).toHaveBeenCalledWith(
      request,
      expect.objectContaining({ userId: 'mock-user' })
    );
  });

  it('extracts "mock-user" from test tokens', async () => {
    const handler = jest.fn().mockResolvedValue(createApiResponse({ ok: true }));
    const wrappedHandler = withAuth(handler);
    const request = createMockRequest('GET', '/api/test', {
      'auth-token': 'test-token-9876543210',
    });

    await wrappedHandler(request);
    expect(handler).toHaveBeenCalledWith(
      request,
      expect.objectContaining({ userId: 'mock-user' })
    );
  });

  it('uses the raw token as userId for non-demo tokens', async () => {
    const handler = jest.fn().mockResolvedValue(createApiResponse({ ok: true }));
    const wrappedHandler = withAuth(handler);
    const request = createMockRequest('GET', '/api/test', {
      'auth-token': 'real-jwt-token-value',
    });

    await wrappedHandler(request);
    expect(handler).toHaveBeenCalledWith(
      request,
      expect.objectContaining({ userId: 'real-jwt-token-value' })
    );
  });

  it('calls the handler with the request and userId', async () => {
    const handler = jest.fn().mockResolvedValue(createApiResponse({ ok: true }));
    const wrappedHandler = withAuth(handler);
    const request = createMockRequest('POST', '/api/citizens', {
      'auth-token': 'demo-token-123',
    });

    await wrappedHandler(request);
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(request, { userId: 'mock-user' });
  });

  it('returns the handler response on success', async () => {
    const responseData = { id: 42, name: 'Test' };
    const handler = jest.fn().mockResolvedValue(createApiResponse(responseData));
    const wrappedHandler = withAuth(handler);
    const request = createMockRequest('GET', '/api/test', {
      'auth-token': 'demo-token-123',
    });

    const response = await wrappedHandler(request);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.data).toEqual(responseData);
  });

  it('catches handler errors and returns 500', async () => {
    const handler = jest.fn().mockRejectedValue(new Error('DB exploded'));
    const wrappedHandler = withAuth(handler);
    const request = createMockRequest('GET', '/api/test', {
      'auth-token': 'demo-token-123',
    });

    const response = await wrappedHandler(request);
    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.error.message).toBe('DB exploded');
  });

  it('catches non-Error exceptions and returns 500 with "Unknown error"', async () => {
    const handler = jest.fn().mockRejectedValue('string error');
    const wrappedHandler = withAuth(handler);
    const request = createMockRequest('GET', '/api/test', {
      'auth-token': 'demo-token-123',
    });

    const response = await wrappedHandler(request);
    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body.error.message).toBe('Unknown error');
  });
});
