import { type NextRequest, NextResponse } from 'next/server';
import * as crypto from 'crypto';

/**
 * CSRF Protection Utility — Double-Submit Cookie Pattern
 *
 * This module implements CSRF (Cross-Site Request Forgery) protection using the
 * double-submit cookie pattern. The flow works as follows:
 *
 * 1. The server generates a cryptographically secure random token.
 * 2. The token is stored in an httpOnly, secure, SameSite=Strict cookie.
 * 3. The client must include the same token in the `X-CSRF-Token` request header
 *    for all state-changing requests (POST, PUT, PATCH, DELETE).
 * 4. The server validates that the header token matches the cookie token using
 *    constant-time comparison to prevent timing attacks.
 *
 * Safe HTTP methods (GET, HEAD, OPTIONS) are exempt from CSRF validation
 * because they should not cause side effects.
 *
 * ---
 *
 * ## Usage in API Routes
 *
 * ### 1. Create a GET endpoint to issue CSRF tokens to the client:
 *
 * ```ts
 * // src/app/api/csrf/route.ts
 * import { NextResponse } from 'next/server';
 * import { generateCsrfToken, setCsrfCookie } from '@/lib/utils/csrf';
 *
 * export async function GET() {
 *   const token = generateCsrfToken();
 *   const response = NextResponse.json({ csrfToken: token });
 *   setCsrfCookie(response, token);
 *   return response;
 * }
 * ```
 *
 * ### 2. Protect state-changing API routes:
 *
 * ```ts
 * // src/app/api/documents/route.ts
 * import { NextRequest, NextResponse } from 'next/server';
 * import { csrfProtect } from '@/lib/utils/csrf';
 *
 * export async function POST(request: NextRequest) {
 *   const csrf = csrfProtect(request);
 *   if (!csrf.valid) {
 *     return NextResponse.json({ error: csrf.error }, { status: 403 });
 *   }
 *
 *   // ... handle the request
 * }
 * ```
 *
 * ### 3. On the client, fetch the token and include it in requests:
 *
 * ```ts
 * // Fetch the CSRF token (typically on app load or before a form submission)
 * const res = await fetch('/api/csrf');
 * const { csrfToken } = await res.json();
 *
 * // Include the token in state-changing requests
 * await fetch('/api/documents', {
 *   method: 'POST',
 *   headers: {
 *     'Content-Type': 'application/json',
 *     'X-CSRF-Token': csrfToken,
 *   },
 *   body: JSON.stringify({ ... }),
 * });
 * ```
 */

// ─── Constants ────────────────────────────────────────────────────────────────

/** Name of the cookie used to store the CSRF token. */
export const CSRF_COOKIE_NAME = 'csrf-token';

/** Name of the HTTP header the client must send the CSRF token in. */
export const CSRF_HEADER_NAME = 'x-csrf-token';

/** Length in bytes of the generated CSRF token (produces a 64-char hex string). */
const TOKEN_BYTE_LENGTH = 32;

/** HTTP methods that are considered safe and exempt from CSRF validation. */
const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

// ─── Token Generation ─────────────────────────────────────────────────────────

/**
 * Generates a cryptographically secure random CSRF token.
 *
 * Uses Node.js `crypto.randomBytes` to produce 32 bytes of randomness,
 * encoded as a 64-character hexadecimal string.
 *
 * @returns A hex-encoded random token string.
 */
export function generateCsrfToken(): string {
  return crypto.randomBytes(TOKEN_BYTE_LENGTH).toString('hex');
}

// ─── Token Validation ─────────────────────────────────────────────────────────

/**
 * Validates two CSRF tokens using constant-time comparison.
 *
 * This prevents timing attacks where an attacker could measure response times
 * to deduce valid token characters. Uses `crypto.timingSafeEqual` which
 * compares all bytes regardless of where a mismatch occurs.
 *
 * @param token - The token received from the client (e.g., from a header).
 * @param storedToken - The token stored on the server (e.g., from a cookie).
 * @returns `true` if the tokens match, `false` otherwise.
 */
