// ─── Admin Mock Data ─────────────────────────────────────────────────────────
// Comprehensive mock data for the admin dashboard of the Colombia Digital Wallet

// ─── Types ───────────────────────────────────────────────────────────────────

export type VerificationStatus = 'verified' | 'pending' | 'rejected' | 'suspended';
export type DocumentType = 'cedula' | 'passport' | 'license' | 'health_card' | 'military_id' | 'electoral';
export type Department =
  | 'Bogotá D.C.'
  | 'Antioquia'
  | 'Valle del Cauca'
  | 'Cundinamarca'
  | 'Santander'
  | 'Atlántico'
  | 'Bolívar'
  | 'Nariño'
  | 'Boyacá'
  | 'Tolima'
  | 'Meta'
  | 'Caldas'
  | 'Risaralda'
  | 'Huila'
  | 'Magdalena';

export interface MockCitizen {
  id: string;
  firstName: string;
  lastName: string;
  documentNumber: string;
  documentType: DocumentType;
  email: string;
  phone: string;
  department: Department;
  city: string;
  status: VerificationStatus;
  photoUrl: string;
  dateOfBirth: string;
  registeredAt: string;
  lastActiveAt: string;
  documentsCount: number;
  verifiedDocuments: number;
}

export interface ActivityLogEntry {
  id: string;
  type: 'verification' | 'registration' | 'document_issued' | 'document_revoked' | 'login' | 'profile_update' | 'suspension';
  citizenName: string;
  citizenId: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, string>;
}

export interface IssuedDocument {
  id: string;
  citizenId: string;
  citizenName: string;
  type: DocumentType;
  documentNumber: string;
  issuedAt: string;
  expiresAt: string;
  status: 'active' | 'expired' | 'revoked' | 'pending';
  issuedBy: string;
}

export interface DailyAnalytics {
  date: string;
  registrations: number;
  verifications: number;
  documentsIssued: number;
  activeUsers: number;
  apiCalls: number;
}

export interface DepartmentStats {
  department: Department;
  citizens: number;
  verificationRate: number;
}

export interface SystemHealth {
  service: string;
  status: 'operational' | 'degraded' | 'down';
  uptime: number;
  responseTime: number;
  lastChecked: string;
}

export interface DocumentTemplate {
  id: string;
  name: string;
  type: DocumentType;
  version: string;
  lastUpdated: string;
  fieldsCount: number;
  active: boolean;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  performedBy: string;
  target: string;
  timestamp: string;
  ipAddress: string;
  details: string;
}

// ─── Helper ──────────────────────────────────────────────────────────────────

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

function hoursAgo(n: number): string {
  const d = new Date();
  d.setHours(d.getHours() - n);
  return d.toISOString();
}

function minutesAgo(n: number): string {
  const d = new Date();
  d.setMinutes(d.getMinutes() - n);
  return d.toISOString();
}

// ─── Mock Citizens (25) ─────────────────────────────────────────────────────

