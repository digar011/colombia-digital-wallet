// ─── Mock Data for Agency Portal ────────────────────────────────────────────
// Comprehensive mock data for the agency-side portal where government agencies
// manage documents, citizens, verification requests, and internal operations.
// All text content is in Spanish with realistic Colombian data.

// ─── Agency Key Type ────────────────────────────────────────────────────────

export type AgencyKey = 'identity' | 'vehicles' | 'tax' | 'health' | 'socialServices' | 'technology';

// ─── Agency Metadata (mirrors colombia.json agencies) ───────────────────────

export const AGENCY_LABELS: Record<AgencyKey, { name: string; shortName: string }> = {
  identity: { name: 'Registraduría Nacional del Estado Civil', shortName: 'RNEC' },
  vehicles: { name: 'Registro Único Nacional de Tránsito', shortName: 'RUNT' },
  tax: { name: 'Dirección de Impuestos y Aduanas Nacionales', shortName: 'DIAN' },
  health: { name: 'Administradora de los Recursos del SGSSS', shortName: 'ADRES' },
  socialServices: { name: 'Departamento para la Prosperidad Social', shortName: 'DPS' },
  technology: { name: 'Ministerio de TIC', shortName: 'MinTIC' },
};

// ─── Types ──────────────────────────────────────────────────────────────────

export interface AgencyStaffUser {
  id: string;
  agencyKey: AgencyKey;
  countryId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'director' | 'operator' | 'viewer';
  department: string;
  lastLogin: string;
  isActive: boolean;
}

export interface AgencyDocument {
  id: string;
  agencyKey: AgencyKey;
  citizenName: string;
  citizenDocNumber: string;
  documentType: string;
  documentNumber: string;
  status: 'issued' | 'pending' | 'revoked' | 'expired';
  issuedDate: string;
  expiryDate: string | null;
  issuedBy: string;
  notes: string;
}

export interface VerificationRequest {
  id: string;
  agencyKey: AgencyKey;
  citizenName: string;
  citizenDocNumber: string;
  requestType: 'identity_verify' | 'document_issue' | 'document_renew' | 'status_check';
  status: 'pending' | 'approved' | 'rejected' | 'in_review';
  requestDate: string;
  resolvedDate: string | null;
  resolvedBy: string | null;
  priority: 'high' | 'medium' | 'low';
  notes: string;
}

export interface AgencyStats {
  agencyKey: AgencyKey;
  totalDocumentsIssued: number;
  documentsThisMonth: number;
  pendingRequests: number;
  averageProcessingTime: string;
  citizensServed: number;
  verificationSuccessRate: number;
  monthlyTrend: { month: string; count: number }[];
}

export interface AgencyActivity {
  id: string;
  agencyKey: AgencyKey;
  action: string;
  description: string;
  user: string;
  timestamp: string;
  type: 'issue' | 'verify' | 'revoke' | 'update' | 'system';
}

// ─── Helpers for relative timestamps ────────────────────────────────────────

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

// ─── Mock Agency Staff (12 members — 2 per agency, Colombia) ────────────────

export const mockAgencyStaff: AgencyStaffUser[] = [
  // ── Registraduría Nacional (identity) ──
  {
    id: 'staff-001',
    agencyKey: 'identity',
    countryId: 'CO',
    firstName: 'Patricia',
    lastName: 'Mendoza Castillo',
    email: 'p.mendoza@registraduria.gov.co',
    role: 'director',
    department: 'Dirección de Identificación',
    lastLogin: hoursAgo(1),
    isActive: true,
  },
  {
    id: 'staff-002',
    agencyKey: 'identity',
    countryId: 'CO',
    firstName: 'Héctor',
    lastName: 'Rojas Peña',
    email: 'h.rojas@registraduria.gov.co',
    role: 'operator',
    department: 'Oficina de Cedulación',
    lastLogin: hoursAgo(3),
    isActive: true,
  },

  // ── RUNT (vehicles) ──
  {
    id: 'staff-003',
    agencyKey: 'vehicles',
    countryId: 'CO',
    firstName: 'Fernando',
    lastName: 'Cárdenas Gutiérrez',
    email: 'f.cardenas@runt.com.co',
    role: 'director',
    department: 'Dirección de Registro Vehicular',
    lastLogin: hoursAgo(2),
    isActive: true,
  },
  {
    id: 'staff-004',
    agencyKey: 'vehicles',
    countryId: 'CO',
    firstName: 'Lorena',
    lastName: 'Quintero Salazar',
    email: 'l.quintero@runt.com.co',
    role: 'operator',
    department: 'Sección de Licencias de Conducción',
    lastLogin: daysAgo(1),
    isActive: true,
  },

  // ── DIAN (tax) ──
  {
    id: 'staff-005',
    agencyKey: 'tax',
    countryId: 'CO',
    firstName: 'Ricardo',
    lastName: 'Velásquez Parra',
    email: 'r.velasquez@dian.gov.co',
    role: 'director',
    department: 'Subdirección de Recaudo y Cobranzas',
    lastLogin: minutesAgo(45),
    isActive: true,
  },
  {
    id: 'staff-006',
    agencyKey: 'tax',
    countryId: 'CO',
    firstName: 'Claudia',
    lastName: 'Bermúdez Ríos',
    email: 'c.bermudez@dian.gov.co',
    role: 'operator',
    department: 'División de RUT y Obligaciones Tributarias',
    lastLogin: hoursAgo(5),
    isActive: true,
  },

  // ── ADRES (health) ──
  {
    id: 'staff-007',
    agencyKey: 'health',
    countryId: 'CO',
    firstName: 'Adriana',
    lastName: 'Morales Vargas',
    email: 'a.morales@adres.gov.co',
    role: 'director',
    department: 'Dirección de Aseguramiento en Salud',
    lastLogin: hoursAgo(4),
    isActive: true,
  },
  {
    id: 'staff-008',
    agencyKey: 'health',
    countryId: 'CO',
    firstName: 'Javier',
    lastName: 'Ospina Torres',
    email: 'j.ospina@adres.gov.co',
    role: 'viewer',
    department: 'Oficina de Auditoría de Afiliaciones',
    lastLogin: daysAgo(2),
    isActive: false,
  },

  // ── DPS (socialServices) ──
  {
    id: 'staff-009',
    agencyKey: 'socialServices',
    countryId: 'CO',
    firstName: 'Gloria',
    lastName: 'Restrepo Henao',
    email: 'g.restrepo@prosperidadsocial.gov.co',
    role: 'director',
    department: 'Dirección de Transferencias Monetarias Condicionadas',
    lastLogin: hoursAgo(6),
    isActive: true,
  },
  {
    id: 'staff-010',
    agencyKey: 'socialServices',
    countryId: 'CO',
    firstName: 'Óscar',
    lastName: 'Duarte Caicedo',
    email: 'o.duarte@prosperidadsocial.gov.co',
    role: 'operator',
    department: 'División de Inclusión Productiva',
    lastLogin: daysAgo(1),
    isActive: true,
  },

  // ── MinTIC (technology) ──
  {
    id: 'staff-011',
    agencyKey: 'technology',
    countryId: 'CO',
    firstName: 'Carolina',
    lastName: 'Pinzón Acosta',
    email: 'c.pinzon@mintic.gov.co',
    role: 'director',
    department: 'Dirección de Gobierno Digital',
    lastLogin: minutesAgo(20),
    isActive: true,
  },
  {
    id: 'staff-012',
    agencyKey: 'technology',
    countryId: 'CO',
    firstName: 'Andrés',
    lastName: 'Lozano Mejía',
    email: 'a.lozano@mintic.gov.co',
    role: 'operator',
    department: 'Subdirección de Estándares y Arquitectura TI',
    lastLogin: hoursAgo(8),
    isActive: true,
  },
];

// ─── Mock Agency Documents (30 — 5 per agency) ─────────────────────────────