export function validateCsrfToken(token: string, storedToken: string): boolean {
  if (!token || !storedToken) {
    return false;
  }

  // timingSafeEqual requires buffers of equal length.
  // If lengths differ, the tokens are definitely not equal.
  const tokenBuffer = Buffer.from(token, 'utf-8');
  const storedBuffer = Buffer.from(storedToken, 'utf-8');

  if (tokenBuffer.length !== storedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(tokenBuffer, storedBuffer);
}

// ─── Cookie Helpers ───────────────────────────────────────────────────────────

/**
 * Sets the CSRF token as a cookie on the provided `NextResponse`.
 *
 * The cookie is configured with security best practices:
 * - `httpOnly: true` — Not accessible via JavaScript (prevents XSS theft).
 * - `secure: true` — Only sent over HTTPS in production.
 * - `sameSite: 'strict'` — Never sent on cross-origin requests.
 * - `path: '/'` — Available to all routes.
 *
 * @param response - The `NextResponse` object to set the cookie on.
 * @param token - The CSRF token value to store in the cookie.
 */
export function setCsrfCookie(response: NextResponse, token: string): void {
  response.cookies.set(CSRF_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  });
}

// ─── Request Helpers ──────────────────────────────────────────────────────────

/**
 * Reads the CSRF token from the request header.
 *
 * Looks for the `X-CSRF-Token` header (case-insensitive) that the client
 * must include in all state-changing requests.
 *
 * @param request - The incoming `NextRequest`.
 * @returns The token string, or `null` if the header is absent.
 */
export function getCsrfFromRequest(request: NextRequest): string | null {
  return request.headers.get(CSRF_HEADER_NAME);
}

/**
 * Reads the stored CSRF token from the request cookie.
 *
 * This retrieves the server-set cookie that was established when the
 * client first fetched a CSRF token via the GET endpoint.
 *
 * @param request - The incoming `NextRequest`.
 * @returns The token string, or `null` if the cookie is absent.
 */
export function getCsrfFromCookie(request: NextRequest): string | null {
  return request.cookies.get(CSRF_COOKIE_NAME)?.value ?? null;
}

// ─── Main Protection Function ─────────────────────────────────────────────────

/** Result of a CSRF validation check. */
export interface CsrfValidationResult {
  /** Whether the CSRF check passed. */
  valid: boolean;
  /** Human-readable error message when validation fails. */
  error?: string;
}

/**
 * Main CSRF protection function for API routes.
 *
 * Implements the double-submit cookie pattern validation:
 * 1. Skips validation for safe HTTP methods (GET, HEAD, OPTIONS).
 * 2. Reads the token from the cookie (server-side stored value).
 * 3. Reads the token from the request header (client-submitted value).
 * 4. Compares them using constant-time comparison.
 *
 * @param request - The incoming `NextRequest` to validate.
 * @returns A `CsrfValidationResult` indicating whether the request is valid.
 *
 * @example
 * ```ts
 * export async function POST(request: NextRequest) {
 *   const csrf = csrfProtect(request);
 *   if (!csrf.valid) {
 *     return NextResponse.json({ error: csrf.error }, { status: 403 });
 *   }
 *   // Proceed with the request...
 * }
 * ```
 */
export function csrfProtect(request: NextRequest): CsrfValidationResult {
  // Safe methods do not require CSRF validation
  if (SAFE_METHODS.has(request.method.toUpperCase())) {
    return { valid: true };
  }

  const cookieToken = getCsrfFromCookie(request);
  if (!cookieToken) {
    return {
      valid: false,
      error: 'CSRF token missing from cookie. Obtain a token via the CSRF endpoint first.',
    };
  }

  const headerToken = getCsrfFromRequest(request);
  if (!headerToken) {
    return {
      valid: false,
      error: 'CSRF token missing from request header. Include the X-CSRF-Token header.',
    };
  }

  if (!validateCsrfToken(headerToken, cookieToken)) {
    return {
      valid: false,
      error: 'CSRF token mismatch. The request has been rejected.',
    };
  }

  return { valid: true };
}