export const mockCitizens: MockCitizen[] = [
  {
    id: 'cit-001',
    firstName: 'Carlos',
    lastName: 'García Martínez',
    documentNumber: '1.023.456.789',
    documentType: 'cedula',
    email: 'carlos.garcia@email.co',
    phone: '+57 310 234 5678',
    department: 'Bogotá D.C.',
    city: 'Bogotá',
    status: 'verified',
    photoUrl: '',
    dateOfBirth: '1990-03-15',
    registeredAt: daysAgo(120),
    lastActiveAt: hoursAgo(2),
    documentsCount: 5,
    verifiedDocuments: 5,
  },
  {
    id: 'cit-002',
    firstName: 'María',
    lastName: 'López Rodríguez',
    documentNumber: '1.098.765.432',
    documentType: 'cedula',
    email: 'maria.lopez@email.co',
    phone: '+57 311 345 6789',
    department: 'Antioquia',
    city: 'Medellín',
    status: 'verified',
    photoUrl: '',
    dateOfBirth: '1985-07-22',
    registeredAt: daysAgo(95),
    lastActiveAt: hoursAgo(5),
    documentsCount: 4,
    verifiedDocuments: 4,
  },
  {
    id: 'cit-003',
    firstName: 'Juan',
    lastName: 'Hernández Pérez',
    documentNumber: '1.045.678.901',
    documentType: 'cedula',
    email: 'juan.hernandez@email.co',
    phone: '+57 312 456 7890',
    department: 'Valle del Cauca',
    city: 'Cali',
    status: 'pending',
    photoUrl: '',
    dateOfBirth: '1992-11-08',
    registeredAt: daysAgo(3),
    lastActiveAt: hoursAgo(1),
    documentsCount: 2,
    verifiedDocuments: 0,
  },
  {
    id: 'cit-004',
    firstName: 'Ana',
    lastName: 'Ramírez Torres',
    documentNumber: '1.067.890.123',
    documentType: 'cedula',
    email: 'ana.ramirez@email.co',
    phone: '+57 313 567 8901',
    department: 'Cundinamarca',
    city: 'Soacha',
    status: 'verified',
    photoUrl: '',
    dateOfBirth: '1988-01-30',
    registeredAt: daysAgo(200),
    lastActiveAt: daysAgo(1),
    documentsCount: 6,
    verifiedDocuments: 6,
  },
  {
    id: 'cit-005',
    firstName: 'Diego',
    lastName: 'Moreno Sánchez',
    documentNumber: '1.012.345.678',
    documentType: 'cedula',
    email: 'diego.moreno@email.co',
    phone: '+57 314 678 9012',
    department: 'Santander',
    city: 'Bucaramanga',
    status: 'rejected',
    photoUrl: '',
    dateOfBirth: '1995-05-14',
    registeredAt: daysAgo(10),
    lastActiveAt: daysAgo(5),
    documentsCount: 1,
    verifiedDocuments: 0,
  },
  {
    id: 'cit-006',
    firstName: 'Valentina',
    lastName: 'Castro Díaz',
    documentNumber: '1.034.567.890',
    documentType: 'cedula',
    email: 'valentina.castro@email.co',
    phone: '+57 315 789 0123',
    department: 'Atlántico',
    city: 'Barranquilla',
    status: 'verified',
    photoUrl: '',
    dateOfBirth: '1993-09-03',
    registeredAt: daysAgo(60),
    lastActiveAt: hoursAgo(8),
    documentsCount: 3,
    verifiedDocuments: 3,
  },
  {
    id: 'cit-007',
    firstName: 'Andrés',
    lastName: 'Vargas Ruiz',
    documentNumber: '1.056.789.012',
    documentType: 'cedula',
    email: 'andres.vargas@email.co',
    phone: '+57 316 890 1234',
    department: 'Bolívar',
    city: 'Cartagena',
    status: 'pending',
    photoUrl: '',
    dateOfBirth: '1991-12-25',
    registeredAt: daysAgo(1),
    lastActiveAt: minutesAgo(30),
    documentsCount: 1,
    verifiedDocuments: 0,
  },
  {
    id: 'cit-008',
    firstName: 'Camila',
    lastName: 'Jiménez Ortiz',
    documentNumber: '1.078.901.234',
    documentType: 'cedula',
    email: 'camila.jimenez@email.co',
    phone: '+57 317 901 2345',
    department: 'Nariño',
    city: 'Pasto',
    status: 'verified',
    photoUrl: '',
    dateOfBirth: '1987-04-18',
    registeredAt: daysAgo(150),
    lastActiveAt: daysAgo(2),
    documentsCount: 4,
    verifiedDocuments: 3,
  },
  {
    id: 'cit-009',
    firstName: 'Santiago',
    lastName: 'Mejía Quintero',
    documentNumber: '1.089.012.345',
    documentType: 'cedula',
    email: 'santiago.mejia@email.co',
    phone: '+57 318 012 3456',
    department: 'Boyacá',
    city: 'Tunja',
    status: 'suspended',
    photoUrl: '',
    dateOfBirth: '1994-08-07',
    registeredAt: daysAgo(80),
    lastActiveAt: daysAgo(30),
    documentsCount: 3,
    verifiedDocuments: 2,
  },
  {
    id: 'cit-010',
    firstName: 'Laura',
    lastName: 'Gutiérrez Restrepo',
    documentNumber: '1.090.123.456',
    documentType: 'cedula',
    email: 'laura.gutierrez@email.co',
    phone: '+57 319 123 4567',
    department: 'Tolima',
    city: 'Ibagué',
    status: 'verified',
    photoUrl: '',
    dateOfBirth: '1996-02-28',
    registeredAt: daysAgo(45),
    lastActiveAt: hoursAgo(12),
    documentsCount: 5,
    verifiedDocuments: 5,
  },
  {
    id: 'cit-011',
    firstName: 'Sebastián',
    lastName: 'Ríos Valencia',
    documentNumber: '1.001.234.567',
    documentType: 'cedula',
    email: 'sebastian.rios@email.co',
    phone: '+57 320 234 5678',
    department: 'Meta',
    city: 'Villavicencio',
    status: 'verified',
    photoUrl: '',
    dateOfBirth: '1989-06-11',
    registeredAt: daysAgo(180),
    lastActiveAt: daysAgo(3),
    documentsCount: 4,
    verifiedDocuments: 4,
  },
  {
    id: 'cit-012',
    firstName: 'Isabella',
    lastName: 'Pineda Arango',
    documentNumber: '1.011.345.678',
    documentType: 'cedula',
    email: 'isabella.pineda@email.co',
    phone: '+57 321 345 6789',
    department: 'Caldas',
    city: 'Manizales',
    status: 'pending',
    photoUrl: '',
    dateOfBirth: '1997-10-19',
    registeredAt: daysAgo(2),
    lastActiveAt: hoursAgo(3),
    documentsCount: 2,
    verifiedDocuments: 0,
  },
  {
    id: 'cit-013',
    firstName: 'Daniel',
    lastName: 'Ospina Castaño',
    documentNumber: '1.022.456.789',
    documentType: 'cedula',
    email: 'daniel.ospina@email.co',
    phone: '+57 322 456 7890',
    department: 'Risaralda',
    city: 'Pereira',
    status: 'verified',
    photoUrl: '',
    dateOfBirth: '1986-12-05',
    registeredAt: daysAgo(210),
    lastActiveAt: hoursAgo(6),
    documentsCount: 6,
    verifiedDocuments: 6,
  },
  {
    id: 'cit-014',
    firstName: 'Gabriela',
    lastName: 'Duarte Mendieta',
    documentNumber: '1.033.567.890',
    documentType: 'cedula',
    email: 'gabriela.duarte@email.co',
    phone: '+57 323 567 8901',
    department: 'Huila',
    city: 'Neiva',
    status: 'verified',
    photoUrl: '',
    dateOfBirth: '1991-03-27',
    registeredAt: daysAgo(90),
    lastActiveAt: daysAgo(1),
    documentsCount: 3,
    verifiedDocuments: 3,
  },
  {
    id: 'cit-015',
    firstName: 'Mateo',
    lastName: 'Salazar Bernal',
    documentNumber: '1.044.678.901',
    documentType: 'cedula',
    email: 'mateo.salazar@email.co',
    phone: '+57 324 678 9012',
    department: 'Magdalena',
    city: 'Santa Marta',
    status: 'rejected',
    photoUrl: '',
    dateOfBirth: '1998-07-16',
    registeredAt: daysAgo(7),
    lastActiveAt: daysAgo(4),
    documentsCount: 1,
    verifiedDocuments: 0,
  },
  {
    id: 'cit-016',
    firstName: 'Sofía',
    lastName: 'Acevedo Parra',
    documentNumber: '1.055.789.012',
    documentType: 'cedula',
    email: 'sofia.acevedo@email.co',
    phone: '+57 325 789 0123',
    department: 'Bogotá D.C.',
    city: 'Bogotá',
    status: 'verified',
    photoUrl: '',
    dateOfBirth: '1993-11-02',
    registeredAt: daysAgo(100),
    lastActiveAt: hoursAgo(4),
    documentsCount: 5,
    verifiedDocuments: 5,
  },
  {
    id: 'cit-017',
    firstName: 'Nicolás',
    lastName: 'Cardona Yepes',
    documentNumber: '1.066.890.123',
    documentType: 'cedula',
    email: 'nicolas.cardona@email.co',
    phone: '+57 326 890 1234',
    department: 'Antioquia',
    city: 'Envigado',
    status: 'pending',
    photoUrl: '',
    dateOfBirth: '1999-01-09',
    registeredAt: daysAgo(1),
    lastActiveAt: minutesAgo(45),
    documentsCount: 1,
    verifiedDocuments: 0,
  },
  {
    id: 'cit-018',
    firstName: 'Mariana',
    lastName: 'Zuluaga Cano',
    documentNumber: '1.077.901.234',
    documentType: 'cedula',
    email: 'mariana.zuluaga@email.co',
    phone: '+57 327 901 2345',
    department: 'Valle del Cauca',
    city: 'Palmira',
    status: 'verified',
    photoUrl: '',
    dateOfBirth: '1990-05-21',
    registeredAt: daysAgo(130),
    lastActiveAt: hoursAgo(10),
    documentsCount: 4,
    verifiedDocuments: 4,
  },
  {
    id: 'cit-019',
    firstName: 'Alejandro',
    lastName: 'Prieto Gómez',
    documentNumber: '1.088.012.345',
    documentType: 'cedula',
    email: 'alejandro.prieto@email.co',
    phone: '+57 328 012 3456',
    department: 'Cundinamarca',
    city: 'Chía',
    status: 'verified',
    photoUrl: '',
    dateOfBirth: '1988-09-14',
    registeredAt: daysAgo(170),
    lastActiveAt: daysAgo(2),
    documentsCount: 5,
    verifiedDocuments: 4,
  },
  {
    id: 'cit-020',
    firstName: 'Paula',
    lastName: 'Herrera Montoya',
    documentNumber: '1.099.123.456',
    documentType: 'cedula',
    email: 'paula.herrera@email.co',
    phone: '+57 329 123 4567',
    department: 'Santander',
    city: 'Floridablanca',
    status: 'suspended',
    photoUrl: '',
    dateOfBirth: '1994-04-06',
    registeredAt: daysAgo(50),
    lastActiveAt: daysAgo(15),
    documentsCount: 2,
    verifiedDocuments: 1,
  },
  {
    id: 'cit-021',
    firstName: 'Felipe',
    lastName: 'Toro Echeverri',
    documentNumber: '1.002.345.678',
    documentType: 'cedula',
    email: 'felipe.toro@email.co',
    phone: '+57 330 234 5678',
    department: 'Atlántico',
    city: 'Soledad',
    status: 'verified',
    photoUrl: '',
    dateOfBirth: '1992-08-30',
    registeredAt: daysAgo(75),
    lastActiveAt: hoursAgo(7),
    documentsCount: 3,
    verifiedDocuments: 3,
  },
  {
    id: 'cit-022',
    firstName: 'Juliana',
    lastName: 'Orozco Bedoya',
    documentNumber: '1.013.456.789',
    documentType: 'cedula',
    email: 'juliana.orozco@email.co',
    phone: '+57 331 345 6789',
    department: 'Bolívar',
    city: 'Magangué',
    status: 'pending',
    photoUrl: '',
    dateOfBirth: '1996-06-17',
    registeredAt: daysAgo(0),
    lastActiveAt: minutesAgo(15),
    documentsCount: 1,
    verifiedDocuments: 0,
  },
  {
    id: 'cit-023',
    firstName: 'Tomás',
    lastName: 'Londoño Muñoz',
    documentNumber: '1.024.567.890',
    documentType: 'cedula',
    email: 'tomas.londono@email.co',
    phone: '+57 332 456 7890',
    department: 'Nariño',
    city: 'Tumaco',
    status: 'verified',
    photoUrl: '',
    dateOfBirth: '1987-02-12',
    registeredAt: daysAgo(160),
    lastActiveAt: daysAgo(4),
    documentsCount: 4,
    verifiedDocuments: 4,
  },
  {
    id: 'cit-024',
    firstName: 'Catalina',
    lastName: 'Bermúdez Arias',
    documentNumber: '1.035.678.901',
    documentType: 'cedula',
    email: 'catalina.bermudez@email.co',
    phone: '+57 333 567 8901',
    department: 'Boyacá',
    city: 'Duitama',
    status: 'verified',
    photoUrl: '',
    dateOfBirth: '1995-10-24',
    registeredAt: daysAgo(40),
    lastActiveAt: hoursAgo(9),
    documentsCount: 3,
    verifiedDocuments: 3,
  },
  {
    id: 'cit-025',
    firstName: 'Emilio',
    lastName: 'Vásquez Correa',
    documentNumber: '1.046.789.012',
    documentType: 'cedula',
    email: 'emilio.vasquez@email.co',
    phone: '+57 334 678 9012',
    department: 'Tolima',
    city: 'Espinal',
    status: 'rejected',
    photoUrl: '',
    dateOfBirth: '2000-03-08',
    registeredAt: daysAgo(5),
    lastActiveAt: daysAgo(3),
    documentsCount: 1,
    verifiedDocuments: 0,
  },
];

