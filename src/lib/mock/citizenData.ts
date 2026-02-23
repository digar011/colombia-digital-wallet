// ─── Mock Data for Colombian Digital Wallet ─────────────────────────────────
// Realistic Colombian citizen data used during development before Supabase
// integration is complete.

// ─── Types ───────────────────────────────────────────────────────────────────

export interface CitizenProfile {
  id: string;
  firstName: string;
  secondName: string;
  firstLastName: string;
  secondLastName: string;
  fullName: string;
  documentType: 'CC' | 'CE' | 'TI' | 'PP';
  documentNumber: string;
  dateOfBirth: string;
  placeOfBirth: string;
  gender: 'M' | 'F';
  bloodType: string;
  rh: '+' | '-';
  email: string;
  phone: string;
  address: string;
  city: string;
  department: string;
  photoUrl: string | null;
  verified: boolean;
  lastVerified: string;
}

export interface DocumentRecord {
  id: string;
  type: 'identity' | 'license' | 'passport' | 'rut' | 'health' | 'vehicle' | 'child_id';
  category: 'identity' | 'vehicle' | 'tax' | 'health';
  name: string;
  shortName: string;
  documentNumber: string;
  issueDate: string;
  expiryDate: string | null;
  status: 'active' | 'valid' | 'expiring' | 'expired' | 'pending';
  authority: string;
  icon: string;
  lastUpdated: string;
}

export interface VehicleRecord {
  id: string;
  plate: string;
  type: 'car' | 'motorcycle' | 'truck';
  brand: string;
  model: string;
  year: number;
  color: string;
  engineCC: number;
  vin: string;
  ownerDocumentNumber: string;
  registrationNumber: string;
  registrationDate: string;
  soat: {
    policyNumber: string;
    insurer: string;
    startDate: string;
    expiryDate: string;
    status: 'active' | 'expiring' | 'expired';
  };
  technomechanical: {
    certificateNumber: string;
    center: string;
    inspectionDate: string;
    expiryDate: string;
    status: 'active' | 'expiring' | 'expired';
    result: 'approved' | 'rejected';
  };
  insurance: {
    policyNumber: string;
    company: string;
    type: string;
    expiryDate: string;
  } | null;
}

export interface HealthRecord {
  eps: {
    name: string;
    regime: 'Contributivo' | 'Subsidiado' | 'Especial';
    affiliationNumber: string;
    affiliationDate: string;
    status: 'active' | 'inactive';
    category: string;
    ipsAssigned: string;
  };
  sisben: {
    group: string;
    subgroup: string;
    score: number;
    lastUpdate: string;
    certificate: string;
  };
  vaccinations: VaccinationRecord[];
  allergies: string[];
  conditions: string[];
  bloodType: string;
  rh: '+' | '-';
}

export interface VaccinationRecord {
  id: string;
  name: string;
  disease: string;
  dose: string;
  date: string;
  lot: string;
  administeredBy: string;
  location: string;
  nextDue: string | null;
}

export interface FamilyMember {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  relationship: 'spouse' | 'child' | 'parent' | 'sibling';
  relationshipLabel: string;
  documentType: 'CC' | 'TI' | 'RC' | 'CE';
  documentNumber: string;
  dateOfBirth: string;
  gender: 'M' | 'F';
  linkedDate: string;
  photoUrl: string | null;
}

export interface WorkRecord {
  rut: {
    nit: string;
    verificationDigit: string;
    fullNit: string;
    registrationDate: string;
    lastUpdate: string;
    mainActivity: string;
    activityCode: string;
    regime: string;
    responsibilities: string[];
  };
  employment: {
    employer: string;
    employerNit: string;
    position: string;
    contractType: 'Indefinido' | 'Fijo' | 'Prestacion de Servicios' | 'Obra o Labor';
    startDate: string;
    salary: number;
    department: string;
  } | null;
  pension: {
    fund: string;
    type: string;
    affiliationNumber: string;
    weeksContributed: number;
  };
  arl: {
    name: string;
    riskLevel: number;
    affiliationNumber: string;
  };
  cesantias: {
    fund: string;
    balance: number;
    lastDeposit: string;
  };
  caja: {
    name: string;
    affiliationNumber: string;
    category: string;
  };
}

export interface SocialProgramRecord {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  enrollmentDate: string;
  authority: string;
  nextPaymentDate: string | null;
  lastPaymentAmount: number | null;
  lastPaymentDate: string | null;
  details: string;
}

export interface AppointmentRecord {
  id: string;
  title: string;
  entity: string;
  location: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  type: 'in-person' | 'virtual';
  reference: string;
  notes: string;
}

