import { logger, logApiRequest, logAuthEvent, logDocumentAccess } from '@/lib/utils/logger';

// ---------------------------------------------------------------------------
// Setup: spy on all console methods
// ---------------------------------------------------------------------------

let consoleSpy: {
  log: jest.SpiedFunction<typeof console.log>;
  warn: jest.SpiedFunction<typeof console.warn>;
  error: jest.SpiedFunction<typeof console.error>;
  debug: jest.SpiedFunction<typeof console.debug>;
};

beforeEach(() => {
  consoleSpy = {
    log: jest.spyOn(console, 'log').mockImplementation(),
    warn: jest.spyOn(console, 'warn').mockImplementation(),
    error: jest.spyOn(console, 'error').mockImplementation(),
    debug: jest.spyOn(console, 'debug').mockImplementation(),
  };
});

afterEach(() => {
  jest.restoreAllMocks();
});

// ---------------------------------------------------------------------------
// Helper to parse the first JSON argument of a console call
// ---------------------------------------------------------------------------

function getLoggedJson(
  spy: jest.SpiedFunction<typeof console.log>
): Record<string, unknown> | null {
  if (spy.mock.calls.length === 0) return null;
  try {
    return JSON.parse(spy.mock.calls[0][0] as string) as Record<string, unknown>;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Core logger methods
// ---------------------------------------------------------------------------

describe('logger', () => {
  describe('logger.info()', () => {
    it('calls console.log with a JSON string', () => {
      logger.info('test message');
      expect(consoleSpy.log).toHaveBeenCalled();
      const parsed = getLoggedJson(consoleSpy.log);
      expect(parsed).not.toBeNull();
      expect(parsed?.level).toBe('info');
      expect(parsed?.message).toBe('test message');
    });

    it('includes metadata in the log entry', () => {
      logger.info('with meta', { userId: 'abc' });
      const parsed = getLoggedJson(consoleSpy.log);
      expect(parsed?.userId).toBe('abc');
    });

    it('includes an ISO timestamp', () => {
      logger.info('timestamp check');
      const parsed = getLoggedJson(consoleSpy.log);
      expect(parsed?.timestamp).toBeDefined();
      expect(typeof parsed?.timestamp).toBe('string');
      // Verify it's a valid ISO date
      expect(new Date(parsed?.timestamp as string).toISOString()).toBe(
        parsed?.timestamp
      );
    });
  });

  describe('logger.warn()', () => {
    it('calls console.warn with a JSON string', () => {
      logger.warn('warning message');
      expect(consoleSpy.warn).toHaveBeenCalled();
      const parsed = getLoggedJson(consoleSpy.warn);
      expect(parsed?.level).toBe('warn');
      expect(parsed?.message).toBe('warning message');
    });
  });

  describe('logger.error()', () => {
    it('calls console.error with a JSON string', () => {
      logger.error('error message');
      expect(consoleSpy.error).toHaveBeenCalled();
      const parsed = getLoggedJson(consoleSpy.error);
      expect(parsed?.level).toBe('error');
      expect(parsed?.message).toBe('error message');
    });

    it('includes error metadata', () => {
      logger.error('db failure', { code: 'ECONNREFUSED' });
      const parsed = getLoggedJson(consoleSpy.error);
      expect(parsed?.code).toBe('ECONNREFUSED');
    });
  });

  describe('logger.debug()', () => {
    it('calls console.debug in non-production environment', () => {
      logger.debug('debug message');
      expect(consoleSpy.debug).toHaveBeenCalled();
      const parsed = getLoggedJson(consoleSpy.debug);
      expect(parsed?.level).toBe('debug');
      expect(parsed?.message).toBe('debug message');
    });
  });
});

// ---------------------------------------------------------------------------
// logApiRequest
// ---------------------------------------------------------------------------

describe('logApiRequest()', () => {
  it('logs with category "api_request"', () => {
    logApiRequest('GET', '/api/citizens');
    const parsed = getLoggedJson(consoleSpy.log);
    expect(parsed?.category).toBe('api_request');
  });

  it('logs the method in uppercase', () => {
    logApiRequest('get', '/api/citizens');
    const parsed = getLoggedJson(consoleSpy.log);
    expect(parsed?.method).toBe('GET');
  });

  it('logs with "info" level for 2xx status codes', () => {
    logApiRequest('GET', '/api/citizens', 'user-1', 200, 42);
    expect(consoleSpy.log).toHaveBeenCalled();
    const parsed = getLoggedJson(consoleSpy.log);
    expect(parsed?.level).toBe('info');
    expect(parsed?.statusCode).toBe(200);
  });

  it('logs with "warn" level for 4xx status codes', () => {
    logApiRequest('POST', '/api/citizens', 'user-1', 404, 10);
    expect(consoleSpy.warn).toHaveBeenCalled();
    const parsed = getLoggedJson(consoleSpy.warn);
    expect(parsed?.level).toBe('warn');
    expect(parsed?.statusCode).toBe(404);
  });

  it('logs with "error" level for 5xx status codes', () => {
    logApiRequest('POST', '/api/citizens', 'user-1', 500, 100);
    expect(consoleSpy.error).toHaveBeenCalled();
    const parsed = getLoggedJson(consoleSpy.error);
    expect(parsed?.level).toBe('error');
    expect(parsed?.statusCode).toBe(500);
  });

  it('includes userId when provided', () => {
    logApiRequest('GET', '/api/me', 'user-42', 200);
    const parsed = getLoggedJson(consoleSpy.log);
    expect(parsed?.userId).toBe('user-42');
  });

  it('excludes userId when not provided', () => {
    logApiRequest('GET', '/api/health');
    const parsed = getLoggedJson(consoleSpy.log);
    expect(parsed?.userId).toBeUndefined();
  });

  it('includes durationMs when provided', () => {
    logApiRequest('GET', '/api/citizens', undefined, 200, 55);
    const parsed = getLoggedJson(consoleSpy.log);
    expect(parsed?.durationMs).toBe(55);
  });

  it('logs the request path', () => {
    logApiRequest('DELETE', '/api/citizens/123', undefined, 204);
    const parsed = getLoggedJson(consoleSpy.log);
    expect(parsed?.path).toBe('/api/citizens/123');
  });
});

// ---------------------------------------------------------------------------
// logAuthEvent
// ---------------------------------------------------------------------------

describe('logAuthEvent()', () => {
  it('logs with category "auth_event"', () => {
    logAuthEvent('login', 'user-1', 'test@test.com');
    const parsed = getLoggedJson(consoleSpy.log);
    expect(parsed?.category).toBe('auth_event');
  });

  it('logs with "warn" level for failed_login', () => {
    logAuthEvent('failed_login', undefined, 'attacker@test.com', {
      reason: 'invalid_password',
    });
    expect(consoleSpy.warn).toHaveBeenCalled();
    const parsed = getLoggedJson(consoleSpy.warn);
    expect(parsed?.level).toBe('warn');
    expect(parsed?.event).toBe('failed_login');
  });

  it('logs with "info" level for successful login', () => {
    logAuthEvent('login', 'user-1');
    expect(consoleSpy.log).toHaveBeenCalled();
    const parsed = getLoggedJson(consoleSpy.log);
    expect(parsed?.level).toBe('info');
    expect(parsed?.event).toBe('login');
  });

  it('logs with "info" level for register', () => {
    logAuthEvent('register', 'user-1', 'new@test.com');
    const parsed = getLoggedJson(consoleSpy.log);
    expect(parsed?.level).toBe('info');
    expect(parsed?.event).toBe('register');
  });

  it('logs with "info" level for logout', () => {
    logAuthEvent('logout', 'user-1');
    const parsed = getLoggedJson(consoleSpy.log);
    expect(parsed?.level).toBe('info');
    expect(parsed?.event).toBe('logout');
  });

  it('logs with "info" level for password_reset', () => {
    logAuthEvent('password_reset', 'user-1', 'reset@test.com');
    const parsed = getLoggedJson(consoleSpy.log);
    expect(parsed?.level).toBe('info');
    expect(parsed?.event).toBe('password_reset');
  });

  it('includes email when provided', () => {
    logAuthEvent('login', 'user-1', 'user@test.com');
    const parsed = getLoggedJson(consoleSpy.log);
    expect(parsed?.email).toBe('user@test.com');
  });

  it('includes extra metadata', () => {
    logAuthEvent('failed_login', undefined, 'x@test.com', {
      ip: '1.2.3.4',
    });
    const parsed = getLoggedJson(consoleSpy.warn);
    expect(parsed?.ip).toBe('1.2.3.4');
  });
});

// ---------------------------------------------------------------------------
// logDocumentAccess
// ---------------------------------------------------------------------------

describe('logDocumentAccess()', () => {
  it('logs with category "document_access"', () => {
    logDocumentAccess('user-1', 'doc-1', 'cedula', 'view');
    const parsed = getLoggedJson(consoleSpy.log);
    expect(parsed?.category).toBe('document_access');
  });

  it('includes userId', () => {
    logDocumentAccess('user-42', 'doc-1', 'cedula', 'view');
    const parsed = getLoggedJson(consoleSpy.log);
    expect(parsed?.userId).toBe('user-42');
  });

  it('includes documentId', () => {
    logDocumentAccess('user-1', 'doc-99', 'cedula', 'download');
    const parsed = getLoggedJson(consoleSpy.log);
    expect(parsed?.documentId).toBe('doc-99');
  });

  it('includes documentType', () => {
    logDocumentAccess('user-1', 'doc-1', 'birth_certificate', 'share');
    const parsed = getLoggedJson(consoleSpy.log);
    expect(parsed?.documentType).toBe('birth_certificate');
  });

  it('includes action', () => {
    logDocumentAccess('user-1', 'doc-1', 'cedula', 'verify');
    const parsed = getLoggedJson(consoleSpy.log);
    expect(parsed?.action).toBe('verify');
  });

  it('includes the document type and action in the message', () => {
    logDocumentAccess('user-1', 'doc-1', 'cedula', 'view');
    const parsed = getLoggedJson(consoleSpy.log);
    expect(parsed?.message).toContain('view');
    expect(parsed?.message).toContain('cedula');
  });

  it('always logs at info level', () => {
    logDocumentAccess('user-1', 'doc-1', 'cedula', 'download');
    expect(consoleSpy.log).toHaveBeenCalled();
    const parsed = getLoggedJson(consoleSpy.log);
    expect(parsed?.level).toBe('info');
  });
});