// ─── Activity Log ────────────────────────────────────────────────────────────

export const mockActivityLog: ActivityLogEntry[] = [
  {
    id: 'act-001',
    type: 'verification',
    citizenName: 'Carlos García Martínez',
    citizenId: 'cit-001',
    description: 'Identity verification completed successfully',
    timestamp: minutesAgo(12),
    metadata: { method: 'Biometric', confidence: '99.2%' },
  },
  {
    id: 'act-002',
    type: 'registration',
    citizenName: 'Juliana Orozco Bedoya',
    citizenId: 'cit-022',
    description: 'New citizen registration submitted',
    timestamp: minutesAgo(15),
  },
  {
    id: 'act-003',
    type: 'document_issued',
    citizenName: 'Ana Ramírez Torres',
    citizenId: 'cit-004',
    description: 'Cédula de Ciudadanía renewed and issued',
    timestamp: minutesAgo(28),
    metadata: { documentType: 'cedula', number: '1.067.890.123' },
  },
  {
    id: 'act-004',
    type: 'verification',
    citizenName: 'Valentina Castro Díaz',
    citizenId: 'cit-006',
    description: 'Document verification passed',
    timestamp: minutesAgo(45),
    metadata: { method: 'Document scan', confidence: '97.8%' },
  },
  {
    id: 'act-005',
    type: 'suspension',
    citizenName: 'Santiago Mejía Quintero',
    citizenId: 'cit-009',
    description: 'Account suspended due to suspicious activity',
    timestamp: hoursAgo(1),
    metadata: { reason: 'Multiple failed verifications' },
  },
  {
    id: 'act-006',
    type: 'document_issued',
    citizenName: 'Laura Gutiérrez Restrepo',
    citizenId: 'cit-010',
    description: 'Licencia de Conducción issued',
    timestamp: hoursAgo(2),
    metadata: { documentType: 'license', category: 'B1' },
  },
  {
    id: 'act-007',
    type: 'login',
    citizenName: 'Daniel Ospina Castaño',
    citizenId: 'cit-013',
    description: 'Admin login from new device',
    timestamp: hoursAgo(3),
    metadata: { device: 'Chrome / Windows', ip: '190.25.xxx.xxx' },
  },
  {
    id: 'act-008',
    type: 'profile_update',
    citizenName: 'Sofía Acevedo Parra',
    citizenId: 'cit-016',
    description: 'Profile information updated (address change)',
    timestamp: hoursAgo(4),
  },
  {
    id: 'act-009',
    type: 'registration',
    citizenName: 'Nicolás Cardona Yepes',
    citizenId: 'cit-017',
    description: 'New citizen registration submitted',
    timestamp: hoursAgo(5),
  },
  {
    id: 'act-010',
    type: 'document_revoked',
    citizenName: 'Paula Herrera Montoya',
    citizenId: 'cit-020',
    description: 'Health card revoked - expired EPS membership',
    timestamp: hoursAgo(6),
    metadata: { documentType: 'health_card' },
  },
  {
    id: 'act-011',
    type: 'verification',
    citizenName: 'Felipe Toro Echeverri',
    citizenId: 'cit-021',
    description: 'Biometric verification successful',
    timestamp: hoursAgo(8),
    metadata: { method: 'Fingerprint', confidence: '98.5%' },
  },
  {
    id: 'act-012',
    type: 'document_issued',
    citizenName: 'Catalina Bermúdez Arias',
    citizenId: 'cit-024',
    description: 'Tarjeta de Propiedad issued for vehicle',
    timestamp: hoursAgo(10),
    metadata: { documentType: 'vehicle', plate: 'ABC-123' },
  },
  {
    id: 'act-013',
    type: 'registration',
    citizenName: 'Andrés Vargas Ruiz',
    citizenId: 'cit-007',
    description: 'New citizen registration submitted',
    timestamp: daysAgo(1),
  },
  {
    id: 'act-014',
    type: 'verification',
    citizenName: 'Mariana Zuluaga Cano',
    citizenId: 'cit-018',
    description: 'Identity verification completed successfully',
    timestamp: daysAgo(1),
    metadata: { method: 'Video call', confidence: '96.3%' },
  },
  {
    id: 'act-015',
    type: 'document_issued',
    citizenName: 'Tomás Londoño Muñoz',
    citizenId: 'cit-023',
    description: 'Pasaporte renewal issued',
    timestamp: daysAgo(2),
    metadata: { documentType: 'passport' },
  },
];