export interface NotificationRecord {
  id: string;
  type: 'warning' | 'info' | 'success' | 'urgent';
  title: string;
  message: string;
  date: string;
  read: boolean;
  actionUrl: string | null;
}

// ─── Mock Citizen Profile ────────────────────────────────────────────────────

export const mockCitizen: CitizenProfile = {
  id: 'ctz-001',
  firstName: 'Juan',
  secondName: 'Carlos',
  firstLastName: 'Rodriguez',
  secondLastName: 'Martinez',
  fullName: 'Juan Carlos Rodriguez Martinez',
  documentType: 'CC',
  documentNumber: '1234567890',
  dateOfBirth: '1990-03-15',
  placeOfBirth: 'Bogota D.C.',
  gender: 'M',
  bloodType: 'O',
  rh: '+',
  email: 'juan.rodriguez@email.com',
  phone: '+57 310 456 7890',
  address: 'Calle 72 #10-34, Apto 501',
  city: 'Bogota D.C.',
  department: 'Cundinamarca',
  photoUrl: null,
  verified: true,
  lastVerified: '2026-02-20T14:30:00Z',
};

// ─── Mock Documents ──────────────────────────────────────────────────────────

export const mockDocuments: DocumentRecord[] = [
  {
    id: 'doc-001',
    type: 'identity',
    category: 'identity',
    name: 'Cedula de Ciudadania',
    shortName: 'CC',
    documentNumber: '1234567890',
    issueDate: '2015-06-20',
    expiryDate: null,
    status: 'active',
    authority: 'Registraduria Nacional del Estado Civil',
    icon: 'id-card',
    lastUpdated: '2026-02-20T14:30:00Z',
  },
  {
    id: 'doc-002',
    type: 'license',
    category: 'vehicle',
    name: 'Licencia de Conduccion',
    shortName: 'B1',
    documentNumber: '1234567890',
    issueDate: '2021-03-10',
    expiryDate: '2031-03-10',
    status: 'active',
    authority: 'Ministerio de Transporte',
    icon: 'car',
    lastUpdated: '2026-01-15T10:00:00Z',
  },
  {
    id: 'doc-003',
    type: 'passport',
    category: 'identity',
    name: 'Pasaporte',
    shortName: 'PP',
    documentNumber: 'AO1234567',
    issueDate: '2023-08-01',
    expiryDate: '2033-08-01',
    status: 'active',
    authority: 'Cancilleria',
    icon: 'book-open',
    lastUpdated: '2023-08-01T09:00:00Z',
  },
  {
    id: 'doc-004',
    type: 'rut',
    category: 'tax',
    name: 'RUT',
    shortName: 'NIT',
    documentNumber: '1234567890-1',
    issueDate: '2015-09-01',
    expiryDate: null,
    status: 'active',
    authority: 'DIAN',
    icon: 'file-text',
    lastUpdated: '2026-01-20T08:00:00Z',
  },
  {
    id: 'doc-005',
    type: 'health',
    category: 'health',
    name: 'Carne de Afiliacion EPS',
    shortName: 'EPS',
    documentNumber: 'SURA-2024-789456',
    issueDate: '2024-01-01',
    expiryDate: '2026-12-31',
    status: 'active',
    authority: 'EPS Sura',
    icon: 'heart-pulse',
    lastUpdated: '2026-02-01T12:00:00Z',
  },
];

// ─── Mock Vehicles ───────────────────────────────────────────────────────────

export const mockVehicles: VehicleRecord[] = [
  {
    id: 'veh-001',
    plate: 'ABC-123',
    type: 'car',
    brand: 'Mazda',
    model: '3 Grand Touring',
    year: 2020,
    color: 'Gris Meteoro',
    engineCC: 2000,
    vin: '3MZBM1V76LM123456',
    ownerDocumentNumber: '1234567890',
    registrationNumber: 'RUNT-2020-654321',
    registrationDate: '2020-04-15',
    soat: {
      policyNumber: 'SOAT-2026-123456',
      insurer: 'Seguros del Estado',
      startDate: '2026-01-15',
      expiryDate: '2027-01-15',
      status: 'active',
    },
    technomechanical: {
      certificateNumber: 'RTM-2025-789012',
      center: 'CDA Nacional Autopista Norte',
      inspectionDate: '2025-11-20',
      expiryDate: '2026-11-20',
      status: 'active',
      result: 'approved',
    },
    insurance: {
      policyNumber: 'POL-AUTO-2026-5678',
      company: 'Sura Seguros',
      type: 'Todo Riesgo',
      expiryDate: '2026-08-30',
    },
  },
  {
    id: 'veh-002',
    plate: 'XYZ-789',
    type: 'motorcycle',
    brand: 'Yamaha',
    model: 'FZ 250',
    year: 2022,
    color: 'Negro',
    engineCC: 250,
    vin: 'JYARN33E9MA789012',
    ownerDocumentNumber: '1234567890',
    registrationNumber: 'RUNT-2022-112233',
    registrationDate: '2022-07-10',
    soat: {
      policyNumber: 'SOAT-2026-654321',
      insurer: 'La Equidad Seguros',
      startDate: '2025-12-01',
      expiryDate: '2026-12-01',
      status: 'active',
    },
    technomechanical: {
      certificateNumber: 'RTM-2025-345678',
      center: 'CDA Motos Express',
      inspectionDate: '2025-08-15',
      expiryDate: '2026-08-15',
      status: 'expiring',
      result: 'approved',
    },
    insurance: null,
  },
];

