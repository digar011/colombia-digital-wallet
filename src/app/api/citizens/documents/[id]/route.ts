import type { NextRequest } from 'next/server';
import { createApiResponse, ApiErrors, withAuth } from '@/lib/utils/apiHelpers';
import { logDocumentAccess } from '@/lib/utils/logger';
import { mockDocuments } from '@/lib/mock/citizenData';

/**
 * GET /api/citizens/documents/[id]
 *
 * Returns a specific document by ID for the authenticated citizen.
 * Protected by auth token. Logs document access for audit compliance.
 */
export const GET = withAuth(async (request: NextRequest, { userId }) => {
  // Extract document ID from the URL pathname
  // Path format: /api/citizens/documents/{id}
  const segments = request.nextUrl.pathname.split('/');
  const documentId = segments[segments.length - 1];

  if (!documentId) {
    return ApiErrors.badRequest('El ID del documento es requerido');
  }

  const document = mockDocuments.find((doc) => doc.id === documentId);

  if (!document) {
    return ApiErrors.notFound('Documento');
  }

  // Log the specific document access for government audit compliance
  logDocumentAccess(userId, document.id, document.type, 'view');

  return createApiResponse(document);
});