// ─── Issued Documents ────────────────────────────────────────────────────────

export const mockIssuedDocuments: IssuedDocument[] = [
  {
    id: 'doc-001',
    citizenId: 'cit-001',
    citizenName: 'Carlos García Martínez',
    type: 'cedula',
    documentNumber: 'CC-1023456789',
    issuedAt: daysAgo(120),
    expiresAt: '2036-03-15T00:00:00Z',
    status: 'active',
    issuedBy: 'Registraduría Nacional',
  },
  {
    id: 'doc-002',
    citizenId: 'cit-001',
    citizenName: 'Carlos García Martínez',
    type: 'license',
    documentNumber: 'LIC-BOG-456789',
    issuedAt: daysAgo(90),
    expiresAt: '2031-06-15T00:00:00Z',
    status: 'active',
    issuedBy: 'Secretaría de Movilidad',
  },
  {
    id: 'doc-003',
    citizenId: 'cit-002',
    citizenName: 'María López Rodríguez',
    type: 'cedula',
    documentNumber: 'CC-1098765432',
    issuedAt: daysAgo(95),
    expiresAt: '2035-07-22T00:00:00Z',
    status: 'active',
    issuedBy: 'Registraduría Nacional',
  },
  {
    id: 'doc-004',
    citizenId: 'cit-002',
    citizenName: 'María López Rodríguez',
    type: 'passport',
    documentNumber: 'PA-CO-9876543',
    issuedAt: daysAgo(60),
    expiresAt: '2031-02-22T00:00:00Z',
    status: 'active',
    issuedBy: 'Cancillería',
  },
  {
    id: 'doc-005',
    citizenId: 'cit-004',
    citizenName: 'Ana Ramírez Torres',
    type: 'cedula',
    documentNumber: 'CC-1067890123',
    issuedAt: minutesAgo(28),
    expiresAt: '2036-01-30T00:00:00Z',
    status: 'active',
    issuedBy: 'Registraduría Nacional',
  },
  {
    id: 'doc-006',
    citizenId: 'cit-004',
    citizenName: 'Ana Ramírez Torres',
    type: 'health_card',
    documentNumber: 'EPS-SAL-890123',
    issuedAt: daysAgo(180),
    expiresAt: '2027-01-30T00:00:00Z',
    status: 'active',
    issuedBy: 'EPS Sura',
  },
  {
    id: 'doc-007',
    citizenId: 'cit-006',
    citizenName: 'Valentina Castro Díaz',
    type: 'cedula',
    documentNumber: 'CC-1034567890',
    issuedAt: daysAgo(60),
    expiresAt: '2033-09-03T00:00:00Z',
    status: 'active',
    issuedBy: 'Registraduría Nacional',
  },
  {
    id: 'doc-008',
    citizenId: 'cit-010',
    citizenName: 'Laura Gutiérrez Restrepo',
    type: 'license',
    documentNumber: 'LIC-TOL-123456',
    issuedAt: hoursAgo(2),
    expiresAt: '2031-02-28T00:00:00Z',
    status: 'active',
    issuedBy: 'Secretaría de Tránsito',
  },
  {
    id: 'doc-009',
    citizenId: 'cit-013',
    citizenName: 'Daniel Ospina Castaño',
    type: 'cedula',
    documentNumber: 'CC-1022456789',
    issuedAt: daysAgo(210),
    expiresAt: '2036-12-05T00:00:00Z',
    status: 'active',
    issuedBy: 'Registraduría Nacional',
  },
  {
    id: 'doc-010',
    citizenId: 'cit-020',
    citizenName: 'Paula Herrera Montoya',
    type: 'health_card',
    documentNumber: 'EPS-NUE-456789',
    issuedAt: daysAgo(200),
    expiresAt: '2026-01-06T00:00:00Z',
    status: 'revoked',
    issuedBy: 'EPS Nueva EPS',
  },
  {
    id: 'doc-011',
    citizenId: 'cit-023',
    citizenName: 'Tomás Londoño Muñoz',
    type: 'passport',
    documentNumber: 'PA-CO-2345678',
    issuedAt: daysAgo(2),
    expiresAt: '2036-02-12T00:00:00Z',
    status: 'active',
    issuedBy: 'Cancillería',
  },
  {
    id: 'doc-012',
    citizenId: 'cit-024',
    citizenName: 'Catalina Bermúdez Arias',
    type: 'cedula',
    documentNumber: 'CC-1035678901',
    issuedAt: daysAgo(40),
    expiresAt: '2035-10-24T00:00:00Z',
    status: 'active',
    issuedBy: 'Registraduría Nacional',
  },
  {
    id: 'doc-013',
    citizenId: 'cit-003',
    citizenName: 'Juan Hernández Pérez',
    type: 'cedula',
    documentNumber: 'CC-1045678901',
    issuedAt: daysAgo(3),
    expiresAt: '2036-11-08T00:00:00Z',
    status: 'pending',
    issuedBy: 'Registraduría Nacional',
  },
  {
    id: 'doc-014',
    citizenId: 'cit-009',
    citizenName: 'Santiago Mejía Quintero',
    type: 'military_id',
    documentNumber: 'LM-089012345',
    issuedAt: daysAgo(300),
    expiresAt: '2030-08-07T00:00:00Z',
    status: 'active',
    issuedBy: 'Ejército Nacional',
  },
  {
    id: 'doc-015',
    citizenId: 'cit-016',
    citizenName: 'Sofía Acevedo Parra',
    type: 'electoral',
    documentNumber: 'TE-1055789012',
    issuedAt: daysAgo(30),
    expiresAt: '2030-11-02T00:00:00Z',
    status: 'active',
    issuedBy: 'Registraduría Nacional',
  },
];

