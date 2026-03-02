import type { NextRequest } from 'next/server';
import { createApiResponse, withAuth } from '@/lib/utils/apiHelpers';
import { logDocumentAccess } from '@/lib/utils/logger';
import { mockDocuments } from '@/lib/mock/citizenData';

/**
 * GET /api/citizens/documents
 *
 * Returns all documents for the authenticated citizen.
 * Protected by auth token. Logs document access for audit compliance.
 */
export const GET = withAuth(async (_request: NextRequest, { userId }) => {
  // Log the document list access for government audit compliance
  logDocumentAccess(userId, 'all', 'document_list', 'view');

  return createApiResponse(mockDocuments, 200, {
    total: mockDocuments.length,
  });
});
