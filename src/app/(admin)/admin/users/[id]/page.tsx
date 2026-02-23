'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft,
  Shield,
  ShieldCheck,
  Ban,
  FileText,
  Car,
  Heart,
  Briefcase,
  Activity,
  Download,
  Printer,
  Copy,
  KeyRound,
  Plus,
  Send,
  Clock,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Hash,
  Trash2,
  CheckCircle2,
  XCircle,
  UserCog,
  FileCheck,
  FileX,
  LogIn,
  UserPlus,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  mockCitizens,
  mockActivityLog,
  mockIssuedDocuments,
  formatDate,
  formatDateTime,
  formatRelativeTime,
  getStatusBadgeVariant,
  getDocumentTypeLabel,
  type ActivityLogEntry,
} from '@/lib/mock/adminData';

// ─── Tab type ────────────────────────────────────────────────────────────────

type TabId = 'documents' | 'vehicles' | 'health' | 'services' | 'activity';

interface Tab {
  id: TabId;
  label: string;
  icon: React.ReactNode;
}

const TABS: Tab[] = [
  { id: 'documents', label: 'Documentos', icon: <FileText className="w-4 h-4" /> },
  { id: 'vehicles', label: 'Vehículos', icon: <Car className="w-4 h-4" /> },
  { id: 'health', label: 'Salud', icon: <Heart className="w-4 h-4" /> },
  { id: 'services', label: 'Servicios', icon: <Briefcase className="w-4 h-4" /> },
  { id: 'activity', label: 'Actividad', icon: <Activity className="w-4 h-4" /> },
];

// ─── Mock vehicle data ───────────────────────────────────────────────────────

const mockVehicles = [
  {
    id: 'veh-001',
    plate: 'ABC-123',
    brand: 'Chevrolet',
    model: 'Onix',
    year: 2023,
    color: 'Blanco',
    type: 'Automóvil',
    soatExpiry: '2027-03-15',
    techExpiry: '2027-03-15',
    status: 'active' as const,
  },
  {
    id: 'veh-002',
    plate: 'XYZ-789',
    brand: 'Yamaha',
    model: 'MT-03',
    year: 2022,
    color: 'Negro',
    type: 'Motocicleta',
    soatExpiry: '2026-11-20',
    techExpiry: '2026-11-20',
    status: 'active' as const,
  },
];

// ─── Mock health data ────────────────────────────────────────────────────────

const mockHealthData = {
  eps: 'EPS Sura',
  regime: 'Contributivo',
  ipsAssigned: 'IPS Universitaria - Medellín',
  bloodType: 'O+',
  allergies: ['Penicilina', 'Ibuprofeno'],
  conditions: ['Ninguna'],
  vaccinations: [
    { name: 'COVID-19 (Pfizer)', date: '2023-06-15', doses: '3/3' },
    { name: 'Influenza', date: '2025-10-01', doses: '1/1' },
    { name: 'Fiebre Amarilla', date: '2020-03-20', doses: '1/1' },
    { name: 'Hepatitis B', date: '2018-01-10', doses: '3/3' },
  ],
  lastCheckup: '2025-11-15',
};

// ─── Mock services data ──────────────────────────────────────────────────────

const mockServices = [
  {
    id: 'svc-001',
    name: 'Sisbén IV',
    status: 'Grupo B3',
    enrolledAt: '2023-01-15',
    authority: 'DNP',
  },
  {
    id: 'svc-002',
    name: 'Familias en Acción',
    status: 'Activo',
    enrolledAt: '2023-03-20',
    authority: 'Prosperidad Social',
  },
  {
    id: 'svc-003',
    name: 'Jóvenes en Acción',
    status: 'No elegible',
    enrolledAt: '',
    authority: 'Prosperidad Social',
  },
  {
    id: 'svc-004',
    name: 'Adulto Mayor',
    status: 'No elegible',
    enrolledAt: '',
    authority: 'Ministerio del Trabajo',
  },
];

// ─── Notes ───────────────────────────────────────────────────────────────────

