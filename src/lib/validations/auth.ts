import { z } from 'zod';

// ─── Document type enum ─────────────────────────────────────────────────────

export const DOCUMENT_TYPES = ['CC', 'CE', 'TI', 'PP', 'PEP'] as const;
export type DocumentTypeEnum = (typeof DOCUMENT_TYPES)[number];

// ─── Login Schema ────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z
    .string({ error: 'El correo electronico es requerido' })
    .min(1, 'El correo electronico es requerido')
    .email('El formato del correo electronico no es valido'),
  password: z
    .string({ error: 'La contrasena es requerida' })
    .min(6, 'La contrasena debe tener al menos 6 caracteres'),
});

export type LoginInput = z.infer<typeof loginSchema>;

// ─── Register Schema ─────────────────────────────────────────────────────────

export const registerSchema = z
  .object({
    email: z
      .string({ error: 'El correo electronico es requerido' })
      .min(1, 'El correo electronico es requerido')
      .email('El formato del correo electronico no es valido'),
    password: z
      .string({ error: 'La contrasena es requerida' })
      .min(8, 'La contrasena debe tener al menos 8 caracteres')
      .regex(/[A-Z]/, 'La contrasena debe incluir al menos una letra mayuscula')
      .regex(/[0-9]/, 'La contrasena debe incluir al menos un numero'),
    confirmPassword: z
      .string({ error: 'Debes confirmar tu contrasena' })
      .min(1, 'Debes confirmar tu contrasena'),
    document_type: z.enum(DOCUMENT_TYPES, {
      error: 'Tipo de documento no valido',
    }),
    document_number: z
      .string({ error: 'El numero de documento es requerido' })
      .min(1, 'El numero de documento es requerido')
      .regex(/^\d{6,15}$/, 'El numero de documento debe tener entre 6 y 15 digitos'),
    first_name: z
      .string({ error: 'El primer nombre es requerido' })
      .min(2, 'El nombre debe tener al menos 2 caracteres')
      .max(50, 'El nombre no puede tener mas de 50 caracteres'),
    last_name: z
      .string({ error: 'El apellido es requerido' })
      .min(2, 'El apellido debe tener al menos 2 caracteres')
      .max(50, 'El apellido no puede tener mas de 50 caracteres'),
    date_of_birth: z
      .string({ error: 'La fecha de nacimiento es requerida' })
      .min(1, 'La fecha de nacimiento es requerida')
      .refine(
        (val) => {
          const date = new Date(val);
          return !isNaN(date.getTime());
        },
        { message: 'La fecha de nacimiento no es valida' }
      )
      .refine(
        (val) => {
          const date = new Date(val);
          return date < new Date();
        },
        { message: 'La fecha de nacimiento debe ser una fecha pasada' }
      ),
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
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contrasenas no coinciden',
    path: ['confirmPassword'],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

// ─── Password Reset Schema ──────────────────────────────────────────────────

export const passwordResetSchema = z.object({
  email: z
    .string({ error: 'El correo electronico es requerido' })
    .min(1, 'El correo electronico es requerido')
    .email('El formato del correo electronico no es valido'),
});

export type PasswordResetInput = z.infer<typeof passwordResetSchema>;

// ─── Verify Email Schema ────────────────────────────────────────────────────

export const verifyEmailSchema = z.object({
  token: z
    .string({ error: 'El token de verificacion es requerido' })
    .min(1, 'El token de verificacion es requerido'),
});

export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