// ─── Mock Health Record ──────────────────────────────────────────────────────

export const mockHealth: HealthRecord = {
  eps: {
    name: 'EPS Sura',
    regime: 'Contributivo',
    affiliationNumber: 'SURA-2024-789456',
    affiliationDate: '2018-06-01',
    status: 'active',
    category: 'A',
    ipsAssigned: 'IPS Sura Calle 80, Bogota',
  },
  sisben: {
    group: 'B',
    subgroup: 'B4',
    score: 42.5,
    lastUpdate: '2025-09-15',
    certificate: 'SISBEN-IV-2025-123456',
  },
  vaccinations: [
    {
      id: 'vax-001',
      name: 'COVID-19 (Pfizer-BioNTech)',
      disease: 'COVID-19',
      dose: '1ra Dosis',
      date: '2021-07-20',
      lot: 'EW0182',
      administeredBy: 'Sec. Salud Bogota',
      location: 'Corferias, Bogota',
      nextDue: '2021-08-10',
    },
    {
      id: 'vax-002',
      name: 'COVID-19 (Pfizer-BioNTech)',
      disease: 'COVID-19',
      dose: '2da Dosis',
      date: '2021-08-10',
      lot: 'EW0195',
      administeredBy: 'Sec. Salud Bogota',
      location: 'Corferias, Bogota',
      nextDue: '2022-02-10',
    },
    {
      id: 'vax-003',
      name: 'COVID-19 (Pfizer-BioNTech)',
      disease: 'COVID-19',
      dose: 'Refuerzo',
      date: '2022-03-15',
      lot: 'FN4859',
      administeredBy: 'EPS Sura',
      location: 'IPS Sura Calle 80',
      nextDue: null,
    },
    {
      id: 'vax-004',
      name: 'Influenza Estacional',
      disease: 'Influenza',
      dose: 'Anual 2025',
      date: '2025-04-10',
      lot: 'INF2025-A',
      administeredBy: 'EPS Sura',
      location: 'IPS Sura Calle 80',
      nextDue: '2026-04-10',
    },
    {
      id: 'vax-005',
      name: 'Fiebre Amarilla',
      disease: 'Fiebre Amarilla',
      dose: 'Unica',
      date: '2019-01-20',
      lot: 'FA2019-042',
      administeredBy: 'Sec. Salud Bogota',
      location: 'Centro de Vacunacion Internacional',
      nextDue: null,
    },
    {
      id: 'vax-006',
      name: 'Tetanos-Difteria (Td)',
      disease: 'Tetanos / Difteria',
      dose: 'Refuerzo',
      date: '2023-06-05',
      lot: 'TD2023-118',
      administeredBy: 'EPS Sura',
      location: 'IPS Sura Calle 80',
      nextDue: '2033-06-05',
    },
    {
      id: 'vax-007',
      name: 'Hepatitis B',
      disease: 'Hepatitis B',
      dose: '3ra Dosis',
      date: '2015-11-10',
      lot: 'HB2015-003',
      administeredBy: 'IPS Colsanitas',
      location: 'Clinica Colsanitas Centro',
      nextDue: null,
    },
  ],
  allergies: ['Penicilina', 'Mariscos'],
  conditions: ['Astigmatismo'],
  bloodType: 'O',
  rh: '+',
};

// ─── Mock Family Members ─────────────────────────────────────────────────────