export const mockAgencyDocuments: AgencyDocument[] = [
  // ── identity (Registraduría) ──
  {
    id: 'adoc-001',
    agencyKey: 'identity',
    citizenName: 'Carlos Alberto García Martínez',
    citizenDocNumber: '1023456789',
    documentType: 'Cédula de Ciudadanía',
    documentNumber: 'CC-1023456789',
    status: 'issued',
    issuedDate: '2024-06-15',
    expiryDate: null,
    issuedBy: 'Patricia Mendoza Castillo',
    notes: 'Expedición por primera vez. Biometría verificada satisfactoriamente.',
  },
  {
    id: 'adoc-002',
    agencyKey: 'identity',
    citizenName: 'María Fernanda López Rodríguez',
    citizenDocNumber: '1098765432',
    documentType: 'Cédula de Ciudadanía',
    documentNumber: 'CC-1098765432',
    status: 'issued',
    issuedDate: '2023-11-20',
    expiryDate: null,
    issuedBy: 'Héctor Rojas Peña',
    notes: 'Renovación por cambio de nombre. Documentos soporte verificados.',
  },
  {
    id: 'adoc-003',
    agencyKey: 'identity',
    citizenName: 'Andrés Felipe Vargas Ruiz',
    citizenDocNumber: '1056789012',
    documentType: 'Pasaporte',
    documentNumber: 'AO5678901',
    status: 'pending',
    issuedDate: '2026-02-18',
    expiryDate: '2036-02-18',
    issuedBy: 'Patricia Mendoza Castillo',
    notes: 'Solicitud en trámite. Pendiente pago de derechos consulares.',
  },
  {
    id: 'adoc-004',
    agencyKey: 'identity',
    citizenName: 'Valentina Castro Díaz',
    citizenDocNumber: '1034567890',
    documentType: 'Tarjeta de Identidad',
    documentNumber: 'TI-1034567890',
    status: 'expired',
    issuedDate: '2011-09-03',
    expiryDate: '2025-09-03',
    issuedBy: 'Héctor Rojas Peña',
    notes: 'Documento vencido. Ciudadana cumplió mayoría de edad; debe tramitar CC.',
  },
  {
    id: 'adoc-005',
    agencyKey: 'identity',
    citizenName: 'Diego Alejandro Moreno Sánchez',
    citizenDocNumber: '1012345678',
    documentType: 'Cédula de Ciudadanía',
    documentNumber: 'CC-1012345678',
    status: 'revoked',
    issuedDate: '2020-05-14',
    expiryDate: null,
    issuedBy: 'Patricia Mendoza Castillo',
    notes: 'Revocada por suplantación de identidad confirmada. Caso remitido a Fiscalía.',
  },

  // ── vehicles (RUNT) ──
  {
    id: 'adoc-006',
    agencyKey: 'vehicles',
    citizenName: 'Juan Pablo Hernández Pérez',
    citizenDocNumber: '1045678901',
    documentType: 'Licencia de Conducción',
    documentNumber: 'LIC-B1-1045678901',
    status: 'issued',
    issuedDate: '2025-03-10',
    expiryDate: '2035-03-10',
    issuedBy: 'Fernando Cárdenas Gutiérrez',
    notes: 'Categoría B1 — Vehículos particulares. Examen médico y teórico aprobado.',
  },
  {
    id: 'adoc-007',
    agencyKey: 'vehicles',
    citizenName: 'Ana Lucía Ramírez Torres',
    citizenDocNumber: '1067890123',
    documentType: 'Tarjeta de Propiedad',
    documentNumber: 'RUNT-TP-2024-654321',
    status: 'issued',
    issuedDate: '2024-04-15',
    expiryDate: null,
    issuedBy: 'Lorena Quintero Salazar',
    notes: 'Vehículo Mazda 3, placa ABC-123. Traspaso registrado correctamente.',
  },
  {
    id: 'adoc-008',
    agencyKey: 'vehicles',
    citizenName: 'Sebastián Ríos Valencia',
    citizenDocNumber: '1001234567',
    documentType: 'SOAT',
    documentNumber: 'SOAT-2026-789012',
    status: 'issued',
    issuedDate: '2026-01-10',
    expiryDate: '2027-01-10',
    issuedBy: 'Lorena Quintero Salazar',
    notes: 'Póliza SOAT para motocicleta Yamaha FZ 250, placa XYZ-789.',
  },
  {
    id: 'adoc-009',
    agencyKey: 'vehicles',
    citizenName: 'Laura Patricia Gutiérrez Restrepo',
    citizenDocNumber: '1090123456',
    documentType: 'Licencia de Conducción',
    documentNumber: 'LIC-A2-1090123456',
    status: 'expired',
    issuedDate: '2016-02-28',
    expiryDate: '2026-02-28',
    issuedBy: 'Fernando Cárdenas Gutiérrez',
    notes: 'Categoría A2. Licencia vencida; ciudadana debe presentar examen médico actualizado.',
  },
  {
    id: 'adoc-010',
    agencyKey: 'vehicles',
    citizenName: 'Daniel Esteban Ospina Castaño',
    citizenDocNumber: '1022456789',
    documentType: 'Revisión Técnico-Mecánica',
    documentNumber: 'RTM-2025-456789',
    status: 'pending',
    issuedDate: '2026-02-20',
    expiryDate: '2027-02-20',
    issuedBy: 'Lorena Quintero Salazar',
    notes: 'Pendiente de resultado final del CDA. Inspección programada para mañana.',
  },

  // ── tax (DIAN) ──
  {
    id: 'adoc-011',
    agencyKey: 'tax',
    citizenName: 'Carlos Alberto García Martínez',
    citizenDocNumber: '1023456789',
    documentType: 'RUT',
    documentNumber: 'NIT-1023456789-1',
    status: 'issued',
    issuedDate: '2018-09-01',
    expiryDate: null,
    issuedBy: 'Ricardo Velásquez Parra',
    notes: 'Actividad económica: 6201 — Desarrollo de sistemas informáticos. Régimen Común.',
  },
  {
    id: 'adoc-012',
    agencyKey: 'tax',
    citizenName: 'Sofía Acevedo Parra',
    citizenDocNumber: '1055789012',
    documentType: 'RUT',
    documentNumber: 'NIT-1055789012-3',
    status: 'issued',
    issuedDate: '2022-01-15',
    expiryDate: null,
    issuedBy: 'Claudia Bermúdez Ríos',
    notes: 'Persona natural. Responsable de IVA. Actualización de dirección registrada.',
  },
  {
    id: 'adoc-013',
    agencyKey: 'tax',
    citizenName: 'Felipe Antonio Toro Echeverri',
    citizenDocNumber: '1002345678',
    documentType: 'Certificado de Declaración de Renta',
    documentNumber: 'DIAN-DR-2025-001234',
    status: 'issued',
    issuedDate: '2025-08-10',
    expiryDate: null,
    issuedBy: 'Ricardo Velásquez Parra',
    notes: 'Declaración año gravable 2024. Impuesto a cargo: $2.340.000 COP.',
  },
  {
    id: 'adoc-014',
    agencyKey: 'tax',
    citizenName: 'Gabriela Duarte Mendieta',
    citizenDocNumber: '1033567890',
    documentType: 'RUT',
    documentNumber: 'NIT-1033567890-7',
    status: 'pending',
    issuedDate: '2026-02-19',
    expiryDate: null,
    issuedBy: 'Claudia Bermúdez Ríos',
    notes: 'Solicitud de inscripción al RUT. Pendiente verificación de domicilio fiscal.',
  },
  {
    id: 'adoc-015',
    agencyKey: 'tax',
    citizenName: 'Mateo Salazar Bernal',
    citizenDocNumber: '1044678901',
    documentType: 'Certificado de Ingresos y Retenciones',
    documentNumber: 'DIAN-CIR-2025-005678',
    status: 'revoked',
    issuedDate: '2025-03-20',
    expiryDate: null,
    issuedBy: 'Ricardo Velásquez Parra',
    notes: 'Revocado por inconsistencias en la información reportada por el empleador.',
  },

  // ── health (ADRES) ──
  {
    id: 'adoc-016',
    agencyKey: 'health',
    citizenName: 'María Fernanda López Rodríguez',
    citizenDocNumber: '1098765432',
    documentType: 'Carné de Afiliación EPS',
    documentNumber: 'EPS-SURA-2024-789456',
    status: 'issued',
    issuedDate: '2024-01-01',
    expiryDate: '2026-12-31',
    issuedBy: 'Adriana Morales Vargas',
    notes: 'Régimen Contributivo. EPS Sura. IPS asignada: IPS Sura Calle 80, Bogotá.',
  },
  {
    id: 'adoc-017',
    agencyKey: 'health',
    citizenName: 'Camila Andrea Jiménez Ortiz',
    citizenDocNumber: '1078901234',
    documentType: 'Certificado de Afiliación al SGSSS',
    documentNumber: 'ADRES-CERT-2026-003456',
    status: 'issued',
    issuedDate: '2026-01-15',
    expiryDate: '2026-07-15',
    issuedBy: 'Javier Ospina Torres',
    notes: 'Régimen Subsidiado. EPS Mutual Ser. Válido para trámites de movilidad.',
  },
  {
    id: 'adoc-018',
    agencyKey: 'health',
    citizenName: 'Nicolás Cardona Yepes',
    citizenDocNumber: '1066890123',
    documentType: 'Carné de Vacunación COVID-19',
    documentNumber: 'MINSALUD-VAX-2022-098765',
    status: 'issued',
    issuedDate: '2022-03-15',
    expiryDate: null,
    issuedBy: 'Adriana Morales Vargas',
    notes: 'Esquema completo: 2 dosis Pfizer + 1 refuerzo. Registrado en PAIWEB.',
  },
  {
    id: 'adoc-019',
    agencyKey: 'health',
    citizenName: 'Paula Andrea Herrera Montoya',
    citizenDocNumber: '1099123456',
    documentType: 'Carné de Afiliación EPS',
    documentNumber: 'EPS-NUEVAEPS-2023-567890',
    status: 'revoked',
    issuedDate: '2023-06-01',
    expiryDate: '2025-12-31',
    issuedBy: 'Adriana Morales Vargas',
    notes: 'Desafiliación por mora en pago de aportes superior a 6 meses. Aplica período de protección.',
  },
  {
    id: 'adoc-020',
    agencyKey: 'health',
    citizenName: 'Tomás Alejandro Londoño Muñoz',
    citizenDocNumber: '1024567890',
    documentType: 'Certificado SISBEN IV',
    documentNumber: 'SISBEN-IV-2025-123456',
    status: 'pending',
    issuedDate: '2026-02-10',
    expiryDate: null,
    issuedBy: 'Javier Ospina Torres',
    notes: 'Encuesta domiciliaria realizada. Pendiente clasificación por DNP. Grupo estimado: B.',
  },

  // ── socialServices (DPS) ──
  {
    id: 'adoc-021',
    agencyKey: 'socialServices',
    citizenName: 'Juliana Orozco Bedoya',
    citizenDocNumber: '1013456789',
    documentType: 'Certificado Familias en Acción',
    documentNumber: 'DPS-FA-2025-001234',
    status: 'issued',
    issuedDate: '2025-03-01',
    expiryDate: '2026-12-31',
    issuedBy: 'Gloria Restrepo Henao',
    notes: 'Beneficiaria con 2 hijos en edad escolar. Incentivo de educación bimestral.',
  },
  {
    id: 'adoc-022',
    agencyKey: 'socialServices',
    citizenName: 'Emilio Vásquez Correa',
    citizenDocNumber: '1046789012',
    documentType: 'Certificado Colombia Mayor',
    documentNumber: 'DPS-CM-2024-005678',
    status: 'issued',
    issuedDate: '2024-07-01',
    expiryDate: null,
    issuedBy: 'Óscar Duarte Caicedo',
    notes: 'Adulto mayor de 65 años. Subsidio económico mensual de $80.000 COP.',
  },
  {
    id: 'adoc-023',
    agencyKey: 'socialServices',
    citizenName: 'Catalina Bermúdez Arias',
    citizenDocNumber: '1035678901',
    documentType: 'Certificado Jóvenes en Acción',
    documentNumber: 'DPS-JA-2025-009012',
    status: 'issued',
    issuedDate: '2025-02-15',
    expiryDate: '2027-02-15',
    issuedBy: 'Gloria Restrepo Henao',
    notes: 'Estudiante universitaria en SENA. Transferencia condicionada por asistencia.',
  },
  {
    id: 'adoc-024',
    agencyKey: 'socialServices',
    citizenName: 'Alejandro Prieto Gómez',
    citizenDocNumber: '1088012345',
    documentType: 'Certificado Ingreso Solidario',
    documentNumber: 'DPS-IS-2022-003456',
    status: 'expired',
    issuedDate: '2020-04-15',
    expiryDate: '2022-06-30',
    issuedBy: 'Óscar Duarte Caicedo',
    notes: 'Programa finalizado. Total de 27 pagos realizados durante vigencia COVID-19.',
  },
  {
    id: 'adoc-025',
    agencyKey: 'socialServices',
    citizenName: 'Mariana Zuluaga Cano',
    citizenDocNumber: '1077901234',
    documentType: 'Inscripción Renta Ciudadana',
    documentNumber: 'DPS-RC-2026-007890',
    status: 'pending',
    issuedDate: '2026-02-05',
    expiryDate: null,
    issuedBy: 'Gloria Restrepo Henao',
    notes: 'Solicitud en validación cruzada con SISBEN IV y BDUA. Prioridad alta.',
  },

  // ── technology (MinTIC) ──
  {
    id: 'adoc-026',
    agencyKey: 'technology',
    citizenName: 'Carlos Alberto García Martínez',
    citizenDocNumber: '1023456789',
    documentType: 'Certificado de Firma Digital',
    documentNumber: 'MINTIC-FD-2025-001234',
    status: 'issued',
    issuedDate: '2025-06-01',
    expiryDate: '2027-06-01',
    issuedBy: 'Carolina Pinzón Acosta',
    notes: 'Firma digital emitida por entidad de certificación acreditada. Vigencia 2 años.',
  },
  {
    id: 'adoc-027',
    agencyKey: 'technology',
    citizenName: 'Sofía Acevedo Parra',
    citizenDocNumber: '1055789012',
    documentType: 'Certificado de Autenticación Digital',
    documentNumber: 'MINTIC-AD-2026-005678',
    status: 'issued',
    issuedDate: '2026-01-10',
    expiryDate: '2028-01-10',
    issuedBy: 'Andrés Lozano Mejía',
    notes: 'Autenticación para trámites en línea ante entidades del Estado colombiano.',
  },
  {
    id: 'adoc-028',
    agencyKey: 'technology',
    citizenName: 'Daniel Esteban Ospina Castaño',
    citizenDocNumber: '1022456789',
    documentType: 'Registro Ciudadanía Digital',
    documentNumber: 'MINTIC-CD-2024-009012',
    status: 'issued',
    issuedDate: '2024-09-15',
    expiryDate: null,
    issuedBy: 'Carolina Pinzón Acosta',
    notes: 'Registro único en la plataforma de Gobierno Digital. Nivel de autenticación: Alto.',
  },
  {
    id: 'adoc-029',
    agencyKey: 'technology',
    citizenName: 'Isabella Pineda Arango',
    citizenDocNumber: '1011345678',
    documentType: 'Certificado de Firma Digital',
    documentNumber: 'MINTIC-FD-2024-003456',
    status: 'expired',
    issuedDate: '2022-08-20',
    expiryDate: '2024-08-20',
    issuedBy: 'Andrés Lozano Mejía',
    notes: 'Certificado de firma digital vencido. Se requiere renovación para continuar operando.',
  },
  {
    id: 'adoc-030',
    agencyKey: 'technology',
    citizenName: 'Santiago Mejía Quintero',
    citizenDocNumber: '1089012345',
    documentType: 'Solicitud Carpeta Ciudadana Digital',
    documentNumber: 'MINTIC-CCD-2026-007890',
    status: 'pending',
    issuedDate: '2026-02-12',
    expiryDate: null,
    issuedBy: 'Carolina Pinzón Acosta',
    notes: 'Solicitud de creación de carpeta ciudadana digital. Pendiente validación de identidad.',
  },
];

