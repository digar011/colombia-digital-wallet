'use client';

import { useState, useMemo, useCallback } from 'react';
import { useParams } from 'next/navigation';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  FilePlus,
  User,
  ShieldCheck,
  Clock,
  ShieldX,
  ShieldAlert,
  FileText,
  Calendar,
  MapPin,
  Mail,
  Phone,
  ArrowUpDown,
} from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useCountry } from '@/lib/contexts/CountryContext';

// ─── Types ───────────────────────────────────────────────────────────────────

type DocumentType = 'CC' | 'TI' | 'CE';
type VerificationStatus = 'verificado' | 'pendiente' | 'rechazado' | 'suspendido';
type AgencyKey = 'identity' | 'vehicles' | 'tax' | 'health' | 'socialServices' | 'technology';

interface AgencyCitizen {
  id: string;
  firstName: string;
  lastName: string;
  documentType: DocumentType;
  documentNumber: string;
  email: string;
  phone: string;
  department: string;
  city: string;
  dateOfBirth: string;
  verificationStatus: VerificationStatus;
  agencyDocumentsCount: number;
  lastActivity: string;
  agencyDocuments: CitizenAgencyDocument[];
  verificationHistory: VerificationEvent[];
}

interface CitizenAgencyDocument {
  id: string;
  name: string;
  documentNumber: string;
  issuedAt: string;
  expiresAt: string | null;
  status: 'activo' | 'expirado' | 'revocado' | 'pendiente';
}

interface VerificationEvent {
  id: string;
  date: string;
  type: string;
  result: 'aprobado' | 'rechazado' | 'pendiente';
  notes: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

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

function formatRelativeTime(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60_000);
  const diffHr = Math.floor(diffMs / 3_600_000);
  const diffDay = Math.floor(diffMs / 86_400_000);

  if (diffMin < 1) return 'Ahora mismo';
  if (diffMin < 60) return `Hace ${diffMin}m`;
  if (diffHr < 24) return `Hace ${diffHr}h`;
  if (diffDay < 7) return `Hace ${diffDay}d`;
  return new Date(iso).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });
}

function getStatusBadgeVariant(status: VerificationStatus): 'active' | 'pending' | 'expired' | 'revoked' {
  switch (status) {
    case 'verificado': return 'active';
    case 'pendiente': return 'pending';
    case 'rechazado': return 'expired';
    case 'suspendido': return 'revoked';
  }
}

function getStatusLabel(status: VerificationStatus): string {
  switch (status) {
    case 'verificado': return 'Verificado';
    case 'pendiente': return 'Pendiente';
    case 'rechazado': return 'Rechazado';
    case 'suspendido': return 'Suspendido';
  }
}

function getDocTypeLabel(type: DocumentType): string {
  switch (type) {
    case 'CC': return 'Cedula de Ciudadania';
    case 'TI': return 'Tarjeta de Identidad';
    case 'CE': return 'Cedula de Extranjeria';
  }
}

// ─── Agency-specific documents per citizen ───────────────────────────────────

