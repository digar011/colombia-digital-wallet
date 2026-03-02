import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { issueDocumentSchema } from '@/lib/validations';
import {
  createApiResponse,
  ApiErrors,
  withAuth,
} from '@/lib/utils/apiHelpers';
import { csrfProtect } from '@/lib/utils/csrf';
import { logger } from '@/lib/utils/logger';
import { adminLimiter } from '@/lib/middleware/rateLimit';

/**
 * POST /api/admin/documents
 *
 * Issues a new document to a citizen.
 * Protected by auth token, CSRF validation, and rate limiting.
 * Validates input with the issueDocumentSchema.
 */
export const POST = withAuth(async (request: NextRequest, { userId }) => {
  const identifier =
    request.headers.get('x-forwarded-for') ??
    request.headers.get('x-real-ip') ??
    'unknown';

  // Rate limit check
  const rateLimitResult = adminLimiter.checkRateLimit(identifier);
  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'RATE_LIMITED',
          message: 'Demasiadas solicitudes. Intente de nuevo mas tarde.',
        },
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(
            Math.ceil(
              (rateLimitResult.resetAt.getTime() - Date.now()) / 1000
            )
          ),
          'X-RateLimit-Remaining': String(rateLimitResult.remaining),
          'X-RateLimit-Reset': rateLimitResult.resetAt.toISOString(),
        },
      }
    );
  }

  // CSRF protection
  const csrf = csrfProtect(request);
  if (!csrf.valid) {
    return ApiErrors.forbidden(csrf.error ?? 'Token CSRF invalido');
  }

  // Parse request body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return ApiErrors.badRequest('El cuerpo de la solicitud no es JSON valido');
  }

  // Validate with Zod schema
  const parsed = issueDocumentSchema.safeParse(body);
  if (!parsed.success) {
    const details = parsed.error.flatten().fieldErrors;
    return ApiErrors.validationError(details);
  }

  const { citizen_id, document_type, expiry_date } = parsed.data;

  // Create a mock issued document
  const issuedDocument = {
    id: `doc-${Date.now()}`,
    citizenId: citizen_id,
    citizenName: 'Ciudadano (Mock)',
    type: document_type,
    documentNumber: `${document_type.toUpperCase()}-${Date.now()}`,
    issuedAt: new Date().toISOString(),
    expiresAt: expiry_date ?? null,
    status: 'active' as const,
    issuedBy: userId,
  };

  // Log the document issuance for audit trail
  logger.info('Document issued', {
    category: 'admin_action',
    adminUserId: userId,
    citizenId: citizen_id,
    documentType: document_type,
    documentId: issuedDocument.id,
  });

  return createApiResponse(issuedDocument, 201);
});