// ─── Mock Verification Requests (18 — 3 per agency) ────────────────────────

export const mockVerificationRequests: VerificationRequest[] = [
  // ── identity ──
  {
    id: 'vreq-001',
    agencyKey: 'identity',
    citizenName: 'Jorge Luis Peña Acosta',
    citizenDocNumber: '1087654321',
    requestType: 'identity_verify',
    status: 'pending',
    requestDate: hoursAgo(3),
    resolvedDate: null,
    resolvedBy: null,
    priority: 'high',
    notes: 'Verificación biométrica solicitada por entidad bancaria. Requiere respuesta en 24 horas.',
  },
  {
    id: 'vreq-002',
    agencyKey: 'identity',
    citizenName: 'Sandra Milena Arias Gómez',
    citizenDocNumber: '1076543210',
    requestType: 'document_renew',
    status: 'approved',
    requestDate: daysAgo(5),
    resolvedDate: daysAgo(2),
    resolvedBy: 'Patricia Mendoza Castillo',
    priority: 'medium',
    notes: 'Renovación de cédula por deterioro. Aprobada tras verificación dactilar.',
  },
  {
    id: 'vreq-003',
    agencyKey: 'identity',
    citizenName: 'Roberto Enrique Castro Flórez',
    citizenDocNumber: '1065432109',
    requestType: 'document_issue',
    status: 'rejected',
    requestDate: daysAgo(10),
    resolvedDate: daysAgo(7),
    resolvedBy: 'Héctor Rojas Peña',
    priority: 'low',
    notes: 'Solicitud rechazada. Documentos soporte incompletos: falta registro civil de nacimiento.',
  },

  // ── vehicles ──
  {
    id: 'vreq-004',
    agencyKey: 'vehicles',
    citizenName: 'Miguel Ángel Suárez Correa',
    citizenDocNumber: '1054321098',
    requestType: 'document_issue',
    status: 'in_review',
    requestDate: hoursAgo(6),
    resolvedDate: null,
    resolvedBy: null,
    priority: 'medium',
    notes: 'Solicitud de primera licencia categoría C1. En revisión de exámenes médicos y teóricos.',
  },
  {
    id: 'vreq-005',
    agencyKey: 'vehicles',
    citizenName: 'Natalia Esperanza Rincón Díaz',
    citizenDocNumber: '1043210987',
    requestType: 'document_renew',
    status: 'approved',
    requestDate: daysAgo(3),
    resolvedDate: daysAgo(1),
    resolvedBy: 'Fernando Cárdenas Gutiérrez',
    priority: 'low',
    notes: 'Renovación de licencia B1 aprobada. Examen médico vigente hasta 2030.',
  },
  {
    id: 'vreq-006',
    agencyKey: 'vehicles',
    citizenName: 'Iván Darío Garzón Beltrán',
    citizenDocNumber: '1032109876',
    requestType: 'status_check',
    status: 'pending',
    requestDate: hoursAgo(1),
    resolvedDate: null,
    resolvedBy: null,
    priority: 'high',
    notes: 'Consulta de estado de traspaso vehicular. Ciudadano reporta demora de 15 días hábiles.',
  },

  // ── tax ──
  {
    id: 'vreq-007',
    agencyKey: 'tax',
    citizenName: 'Carmen Elena Fuentes Pardo',
    citizenDocNumber: '1021098765',
    requestType: 'document_issue',
    status: 'approved',
    requestDate: daysAgo(7),
    resolvedDate: daysAgo(4),
    resolvedBy: 'Claudia Bermúdez Ríos',
    priority: 'medium',
    notes: 'Inscripción al RUT aprobada. Actividad: comercio al por menor. Régimen Simplificado.',
  },
  {
    id: 'vreq-008',
    agencyKey: 'tax',
    citizenName: 'Esteban Mauricio Torres León',
    citizenDocNumber: '1010987654',
    requestType: 'identity_verify',
    status: 'in_review',
    requestDate: hoursAgo(12),
    resolvedDate: null,
    resolvedBy: null,
    priority: 'high',
    notes: 'Verificación de identidad para actualización de representante legal en RUT. Prioridad alta por cierre fiscal.',
  },
  {
    id: 'vreq-009',
    agencyKey: 'tax',
    citizenName: 'Diana Marcela Ruiz Calderón',
    citizenDocNumber: '1009876543',
    requestType: 'status_check',
    status: 'rejected',
    requestDate: daysAgo(14),
    resolvedDate: daysAgo(12),
    resolvedBy: 'Ricardo Velásquez Parra',
    priority: 'low',
    notes: 'Consulta sobre estado de devolución de saldo a favor. Rechazada: NIT no coincide con solicitante.',
  },

  // ── health ──
  {
    id: 'vreq-010',
    agencyKey: 'health',
    citizenName: 'Liliana Patricia Ortega Salinas',
    citizenDocNumber: '1098765432',
    requestType: 'document_renew',
    status: 'pending',
    requestDate: hoursAgo(8),
    resolvedDate: null,
    resolvedBy: null,
    priority: 'medium',
    notes: 'Renovación de carné EPS por cambio de régimen (Subsidiado a Contributivo).',
  },
  {
    id: 'vreq-011',
    agencyKey: 'health',
    citizenName: 'Fabián Arturo Camacho Nieto',
    citizenDocNumber: '1087654321',
    requestType: 'identity_verify',
    status: 'approved',
    requestDate: daysAgo(4),
    resolvedDate: daysAgo(2),
    resolvedBy: 'Adriana Morales Vargas',
    priority: 'high',
    notes: 'Verificación de identidad para traslado de EPS. Aprobada con cruce de BDUA.',
  },
  {
    id: 'vreq-012',
    agencyKey: 'health',
    citizenName: 'Yolanda del Carmen Herrera Peña',
    citizenDocNumber: '1076543210',
    requestType: 'status_check',
    status: 'in_review',
    requestDate: daysAgo(1),
    resolvedDate: null,
    resolvedBy: null,
    priority: 'low',
    notes: 'Consulta de estado de afiliación al SGSSS. Multiafiliación detectada, en proceso de depuración.',
  },

  // ── socialServices ──
  {
    id: 'vreq-013',
    agencyKey: 'socialServices',
    citizenName: 'Luz Marina Cortés Vega',
    citizenDocNumber: '1065432109',
    requestType: 'document_issue',
    status: 'pending',
    requestDate: hoursAgo(4),
    resolvedDate: null,
    resolvedBy: null,
    priority: 'high',
    notes: 'Solicitud de inscripción a Familias en Acción. SISBEN IV grupo A5. Prioridad por vulnerabilidad.',
  },
  {
    id: 'vreq-014',
    agencyKey: 'socialServices',
    citizenName: 'Hernán Darío Zapata Montoya',
    citizenDocNumber: '1054321098',
    requestType: 'status_check',
    status: 'approved',
    requestDate: daysAgo(6),
    resolvedDate: daysAgo(3),
    resolvedBy: 'Óscar Duarte Caicedo',
    priority: 'medium',
    notes: 'Consulta sobre estado de pago de Colombia Mayor. Verificado: pago programado para 15 de marzo.',
  },
  {
    id: 'vreq-015',
    agencyKey: 'socialServices',
    citizenName: 'Rosa Elvira Manrique Soto',
    citizenDocNumber: '1043210987',
    requestType: 'document_renew',
    status: 'rejected',
    requestDate: daysAgo(8),
    resolvedDate: daysAgo(5),
    resolvedBy: 'Gloria Restrepo Henao',
    priority: 'low',
    notes: 'Renovación de inscripción denegada. Ingresos del hogar superan el umbral del programa.',
  },

  // ── technology ──
  {
    id: 'vreq-016',
    agencyKey: 'technology',
    citizenName: 'Álvaro José Marín Piedrahíta',
    citizenDocNumber: '1032109876',
    requestType: 'document_issue',
    status: 'in_review',
    requestDate: hoursAgo(2),
    resolvedDate: null,
    resolvedBy: null,
    priority: 'medium',
    notes: 'Solicitud de firma digital para persona jurídica. Verificando representación legal.',
  },
  {
    id: 'vreq-017',
    agencyKey: 'technology',
    citizenName: 'Claudia Milena Ossa Jaramillo',
    citizenDocNumber: '1021098765',
    requestType: 'identity_verify',
    status: 'approved',
    requestDate: daysAgo(3),
    resolvedDate: daysAgo(1),
    resolvedBy: 'Andrés Lozano Mejía',
    priority: 'high',
    notes: 'Verificación de identidad para nivel alto en Carpeta Ciudadana Digital. Biometría exitosa.',
  },
  {
    id: 'vreq-018',
    agencyKey: 'technology',
    citizenName: 'Pedro Nel Gallego Flórez',
    citizenDocNumber: '1010987654',
    requestType: 'document_renew',
    status: 'pending',
    requestDate: daysAgo(1),
    resolvedDate: null,
    resolvedBy: null,
    priority: 'low',
    notes: 'Renovación de certificado de firma digital. Certificado anterior vence en 30 días.',
  },
];