function getAgencyDocumentsForCitizen(agencyKey: AgencyKey, citizenId: string): CitizenAgencyDocument[] {
  const baseDocsByAgency: Record<AgencyKey, CitizenAgencyDocument[]> = {
    identity: [
      { id: `${citizenId}-doc-1`, name: 'Cedula de Ciudadania', documentNumber: 'CC-' + citizenId.slice(-3) + '456789', issuedAt: daysAgo(365), expiresAt: null, status: 'activo' },
      { id: `${citizenId}-doc-2`, name: 'Registro Civil', documentNumber: 'RC-' + citizenId.slice(-3) + '123456', issuedAt: daysAgo(730), expiresAt: null, status: 'activo' },
    ],
    vehicles: [
      { id: `${citizenId}-doc-1`, name: 'Licencia de Conduccion', documentNumber: 'LIC-' + citizenId.slice(-3) + '789012', issuedAt: daysAgo(180), expiresAt: null, status: 'activo' },
      { id: `${citizenId}-doc-2`, name: 'Tarjeta de Propiedad', documentNumber: 'TP-' + citizenId.slice(-3) + '345678', issuedAt: daysAgo(90), expiresAt: null, status: 'activo' },
    ],
    tax: [
      { id: `${citizenId}-doc-1`, name: 'RUT', documentNumber: 'NIT-' + citizenId.slice(-3) + '901234', issuedAt: daysAgo(300), expiresAt: null, status: 'activo' },
      { id: `${citizenId}-doc-2`, name: 'Certificado Tributario', documentNumber: 'CT-' + citizenId.slice(-3) + '567890', issuedAt: daysAgo(60), expiresAt: null, status: 'activo' },
    ],
    health: [
      { id: `${citizenId}-doc-1`, name: 'Carne EPS', documentNumber: 'EPS-' + citizenId.slice(-3) + '234567', issuedAt: daysAgo(200), expiresAt: null, status: 'activo' },
      { id: `${citizenId}-doc-2`, name: 'Carnet de Vacunacion', documentNumber: 'VAC-' + citizenId.slice(-3) + '890123', issuedAt: daysAgo(100), expiresAt: null, status: 'activo' },
    ],
    socialServices: [
      { id: `${citizenId}-doc-1`, name: 'Certificado SISBEN', documentNumber: 'SIS-' + citizenId.slice(-3) + '456789', issuedAt: daysAgo(150), expiresAt: null, status: 'activo' },
    ],
    technology: [
      { id: `${citizenId}-doc-1`, name: 'Certificado Firma Digital', documentNumber: 'FD-' + citizenId.slice(-3) + '012345', issuedAt: daysAgo(120), expiresAt: null, status: 'activo' },
    ],
  };

  return baseDocsByAgency[agencyKey] || [];
}

function getVerificationHistory(citizenId: string): VerificationEvent[] {
  return [
    { id: `${citizenId}-ver-1`, date: daysAgo(30), type: 'Verificacion de Identidad', result: 'aprobado', notes: 'Verificacion biometrica exitosa' },
    { id: `${citizenId}-ver-2`, date: daysAgo(90), type: 'Validacion de Documento', result: 'aprobado', notes: 'Documento validado contra base de datos' },
    { id: `${citizenId}-ver-3`, date: daysAgo(180), type: 'Registro Inicial', result: 'aprobado', notes: 'Registro inicial completado' },
  ];
}

// ─── Mock Citizens (15) ──────────────────────────────────────────────────────

