import type { NextRequest } from 'next/server';
import { appointmentBookingSchema } from '@/lib/validations';
import {
  createApiResponse,
  ApiErrors,
  withAuth,
} from '@/lib/utils/apiHelpers';
import { csrfProtect } from '@/lib/utils/csrf';
import { mockAppointments } from '@/lib/mock/citizenData';

/**
 * GET /api/citizens/appointments
 *
 * Returns all appointments for the authenticated citizen.
 * Protected by auth token.
 */
export const GET = withAuth(async (_request: NextRequest) => {
  return createApiResponse(mockAppointments, 200, {
    total: mockAppointments.length,
  });
});

/**
 * POST /api/citizens/appointments
 *
 * Books a new appointment for the authenticated citizen.
 * Protected by auth token and CSRF validation.
 * Validates input with the appointmentBookingSchema.
 */
export const POST = withAuth(async (request: NextRequest) => {
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
  const parsed = appointmentBookingSchema.safeParse(body);
  if (!parsed.success) {
    const details = parsed.error.flatten().fieldErrors;
    return ApiErrors.validationError(details);
  }

  const { service_type, preferred_date, preferred_time, notes } = parsed.data;

  // Create a mock appointment
  const newAppointment = {
    id: `apt-${Date.now()}`,
    title: `Cita - ${service_type}`,
    entity: 'Entidad Gubernamental',
    location: 'Por confirmar',
    date: preferred_date,
    time: preferred_time,
    status: 'pending' as const,
    type: 'in-person' as const,
    reference: `REF-${Date.now()}`,
    notes: notes ?? '',
  };

  return createApiResponse(newAppointment, 201);
});