// ─── Mock Agency Stats (6 — one per agency) ────────────────────────────────

export const mockAgencyStats: AgencyStats[] = [
  {
    agencyKey: 'identity',
    totalDocumentsIssued: 148_350,
    documentsThisMonth: 3_245,
    pendingRequests: 187,
    averageProcessingTime: '3.2 días',
    citizensServed: 142_800,
    verificationSuccessRate: 96.8,
    monthlyTrend: [
      { month: 'Sep 2025', count: 2890 },
      { month: 'Oct 2025', count: 3120 },
      { month: 'Nov 2025', count: 2980 },
      { month: 'Dic 2025', count: 2450 },
      { month: 'Ene 2026', count: 3540 },
      { month: 'Feb 2026', count: 3245 },
    ],
  },
  {
    agencyKey: 'vehicles',
    totalDocumentsIssued: 89_720,
    documentsThisMonth: 1_876,
    pendingRequests: 124,
    averageProcessingTime: '2.1 días',
    citizensServed: 78_450,
    verificationSuccessRate: 94.3,
    monthlyTrend: [
      { month: 'Sep 2025', count: 1650 },
      { month: 'Oct 2025', count: 1780 },
      { month: 'Nov 2025', count: 1920 },
      { month: 'Dic 2025', count: 1340 },
      { month: 'Ene 2026', count: 2100 },
      { month: 'Feb 2026', count: 1876 },
    ],
  },
  {
    agencyKey: 'tax',
    totalDocumentsIssued: 215_490,
    documentsThisMonth: 5_670,
    pendingRequests: 342,
    averageProcessingTime: '1.8 días',
    citizensServed: 198_300,
    verificationSuccessRate: 97.5,
    monthlyTrend: [
      { month: 'Sep 2025', count: 4230 },
      { month: 'Oct 2025', count: 4890 },
      { month: 'Nov 2025', count: 5120 },
      { month: 'Dic 2025', count: 3780 },
      { month: 'Ene 2026', count: 6240 },
      { month: 'Feb 2026', count: 5670 },
    ],
  },
  {
    agencyKey: 'health',
    totalDocumentsIssued: 176_830,
    documentsThisMonth: 4_120,
    pendingRequests: 256,
    averageProcessingTime: '2.8 días',
    citizensServed: 165_200,
    verificationSuccessRate: 93.1,
    monthlyTrend: [
      { month: 'Sep 2025', count: 3450 },
      { month: 'Oct 2025', count: 3780 },
      { month: 'Nov 2025', count: 3920 },
      { month: 'Dic 2025', count: 3100 },
      { month: 'Ene 2026', count: 4350 },
      { month: 'Feb 2026', count: 4120 },
    ],
  },
  {
    agencyKey: 'socialServices',
    totalDocumentsIssued: 67_450,
    documentsThisMonth: 1_540,
    pendingRequests: 478,
    averageProcessingTime: '5.4 días',
    citizensServed: 62_100,
    verificationSuccessRate: 89.7,
    monthlyTrend: [
      { month: 'Sep 2025', count: 1230 },
      { month: 'Oct 2025', count: 1350 },
      { month: 'Nov 2025', count: 1180 },
      { month: 'Dic 2025', count: 1450 },
      { month: 'Ene 2026', count: 1620 },
      { month: 'Feb 2026', count: 1540 },
    ],
  },
  {
    agencyKey: 'technology',
    totalDocumentsIssued: 42_890,
    documentsThisMonth: 1_230,
    pendingRequests: 95,
    averageProcessingTime: '1.5 días',
    citizensServed: 39_500,
    verificationSuccessRate: 98.2,
    monthlyTrend: [
      { month: 'Sep 2025', count: 890 },
      { month: 'Oct 2025', count: 980 },
      { month: 'Nov 2025', count: 1050 },
      { month: 'Dic 2025', count: 780 },
      { month: 'Ene 2026', count: 1340 },
      { month: 'Feb 2026', count: 1230 },
    ],
  },
];

