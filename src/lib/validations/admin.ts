import { z } from 'zod';

// ─── Admin document types ───────────────────────────────────────────────────

export const ADMIN_DOCUMENT_TYPES = [
  'cedula_ciudadania',
  'cedula_extranjeria',
  'tarjeta_identidad',
  'pasaporte',
  'registro_civil',
  'licencia_conduccion',
  'certificado_electoral',
  'antecedentes_judiciales',
  'antecedentes_fiscales',
  'afiliacion_salud',
] as const;

export type AdminDocumentType = (typeof ADMIN_DOCUMENT_TYPES)[number];

// ─── Citizen status enum ────────────────────────────────────────────────────

export const CITIZEN_STATUSES = ['active', 'suspended', 'blocked'] as const;
export type CitizenStatus = (typeof CITIZEN_STATUSES)[number];

// ─── UUID regex pattern ─────────────────────────────────────────────────────

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// ─── Issue Document Schema ──────────────────────────────────────────────────

export const issueDocumentSchema = z.object({
  citizen_id: z
    .string({ error: 'El ID del ciudadano es requerido' })
    .min(1, 'El ID del ciudadano es requerido')
    .regex(UUID_REGEX, 'El ID del ciudadano debe ser un UUID valido'),
  document_type: z.enum(ADMIN_DOCUMENT_TYPES, {
    error: 'Tipo de documento no valido',
  }),
  expiry_date: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val.trim() === '') return true;
        const date = new Date(val);
        return !isNaN(date.getTime());
      },
      { message: 'La fecha de vencimiento no es valida' }
    )
    .refine(
      (val) => {
        if (!val || val.trim() === '') return true;
        const date = new Date(val);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date > today;
      },
      { message: 'La fecha de vencimiento debe ser una fecha futura' }
    ),
});

export type IssueDocumentInput = z.infer<typeof issueDocumentSchema>;

// ─── Search Citizens Schema ─────────────────────────────────────────────────

export const searchCitizensSchema = z.object({
  query: z
    .string({ error: 'El termino de busqueda es requerido' })
    .min(2, 'El termino de busqueda debe tener al menos 2 caracteres'),
  page: z
    .number()
    .int('La pagina debe ser un numero entero')
    .positive('La pagina debe ser un numero positivo')
    .optional(),
  limit: z
    .number()
    .int('El limite debe ser un numero entero')
    .min(1, 'El limite debe ser al menos 1')
    .max(100, 'El limite no puede ser mayor a 100')
    .optional(),
});

export type SearchCitizensInput = z.infer<typeof searchCitizensSchema>;

// ─── Update Citizen Status Schema ───────────────────────────────────────────

export const updateCitizenStatusSchema = z.object({
  citizen_id: z
    .string({ error: 'El ID del ciudadano es requerido' })
    .min(1, 'El ID del ciudadano es requerido')
    .regex(UUID_REGEX, 'El ID del ciudadano debe ser un UUID valido'),
  status: z.enum(CITIZEN_STATUSES, {
    error: 'Estado no valido. Debe ser: active, suspended o blocked',
  }),
  reason: z
    .string({ error: 'El motivo es requerido' })
    .min(10, 'El motivo debe tener al menos 10 caracteres'),
});

export type UpdateCitizenStatusInput = z.infer<typeof updateCitizenStatusSchema>;