function buildMockCitizens(agencyKey: AgencyKey): AgencyCitizen[] {
  const citizens: Omit<AgencyCitizen, 'agencyDocuments' | 'verificationHistory' | 'agencyDocumentsCount'>[] = [
    { id: 'ac-001', firstName: 'Maria Fernanda', lastName: 'Lopez Garcia', documentType: 'CC', documentNumber: '1.098.765.432', email: 'maria.lopez@email.co', phone: '+57 311 234 5678', department: 'Antioquia', city: 'Medellin', dateOfBirth: '1988-05-14', verificationStatus: 'verificado', lastActivity: hoursAgo(2) },
    { id: 'ac-002', firstName: 'Carlos Andres', lastName: 'Martinez Ruiz', documentType: 'CC', documentNumber: '1.234.567.890', email: 'carlos.martinez@email.co', phone: '+57 310 345 6789', department: 'Cundinamarca', city: 'Bogota D.C.', dateOfBirth: '1992-03-22', verificationStatus: 'verificado', lastActivity: hoursAgo(5) },
    { id: 'ac-003', firstName: 'Ana Sofia', lastName: 'Hernandez Diaz', documentType: 'CC', documentNumber: '1.087.654.321', email: 'ana.hernandez@email.co', phone: '+57 312 456 7890', department: 'Valle del Cauca', city: 'Cali', dateOfBirth: '1995-11-08', verificationStatus: 'pendiente', lastActivity: hoursAgo(1) },
    { id: 'ac-004', firstName: 'Juan Pablo', lastName: 'Rodriguez Vargas', documentType: 'CC', documentNumber: '1.045.678.901', email: 'juan.rodriguez@email.co', phone: '+57 313 567 8901', department: 'Santander', city: 'Bucaramanga', dateOfBirth: '1990-07-30', verificationStatus: 'verificado', lastActivity: daysAgo(1) },
    { id: 'ac-005', firstName: 'Valentina', lastName: 'Castro Moreno', documentType: 'CC', documentNumber: '1.067.890.123', email: 'valentina.castro@email.co', phone: '+57 314 678 9012', department: 'Atlantico', city: 'Barranquilla', dateOfBirth: '1993-09-03', verificationStatus: 'verificado', lastActivity: hoursAgo(8) },
    { id: 'ac-006', firstName: 'Diego Fernando', lastName: 'Ramirez Torres', documentType: 'CC', documentNumber: '1.012.345.678', email: 'diego.ramirez@email.co', phone: '+57 315 789 0123', department: 'Bolivar', city: 'Cartagena', dateOfBirth: '1985-01-17', verificationStatus: 'rechazado', lastActivity: daysAgo(5) },
    { id: 'ac-007', firstName: 'Laura Camila', lastName: 'Gutierrez Pena', documentType: 'TI', documentNumber: '1.056.789.012', email: 'laura.gutierrez@email.co', phone: '+57 316 890 1234', department: 'Narino', city: 'Pasto', dateOfBirth: '2010-04-25', verificationStatus: 'pendiente', lastActivity: daysAgo(2) },
    { id: 'ac-008', firstName: 'Santiago', lastName: 'Mejia Quintero', documentType: 'CC', documentNumber: '1.089.012.345', email: 'santiago.mejia@email.co', phone: '+57 317 901 2345', department: 'Boyaca', city: 'Tunja', dateOfBirth: '1994-08-07', verificationStatus: 'suspendido', lastActivity: daysAgo(30) },
    { id: 'ac-009', firstName: 'Gabriela', lastName: 'Ospina Restrepo', documentType: 'CC', documentNumber: '1.078.901.234', email: 'gabriela.ospina@email.co', phone: '+57 318 012 3456', department: 'Caldas', city: 'Manizales', dateOfBirth: '1991-12-11', verificationStatus: 'verificado', lastActivity: hoursAgo(3) },
    { id: 'ac-010', firstName: 'Andres Felipe', lastName: 'Cardona Yepes', documentType: 'CE', documentNumber: '1.034.567.890', email: 'andres.cardona@email.co', phone: '+57 319 123 4567', department: 'Risaralda', city: 'Pereira', dateOfBirth: '1987-06-19', verificationStatus: 'verificado', lastActivity: daysAgo(3) },
    { id: 'ac-011', firstName: 'Daniela', lastName: 'Zuluaga Cano', documentType: 'CC', documentNumber: '1.023.456.789', email: 'daniela.zuluaga@email.co', phone: '+57 320 234 5678', department: 'Tolima', city: 'Ibague', dateOfBirth: '1996-02-28', verificationStatus: 'verificado', lastActivity: hoursAgo(12) },
    { id: 'ac-012', firstName: 'Nicolas', lastName: 'Herrera Montoya', documentType: 'CC', documentNumber: '1.056.123.456', email: 'nicolas.herrera@email.co', phone: '+57 321 345 6789', department: 'Meta', city: 'Villavicencio', dateOfBirth: '1989-10-05', verificationStatus: 'pendiente', lastActivity: hoursAgo(6) },
    { id: 'ac-013', firstName: 'Isabella', lastName: 'Pineda Arango', documentType: 'CC', documentNumber: '1.011.345.678', email: 'isabella.pineda@email.co', phone: '+57 322 456 7890', department: 'Huila', city: 'Neiva', dateOfBirth: '1997-08-14', verificationStatus: 'verificado', lastActivity: daysAgo(1) },
    { id: 'ac-014', firstName: 'Mateo', lastName: 'Salazar Bernal', documentType: 'CC', documentNumber: '1.044.678.901', email: 'mateo.salazar@email.co', phone: '+57 323 567 8901', department: 'Magdalena', city: 'Santa Marta', dateOfBirth: '1998-05-20', verificationStatus: 'rechazado', lastActivity: daysAgo(4) },
    { id: 'ac-015', firstName: 'Camila Andrea', lastName: 'Bermudez Arias', documentType: 'CC', documentNumber: '1.035.678.901', email: 'camila.bermudez@email.co', phone: '+57 324 678 9012', department: 'Antioquia', city: 'Envigado', dateOfBirth: '1995-03-09', verificationStatus: 'verificado', lastActivity: hoursAgo(4) },
  ];

  return citizens.map((c) => {
    const docs = getAgencyDocumentsForCitizen(agencyKey, c.id);
    return {
      ...c,
      agencyDocuments: docs,
      agencyDocumentsCount: docs.length,
      verificationHistory: getVerificationHistory(c.id),
    };
  });
}