// ─── Analytics Data (30 days) ────────────────────────────────────────────────

export const mockAnalytics: DailyAnalytics[] = Array.from({ length: 30 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (29 - i));
  const dayOfWeek = d.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  const baseReg = isWeekend ? 8 : 18;
  const baseVer = isWeekend ? 12 : 30;
  const baseDoc = isWeekend ? 5 : 15;
  const baseActive = isWeekend ? 200 : 450;
  const baseApi = isWeekend ? 3000 : 8000;

  return {
    date: d.toISOString().split('T')[0],
    registrations: baseReg + Math.floor(Math.random() * 12),
    verifications: baseVer + Math.floor(Math.random() * 20),
    documentsIssued: baseDoc + Math.floor(Math.random() * 10),
    activeUsers: baseActive + Math.floor(Math.random() * 150),
    apiCalls: baseApi + Math.floor(Math.random() * 4000),
  };
});

// ─── Department Statistics ───────────────────────────────────────────────────

export const mockDepartmentStats: DepartmentStats[] = [
  { department: 'Bogotá D.C.', citizens: 12450, verificationRate: 94.2 },
  { department: 'Antioquia', citizens: 8320, verificationRate: 91.8 },
  { department: 'Valle del Cauca', citizens: 5680, verificationRate: 89.5 },
  { department: 'Cundinamarca', citizens: 3940, verificationRate: 92.1 },
  { department: 'Santander', citizens: 3210, verificationRate: 88.7 },
  { department: 'Atlántico', citizens: 2890, verificationRate: 87.3 },
  { department: 'Bolívar', citizens: 2340, verificationRate: 85.1 },
  { department: 'Nariño', citizens: 1870, verificationRate: 83.6 },
  { department: 'Boyacá', citizens: 1650, verificationRate: 90.4 },
  { department: 'Tolima', citizens: 1420, verificationRate: 86.9 },
  { department: 'Meta', citizens: 1180, verificationRate: 84.2 },
  { department: 'Caldas', citizens: 980, verificationRate: 91.0 },
  { department: 'Risaralda', citizens: 870, verificationRate: 89.8 },
  { department: 'Huila', citizens: 760, verificationRate: 87.5 },
  { department: 'Magdalena', citizens: 640, verificationRate: 82.1 },
];