export const mockFamily: FamilyMember[] = [
  {
    id: 'fam-001',
    firstName: 'Maria',
    lastName: 'Lopez Herrera',
    fullName: 'Maria Lopez Herrera',
    relationship: 'spouse',
    relationshipLabel: 'Esposa',
    documentType: 'CC',
    documentNumber: '9876543210',
    dateOfBirth: '1991-07-22',
    gender: 'F',
    linkedDate: '2019-12-14',
    photoUrl: null,
  },
  {
    id: 'fam-002',
    firstName: 'Diego',
    lastName: 'Rodriguez Lopez',
    fullName: 'Diego Rodriguez Lopez',
    relationship: 'child',
    relationshipLabel: 'Hijo',
    documentType: 'TI',
    documentNumber: '1098765432',
    dateOfBirth: '2015-11-03',
    gender: 'M',
    linkedDate: '2015-11-03',
    photoUrl: null,
  },
  {
    id: 'fam-003',
    firstName: 'Sofia',
    lastName: 'Rodriguez Lopez',
    fullName: 'Sofia Rodriguez Lopez',
    relationship: 'child',
    relationshipLabel: 'Hija',
    documentType: 'RC',
    documentNumber: '1112233445',
    dateOfBirth: '2021-04-18',
    gender: 'F',
    linkedDate: '2021-04-18',
    photoUrl: null,
  },
];

// ─── Mock Work / Tax Record ──────────────────────────────────────────────────

export const mockWork: WorkRecord = {
  rut: {
    nit: '1234567890',
    verificationDigit: '1',
    fullNit: '1234567890-1',
    registrationDate: '2015-09-01',
    lastUpdate: '2026-01-20',
    mainActivity: 'Actividades de desarrollo de sistemas informaticos',
    activityCode: '6201',
    regime: 'Regimen Comun',
    responsibilities: [
      '05 - Impuesto de renta y complementario regimen ordinario',
      '07 - Retencion en la fuente a titulo de renta',
      '09 - Retencion en la fuente en el impuesto sobre las ventas',
      '14 - Informante de exogena',
    ],
  },
  employment: {
    employer: 'TechColombia SAS',
    employerNit: '900.123.456-7',
    position: 'Ingeniero de Software Senior',
    contractType: 'Indefinido',
    startDate: '2022-03-01',
    salary: 8500000,
    department: 'Tecnologia',
  },
  pension: {
    fund: 'Porvenir',
    type: 'Regimen de Ahorro Individual con Solidaridad (RAIS)',
    affiliationNumber: 'POR-2015-567890',
    weeksContributed: 520,
  },
  arl: {
    name: 'Sura ARL',
    riskLevel: 1,
    affiliationNumber: 'ARL-SURA-2022-345',
  },
  cesantias: {
    fund: 'Fondo Nacional del Ahorro',
    balance: 18750000,
    lastDeposit: '2026-02-14',
  },
  caja: {
    name: 'Compensar',
    affiliationNumber: 'COMP-2022-88901',
    category: 'A',
  },
};

// ─── Mock Social Programs ────────────────────────────────────────────────────

export const mockSocialPrograms: SocialProgramRecord[] = [
  {
    id: 'prog-001',
    name: 'Familias en Accion',
    status: 'active',
    enrollmentDate: '2023-03-01',
    authority: 'Departamento para la Prosperidad Social (DPS)',
    nextPaymentDate: '2026-03-15',
    lastPaymentAmount: 350000,
    lastPaymentDate: '2026-01-15',
    details: 'Incentivo de educacion para Diego Rodriguez Lopez (Grado 5to)',
  },
  {
    id: 'prog-002',
    name: 'SISBEN IV',
    status: 'active',
    enrollmentDate: '2025-09-15',
    authority: 'Departamento Nacional de Planeacion (DNP)',
    nextPaymentDate: null,
    lastPaymentAmount: null,
    lastPaymentDate: null,
    details: 'Clasificacion: Grupo B, Subgrupo B4 - Puntaje: 42.5',
  },
  {
    id: 'prog-003',
    name: 'Ingreso Solidario',
    status: 'inactive',
    enrollmentDate: '2020-04-15',
    authority: 'Departamento para la Prosperidad Social (DPS)',
    nextPaymentDate: null,
    lastPaymentAmount: 160000,
    lastPaymentDate: '2022-06-30',
    details: 'Programa finalizado. Recibio 27 pagos entre 2020 y 2022.',
  },
];

// ─── Mock Appointments ───────────────────────────────────────────────────────