// ─── Mock Agency Activities (24 — 4 per agency) ────────────────────────────

export const mockAgencyActivities: AgencyActivity[] = [
  // ── identity ──
  {
    id: 'aact-001',
    agencyKey: 'identity',
    action: 'Expedición de cédula',
    description: 'Se expidió cédula de ciudadanía CC-1023456789 para Carlos Alberto García Martínez.',
    user: 'Patricia Mendoza Castillo',
    timestamp: minutesAgo(15),
    type: 'issue',
  },
  {
    id: 'aact-002',
    agencyKey: 'identity',
    action: 'Verificación biométrica',
    description: 'Verificación dactilar exitosa para Sandra Milena Arias Gómez. Confianza: 99.1%.',
    user: 'Héctor Rojas Peña',
    timestamp: hoursAgo(2),
    type: 'verify',
  },
  {
    id: 'aact-003',
    agencyKey: 'identity',
    action: 'Revocación de documento',
    description: 'Se revocó cédula CC-1012345678 por suplantación de identidad confirmada.',
    user: 'Patricia Mendoza Castillo',
    timestamp: hoursAgo(6),
    type: 'revoke',
  },
  {
    id: 'aact-004',
    agencyKey: 'identity',
    action: 'Actualización de sistema',
    description: 'Actualización del módulo de captura biométrica a versión 4.2.1. Sin interrupciones.',
    user: 'Sistema',
    timestamp: daysAgo(1),
    type: 'system',
  },

  // ── vehicles ──
  {
    id: 'aact-005',
    agencyKey: 'vehicles',
    action: 'Emisión de licencia',
    description: 'Licencia de conducción categoría B1 expedida para Juan Pablo Hernández Pérez.',
    user: 'Fernando Cárdenas Gutiérrez',
    timestamp: minutesAgo(30),
    type: 'issue',
  },
  {
    id: 'aact-006',
    agencyKey: 'vehicles',
    action: 'Verificación de SOAT',
    description: 'Validación de póliza SOAT-2026-789012 para vehículo placa XYZ-789. Vigente.',
    user: 'Lorena Quintero Salazar',
    timestamp: hoursAgo(4),
    type: 'verify',
  },
  {
    id: 'aact-007',
    agencyKey: 'vehicles',
    action: 'Actualización de registro',
    description: 'Traspaso de vehículo placa ABC-123 registrado. Nuevo propietario: Ana Lucía Ramírez Torres.',
    user: 'Lorena Quintero Salazar',
    timestamp: hoursAgo(8),
    type: 'update',
  },
  {
    id: 'aact-008',
    agencyKey: 'vehicles',
    action: 'Mantenimiento programado',
    description: 'Sincronización de base de datos RUNT con el Ministerio de Transporte completada.',
    user: 'Sistema',
    timestamp: daysAgo(1),
    type: 'system',
  },

  // ── tax ──
  {
    id: 'aact-009',
    agencyKey: 'tax',
    action: 'Expedición de RUT',
    description: 'RUT expedido para Carmen Elena Fuentes Pardo. NIT: 1021098765-4. Régimen Simplificado.',
    user: 'Claudia Bermúdez Ríos',
    timestamp: minutesAgo(45),
    type: 'issue',
  },
  {
    id: 'aact-010',
    agencyKey: 'tax',
    action: 'Verificación de identidad',
    description: 'Verificación de representante legal para actualización de RUT en proceso.',
    user: 'Ricardo Velásquez Parra',
    timestamp: hoursAgo(3),
    type: 'verify',
  },
  {
    id: 'aact-011',
    agencyKey: 'tax',
    action: 'Revocación de certificado',
    description: 'Certificado de ingresos DIAN-CIR-2025-005678 revocado por inconsistencias.',
    user: 'Ricardo Velásquez Parra',
    timestamp: hoursAgo(10),
    type: 'revoke',
  },
  {
    id: 'aact-012',
    agencyKey: 'tax',
    action: 'Actualización masiva',
    description: 'Actualización de responsabilidades tributarias para 1.250 contribuyentes del periodo 2025.',
    user: 'Sistema',
    timestamp: daysAgo(2),
    type: 'system',
  },

  // ── health ──
  {
    id: 'aact-013',
    agencyKey: 'health',
    action: 'Emisión de carné EPS',
    description: 'Carné de afiliación EPS-SURA-2024-789456 emitido para María Fernanda López Rodríguez.',
    user: 'Adriana Morales Vargas',
    timestamp: hoursAgo(1),
    type: 'issue',
  },
  {
    id: 'aact-014',
    agencyKey: 'health',
    action: 'Verificación de afiliación',
    description: 'Cruce exitoso con BDUA para traslado de EPS de Fabián Arturo Camacho Nieto.',
    user: 'Adriana Morales Vargas',
    timestamp: hoursAgo(5),
    type: 'verify',
  },
  {
    id: 'aact-015',
    agencyKey: 'health',
    action: 'Desafiliación',
    description: 'Carné EPS-NUEVAEPS-2023-567890 revocado por mora. Ciudadana: Paula Andrea Herrera Montoya.',
    user: 'Javier Ospina Torres',
    timestamp: hoursAgo(12),
    type: 'revoke',
  },
  {
    id: 'aact-016',
    agencyKey: 'health',
    action: 'Depuración de BDUA',
    description: 'Proceso de depuración de multiafiliaciones completado. 342 registros corregidos.',
    user: 'Sistema',
    timestamp: daysAgo(1),
    type: 'system',
  },

  // ── socialServices ──
  {
    id: 'aact-017',
    agencyKey: 'socialServices',
    action: 'Inscripción a programa',
    description: 'Juliana Orozco Bedoya inscrita en Familias en Acción. 2 hijos beneficiarios.',
    user: 'Gloria Restrepo Henao',
    timestamp: hoursAgo(2),
    type: 'issue',
  },
  {
    id: 'aact-018',
    agencyKey: 'socialServices',
    action: 'Verificación de cumplimiento',
    description: 'Verificación de corresponsabilidades de educación para ciclo enero-febrero 2026.',
    user: 'Óscar Duarte Caicedo',
    timestamp: hoursAgo(7),
    type: 'verify',
  },
  {
    id: 'aact-019',
    agencyKey: 'socialServices',
    action: 'Actualización de beneficiarios',
    description: 'Actualización masiva de listado de beneficiarios Colombia Mayor — Marzo 2026.',
    user: 'Gloria Restrepo Henao',
    timestamp: daysAgo(1),
    type: 'update',
  },
  {
    id: 'aact-020',
    agencyKey: 'socialServices',
    action: 'Cruce de bases de datos',
    description: 'Cruce automático SISBEN IV - BDUA - PILA completado. 89 nuevos beneficiarios identificados.',
    user: 'Sistema',
    timestamp: daysAgo(2),
    type: 'system',
  },

  // ── technology ──
  {
    id: 'aact-021',
    agencyKey: 'technology',
    action: 'Emisión de firma digital',
    description: 'Certificado de firma digital MINTIC-FD-2025-001234 emitido para Carlos Alberto García Martínez.',
    user: 'Carolina Pinzón Acosta',
    timestamp: minutesAgo(20),
    type: 'issue',
  },
  {
    id: 'aact-022',
    agencyKey: 'technology',
    action: 'Verificación de identidad digital',
    description: 'Verificación biométrica para nivel alto en Carpeta Ciudadana Digital. Ciudadana: Claudia Milena Ossa Jaramillo.',
    user: 'Andrés Lozano Mejía',
    timestamp: hoursAgo(3),
    type: 'verify',
  },
  {
    id: 'aact-023',
    agencyKey: 'technology',
    action: 'Actualización de plataforma',
    description: 'Módulo de autenticación digital actualizado a OAuth 2.1. Mejora en seguridad de tokens.',
    user: 'Carolina Pinzón Acosta',
    timestamp: hoursAgo(9),
    type: 'update',
  },
  {
    id: 'aact-024',
    agencyKey: 'technology',
    action: 'Monitoreo de servicios',
    description: 'Reporte de disponibilidad de servicios GOV.CO: 99.97% uptime en últimas 24 horas.',
    user: 'Sistema',
    timestamp: daysAgo(1),
    type: 'system',
  },
];

