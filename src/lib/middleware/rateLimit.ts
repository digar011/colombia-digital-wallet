/**
 * In-Memory Rate Limiter
 *
 * Provides a simple sliding-window rate limiter backed by an in-memory Map.
 * Designed for Next.js API routes and server actions in the Colombia Digital
 * Wallet application.
 *
 * IMPORTANT:  This is an in-memory implementation. The rate-limit counters
 * are local to each server process and are reset whenever the server restarts.
 * For production deployments at scale (especially with multiple serverless
 * instances), replace this with a distributed store such as Redis or
 * Upstash Redis to ensure rate limits are enforced consistently across
 * all instances.
 *
 * No external dependencies required.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Configuration options for creating a rate limiter. */
interface RateLimiterOptions {
  /** The time window in milliseconds during which requests are counted. */
  windowMs: number;
  /** The maximum number of requests allowed within the window. */
  maxRequests: number;
}

/** The result returned when checking rate limit status for an identifier. */
interface RateLimitResult {
  /** Whether the request is allowed (true) or should be rejected (false). */
  allowed: boolean;
  /** How many requests remain before the limit is reached. */
  remaining: number;
  /** The Date/time at which the current window expires and the counter resets. */
  resetAt: Date;
}

/** Internal tracking record for a single identifier. */
interface RateLimitEntry {
  /** Timestamps (in ms) of each request within the current window. */
  timestamps: number[];
  /** The time (in ms) at which the oldest tracked request will expire. */
  windowStart: number;
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

/**
 * Creates a rate limiter with the given configuration.
 *
 * Returns a `checkRateLimit` function that can be called with a unique
 * identifier (e.g. IP address, user ID, API key) to determine whether
 * the request should be allowed.
 *
 * Usage:
 *   const limiter = createRateLimiter({ windowMs: 60_000, maxRequests: 10 });
 *   const result = limiter.checkRateLimit(request.ip ?? 'unknown');
 *   if (!result.allowed) {
 *     return new Response('Too Many Requests', { status: 429 });
 *   }
 *
 * @param options - The rate limiter configuration.
 * @returns An object with a `checkRateLimit` method.
 */
export function createRateLimiter(options: RateLimiterOptions) {
  const { windowMs, maxRequests } = options;

  /** In-memory store keyed by identifier (IP, userId, etc.). */
  const store = new Map<string, RateLimitEntry>();

  // -------------------------------------------------------------------------
  // Automatic cleanup of expired entries
  //
  // Runs every `windowMs` milliseconds (minimum 10 s, maximum 5 min) to
  // prevent unbounded memory growth from abandoned identifiers.
  // -------------------------------------------------------------------------
  const cleanupIntervalMs = Math.min(Math.max(windowMs, 10_000), 300_000);

  const cleanupTimer = setInterval(() => {
    const now = Date.now();
    store.forEach((entry, key) => {
      // If no timestamps fall within the active window, remove the entry
      if (entry.timestamps.length === 0 || now - entry.windowStart > windowMs) {
        store.delete(key);
      }
    });
  }, cleanupIntervalMs);

  // Allow the Node.js process to exit without waiting for this timer
  if (typeof cleanupTimer === 'object' && 'unref' in cleanupTimer) {
    cleanupTimer.unref();
  }

  // -------------------------------------------------------------------------
  // Core check function
  // -------------------------------------------------------------------------

  /**
   * Checks whether a request from the given identifier should be allowed.
   *
   * @param identifier - A unique string identifying the requester
   *                     (e.g. IP address, userId, API key).
   * @returns A {@link RateLimitResult} indicating the decision.
   */
  function checkRateLimit(identifier: string): RateLimitResult {
    const now = Date.now();
    const windowStart = now - windowMs;

    // Retrieve or initialise the entry for this identifier
    let entry = store.get(identifier);
    if (!entry) {
      entry = { timestamps: [], windowStart: now };
      store.set(identifier, entry);
    }

    // Prune timestamps that have fallen outside the sliding window
    entry.timestamps = entry.timestamps.filter((ts) => ts > windowStart);
    entry.windowStart = entry.timestamps.length > 0 ? entry.timestamps[0] : now;

    // Determine the reset time — the moment the oldest tracked request expires
    const resetAt = new Date(
      entry.timestamps.length > 0
        ? entry.timestamps[0] + windowMs
        : now + windowMs
    );

    // Check if the identifier has exceeded the limit
    if (entry.timestamps.length >= maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetAt,
      };
    }

    // Record the current request
    entry.timestamps.push(now);

    return {
      allowed: true,
      remaining: maxRequests - entry.timestamps.length,
      resetAt,
    };
  }

  return { checkRateLimit };
}

// ---------------------------------------------------------------------------
// Pre-configured Limiters
// ---------------------------------------------------------------------------

/**
 * Auth limiter — 10 requests per minute.
 *
 * Protects login, registration, and password-reset endpoints from brute-force
 * attacks. Identify callers by IP address.
 */
export const authLimiter = createRateLimiter({
  windowMs: 60_000, // 1 minute
  maxRequests: 10,
});

/**
 * Citizen API limiter — 100 requests per minute.
 *
 * General-purpose rate limit for citizen-facing API endpoints (profile,
 * documents, wallet operations). Identify callers by userId or IP.
 */
export const citizenApiLimiter = createRateLimiter({
  windowMs: 60_000, // 1 minute
  maxRequests: 100,
});

/**
 * Verification limiter — 1 000 requests per minute.
 *
 * Higher throughput limit for document/identity verification endpoints which
 * may be called programmatically by third-party verifiers.
 */
export const verificationLimiter = createRateLimiter({
  windowMs: 60_000, // 1 minute
  maxRequests: 1_000,
});

/**
 * Admin limiter — 500 requests per minute.
 *
 * Rate limit for agency/admin dashboard API routes. Higher than citizen
 * limits because admin tools often make batched or paginated requests.
 */
export const adminLimiter = createRateLimiter({
  windowMs: 60_000, // 1 minute
  maxRequests: 500,
});