export const mockAppointments: AppointmentRecord[] = [
  {
    id: 'apt-001',
    title: 'Declaracion de Renta 2025',
    entity: 'DIAN',
    location: 'Punto DIAN - Centro Comercial Gran Estacion, Bogota',
    date: '2026-03-05',
    time: '09:30',
    status: 'confirmed',
    type: 'in-person',
    reference: 'DIAN-CITA-2026-00789',
    notes: 'Llevar RUT impreso y ultima declaracion.',
  },
  {
    id: 'apt-002',
    title: 'Renovacion Licencia de Conduccion',
    entity: 'RUNT / Secretaria de Movilidad',
    location: 'SuperCADE Suba, Bogota',
    date: '2026-03-12',
    time: '14:00',
    status: 'pending',
    type: 'in-person',
    reference: 'MOV-CITA-2026-01234',
    notes: 'Examen medico requerido previamente. Llevar cedula original.',
  },
  {
    id: 'apt-003',
    title: 'Control Medico General',
    entity: 'EPS Sura',
    location: 'IPS Sura Calle 80, Bogota',
    date: '2026-02-28',
    time: '10:00',
    status: 'confirmed',
    type: 'in-person',
    reference: 'SURA-CITA-2026-04567',
    notes: 'Control anual. Llevar resultados de laboratorio.',
  },
  {
    id: 'apt-004',
    title: 'Consulta Tributaria Virtual',
    entity: 'DIAN',
    location: 'Virtual - Microsoft Teams',
    date: '2026-02-25',
    time: '11:00',
    status: 'confirmed',
    type: 'virtual',
    reference: 'DIAN-VIRTUAL-2026-00123',
    notes: 'Consulta sobre descuentos tributarios.',
  },
];

// ─── Mock Notifications ──────────────────────────────────────────────────────

export const mockNotifications: NotificationRecord[] = [
  {
    id: 'notif-001',
    type: 'warning',
    title: 'Revision tecnomecanica proxima a vencer',
    message:
      'La revision tecnomecanica de su motocicleta XYZ-789 vence el 15 de agosto de 2026. Agende su cita con anticipacion.',
    date: '2026-02-20T08:00:00Z',
    read: false,
    actionUrl: '/documents/vehicles',
  },
  {
    id: 'notif-002',
    type: 'info',
    title: 'Cita confirmada - DIAN',
    message:
      'Su cita para Declaracion de Renta 2025 ha sido confirmada para el 5 de marzo a las 9:30 AM en Gran Estacion.',
    date: '2026-02-19T15:30:00Z',
    read: false,
    actionUrl: '/services',
  },
  {
    id: 'notif-003',
    type: 'success',
    title: 'Pago Familias en Accion recibido',
    message:
      'Se ha realizado el pago correspondiente al bimestre enero-febrero 2026 por $350.000 COP.',
    date: '2026-01-15T10:00:00Z',
    read: true,
    actionUrl: '/services',
  },
  {
    id: 'notif-004',
    type: 'info',
    title: 'Actualizacion SISBEN IV',
    message:
      'Su encuesta SISBEN IV ha sido actualizada. Nuevo puntaje: 42.5 (Grupo B4).',
    date: '2025-09-15T12:00:00Z',
    read: true,
    actionUrl: '/services',
  },
  {
    id: 'notif-005',
    type: 'urgent',
    title: 'Cita medica manana',
    message:
      'Recuerde su control medico general manana 28 de febrero a las 10:00 AM en IPS Sura Calle 80.',
    date: '2026-02-27T18:00:00Z',
    read: false,
    actionUrl: '/services',
  },
];

// ─── Helper functions ────────────────────────────────────────────────────────

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Buenos dias';
  if (hour >= 12 && hour < 18) return 'Buenas tardes';
  return 'Buenas noches';
}

export function calculateAge(dateOfBirth: string): number {
  const today = new Date();
  const birth = new Date(dateOfBirth);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

export function getIdentityDocumentInfo(dateOfBirth: string): { title: string; shortName: string; prefix: string; isMinor: boolean } {
  const isMinor = calculateAge(dateOfBirth) < 18;
  return {
    title: isMinor ? 'Tarjeta de Identidad' : 'Cedula de Ciudadania',
    shortName: isMinor ? 'TI' : 'CC',
    prefix: isMinor ? 'TI' : 'CC',
    isMinor,
  };
}

export function formatCOPCurrency(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatColombianDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return new Intl.DateTimeFormat('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function formatShortDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function daysUntil(dateStr: string): number {
  const target = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = target.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function getUnreadNotificationCount(): number {
  return mockNotifications.filter((n) => !n.read).length;
}

export function getUpcomingAppointments(): AppointmentRecord[] {
  const today = new Date().toISOString().split('T')[0];
  return mockAppointments
    .filter((a) => a.date >= today && a.status !== 'cancelled')
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function getActivePrograms(): SocialProgramRecord[] {
  return mockSocialPrograms.filter((p) => p.status === 'active');
}
