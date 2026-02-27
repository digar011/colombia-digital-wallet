// ─── Auth validations ────────────────────────────────────────────────────────
export {
  loginSchema,
  registerSchema,
  passwordResetSchema,
  verifyEmailSchema,
  DOCUMENT_TYPES,
  type DocumentTypeEnum,
  type LoginInput,
  type RegisterInput,
  type PasswordResetInput,
  type VerifyEmailInput,
} from './auth';

// ─── Citizen validations ─────────────────────────────────────────────────────
export {
  updateProfileSchema,
  appointmentBookingSchema,
  SERVICE_TYPES,
  type ServiceType,
  type UpdateProfileInput,
  type AppointmentBookingInput,
} from './citizen';

// ─── Admin validations ──────────────────────────────────────────────────────
export {
  issueDocumentSchema,
  searchCitizensSchema,
  updateCitizenStatusSchema,
  ADMIN_DOCUMENT_TYPES,
  CITIZEN_STATUSES,
  type AdminDocumentType,
  type CitizenStatus,
  type IssueDocumentInput,
  type SearchCitizensInput,
  type UpdateCitizenStatusInput,
} from './admin';