// ─── System Health ───────────────────────────────────────────────────────────

export const mockSystemHealth: SystemHealth[] = [
  {
    service: 'Authentication Service',
    status: 'operational',
    uptime: 99.98,
    responseTime: 45,
    lastChecked: minutesAgo(1),
  },
  {
    service: 'Document Verification API',
    status: 'operational',
    uptime: 99.95,
    responseTime: 120,
    lastChecked: minutesAgo(1),
  },
  {
    service: 'Biometric Processing',
    status: 'operational',
    uptime: 99.90,
    responseTime: 230,
    lastChecked: minutesAgo(2),
  },
  {
    service: 'Database Cluster',
    status: 'operational',
    uptime: 99.99,
    responseTime: 12,
    lastChecked: minutesAgo(1),
  },
  {
    service: 'File Storage (S3)',
    status: 'degraded',
    uptime: 99.85,
    responseTime: 340,
    lastChecked: minutesAgo(1),
  },
  {
    service: 'Email / SMS Gateway',
    status: 'operational',
    uptime: 99.92,
    responseTime: 89,
    lastChecked: minutesAgo(3),
  },
  {
    service: 'QR Code Generator',
    status: 'operational',
    uptime: 99.97,
    responseTime: 35,
    lastChecked: minutesAgo(2),
  },
  {
    service: 'Registraduría Bridge',
    status: 'operational',
    uptime: 99.80,
    responseTime: 450,
    lastChecked: minutesAgo(5),
  },
];