// ─── Helper Functions ───────────────────────────────────────────────────────

/**
 * Returns all agency-related data filtered by agency key.
 */
export interface AgencyDocumentType {
  id: string;
  label: string;
  shortLabel: string;
}

const agencyDocumentTypes: Record<AgencyKey, AgencyDocumentType[]> = {
  identity: [
    { id: 'cc', label: 'Cedula de Ciudadania', shortLabel: 'CC' },
    { id: 'ti', label: 'Tarjeta de Identidad', shortLabel: 'TI' },
    { id: 'ce', label: 'Cedula de Extranjeria', shortLabel: 'CE' },
    { id: 'rc', label: 'Registro Civil', shortLabel: 'RC' },
  ],
  vehicles: [
    { id: 'lic', label: 'Licencia de Conduccion', shortLabel: 'LIC' },
    { id: 'runt', label: 'Registro RUNT', shortLabel: 'RUNT' },
    { id: 'soat', label: 'SOAT', shortLabel: 'SOAT' },
    { id: 'rtm', label: 'Revision Tecnomecanica', shortLabel: 'RTM' },
  ],
  tax: [
    { id: 'rut', label: 'RUT', shortLabel: 'RUT' },
    { id: 'ct', label: 'Certificado Tributario', shortLabel: 'CT' },
    { id: 'dr', label: 'Declaracion de Renta', shortLabel: 'DR' },
    { id: 'fe', label: 'Factura Electronica', shortLabel: 'FE' },
  ],
  health: [
    { id: 'eps', label: 'Carne de Afiliacion EPS', shortLabel: 'EPS' },
    { id: 'vac', label: 'Certificado de Vacunacion', shortLabel: 'VAC' },
    { id: 'hc', label: 'Historia Clinica Digital', shortLabel: 'HC' },
    { id: 'sis', label: 'Certificado SISBEN', shortLabel: 'SIS' },
  ],
  socialServices: [
    { id: 'sisben', label: 'Certificado SISBEN IV', shortLabel: 'SIS' },
    { id: 'fam', label: 'Inscripcion Familias en Accion', shortLabel: 'FAM' },
    { id: 'is', label: 'Ingreso Solidario', shortLabel: 'IS' },
    { id: 'cm', label: 'Colombia Mayor', shortLabel: 'CM' },
  ],
  technology: [
    { id: 'cd', label: 'Certificado Digital', shortLabel: 'CD' },
    { id: 'fe', label: 'Firma Electronica', shortLabel: 'FE' },
    { id: 'gov', label: 'Autenticacion Gov.co', shortLabel: 'GOV' },
    { id: 'sd', label: 'Sello Digital', shortLabel: 'SD' },
  ],
};

export interface AgencyData {
  label: { name: string; shortName: string } | null;
  documents: AgencyDocument[];
  requests: VerificationRequest[];
  stats: AgencyStats | null;
  activities: AgencyActivity[];
  documentTypes: AgencyDocumentType[];
}

export function getAgencyDataByKey(agencyKey: string): AgencyData {
  return {
    label: AGENCY_LABELS[agencyKey as AgencyKey] || null,
    documents: mockAgencyDocuments.filter((d) => d.agencyKey === agencyKey),
    requests: mockVerificationRequests.filter((r) => r.agencyKey === agencyKey),
    stats: mockAgencyStats.find((s) => s.agencyKey === agencyKey) || null,
    activities: mockAgencyActivities.filter((a) => a.agencyKey === agencyKey),
    documentTypes: agencyDocumentTypes[agencyKey as AgencyKey] || [],
  };
}

/**
 * Returns staff members for a given agency key.
 */
export function getAgencyStaffByKey(agencyKey: string): AgencyStaffUser[] {
  return mockAgencyStaff.filter((s) => s.agencyKey === agencyKey);
}

/**
 * Formats a date string in es-CO locale (e.g. "15 de febrero de 2026").
 */
export function formatAgencyDate(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

/**
 * Formats a date-time string in es-CO locale with time.
 */
export function formatAgencyDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * Returns a human-readable relative time string in Spanish.
 */
export function formatAgencyRelativeTime(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60_000);
  const diffHr = Math.floor(diffMs / 3_600_000);
  const diffDay = Math.floor(diffMs / 86_400_000);

  if (diffMin < 1) return 'Justo ahora';
  if (diffMin < 60) return `Hace ${diffMin} min`;
  if (diffHr < 24) return `Hace ${diffHr}h`;
  if (diffDay < 7) return `Hace ${diffDay} día${diffDay > 1 ? 's' : ''}`;
  return formatAgencyDate(dateStr);
}

/**
 * Returns all agency keys.
 */
export function getAllAgencyKeys(): AgencyKey[] {
  return ['identity', 'vehicles', 'tax', 'health', 'socialServices', 'technology'];
}

/**
 * Checks whether a given string is a valid AgencyKey.
 */
export function isValidAgencyKey(key: string): key is AgencyKey {
  return getAllAgencyKeys().includes(key as AgencyKey);
}

/**
 * Returns a status label in Spanish for document/request statuses.
 */
export function getAgencyStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    issued: 'Expedido',
    pending: 'Pendiente',
    revoked: 'Revocado',
    expired: 'Vencido',
    approved: 'Aprobado',
    rejected: 'Rechazado',
    in_review: 'En revisión',
  };
  return labels[status] || status;
}

/**
 * Returns a Badge-compatible variant for status badge styling.
 * Maps to BadgeStatus: 'active' | 'valid' | 'pending' | 'expiring' | 'expired' | 'revoked' | 'info' | 'default'
 */
export function getAgencyStatusVariant(
  status: string
): 'active' | 'pending' | 'revoked' | 'expired' | 'info' | 'default' {
  switch (status) {
    case 'issued':
    case 'approved':
      return 'active';
    case 'pending':
    case 'in_review':
      return 'pending';
    case 'revoked':
    case 'rejected':
      return 'revoked';
    case 'expired':
      return 'expired';
    default:
      return 'default';
  }
}

/**
 * Returns a priority label in Spanish.
 */
export function getPriorityLabel(priority: 'high' | 'medium' | 'low'): string {
  const labels: Record<string, string> = {
    high: 'Alta',
    medium: 'Media',
    low: 'Baja',
  };
  return labels[priority];
}

/**
 * Returns an activity type label in Spanish.
 */
