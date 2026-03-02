import type { NextRequest } from 'next/server';
import { z } from 'zod';
import { CITIZEN_STATUSES } from '@/lib/validations';
import {
  createApiResponse,
  ApiErrors,
  withAuth,
} from '@/lib/utils/apiHelpers';
import { csrfProtect } from '@/lib/utils/csrf';
import { logger } from '@/lib/utils/logger';
import { mockCitizens } from '@/lib/mock/adminData';

/**
 * Body-only validation schema for the status update endpoint.
 * The citizen_id comes from the URL path parameter, so we only validate
 * the status and reason fields from the request body.
 */
const statusUpdateBodySchema = z.object({
  status: z.enum(CITIZEN_STATUSES, {
    error: 'Estado no valido. Debe ser: active, suspended o blocked',
  }),
  reason: z
    .string({ error: 'El motivo es requerido' })
    .min(10, 'El motivo debe tener al menos 10 caracteres'),
});

/**
 * PUT /api/admin/citizens/[id]/status
 *
 * Updates a citizen's verification status (e.g., active, suspended, blocked).
 * Protected by auth token and CSRF validation.
 * Validates body with status + reason fields.
 * Logs status changes for audit trail.
 */
export const PUT = withAuth(async (request: NextRequest, { userId }) => {
  // CSRF protection
  const csrf = csrfProtect(request);
  if (!csrf.valid) {
    return ApiErrors.forbidden(csrf.error ?? 'Token CSRF invalido');
  }

  // Extract citizen ID from the URL pathname
  // Path format: /api/admin/citizens/{id}/status
  const segments = request.nextUrl.pathname.split('/');
  // segments: ['', 'api', 'admin', 'citizens', '{id}', 'status']
  const citizenId = segments[segments.length - 2];

  if (!citizenId) {
    return ApiErrors.badRequest('El ID del ciudadano es requerido');
  }

  // Parse request body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return ApiErrors.badRequest(
      'El cuerpo de la solicitud no es JSON valido'
    );
  }

  // Validate body fields with Zod
  const parsed = statusUpdateBodySchema.safeParse(body);
  if (!parsed.success) {
    const details = parsed.error.flatten().fieldErrors;
    return ApiErrors.validationError(details);
  }

  const { status, reason } = parsed.data;

  // Find the citizen in mock data
  const citizen = mockCitizens.find((c) => c.id === citizenId);
  if (!citizen) {
    return ApiErrors.notFound('Ciudadano');
  }

  // Log the status change for audit trail
  logger.info('Citizen status updated', {
    category: 'admin_action',
    adminUserId: userId,
    citizenId,
    citizenName: `${citizen.firstName} ${citizen.lastName}`,
    previousStatus: citizen.status,
    newStatus: status,
    reason,
  });

  // Return the updated citizen with the new status
  const updatedCitizen = {
    ...citizen,
    status,
    lastActiveAt: new Date().toISOString(),
  };

  return createApiResponse(updatedCitizen);
});