// ─── Document Templates ──────────────────────────────────────────────────────

export const mockDocumentTemplates: DocumentTemplate[] = [
  {
    id: 'tmpl-001',
    name: 'Cédula de Ciudadanía',
    type: 'cedula',
    version: '3.2.1',
    lastUpdated: daysAgo(15),
    fieldsCount: 18,
    active: true,
  },
  {
    id: 'tmpl-002',
    name: 'Pasaporte Colombiano',
    type: 'passport',
    version: '2.1.0',
    lastUpdated: daysAgo(30),
    fieldsCount: 22,
    active: true,
  },
  {
    id: 'tmpl-003',
    name: 'Licencia de Conducción',
    type: 'license',
    version: '4.0.0',
    lastUpdated: daysAgo(7),
    fieldsCount: 15,
    active: true,
  },
  {
    id: 'tmpl-004',
    name: 'Carné de Salud (EPS)',
    type: 'health_card',
    version: '1.8.2',
    lastUpdated: daysAgo(45),
    fieldsCount: 12,
    active: true,
  },
  {
    id: 'tmpl-005',
    name: 'Libreta Militar',
    type: 'military_id',
    version: '2.0.1',
    lastUpdated: daysAgo(60),
    fieldsCount: 16,
    active: true,
  },
  {
    id: 'tmpl-006',
    name: 'Tarjeta Electoral',
    type: 'electoral',
    version: '1.5.0',
    lastUpdated: daysAgo(90),
    fieldsCount: 10,
    active: false,
  },
];

// ─── Audit Log ───────────────────────────────────────────────────────────────

export const mockAuditLog: AuditLogEntry[] = [
  {
    id: 'aud-001',
    action: 'USER_VERIFIED',
    performedBy: 'admin@wallet.gov.co',
    target: 'Carlos García Martínez (cit-001)',
    timestamp: minutesAgo(12),
    ipAddress: '190.25.100.42',
    details: 'Biometric verification approved with 99.2% confidence',
  },
  {
    id: 'aud-002',
    action: 'DOCUMENT_ISSUED',
    performedBy: 'admin@wallet.gov.co',
    target: 'Ana Ramírez Torres (cit-004)',
    timestamp: minutesAgo(28),
    ipAddress: '190.25.100.42',
    details: 'Cédula de Ciudadanía CC-1067890123 issued',
  },
  {
    id: 'aud-003',
    action: 'ACCOUNT_SUSPENDED',
    performedBy: 'admin@wallet.gov.co',
    target: 'Santiago Mejía Quintero (cit-009)',
    timestamp: hoursAgo(1),
    ipAddress: '190.25.100.42',
    details: 'Suspended for suspicious activity: multiple failed verifications',
  },
  {
    id: 'aud-004',
    action: 'DOCUMENT_REVOKED',
    performedBy: 'supervisor@wallet.gov.co',
    target: 'Paula Herrera Montoya (cit-020)',
    timestamp: hoursAgo(6),
    ipAddress: '190.25.100.85',
    details: 'Health card EPS-NUE-456789 revoked due to expired EPS membership',
  },
  {
    id: 'aud-005',
    action: 'SETTINGS_CHANGED',
    performedBy: 'admin@wallet.gov.co',
    target: 'System Configuration',
    timestamp: hoursAgo(8),
    ipAddress: '190.25.100.42',
    details: 'Email notification template updated for verification reminders',
  },
  {
    id: 'aud-006',
    action: 'API_KEY_ROTATED',
    performedBy: 'admin@wallet.gov.co',
    target: 'Registraduría Bridge API Key',
    timestamp: daysAgo(1),
    ipAddress: '190.25.100.42',
    details: 'API key rotated. Old key invalidated.',
  },
  {
    id: 'aud-007',
    action: 'ROLE_CHANGED',
    performedBy: 'admin@wallet.gov.co',
    target: 'supervisor@wallet.gov.co',
    timestamp: daysAgo(2),
    ipAddress: '190.25.100.42',
    details: 'Role upgraded from viewer to supervisor',
  },
  {
    id: 'aud-008',
    action: 'BULK_EXPORT',
    performedBy: 'supervisor@wallet.gov.co',
    target: 'Citizens Report',
    timestamp: daysAgo(3),
    ipAddress: '190.25.100.85',
    details: 'Exported 2,450 citizen records in CSV format',
  },
  {
    id: 'aud-009',
    action: 'TEMPLATE_UPDATED',
    performedBy: 'admin@wallet.gov.co',
    target: 'Licencia de Conducción Template',
    timestamp: daysAgo(7),
    ipAddress: '190.25.100.42',
    details: 'Updated to version 4.0.0 with new security features',
  },
  {
    id: 'aud-010',
    action: 'SYSTEM_MAINTENANCE',
    performedBy: 'system',
    target: 'Database Cluster',
    timestamp: daysAgo(10),
    ipAddress: '10.0.0.1',
    details: 'Scheduled maintenance: index optimization completed',
  },
];

