import { NextRequest } from 'next/server';
import {
  generateCsrfToken,
  validateCsrfToken,
  csrfProtect,
  CSRF_COOKIE_NAME,
  CSRF_HEADER_NAME,
} from '@/lib/utils/csrf';

// ---------------------------------------------------------------------------
// Helper to create mock NextRequest objects
// ---------------------------------------------------------------------------

function createMockRequest(
  method: string,
  headers: Record<string, string> = {},
  cookies: Record<string, string> = {}
): NextRequest {
  const url = new URL('http://localhost:3000/api/test');
  const request = new NextRequest(url, { method, headers });
  for (const [name, value] of Object.entries(cookies)) {
    request.cookies.set(name, value);
  }
  return request;
}

// ---------------------------------------------------------------------------
// generateCsrfToken
// ---------------------------------------------------------------------------

describe('generateCsrfToken()', () => {
  it('returns a 64-character hex string', () => {
    const token = generateCsrfToken();
    expect(token).toHaveLength(64);
    expect(token).toMatch(/^[0-9a-f]{64}$/);
  });

  it('generates a unique token on each call', () => {
    const token1 = generateCsrfToken();
    const token2 = generateCsrfToken();
    expect(token1).not.toBe(token2);
  });

  it('returns only lowercase hex characters', () => {
    const token = generateCsrfToken();
    expect(token).toMatch(/^[0-9a-f]+$/);
  });
});

// ---------------------------------------------------------------------------
// validateCsrfToken
// ---------------------------------------------------------------------------

describe('validateCsrfToken()', () => {
  it('returns true for matching tokens', () => {
    const token = generateCsrfToken();
    expect(validateCsrfToken(token, token)).toBe(true);
  });

  it('returns false for mismatched tokens', () => {
    const token1 = generateCsrfToken();
    const token2 = generateCsrfToken();
    expect(validateCsrfToken(token1, token2)).toBe(false);
  });

  it('returns false when the first token is empty', () => {
    const token = generateCsrfToken();
    expect(validateCsrfToken('', token)).toBe(false);
  });

  it('returns false when the second token is empty', () => {
    const token = generateCsrfToken();
    expect(validateCsrfToken(token, '')).toBe(false);
  });

  it('returns false when both tokens are empty', () => {
    expect(validateCsrfToken('', '')).toBe(false);
  });

  it('returns false for tokens of different lengths', () => {
    expect(validateCsrfToken('abcdef', 'abc')).toBe(false);
  });

  it('returns false for tokens that only differ in one character', () => {
    const token = generateCsrfToken();
    const tampered = token.slice(0, -1) + (token.endsWith('0') ? '1' : '0');
    expect(validateCsrfToken(token, tampered)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// csrfProtect
// ---------------------------------------------------------------------------

describe('csrfProtect()', () => {
  describe('safe methods (GET, HEAD, OPTIONS)', () => {
    it.each(['GET', 'HEAD', 'OPTIONS'])(
      'skips validation for %s requests',
      (method) => {
        const request = createMockRequest(method);
        const result = csrfProtect(request);
        expect(result.valid).toBe(true);
        expect(result.error).toBeUndefined();
      }
    );

    it('skips validation for lowercase safe methods', () => {
      const request = createMockRequest('get');
      const result = csrfProtect(request);
      expect(result.valid).toBe(true);
    });
  });

  describe('state-changing methods (POST, PUT, PATCH, DELETE)', () => {
    it('requires a CSRF cookie token for POST', () => {
      const request = createMockRequest('POST');
      const result = csrfProtect(request);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('missing from cookie');
    });

    it('requires a CSRF header token for POST when cookie is present', () => {
      const token = generateCsrfToken();
      const request = createMockRequest(
        'POST',
        {},
        { [CSRF_COOKIE_NAME]: token }
      );
      const result = csrfProtect(request);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('missing from request header');
    });

    it('validates token match for POST', () => {
      const token = generateCsrfToken();
      const request = createMockRequest(
        'POST',
        { [CSRF_HEADER_NAME]: token },
        { [CSRF_COOKIE_NAME]: token }
      );
      const result = csrfProtect(request);
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('rejects mismatched tokens for POST', () => {
      const cookieToken = generateCsrfToken();
      const headerToken = generateCsrfToken();
      const request = createMockRequest(
        'POST',
        { [CSRF_HEADER_NAME]: headerToken },
        { [CSRF_COOKIE_NAME]: cookieToken }
      );
      const result = csrfProtect(request);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('mismatch');
    });

    it('rejects PUT requests without tokens', () => {
      const request = createMockRequest('PUT');
      const result = csrfProtect(request);
      expect(result.valid).toBe(false);
    });

    it('rejects PATCH requests without tokens', () => {
      const request = createMockRequest('PATCH');
      const result = csrfProtect(request);
      expect(result.valid).toBe(false);
    });

    it('rejects DELETE requests without tokens', () => {
      const request = createMockRequest('DELETE');
      const result = csrfProtect(request);
      expect(result.valid).toBe(false);
    });

    it('validates matching tokens for PUT', () => {
      const token = generateCsrfToken();
      const request = createMockRequest(
        'PUT',
        { [CSRF_HEADER_NAME]: token },
        { [CSRF_COOKIE_NAME]: token }
      );
      const result = csrfProtect(request);
      expect(result.valid).toBe(true);
    });
  });
});