const mockNotes = [
  {
    id: 'note-001',
    author: 'admin@wallet.gov.co',
    content: 'Ciudadano solicitó actualización de dirección. Documentación verificada y aprobada.',
    createdAt: '2026-02-18T14:30:00Z',
  },
  {
    id: 'note-002',
    author: 'supervisor@wallet.gov.co',
    content: 'Datos biométricos actualizados durante visita presencial en oficina de Bogotá.',
    createdAt: '2026-02-10T09:15:00Z',
  },
];

// ─── Activity icon for this page ─────────────────────────────────────────────

function ActivityTypeIcon({ type }: { type: ActivityLogEntry['type'] }) {
  const cls = 'w-4 h-4';
  switch (type) {
    case 'verification':
      return <ShieldCheck className={`${cls} text-green-600`} />;
    case 'registration':
      return <UserPlus className={`${cls} text-blue-600`} />;
    case 'document_issued':
      return <FileCheck className={`${cls} text-colombia-blue`} />;
    case 'document_revoked':
      return <FileX className={`${cls} text-red-600`} />;
    case 'login':
      return <LogIn className={`${cls} text-gray-600`} />;
    case 'profile_update':
      return <UserCog className={`${cls} text-purple-600`} />;
    case 'suspension':
      return <Ban className={`${cls} text-red-700`} />;
  }
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function AdminUserDetailPage() {
  const router = useRouter();
  const params = useParams();
  const citizenId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>('documents');
  const [newNote, setNewNote] = useState('');

  const citizen = useMemo(
    () => mockCitizens.find((c) => c.id === citizenId) || null,
    [citizenId]
  );

  const citizenDocuments = useMemo(
    () => mockIssuedDocuments.filter((d) => d.citizenId === citizenId),
    [citizenId]
  );

  const citizenActivity = useMemo(
    () => mockActivityLog.filter((a) => a.citizenId === citizenId),
    [citizenId]
  );

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  // ── Loading state ─────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gray-200 animate-pulse" />
              <div className="space-y-2 flex-1">
                <div className="h-7 w-56 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md h-96 animate-pulse" />
        </div>
      </div>
    );
  }

  // ── Not found ─────────────────────────────────────────────────

  if (!citizen) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <XCircle className="w-16 h-16 text-gray-300 mx-auto" />
          <h2 className="text-xl font-bold text-text-primary">Ciudadano No Encontrado</h2>
          <p className="text-sm text-text-secondary">
            No se pudo encontrar el ciudadano con ID &quot;{citizenId}&quot;.
          </p>
          <Button variant="primary" onClick={() => router.push('/admin/users')}>
            Volver a Ciudadanos
          </Button>
        </div>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* ── Back button ─────────────────────────────────────── */}
        <button
          onClick={() => router.push('/admin/users')}
          className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-colombia-blue transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a Ciudadanos
        </button>

        {/* ── Profile Header ──────────────────────────────────── */}
        <Card variant="elevated">
          <CardBody>
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-colombia-blue to-colombia-blue-light flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  {citizen.firstName[0]}
                  {citizen.lastName[0]}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                  <h1 className="text-xl font-bold text-text-primary">
                    {citizen.firstName} {citizen.lastName}
                  </h1>
                  <Badge
                    status={getStatusBadgeVariant(citizen.status)}
                    dot
                  >
                    {citizen.status.charAt(0).toUpperCase() + citizen.status.slice(1)}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2 mt-3">
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <Hash className="w-4 h-4 flex-shrink-0" />
                    <span className="font-mono">{citizen.documentNumber}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{citizen.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <Phone className="w-4 h-4 flex-shrink-0" />
                    <span>{citizen.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span>
                      {citizen.city}, {citizen.department}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    <span>Nacimiento: {formatDate(citizen.dateOfBirth)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <Clock className="w-4 h-4 flex-shrink-0" />
                    <span>Registrado {formatRelativeTime(citizen.registeredAt)}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 flex-shrink-0">
                {citizen.status === 'pending' && (
                  <Button variant="primary" size="sm" leftIcon={ShieldCheck}>
                    Verificar Ciudadano
                  </Button>
                )}
                {citizen.status !== 'suspended' ? (
                  <Button variant="outline" size="sm" leftIcon={Ban}>
                    Suspender
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" leftIcon={Shield}>
                    Reactivar
                  </Button>
                )}
                <Button variant="outline" size="sm" leftIcon={FileText}>
                  Emitir Documento
                </Button>
                <Button variant="ghost" size="sm" leftIcon={KeyRound}>
                  Restablecer Contraseña
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* ── Tabs ────────────────────────────────────────────── */}
        <div className="border-b border-gray-200 bg-white rounded-t-xl">
          <nav className="flex overflow-x-auto px-4 -mb-px">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-colombia-blue text-colombia-blue'
                    : 'border-transparent text-text-secondary hover:text-text-primary hover:border-gray-300'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* ── Tab Content ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {/* Documents Tab */}
            {activeTab === 'documents' && (
              <Card variant="elevated">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>
                      Documentos ({citizenDocuments.length})
                    </CardTitle>
                    <Button variant="outline" size="sm" leftIcon={Plus}>
                      Emitir Nuevo
                    </Button>
                  </div>
                </CardHeader>
                <CardBody className="!p-0">
                  {citizenDocuments.length === 0 ? (
                    <div className="px-6 py-12 text-center">
                      <FileText className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-text-secondary">Aún no se han emitido documentos</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {citizenDocuments.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
                        >
                          <div
                            className={`p-2.5 rounded-xl flex-shrink-0 ${
                              doc.status === 'active'
                                ? 'bg-green-100 text-green-700'
                                : doc.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            <FileText className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-text-primary">
                              {getDocumentTypeLabel(doc.type)}
                            </p>
                            <p className="text-xs text-text-secondary font-mono mt-0.5">
                              {doc.documentNumber}
                            </p>
                            <p className="text-xs text-text-secondary mt-0.5">
                              Emitido: {formatDate(doc.issuedAt)} &middot; Expira:{' '}
                              {formatDate(doc.expiresAt)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <Badge
                              status={getStatusBadgeVariant(doc.status)}
                              size="sm"
                            >
                              {doc.status === 'active'
                                ? 'Activo'
                                : doc.status === 'pending'
                                ? 'Pendiente'
                                : doc.status === 'revoked'
                                ? 'Revocado'
                                : 'Expirado'}
                            </Badge>
                            <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                              <Download className="w-4 h-4 text-gray-500" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardBody>
              </Card>
            )}

            {/* Vehicles Tab */}
            {activeTab === 'vehicles' && (
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle>Vehículos Registrados ({mockVehicles.length})</CardTitle>
                </CardHeader>
                <CardBody className="!p-0">
                  <div className="divide-y divide-gray-100">
                    {mockVehicles.map((vehicle) => (
                      <div
                        key={vehicle.id}
                        className="px-6 py-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <div className="p-2.5 rounded-xl bg-blue-100 text-blue-700 flex-shrink-0">
                              <Car className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-semibold text-text-primary">
                                  {vehicle.brand} {vehicle.model} ({vehicle.year})
                                </p>
                                <Badge status="active" size="sm">
                                  {vehicle.status === 'active' ? 'Activo' : 'Inactivo'}
                                </Badge>
                              </div>
                              <div className="mt-1.5 grid grid-cols-2 gap-x-6 gap-y-1 text-xs text-text-secondary">
                                <span>
                                  <strong>Placa:</strong> {vehicle.plate}
                                </span>
                                <span>
                                  <strong>Color:</strong> {vehicle.color}
                                </span>
                                <span>
                                  <strong>Tipo:</strong> {vehicle.type}
                                </span>
                                <span>
                                  <strong>SOAT hasta:</strong> {formatDate(vehicle.soatExpiry)}
                                </span>
                                <span>
                                  <strong>Tecnomecánica:</strong>{' '}
                                  {formatDate(vehicle.techExpiry)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            )}

            {/* Health Tab */}
            {activeTab === 'health' && (
              <div className="space-y-6">
                <Card variant="elevated">
                  <CardHeader>
                    <CardTitle>Información de Salud</CardTitle>
                  </CardHeader>
                  <CardBody>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-text-secondary font-medium">EPS</p>
                        <p className="text-sm font-semibold text-text-primary mt-0.5">
                          {mockHealthData.eps}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-text-secondary font-medium">Régimen</p>
                        <p className="text-sm font-semibold text-text-primary mt-0.5">
                          {mockHealthData.regime}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-text-secondary font-medium">IPS Asignada</p>
                        <p className="text-sm font-semibold text-text-primary mt-0.5">
                          {mockHealthData.ipsAssigned}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-text-secondary font-medium">
                          Tipo de Sangre
                        </p>
                        <p className="text-sm font-semibold text-text-primary mt-0.5">
                          {mockHealthData.bloodType}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-text-secondary font-medium">Alergias</p>
                        <div className="flex flex-wrap gap-1 mt-0.5">
                          {mockHealthData.allergies.map((a) => (
                            <Badge key={a} status="expiring" size="sm">
                              {a}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-text-secondary font-medium">
                          Último Chequeo
                        </p>
                        <p className="text-sm font-semibold text-text-primary mt-0.5">
                          {formatDate(mockHealthData.lastCheckup)}
                        </p>
                      </div>
                    </div>
                  </CardBody>
                </Card>

                <Card variant="elevated">
                  <CardHeader>
                    <CardTitle>Vacunación</CardTitle>
                  </CardHeader>
                  <CardBody className="!p-0">
                    <div className="divide-y divide-gray-100">
                      {mockHealthData.vaccinations.map((v, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between px-6 py-3"
                        >
                          <div className="flex items-center gap-3">
                            <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-text-primary">
                                {v.name}
                              </p>
                              <p className="text-xs text-text-secondary">
                                {formatDate(v.date)}
                              </p>
                            </div>
                          </div>
                          <Badge status="active" size="sm">
                            {v.doses}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardBody>
                </Card>
              </div>
            )}

            {/* Services Tab */}
            {activeTab === 'services' && (
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle>Programas y Servicios Sociales</CardTitle>
                </CardHeader>
                <CardBody className="!p-0">
                  <div className="divide-y divide-gray-100">
                    {mockServices.map((svc) => (
                      <div
                        key={svc.id}
                        className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-2.5 rounded-xl bg-purple-100 text-purple-700 flex-shrink-0">
                            <Briefcase className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-text-primary">
                              {svc.name}
                            </p>
                            <p className="text-xs text-text-secondary mt-0.5">
                              {svc.authority}
                              {svc.enrolledAt && (
                                <span> &middot; Inscrito: {formatDate(svc.enrolledAt)}</span>
                              )}
                            </p>
                          </div>
                        </div>
                        <Badge
                          status={
                            svc.status === 'Activo'
                              ? 'active'
                              : svc.status.startsWith('Grupo')
                              ? 'info'
                              : 'default'
                          }
                          size="sm"
                        >
                          {svc.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            )}

            {/* Activity Tab */}
            {activeTab === 'activity' && (
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle>Registro de Actividad</CardTitle>
                </CardHeader>
                <CardBody className="!p-0">
                  {citizenActivity.length === 0 ? (
                    <div className="px-6 py-12 text-center">
                      <Activity className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-text-secondary">Sin actividad registrada</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {citizenActivity.map((entry) => (
                        <div
                          key={entry.id}
                          className="flex items-start gap-3 px-6 py-4"
                        >
                          <div className="mt-0.5 p-1.5 rounded-lg bg-gray-100 flex-shrink-0">
                            <ActivityTypeIcon type={entry.type} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-text-primary">
                              {entry.description}
                            </p>
                            {entry.metadata && (
                              <div className="flex flex-wrap gap-2 mt-1">
                                {Object.entries(entry.metadata).map(([k, v]) => (
                                  <span
                                    key={k}
                                    className="text-[10px] bg-gray-100 text-text-secondary px-2 py-0.5 rounded-full"
                                  >
                                    {k}: {v}
                                  </span>
                                ))}
                              </div>
                            )}
                            <p className="text-xs text-text-secondary mt-1">
                              {formatDateTime(entry.timestamp)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardBody>
              </Card>
            )}
          </div>

          {/* ── Sidebar: Notes + Quick Info ─────────────────────── */}
          <div className="space-y-6">
            {/* Quick Summary */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Resumen</CardTitle>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-text-secondary">Total de Documentos</span>
                    <span className="text-sm font-bold text-text-primary">
                      {citizen.documentsCount}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-text-secondary">Verificados</span>
                    <span className="text-sm font-bold text-green-600">
                      {citizen.verifiedDocuments}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-text-secondary">Pendientes</span>
                    <span className="text-sm font-bold text-yellow-600">
                      {citizen.documentsCount - citizen.verifiedDocuments}
                    </span>
                  </div>
                  <div className="h-px bg-gray-100" />
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-text-secondary">Última Actividad</span>
                    <span className="text-xs font-medium text-text-primary">
                      {formatRelativeTime(citizen.lastActiveAt)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-text-secondary">Miembro Desde</span>
                    <span className="text-xs font-medium text-text-primary">
                      {formatDate(citizen.registeredAt)}
                    </span>
                  </div>

                  {/* Completion bar */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-text-secondary">Perfil Completado</span>
                      <span className="text-xs font-bold text-text-primary">
                        {citizen.status === 'verified' ? '100' : citizen.status === 'pending' ? '60' : '40'}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-colombia-blue to-colombia-blue-light"
                        style={{
                          width: `${
                            citizen.status === 'verified'
                              ? 100
                              : citizen.status === 'pending'
                              ? 60
                              : 40
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Admin Notes */}
            <Card variant="elevated">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Notas del Administrador</CardTitle>
                  <Badge status="default" size="sm">
                    {mockNotes.length}
                  </Badge>
                </div>
              </CardHeader>
              <CardBody>
                <div className="space-y-3">
                  {mockNotes.map((note) => (
                    <div
                      key={note.id}
                      className="p-3 bg-gray-50 rounded-lg border border-gray-100"
                    >
                      <p className="text-sm text-text-primary">{note.content}</p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-[10px] text-text-secondary">{note.author}</p>
                        <p className="text-[10px] text-text-secondary">
                          {formatRelativeTime(note.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Add new note */}
                  <div className="mt-3">
                    <textarea
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Agregar una nota..."
                      rows={3}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-colombia-blue/30 focus:border-colombia-blue resize-none"
                    />
                    <div className="flex justify-end mt-2">
                      <Button
                        variant="primary"
                        size="sm"
                        leftIcon={Send}
                        disabled={!newNote.trim()}
                      >
                        Agregar Nota
                      </Button>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Quick Actions */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Acciones</CardTitle>
              </CardHeader>
              <CardBody>
                <div className="space-y-2">
                  <button className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 text-sm text-text-primary transition-colors">
                    <Copy className="w-4 h-4 text-gray-500" />
                    Copiar ID del Ciudadano
                  </button>
                  <button className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 text-sm text-text-primary transition-colors">
                    <Printer className="w-4 h-4 text-gray-500" />
                    Imprimir Perfil
                  </button>
                  <button className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 text-sm text-text-primary transition-colors">
                    <Download className="w-4 h-4 text-gray-500" />
                    Exportar Datos
                  </button>
                  <button className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 text-sm text-text-primary transition-colors">
                    <Mail className="w-4 h-4 text-gray-500" />
                    Enviar Notificación
                  </button>
                  <div className="h-px bg-gray-100 my-1" />
                  <button className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-red-50 text-sm text-red-600 transition-colors">
                    <Trash2 className="w-4 h-4" />
                    Eliminar Cuenta
                  </button>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