// ─── Aggregated Stats ────────────────────────────────────────────────────────

export const mockDashboardStats = {
  totalCitizens: 48_732,
  activeCitizens: 42_156,
  totalDocuments: 134_891,
  activeDocuments: 128_450,
  verificationsToday: 347,
  verificationsThisWeek: 2_184,
  pendingRequests: 156,
  pendingVerifications: 89,
  rejectedToday: 12,
  successRate: 96.5,
  averageVerificationTime: '2m 34s',
  documentsIssuedToday: 78,
  documentsIssuedThisWeek: 534,
  newRegistrationsToday: 23,
  newRegistrationsThisWeek: 167,
};

// ─── Document Type Distribution ──────────────────────────────────────────────

export const mockDocTypeDistribution = [
  { type: 'Cédula de Ciudadanía', count: 45200, percentage: 33.5, color: '#003893' },
  { type: 'Licencia de Conducción', count: 28900, percentage: 21.4, color: '#FCD116' },
  { type: 'Carné de Salud (EPS)', count: 24300, percentage: 18.0, color: '#CE1126' },
  { type: 'Pasaporte', count: 18700, percentage: 13.9, color: '#1A5CC8' },
  { type: 'Libreta Militar', count: 11400, percentage: 8.5, color: '#6B7280' },
  { type: 'Tarjeta Electoral', count: 6391, percentage: 4.7, color: '#10B981' },
];

// ─── Verification Success Rate by Method ─────────────────────────────────────

export const mockVerificationMethods = [
  { method: 'Biometric (Fingerprint)', successRate: 98.7, totalAttempts: 15420 },
  { method: 'Facial Recognition', successRate: 96.3, totalAttempts: 12890 },
  { method: 'Document Scan (OCR)', successRate: 94.1, totalAttempts: 18340 },
  { method: 'Video Call', successRate: 99.1, totalAttempts: 3210 },
  { method: 'Knowledge-based', successRate: 87.5, totalAttempts: 8960 },
];

// ─── Admin Staff ──────────────────────────────────────────────────────────────

export interface AdminStaffMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'supervisor' | 'viewer';
  status: 'active' | 'inactive';
}

export const mockAdminStaff: AdminStaffMember[] = [
  {
    id: 'staff-001',
    firstName: 'Carlos',
    lastName: 'Ramírez',
    email: 'admin@wallet.gov.co',
    role: 'admin',
    status: 'active',
  },
  {
    id: 'staff-002',
    firstName: 'Laura',
    lastName: 'Hernández',
    email: 'supervisor@wallet.gov.co',
    role: 'supervisor',
    status: 'active',
  },
  {
    id: 'staff-003',
    firstName: 'Andrés',
    lastName: 'Ospina',
    email: 'viewer@wallet.gov.co',
    role: 'viewer',
    status: 'active',
  },
  {
    id: 'staff-004',
    firstName: 'María',
    lastName: 'Toro',
    email: 'maria.toro@wallet.gov.co',
    role: 'supervisor',
    status: 'inactive',
  },
];

// ─── Helpers for formatted display ───────────────────────────────────────────

export function formatNumber(n: number): string {
  return n.toLocaleString('es-CO');
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatRelativeTime(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60_000);
  const diffHr = Math.floor(diffMs / 3_600_000);
  const diffDay = Math.floor(diffMs / 86_400_000);

  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return formatDate(iso);
}

export function getStatusBadgeVariant(status: string): 'active' | 'pending' | 'expired' | 'revoked' | 'default' {
  switch (status) {
    case 'verified':
    case 'active':
      return 'active';
    case 'pending':
      return 'pending';
    case 'rejected':
    case 'expired':
      return 'expired';
    case 'suspended':
    case 'revoked':
      return 'revoked';
    default:
      return 'default';
  }
}

export function getDocumentTypeLabel(type: DocumentType): string {
  const labels: Record<DocumentType, string> = {
    cedula: 'Cédula de Ciudadanía',
    passport: 'Pasaporte',
    license: 'Licencia de Conducción',
    health_card: 'Carné de Salud',
    military_id: 'Libreta Militar',
    electoral: 'Tarjeta Electoral',
  };
  return labels[type] || type;
}

export function getActivityIcon(type: ActivityLogEntry['type']): string {
  const icons: Record<ActivityLogEntry['type'], string> = {
    verification: 'ShieldCheck',
    registration: 'UserPlus',
    document_issued: 'FileCheck',
    document_revoked: 'FileX',
    login: 'LogIn',
    profile_update: 'UserCog',
    suspension: 'Ban',
  };
  return icons[type];
}
