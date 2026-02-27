import { z } from 'zod';

// ─── Service type enum ──────────────────────────────────────────────────────

export const SERVICE_TYPES = [
  'cedula',
  'pasaporte',
  'licencia_conduccion',
  'registro_civil',
  'antecedentes',
  'certificado_electoral',
  'afiliacion_salud',
  'pension',
  'subsidio',
  'otro',
] as const;

export type ServiceType = (typeof SERVICE_TYPES)[number];

// ─── Update Profile Schema ──────────────────────────────────────────────────

export const updateProfileSchema = z.object({
  phone: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val.trim() === '') return true;
        return /^\+57\d{10}$/.test(val.replace(/\s/g, ''));
      },
      { message: 'El telefono debe tener formato colombiano (+57 seguido de 10 digitos)' }
    ),
  email: z
    .string()
    .email('El formato del correo electronico no es valido')
    .optional()
    .or(z.literal('')),
  address: z
    .string()
    .max(200, 'La direccion no puede tener mas de 200 caracteres')
    .optional()
    .or(z.literal('')),
  city: z
    .string()
    .max(100, 'La ciudad no puede tener mas de 100 caracteres')
    .optional()
    .or(z.literal('')),
  department: z
    .string()
    .max(100, 'El departamento no puede tener mas de 100 caracteres')
    .optional()
    .or(z.literal('')),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

// ─── Appointment Booking Schema ─────────────────────────────────────────────

export const appointmentBookingSchema = z.object({
  service_type: z.enum(SERVICE_TYPES, {
    error: 'Tipo de servicio no valido',
  }),
  preferred_date: z
    .string({ error: 'La fecha preferida es requerida' })
    .min(1, 'La fecha preferida es requerida')
    .refine(
      (val) => {
        const date = new Date(val);
        return !isNaN(date.getTime());
      },
      { message: 'La fecha no es valida' }
    )
    .refine(
      (val) => {
        const date = new Date(val);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date >= today;
      },
      { message: 'La fecha debe ser hoy o una fecha futura' }
    ),
  preferred_time: z
    .string({ error: 'La hora preferida es requerida' })
    .min(1, 'La hora preferida es requerida'),
  notes: z
    .string()
    .max(500, 'Las notas no pueden tener mas de 500 caracteres')
    .optional()
    .or(z.literal('')),
});

export type AppointmentBookingInput = z.infer<typeof appointmentBookingSchema>;
