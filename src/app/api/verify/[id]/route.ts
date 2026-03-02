import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createApiResponse, ApiErrors } from '@/lib/utils/apiHelpers';
import { logger } from '@/lib/utils/logger';
import { verificationLimiter } from '@/lib/middleware/rateLimit';
import { mockIssuedDocuments } from '@/lib/mock/adminData';

/**
 * GET /api/verify/[id]
 *
 * Public document verification endpoint.
 * Third-party verifiers and citizens can use this to check if a document
 * is valid and retrieve its basic details.
 *
 * Rate limited with verificationLimiter (higher throughput for programmatic access).
 * Does NOT require authentication — this is a public verification endpoint.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: documentId } = await params;

  const identifier =
    request.headers.get('x-forwarded-for') ??
    request.headers.get('x-real-ip') ??
    'unknown';

  // Rate limit check
  const rateLimitResult = verificationLimiter.checkRateLimit(identifier);
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

  if (!documentId) {
    return ApiErrors.badRequest('El ID del documento es requerido');
  }

  // Look up the document in mock issued documents
  const document = mockIssuedDocuments.find((doc) => doc.id === documentId);

  if (!document) {
    logger.info('Document verification failed - not found', {
      category: 'verification',
      documentId,
      ip: identifier,
      result: 'not_found',
    });
    return ApiErrors.notFound('Documento');
  }

  // Log the verification attempt
  logger.info('Document verification successful', {
    category: 'verification',
    documentId,
    documentType: document.type,
    ip: identifier,
    result: 'found',
  });

  // Return verification result (limited public data — no full citizen details)
  return createApiResponse({
    verified: true,
    document: {
      id: document.id,
      type: document.type,
      documentNumber: document.documentNumber,
      status: document.status,
      issuedAt: document.issuedAt,
      expiresAt: document.expiresAt,
      issuedBy: document.issuedBy,
    },
  });
}