export function getActivityTypeLabel(type: AgencyActivity['type']): string {
  const labels: Record<AgencyActivity['type'], string> = {
    issue: 'Expedición',
    verify: 'Verificación',
    revoke: 'Revocación',
    update: 'Actualización',
    system: 'Sistema',
  };
  return labels[type];
}

/**
 * Returns a request type label in Spanish.
 */
export function getRequestTypeLabel(type: VerificationRequest['requestType']): string {
  const labels: Record<VerificationRequest['requestType'], string> = {
    identity_verify: 'Verificación de identidad',
    document_issue: 'Expedición de documento',
    document_renew: 'Renovación de documento',
    status_check: 'Consulta de estado',
  };
  return labels[type];
}

// ─── Format number with locale ──────────────────────────────────────────────

export function formatNumber(n: number): string {
  return new Intl.NumberFormat('es-CO').format(n);
}

// ─── Agency Analytics Data ──────────────────────────────────────────────────

export interface AgencyAnalyticsData {
  documentsIssued: number;
  documentsTrend: number;
  verificationsCompleted: number;
  verificationsTrend: number;
  approvalRate: number;
  approvalTrend: number;
  averageTime: string;
  averageTimeTrend: number;
  monthlyEmissions: { month: string; count: number }[];
  documentTypes: { type: string; count: number; percentage: number; color: string }[];
  successRates: { type: string; rate: number; total: number }[];
  departmentDistribution: { department: string; count: number }[];
}

export const agencyAnalytics: Record<AgencyKey, AgencyAnalyticsData> = {
  identity: {
    documentsIssued: 18420,
    documentsTrend: 5.2,
    verificationsCompleted: 12340,
    verificationsTrend: 3.8,
    approvalRate: 96.4,
    approvalTrend: 1.2,
    averageTime: '1.8 días',
    averageTimeTrend: -4.5,
    monthlyEmissions: [
      { month: 'Sep', count: 2800 }, { month: 'Oct', count: 3100 },
      { month: 'Nov', count: 2950 }, { month: 'Dic', count: 3400 },
      { month: 'Ene', count: 3020 }, { month: 'Feb', count: 3150 },
    ],
    documentTypes: [
      { type: 'Cédula de Ciudadanía', count: 12400, percentage: 67, color: '#003893' },
      { type: 'Tarjeta de Identidad', count: 3200, percentage: 17, color: '#16A34A' },
      { type: 'Cédula de Extranjería', count: 1800, percentage: 10, color: '#EAB308' },
      { type: 'Registro Civil', count: 1020, percentage: 6, color: '#DC2626' },
    ],
    successRates: [
      { type: 'Expedición primera vez', rate: 97, total: 8200 },
      { type: 'Renovación', rate: 98, total: 5400 },
      { type: 'Duplicado', rate: 95, total: 3100 },
      { type: 'Corrección de datos', rate: 89, total: 1720 },
    ],
    departmentDistribution: [
      { department: 'Cundinamarca', count: 4200 }, { department: 'Antioquia', count: 3100 },
      { department: 'Valle del Cauca', count: 2400 }, { department: 'Atlántico', count: 1800 },
      { department: 'Santander', count: 1500 }, { department: 'Bolívar', count: 1200 },
      { department: 'Nariño', count: 980 }, { department: 'Tolima', count: 850 },
    ],
  },
  vehicles: {
    documentsIssued: 9850,
    documentsTrend: 7.1,
    verificationsCompleted: 6200,
    verificationsTrend: 4.3,
    approvalRate: 91.2,
    approvalTrend: -0.5,
    averageTime: '3.2 días',
    averageTimeTrend: -2.1,
    monthlyEmissions: [
      { month: 'Sep', count: 1400 }, { month: 'Oct', count: 1600 },
      { month: 'Nov', count: 1550 }, { month: 'Dic', count: 1700 },
      { month: 'Ene', count: 1750 }, { month: 'Feb', count: 1850 },
    ],
    documentTypes: [
      { type: 'Licencia de Conducción', count: 5200, percentage: 53, color: '#003893' },
      { type: 'Registro RUNT', count: 2800, percentage: 28, color: '#16A34A' },
      { type: 'SOAT', count: 1200, percentage: 12, color: '#EAB308' },
      { type: 'Revisión Tecnomecánica', count: 650, percentage: 7, color: '#DC2626' },
    ],
    successRates: [
      { type: 'Expedición licencia', rate: 88, total: 4100 },
      { type: 'Renovación licencia', rate: 95, total: 2800 },
      { type: 'Traspaso vehículo', rate: 92, total: 1600 },
      { type: 'Registro inicial', rate: 97, total: 1350 },
    ],
    departmentDistribution: [
      { department: 'Cundinamarca', count: 2300 }, { department: 'Antioquia', count: 1800 },
      { department: 'Valle del Cauca', count: 1400 }, { department: 'Atlántico', count: 1100 },
      { department: 'Santander', count: 900 }, { department: 'Bolívar', count: 750 },
      { department: 'Norte de Santander', count: 620 }, { department: 'Meta', count: 480 },
    ],
  },
  tax: {
    documentsIssued: 24600,
    documentsTrend: 12.3,
    verificationsCompleted: 18900,
    verificationsTrend: 8.7,
    approvalRate: 94.8,
    approvalTrend: 2.1,
    averageTime: '0.5 días',
    averageTimeTrend: -15.2,
    monthlyEmissions: [
      { month: 'Sep', count: 3200 }, { month: 'Oct', count: 3600 },
      { month: 'Nov', count: 3800 }, { month: 'Dic', count: 4500 },
      { month: 'Ene', count: 5200 }, { month: 'Feb', count: 4300 },
    ],
    documentTypes: [
      { type: 'RUT', count: 14200, percentage: 58, color: '#003893' },
      { type: 'Certificado Tributario', count: 5400, percentage: 22, color: '#16A34A' },
      { type: 'Declaración de Renta', count: 3200, percentage: 13, color: '#EAB308' },
      { type: 'Facturación Electrónica', count: 1800, percentage: 7, color: '#DC2626' },
    ],
    successRates: [
      { type: 'Inscripción RUT', rate: 96, total: 9200 },
      { type: 'Actualización RUT', rate: 98, total: 7400 },
      { type: 'Certificados', rate: 99, total: 5100 },
      { type: 'Consultas tributarias', rate: 88, total: 2900 },
    ],
    departmentDistribution: [
      { department: 'Cundinamarca', count: 6200 }, { department: 'Antioquia', count: 4500 },
      { department: 'Valle del Cauca', count: 3400 }, { department: 'Atlántico', count: 2600 },
      { department: 'Santander', count: 2100 }, { department: 'Bolívar', count: 1700 },
      { department: 'Risaralda', count: 1400 }, { department: 'Boyacá', count: 1100 },
    ],
  },
  health: {
    documentsIssued: 15200,
    documentsTrend: 3.4,
    verificationsCompleted: 11800,
    verificationsTrend: 5.6,
    approvalRate: 97.1,
    approvalTrend: 0.8,
    averageTime: '2.1 días',
    averageTimeTrend: -3.2,
    monthlyEmissions: [
      { month: 'Sep', count: 2200 }, { month: 'Oct', count: 2400 },
      { month: 'Nov', count: 2500 }, { month: 'Dic', count: 2700 },
      { month: 'Ene', count: 2600 }, { month: 'Feb', count: 2800 },
    ],
    documentTypes: [
      { type: 'Carné de Afiliación EPS', count: 8500, percentage: 56, color: '#003893' },
      { type: 'Certificado de Vacunación', count: 3200, percentage: 21, color: '#16A34A' },
      { type: 'Historia Clínica Digital', count: 2100, percentage: 14, color: '#EAB308' },
      { type: 'Certificado SISBEN', count: 1400, percentage: 9, color: '#DC2626' },
    ],
    successRates: [
      { type: 'Afiliación EPS', rate: 98, total: 6200 },
      { type: 'Traslado EPS', rate: 94, total: 3400 },
      { type: 'Certificado vacunación', rate: 99, total: 4800 },
      { type: 'Autorización servicio', rate: 91, total: 2600 },
    ],
    departmentDistribution: [
      { department: 'Cundinamarca', count: 3800 }, { department: 'Antioquia', count: 2600 },
      { department: 'Valle del Cauca', count: 2100 }, { department: 'Atlántico', count: 1700 },
      { department: 'Santander', count: 1300 }, { department: 'Bolívar', count: 1100 },
      { department: 'Cesar', count: 850 }, { department: 'Córdoba', count: 720 },
    ],
  },
  socialServices: {
    documentsIssued: 8900,
    documentsTrend: 6.8,
    verificationsCompleted: 7200,
    verificationsTrend: 9.1,
    approvalRate: 88.5,
    approvalTrend: -1.3,
    averageTime: '5.4 días',
    averageTimeTrend: 2.8,
    monthlyEmissions: [
      { month: 'Sep', count: 1200 }, { month: 'Oct', count: 1350 },
      { month: 'Nov', count: 1500 }, { month: 'Dic', count: 1700 },
      { month: 'Ene', count: 1600 }, { month: 'Feb', count: 1550 },
    ],
    documentTypes: [
      { type: 'Certificado SISBEN IV', count: 4200, percentage: 47, color: '#003893' },
      { type: 'Inscripción Familias en Acción', count: 2100, percentage: 24, color: '#16A34A' },
      { type: 'Ingreso Solidario', count: 1500, percentage: 17, color: '#EAB308' },
      { type: 'Colombia Mayor', count: 1100, percentage: 12, color: '#DC2626' },
    ],
    successRates: [
      { type: 'Inscripción programa', rate: 85, total: 4100 },
      { type: 'Renovación beneficio', rate: 92, total: 2800 },
      { type: 'Consulta de estado', rate: 98, total: 3200 },
      { type: 'Reclamo/Queja', rate: 78, total: 1100 },
    ],
    departmentDistribution: [
      { department: 'Cundinamarca', count: 1800 }, { department: 'Antioquia', count: 1400 },
      { department: 'Bolívar', count: 1200 }, { department: 'Córdoba', count: 1100 },
      { department: 'Nariño', count: 950 }, { department: 'Cauca', count: 820 },
      { department: 'Chocó', count: 750 }, { department: 'La Guajira', count: 680 },
    ],
  },
  technology: {
    documentsIssued: 4200,
    documentsTrend: 18.5,
    verificationsCompleted: 3100,
    verificationsTrend: 22.3,
    approvalRate: 93.7,
    approvalTrend: 3.4,
    averageTime: '1.2 días',
    averageTimeTrend: -8.6,
    monthlyEmissions: [
      { month: 'Sep', count: 450 }, { month: 'Oct', count: 520 },
      { month: 'Nov', count: 600 }, { month: 'Dic', count: 680 },
      { month: 'Ene', count: 780 }, { month: 'Feb', count: 870 },
    ],
    documentTypes: [
      { type: 'Certificado Digital', count: 1800, percentage: 43, color: '#003893' },
      { type: 'Firma Electrónica', count: 1200, percentage: 29, color: '#16A34A' },
      { type: 'Autenticación Gov.co', count: 800, percentage: 19, color: '#EAB308' },
      { type: 'Sello Digital', count: 400, percentage: 9, color: '#DC2626' },
    ],
    successRates: [
      { type: 'Emisión certificado', rate: 96, total: 1800 },
      { type: 'Firma electrónica', rate: 94, total: 1200 },
      { type: 'Autenticación', rate: 99, total: 2400 },
      { type: 'Renovación', rate: 91, total: 800 },
    ],
    departmentDistribution: [
      { department: 'Cundinamarca', count: 1200 }, { department: 'Antioquia', count: 850 },
      { department: 'Valle del Cauca', count: 620 }, { department: 'Santander', count: 450 },
      { department: 'Atlántico', count: 380 }, { department: 'Risaralda', count: 280 },
      { department: 'Boyacá', count: 220 }, { department: 'Caldas', count: 180 },
    ],
  },
};

