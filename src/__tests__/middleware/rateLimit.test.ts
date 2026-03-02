import {
  createRateLimiter,
  authLimiter,
  citizenApiLimiter,
  verificationLimiter,
  adminLimiter,
} from '@/lib/middleware/rateLimit';

// ---------------------------------------------------------------------------
// createRateLimiter
// ---------------------------------------------------------------------------

describe('createRateLimiter()', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('allows requests under the limit', () => {
    const limiter = createRateLimiter({ windowMs: 60_000, maxRequests: 5 });

    const result = limiter.checkRateLimit('192.168.1.1');
    expect(result.allowed).toBe(true);
  });

  it('tracks remaining count correctly', () => {
    const limiter = createRateLimiter({ windowMs: 60_000, maxRequests: 5 });

    const r1 = limiter.checkRateLimit('ip-1');
    expect(r1.remaining).toBe(4); // 5 - 1

    const r2 = limiter.checkRateLimit('ip-1');
    expect(r2.remaining).toBe(3); // 5 - 2

    const r3 = limiter.checkRateLimit('ip-1');
    expect(r3.remaining).toBe(2); // 5 - 3
  });

  it('blocks requests at the limit', () => {
    const limiter = createRateLimiter({ windowMs: 60_000, maxRequests: 3 });

    limiter.checkRateLimit('ip-1'); // 1
    limiter.checkRateLimit('ip-1'); // 2
    limiter.checkRateLimit('ip-1'); // 3

    const result = limiter.checkRateLimit('ip-1'); // 4th should be blocked
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it('returns remaining: 0 when blocked', () => {
    const limiter = createRateLimiter({ windowMs: 60_000, maxRequests: 2 });

    limiter.checkRateLimit('ip-1');
    limiter.checkRateLimit('ip-1');

    const result = limiter.checkRateLimit('ip-1');
    expect(result.remaining).toBe(0);
  });

  it('returns a resetAt Date', () => {
    const limiter = createRateLimiter({ windowMs: 60_000, maxRequests: 5 });

    const result = limiter.checkRateLimit('ip-1');
    expect(result.resetAt).toBeInstanceOf(Date);
    // resetAt should be in the future
    expect(result.resetAt.getTime()).toBeGreaterThanOrEqual(Date.now());
  });

  it('resets after the time window expires', () => {
    const limiter = createRateLimiter({ windowMs: 60_000, maxRequests: 2 });

    limiter.checkRateLimit('ip-1'); // 1
    limiter.checkRateLimit('ip-1'); // 2

    // Should be blocked now
    const blocked = limiter.checkRateLimit('ip-1');
    expect(blocked.allowed).toBe(false);

    // Advance time past the window
    jest.advanceTimersByTime(61_000);

    // Should be allowed again after window reset
    const afterReset = limiter.checkRateLimit('ip-1');
    expect(afterReset.allowed).toBe(true);
    expect(afterReset.remaining).toBe(1); // 2 - 1
  });

  it('tracks different identifiers independently', () => {
    const limiter = createRateLimiter({ windowMs: 60_000, maxRequests: 2 });

    limiter.checkRateLimit('ip-1');
    limiter.checkRateLimit('ip-1');

    // ip-1 should be blocked
    expect(limiter.checkRateLimit('ip-1').allowed).toBe(false);

    // ip-2 should still be allowed
    expect(limiter.checkRateLimit('ip-2').allowed).toBe(true);
  });

  it('allows exactly maxRequests before blocking', () => {
    const maxRequests = 5;
    const limiter = createRateLimiter({ windowMs: 60_000, maxRequests });

    for (let i = 0; i < maxRequests; i++) {
      const result = limiter.checkRateLimit('ip-1');
      expect(result.allowed).toBe(true);
    }

    const blockedResult = limiter.checkRateLimit('ip-1');
    expect(blockedResult.allowed).toBe(false);
  });

  it('partially resets as timestamps slide out of the window', () => {
    const limiter = createRateLimiter({ windowMs: 60_000, maxRequests: 3 });

    // Make 3 requests at t=0
    limiter.checkRateLimit('ip-1');
    limiter.checkRateLimit('ip-1');
    limiter.checkRateLimit('ip-1');

    // Blocked at t=0
    expect(limiter.checkRateLimit('ip-1').allowed).toBe(false);

    // Advance 61 seconds — all timestamps from t=0 should have expired
    jest.advanceTimersByTime(61_000);

    // Now requests should be allowed again
    const result = limiter.checkRateLimit('ip-1');
    expect(result.allowed).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Pre-configured limiters exist and work
// ---------------------------------------------------------------------------

describe('pre-configured limiters', () => {
  it('authLimiter exists and has checkRateLimit', () => {
    expect(authLimiter).toBeDefined();
    expect(typeof authLimiter.checkRateLimit).toBe('function');
  });

  it('citizenApiLimiter exists and has checkRateLimit', () => {
    expect(citizenApiLimiter).toBeDefined();
    expect(typeof citizenApiLimiter.checkRateLimit).toBe('function');
  });

  it('verificationLimiter exists and has checkRateLimit', () => {
    expect(verificationLimiter).toBeDefined();
    expect(typeof verificationLimiter.checkRateLimit).toBe('function');
  });

  it('adminLimiter exists and has checkRateLimit', () => {
    expect(adminLimiter).toBeDefined();
    expect(typeof adminLimiter.checkRateLimit).toBe('function');
  });

  it('authLimiter allows up to 10 requests', () => {
    for (let i = 0; i < 10; i++) {
      const result = authLimiter.checkRateLimit(`auth-test-${Date.now()}-${i}`);
      expect(result.allowed).toBe(true);
    }
  });
});