// ─── Sort ────────────────────────────────────────────────────────────────────

type SortField = 'name' | 'documentNumber' | 'department' | 'status' | 'lastActivity';
type SortDirection = 'asc' | 'desc';

// ─── Constants ───────────────────────────────────────────────────────────────

const PAGE_SIZE = 8;

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function AgencyCitizensPage() {
  const params = useParams();
  const agencyKey = params.agencyKey as string;
  const { country } = useCountry();

  const agencyConfig = country.agencies[agencyKey];
  const agencyShortName = agencyConfig?.shortName ?? agencyKey;

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  // Sort state
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Detail modal
  const [selectedCitizen, setSelectedCitizen] = useState<AgencyCitizen | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Mock data
  const allCitizens = useMemo(() => buildMockCitizens(agencyKey as AgencyKey), [agencyKey]);

  // ── Search handler ──────────────────────────────────────────

  const handleSearch = useCallback(() => {
    setHasSearched(true);
    setCurrentPage(1);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') handleSearch();
    },
    [handleSearch]
  );

  // ── Sort handler ────────────────────────────────────────────

  const handleSort = useCallback(
    (field: SortField) => {
      if (sortField === field) {
        setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortField(field);
        setSortDirection('asc');
      }
    },
    [sortField]
  );

  // ── Filtered + sorted citizens ──────────────────────────────

  const filteredCitizens = useMemo(() => {
    if (!hasSearched) return [];

    let result = [...allCitizens];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
          c.documentNumber.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case 'name':
          cmp = `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
          break;
        case 'documentNumber':
          cmp = a.documentNumber.localeCompare(b.documentNumber);
          break;
        case 'department':
          cmp = a.department.localeCompare(b.department);
          break;
        case 'status':
          cmp = a.verificationStatus.localeCompare(b.verificationStatus);
          break;
        case 'lastActivity':
          cmp = new Date(a.lastActivity).getTime() - new Date(b.lastActivity).getTime();
          break;
      }
      return sortDirection === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [allCitizens, searchQuery, hasSearched, sortField, sortDirection]);

  // ── Pagination ──────────────────────────────────────────────

  const totalPages = Math.max(1, Math.ceil(filteredCitizens.length / PAGE_SIZE));
  const paginatedCitizens = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredCitizens.slice(start, start + PAGE_SIZE);
  }, [filteredCitizens, currentPage]);

  // ── Open detail ─────────────────────────────────────────────

  const openDetail = (citizen: AgencyCitizen) => {
    setSelectedCitizen(citizen);
    setShowDetailModal(true);
  };

  // ── Sort icon ───────────────────────────────────────────────

  function SortIcon({ field }: { field: SortField }) {
    if (sortField !== field)
      return <ArrowUpDown className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />;
    return (
      <ArrowUpDown
        className={`w-3 h-3 text-colombia-blue ${sortDirection === 'desc' ? 'rotate-180' : ''} transition-transform`}
      />
    );
  }

  // ── Status icon ─────────────────────────────────────────────

  function StatusIcon({ status }: { status: VerificationStatus }) {
    switch (status) {
      case 'verificado':
        return <ShieldCheck className="w-4 h-4 text-green-600" />;
      case 'pendiente':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'rechazado':
        return <ShieldX className="w-4 h-4 text-red-600" />;
      case 'suspendido':
        return <ShieldAlert className="w-4 h-4 text-red-600" />;
    }
  }

  return (
    <div className="space-y-6">
      {/* ── Header ──────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">
          Consulta de Ciudadanos - {agencyShortName}
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Busque y consulte la informacion de ciudadanos registrados en {agencyConfig?.name || 'la agencia'}
        </p>
      </div>

      {/* ── Search Area ─────────────────────────────────────── */}
      <Card variant="elevated">
        <CardBody>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                placeholder="Buscar por numero de documento, nombre o correo..."
                leftIcon={Search}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                inputSize="lg"
              />
            </div>
            <Button
              variant="primary"
              size="lg"
              leftIcon={Search}
              onClick={handleSearch}
            >
              Buscar
            </Button>
          </div>
          {hasSearched && (
            <p className="text-sm text-text-secondary mt-3">
              {filteredCitizens.length} resultado{filteredCitizens.length !== 1 ? 's' : ''} encontrado{filteredCitizens.length !== 1 ? 's' : ''}
            </p>
          )}
        </CardBody>
      </Card>

      {/* ── Empty state: no search ─────────────────────────── */}
      {!hasSearched && (
        <Card variant="elevated">
          <CardBody>
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="p-4 rounded-full bg-colombia-blue/10 mb-4">
                <Search className="w-10 h-10 text-colombia-blue" />
              </div>
              <p className="text-lg font-medium text-text-primary">
                Ingrese un termino de busqueda para consultar ciudadanos
              </p>
              <p className="text-sm text-text-secondary mt-2 max-w-md">
                Puede buscar por numero de documento, nombre completo o correo electronico del ciudadano
              </p>
            </div>
          </CardBody>
        </Card>
      )}

      {/* ── Empty state: no results ────────────────────────── */}
      {hasSearched && filteredCitizens.length === 0 && (
        <Card variant="elevated">
          <CardBody>
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <User className="w-12 h-12 text-gray-300 mb-3" />
              <p className="text-lg font-medium text-text-primary">
                No se encontraron ciudadanos
              </p>
              <p className="text-sm text-text-secondary mt-2">
                Intente con otro termino de busqueda o verifique los datos ingresados
              </p>
            </div>
          </CardBody>
        </Card>
      )}

      {/* ── Results Table ──────────────────────────────────── */}
      {hasSearched && filteredCitizens.length > 0 && (
        <Card variant="elevated" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 text-left">
                    <button
                      className="group flex items-center gap-1.5 text-xs font-semibold text-text-secondary uppercase tracking-wider"
                      onClick={() => handleSort('name')}
                    >
                      Ciudadano
                      <SortIcon field="name" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <button
                      className="group flex items-center gap-1.5 text-xs font-semibold text-text-secondary uppercase tracking-wider"
                      onClick={() => handleSort('documentNumber')}
                    >
                      Documento
                      <SortIcon field="documentNumber" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left hidden lg:table-cell">
                    <button
                      className="group flex items-center gap-1.5 text-xs font-semibold text-text-secondary uppercase tracking-wider"
                      onClick={() => handleSort('department')}
                    >
                      Departamento
                      <SortIcon field="department" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <button
                      className="group flex items-center gap-1.5 text-xs font-semibold text-text-secondary uppercase tracking-wider"
                      onClick={() => handleSort('status')}
                    >
                      Estado de Verificacion
                      <SortIcon field="status" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left hidden xl:table-cell">
                    <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                      Documentos Vinculados
                    </span>
                  </th>
                  <th className="px-4 py-3 text-left hidden md:table-cell">
                    <button
                      className="group flex items-center gap-1.5 text-xs font-semibold text-text-secondary uppercase tracking-wider"
                      onClick={() => handleSort('lastActivity')}
                    >
                      Ultima Actividad
                      <SortIcon field="lastActivity" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                      Acciones
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedCitizens.map((citizen) => (
                  <tr
                    key={citizen.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* Ciudadano */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-colombia-blue to-colombia-blue-light flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                          {citizen.firstName[0]}{citizen.lastName[0]}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-text-primary truncate">
                            {citizen.firstName} {citizen.lastName}
                          </p>
                          <p className="text-xs text-text-secondary truncate">
                            {citizen.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Documento */}
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-mono text-text-primary">
                          {citizen.documentNumber}
                        </p>
                        <p className="text-xs text-text-secondary">
                          {citizen.documentType}
                        </p>
                      </div>
                    </td>

                    {/* Departamento */}
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <p className="text-sm text-text-secondary">{citizen.department}</p>
                      <p className="text-xs text-text-secondary">{citizen.city}</p>
                    </td>

                    {/* Estado de Verificacion */}
                    <td className="px-4 py-3">
                      <Badge
                        status={getStatusBadgeVariant(citizen.verificationStatus)}
                        dot
                        size="sm"
                      >
                        {getStatusLabel(citizen.verificationStatus)}
                      </Badge>
                    </td>

                    {/* Documentos Vinculados */}
                    <td className="px-4 py-3 hidden xl:table-cell">
                      <div className="flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-text-secondary" />
                        <span className="text-sm font-semibold text-text-primary">
                          {citizen.agencyDocumentsCount}
                        </span>
                        <span className="text-xs text-text-secondary">
                          documento{citizen.agencyDocumentsCount !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </td>

                    {/* Ultima Actividad */}
                    <td className="px-4 py-3 hidden md:table-cell">
                      <p className="text-sm text-text-secondary">
                        {formatRelativeTime(citizen.lastActivity)}
                      </p>
                    </td>

                    {/* Acciones */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          leftIcon={Eye}
                          onClick={() => openDetail(citizen)}
                        >
                          Ver Perfil
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          leftIcon={FilePlus}
                          onClick={() => {
                            alert(`Emitir documento para ${citizen.firstName} ${citizen.lastName}`);
                          }}
                        >
                          <span className="hidden lg:inline">Emitir Documento</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Pagination ──────────────────────────────────── */}
          {filteredCitizens.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-6 py-4 border-t border-gray-200 bg-gray-50/50">
              <p className="text-sm text-text-secondary">
                Mostrando {(currentPage - 1) * PAGE_SIZE + 1}
                {' '}-{' '}
                {Math.min(currentPage * PAGE_SIZE, filteredCitizens.length)} de{' '}
                {filteredCitizens.length} resultado{filteredCitizens.length !== 1 ? 's' : ''}
              </p>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (page) =>
                      page === 1 ||
                      page === totalPages ||
                      Math.abs(page - currentPage) <= 1
                  )
                  .map((page, idx, arr) => (
                    <span key={page}>
                      {idx > 0 && arr[idx - 1] !== page - 1 && (
                        <span className="px-1 text-gray-400">...</span>
                      )}
                      <button
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === page
                            ? 'bg-colombia-blue text-white'
                            : 'hover:bg-gray-100 text-text-secondary'
                        }`}
                      >
                        {page}
                      </button>
                    </span>
                  ))}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* ── Citizen Detail Modal ───────────────────────────── */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedCitizen(null);
        }}
        title={selectedCitizen ? `${selectedCitizen.firstName} ${selectedCitizen.lastName}` : ''}
        description="Perfil completo del ciudadano"
        size="full"
      >
        {selectedCitizen && (
          <div className="space-y-6">
            {/* Informacion Personal */}
            <div>
              <h4 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">
                Informacion Personal
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-colombia-blue to-colombia-blue-light flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
                    {selectedCitizen.firstName[0]}{selectedCitizen.lastName[0]}
                  </div>
                  <div>
                    <p className="text-base font-semibold text-text-primary">
                      {selectedCitizen.firstName} {selectedCitizen.lastName}
                    </p>
                    <Badge
                      status={getStatusBadgeVariant(selectedCitizen.verificationStatus)}
                      dot
                      size="sm"
                    >
                      {getStatusLabel(selectedCitizen.verificationStatus)}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="w-4 h-4 text-text-secondary" />
                    <span className="text-text-secondary">{getDocTypeLabel(selectedCitizen.documentType)}:</span>
                    <span className="font-mono font-medium text-text-primary">{selectedCitizen.documentNumber}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-text-secondary" />
                    <span className="text-text-secondary">Fecha de nacimiento:</span>
                    <span className="text-text-primary">{formatDate(selectedCitizen.dateOfBirth)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-text-secondary" />
                    <span className="text-text-primary">{selectedCitizen.city}, {selectedCitizen.department}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-text-secondary" />
                    <span className="text-text-primary">{selectedCitizen.email}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-text-secondary" />
                    <span className="text-text-primary">{selectedCitizen.phone}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Documentos emitidos por esta agencia */}
            <div>
              <h4 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">
                Documentos Emitidos por {agencyShortName}
              </h4>
              {selectedCitizen.agencyDocuments.length === 0 ? (
                <p className="text-sm text-text-secondary py-4">
                  Este ciudadano no tiene documentos emitidos por esta agencia.
                </p>
              ) : (
                <div className="space-y-2">
                  {selectedCitizen.agencyDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-colombia-blue/10 text-colombia-blue">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-text-primary">{doc.name}</p>
                          <p className="text-xs text-text-secondary font-mono">{doc.documentNumber}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          status={doc.status === 'activo' ? 'active' : doc.status === 'pendiente' ? 'pending' : 'expired'}
                          size="sm"
                        >
                          {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                        </Badge>
                        <p className="text-xs text-text-secondary mt-1">
                          Emitido: {formatDate(doc.issuedAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Historial de Verificacion */}
            <div>
              <h4 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">
                Historial de Verificacion
              </h4>
              <div className="space-y-3">
                {selectedCitizen.verificationHistory.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <StatusIcon
                      status={
                        event.result === 'aprobado'
                          ? 'verificado'
                          : event.result === 'rechazado'
                          ? 'rechazado'
                          : 'pendiente'
                      }
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-text-primary">{event.type}</p>
                        <Badge
                          status={
                            event.result === 'aprobado'
                              ? 'active'
                              : event.result === 'rechazado'
                              ? 'expired'
                              : 'pending'
                          }
                          size="sm"
                        >
                          {event.result.charAt(0).toUpperCase() + event.result.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-xs text-text-secondary mt-1">{event.notes}</p>
                      <p className="text-xs text-text-secondary mt-0.5">{formatDate(event.date)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Emitir Nuevo Documento button */}
            <div className="pt-2 border-t border-gray-100">
              <Button
                variant="primary"
                size="md"
                leftIcon={FilePlus}
                onClick={() => {
                  alert(`Emitir nuevo documento para ${selectedCitizen.firstName} ${selectedCitizen.lastName}`);
                }}
              >
                Emitir Nuevo Documento
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
