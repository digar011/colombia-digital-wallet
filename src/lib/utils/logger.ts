/**
 * Structured Server-Side Logger
 *
 * Provides JSON-formatted structured logging for the Colombia Digital Wallet
 * application. Designed for Next.js server-side usage where stdout/stderr
 * is captured automatically by hosting platforms (Vercel, etc.).
 *
 * In development mode, logs are also output in a human-readable format
 * to the console for easier debugging.
 *
 * No external dependencies required — uses built-in console methods.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  [key: string]: unknown;
}

type AuthEvent =
  | 'login'
  | 'register'
  | 'logout'
  | 'failed_login'
  | 'password_reset';

type DocumentAction = 'view' | 'download' | 'share' | 'verify';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

/**
 * Builds a structured log entry object.
 */
function buildEntry(
  level: LogLevel,
  message: string,
  meta?: Record<string, unknown>
): LogEntry {
  return {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...(meta ?? {}),
  };
}

/**
 * Formats a log entry as a human-readable string for dev console output.
 *
 * Example:
 *   [2026-02-26T14:30:00.000Z] INFO  Auth login succeeded  { userId: "abc123" }
 */
function formatHumanReadable(entry: LogEntry): string {
  const { timestamp, level, message, ...rest } = entry;
  const metaString =
    Object.keys(rest).length > 0 ? `  ${JSON.stringify(rest)}` : '';
  return `[${timestamp}] ${level.toUpperCase().padEnd(5)} ${message}${metaString}`;
}

/**
 * Emits a log entry as structured JSON to stdout/stderr.
 * In development, also emits a human-readable line.
 */
function emit(level: LogLevel, message: string, meta?: Record<string, unknown>): void {
  const entry = buildEntry(level, message, meta);

  // Structured JSON output (always emitted — captured by Vercel / cloud logging)
  const jsonLine = JSON.stringify(entry);

  switch (level) {
    case 'error':
      console.error(jsonLine);
      break;
    case 'warn':
      console.warn(jsonLine);
      break;
    case 'debug':
      // In production, skip debug-level logs entirely to reduce noise
      if (IS_PRODUCTION) return;
      console.debug(jsonLine);
      break;
    case 'info':
    default:
      console.log(jsonLine);
      break;
  }

  // Human-readable output for development only
  if (!IS_PRODUCTION) {
    const readable = formatHumanReadable(entry);
    switch (level) {
      case 'error':
        console.error(readable);
        break;
      case 'warn':
        console.warn(readable);
        break;
      case 'debug':
        console.debug(readable);
        break;
      case 'info':
      default:
        console.log(readable);
        break;
    }
  }
}

// ---------------------------------------------------------------------------
// Core Logger
// ---------------------------------------------------------------------------

/**
 * Structured logger with leveled methods.
 *
 * Usage:
 *   import { logger } from '@/lib/utils/logger';
 *   logger.info('Server started', { port: 3000 });
 *   logger.error('Unhandled exception', { error: err.message });
 */
export const logger = {
  /** Verbose output, only emitted in non-production environments. */
  debug(message: string, meta?: Record<string, unknown>): void {
    emit('debug', message, meta);
  },

  /** General informational messages. */
  info(message: string, meta?: Record<string, unknown>): void {
    emit('info', message, meta);
  },

  /** Potentially harmful situations that deserve attention. */
  warn(message: string, meta?: Record<string, unknown>): void {
    emit('warn', message, meta);
  },

  /** Error events — something went wrong. */
  error(message: string, meta?: Record<string, unknown>): void {
    emit('error', message, meta);
  },
};

// ---------------------------------------------------------------------------
// Helper: API Request Logging
// ---------------------------------------------------------------------------

/**
 * Logs an API route request with standard fields.
 *
 * Usage:
 *   logApiRequest('GET', '/api/citizens/123', userId, 200, 42);
 *
 * @param method   - HTTP method (GET, POST, PUT, DELETE, etc.)
 * @param path     - Request path (e.g. "/api/citizens/123")
 * @param userId   - Authenticated user ID, if available
 * @param statusCode - HTTP response status code
 * @param durationMs - Request processing time in milliseconds
 */
export function logApiRequest(
  method: string,
  path: string,
  userId?: string,
  statusCode?: number,
  durationMs?: number
): void {
  const meta: Record<string, unknown> = {
    category: 'api_request',
    method: method.toUpperCase(),
    path,
  };

  if (userId !== undefined) meta.userId = userId;
  if (statusCode !== undefined) meta.statusCode = statusCode;
  if (durationMs !== undefined) meta.durationMs = durationMs;

  // Classify the log level based on the status code
  const level: LogLevel =
    statusCode !== undefined && statusCode >= 500
      ? 'error'
      : statusCode !== undefined && statusCode >= 400
        ? 'warn'
        : 'info';

  emit(level, `${method.toUpperCase()} ${path} ${statusCode ?? ''}`.trim(), meta);
}

// ---------------------------------------------------------------------------
// Helper: Auth Event Logging
// ---------------------------------------------------------------------------

/**
 * Logs an authentication event for audit trail purposes.
 *
 * Usage:
 *   logAuthEvent('login', userId, 'user@example.com');
 *   logAuthEvent('failed_login', undefined, 'attacker@example.com', { reason: 'invalid_password' });
 *
 * @param event  - The authentication event type
 * @param userId - The user ID involved, if known
 * @param email  - The email address involved, if known
 * @param meta   - Additional metadata (e.g. IP address, user agent, failure reason)
 */
export function logAuthEvent(
  event: AuthEvent,
  userId?: string,
  email?: string,
  meta?: Record<string, unknown>
): void {
  const baseMeta: Record<string, unknown> = {
    category: 'auth_event',
    event,
    ...(meta ?? {}),
  };

  if (userId !== undefined) baseMeta.userId = userId;
  if (email !== undefined) baseMeta.email = email;

  // Failed logins are warnings (potential brute-force); everything else is informational
  const level: LogLevel = event === 'failed_login' ? 'warn' : 'info';

  emit(level, `Auth: ${event}`, baseMeta);
}

// ---------------------------------------------------------------------------
// Helper: Document Access Logging (Government Audit Compliance)
// ---------------------------------------------------------------------------

/**
 * Logs a document access event for government audit compliance.
 *
 * Colombian digital government services require an audit trail of who accessed
 * what documents, when, and what action they performed. This helper provides
 * that structured trail.
 *
 * Usage:
 *   logDocumentAccess('user-123', 'doc-456', 'cedula', 'view');
 *   logDocumentAccess('user-123', 'doc-789', 'birth_certificate', 'download');
 *
 * @param userId       - The user performing the action
 * @param documentId   - The unique identifier of the document
 * @param documentType - The type/category of the document (e.g. "cedula", "birth_certificate", "tax_report")
 * @param action       - The action performed on the document
 */
export function logDocumentAccess(
  userId: string,
  documentId: string,
  documentType: string,
  action: DocumentAction
): void {
  emit('info', `Document ${action}: ${documentType}`, {
    category: 'document_access',
    userId,
    documentId,
    documentType,
    action,
  });
}