// ─── Audit Log Data (for Settings page) ──────────────────────────────────────

export interface AgencyAuditEntry {
  id: string;
  action: string;
  performedBy: string;
  details: string;
  timestamp: string;
  ipAddress: string;
  target: string;
}

function daysAgoISO(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

function hoursAgoISO(n: number): string {
  const d = new Date();
  d.setHours(d.getHours() - n);
  return d.toISOString();
}

const baseAuditLogs: AgencyAuditEntry[] = [
  { id: 'audit-001', action: 'DOCUMENTO_EMITIDO', performedBy: 'Carlos Gomez', details: 'Emision de cedula de ciudadania para Maria Lopez', timestamp: hoursAgoISO(2), ipAddress: '192.168.1.45', target: 'DOC-2026-001' },
  { id: 'audit-002', action: 'SOLICITUD_APROBADA', performedBy: 'Ana Rodriguez', details: 'Aprobacion de solicitud de verificacion de identidad', timestamp: hoursAgoISO(5), ipAddress: '192.168.1.32', target: 'SOL-2026-015' },
  { id: 'audit-003', action: 'DOCUMENTO_REVOCADO', performedBy: 'Diego Ramirez', details: 'Revocacion de documento por datos incorrectos', timestamp: daysAgoISO(1), ipAddress: '192.168.1.78', target: 'DOC-2026-089' },
  { id: 'audit-004', action: 'CONFIGURACION_ACTUALIZADA', performedBy: 'Carlos Gomez', details: 'Actualizacion de configuracion de notificaciones', timestamp: daysAgoISO(2), ipAddress: '192.168.1.45', target: 'CONFIG-NOTIF' },
  { id: 'audit-005', action: 'SOLICITUD_RECHAZADA', performedBy: 'Ana Rodriguez', details: 'Rechazo de solicitud por documentacion incompleta', timestamp: daysAgoISO(3), ipAddress: '192.168.1.32', target: 'SOL-2026-012' },
  { id: 'audit-006', action: 'VERIFICACION_COMPLETADA', performedBy: 'Santiago Mejia', details: 'Verificacion biometrica exitosa para ciudadano', timestamp: daysAgoISO(4), ipAddress: '192.168.1.56', target: 'VER-2026-044' },
  { id: 'audit-007', action: 'PLANTILLA_ACTUALIZADA', performedBy: 'Carlos Gomez', details: 'Actualizacion de plantilla de documento oficial', timestamp: daysAgoISO(5), ipAddress: '192.168.1.45', target: 'TPL-001' },
  { id: 'audit-008', action: 'USUARIO_CREADO', performedBy: 'Diego Ramirez', details: 'Creacion de nuevo usuario funcionario', timestamp: daysAgoISO(7), ipAddress: '192.168.1.78', target: 'USR-NEW-003' },
];

export const agencyAuditLogs: Record<AgencyKey, AgencyAuditEntry[]> = {
  identity: baseAuditLogs,
  vehicles: baseAuditLogs.map((e) => ({ ...e, id: `v-${e.id}` })),
  tax: baseAuditLogs.map((e) => ({ ...e, id: `t-${e.id}` })),
  health: baseAuditLogs.map((e) => ({ ...e, id: `h-${e.id}` })),
  socialServices: baseAuditLogs.map((e) => ({ ...e, id: `s-${e.id}` })),
  technology: baseAuditLogs.map((e) => ({ ...e, id: `tc-${e.id}` })),
};

// ─── Document Templates Data (for Settings page) ────────────────────────────

export interface AgencyTemplate {
  id: string;
  name: string;
  active: boolean;
  version: string;
  fieldsCount: number;
  lastUpdated: string;
}

const makeTemplates = (names: string[]): AgencyTemplate[] =>
  names.map((name, i) => ({
    id: `tpl-${i + 1}`,
    name,
    active: i < 3,
    version: `${Math.floor(Math.random() * 3) + 1}.${Math.floor(Math.random() * 10)}`,
    fieldsCount: 8 + Math.floor(Math.random() * 12),
    lastUpdated: daysAgoISO(i * 5 + 3),
  }));

export const agencyTemplates: Record<AgencyKey, AgencyTemplate[]> = {
  identity: makeTemplates([
    'Cedula de Ciudadania',
    'Tarjeta de Identidad',
    'Cedula de Extranjeria',
    'Registro Civil de Nacimiento',
    'Certificado de Nacionalidad',
  ]),
  vehicles: makeTemplates([
    'Licencia de Conduccion',
    'Registro RUNT',
    'SOAT',
    'Revision Tecnomecanica',
  ]),
  tax: makeTemplates([
    'RUT',
    'Certificado Tributario',
    'Declaracion de Renta',
    'Factura Electronica',
  ]),
  health: makeTemplates([
    'Carne de Afiliacion EPS',
    'Certificado de Vacunacion',
    'Historia Clinica Digital',
    'Certificado SISBEN',
  ]),
  socialServices: makeTemplates([
    'Certificado SISBEN IV',
    'Inscripcion Familias en Accion',
    'Certificado Ingreso Solidario',
  ]),
  technology: makeTemplates([
    'Certificado Digital',
    'Firma Electronica',
    'Autenticacion Gov.co',
    'Sello Digital',
  ]),
};
