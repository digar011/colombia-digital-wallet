'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  Search,
  Filter,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Eye,
  Clock,
  ClipboardList,
  X,
  Inbox,
} from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Tabs } from '@/components/ui/Tabs';
import { useCountry } from '@/lib/contexts/CountryContext';
import {
  getAgencyDataByKey,
  formatNumber,
} from '@/lib/mock/agencyData';

// ─── Types ───────────────────────────────────────────────────────────────────

type RequestStatus = 'pendiente' | 'en_revision' | 'aprobada' | 'rechazada';
type RequestType = 'verificacion_identidad' | 'emision_documento' | 'renovacion' | 'consulta_estado';
type Priority = 'alta' | 'media' | 'baja';

interface VerificationRequest {
  id: string;
  requestId: string;
  type: RequestType;
  citizenName: string;
  citizenDoc: string;
  status: RequestStatus;
  priority: Priority;
  requestedAt: string;
  resolvedAt: string | null;
  resolvedBy: string | null;
  resolution: string | null;
  notes: string;
  documentType: string;
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

function minutesAgo(n: number): string {
  const d = new Date();
  d.setMinutes(d.getMinutes() - n);
  return d.toISOString();
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getRequestTypeLabel(type: RequestType): string {
  switch (type) {
    case 'verificacion_identidad': return 'Verificacion de Identidad';
    case 'emision_documento': return 'Emision de Documento';
    case 'renovacion': return 'Renovacion';
    case 'consulta_estado': return 'Consulta de Estado';
  }
}

function getRequestTypeBadge(type: RequestType): 'info' | 'active' | 'pending' | 'default' {
  switch (type) {
    case 'verificacion_identidad': return 'info';
    case 'emision_documento': return 'active';
    case 'renovacion': return 'pending';
    case 'consulta_estado': return 'default';
  }
}

function getStatusLabel(status: RequestStatus): string {
  switch (status) {
    case 'pendiente': return 'Pendiente';
    case 'en_revision': return 'En Revision';
    case 'aprobada': return 'Aprobada';
    case 'rechazada': return 'Rechazada';
  }
}

function getStatusBadge(status: RequestStatus): 'pending' | 'info' | 'active' | 'expired' {
  switch (status) {
    case 'pendiente': return 'pending';
    case 'en_revision': return 'info';
    case 'aprobada': return 'active';
    case 'rechazada': return 'expired';
  }
}

function getPriorityLabel(priority: Priority): string {
  switch (priority) {
    case 'alta': return 'Alta';
    case 'media': return 'Media';
    case 'baja': return 'Baja';
  }
}

function getPriorityBadge(priority: Priority): 'revoked' | 'pending' | 'default' {
  switch (priority) {
    case 'alta': return 'revoked';
    case 'media': return 'pending';
    case 'baja': return 'default';
  }
}

// ─── Mock Request Data ───────────────────────────────────────────────────────

function buildMockRequests(agencyKey: string): VerificationRequest[] {
  const agencyData = getAgencyDataByKey(agencyKey);
  const docTypes = agencyData?.documentTypes || [];
  const mainDocType = docTypes[0]?.label || 'Documento';

  const citizenNames = [
    'Carlos Garcia Martinez',
    'Maria Lopez Rodriguez',
    'Juan Hernandez Perez',
    'Ana Ramirez Torres',
    'Diego Moreno Sanchez',
    'Valentina Castro Diaz',
    'Andres Vargas Ruiz',
    'Camila Jimenez Ortiz',
    'Santiago Mejia Quintero',
    'Laura Gutierrez Restrepo',
    'Sebastian Rios Valencia',
    'Isabella Pineda Arango',
    'Daniel Ospina Castano',
    'Gabriela Duarte Mendieta',
    'Mateo Salazar Bernal',
    'Sofia Acevedo Parra',
    'Nicolas Cardona Yepes',
    'Mariana Zuluaga Cano',
    'Alejandro Prieto Gomez',
    'Paula Herrera Montoya',
  ];

  const citizenDocs = [
    '1.023.456.789', '1.098.765.432', '1.045.678.901', '1.067.890.123',
    '1.012.345.678', '1.034.567.890', '1.056.789.012', '1.078.901.234',
    '1.089.012.345', '1.090.123.456', '1.001.234.567', '1.011.345.678',
    '1.022.456.789', '1.033.567.890', '1.044.678.901', '1.055.789.012',
    '1.066.890.123', '1.077.901.234', '1.088.012.345', '1.099.123.456',
  ];

  const types: RequestType[] = [
    'verificacion_identidad', 'emision_documento', 'renovacion', 'consulta_estado',
  ];

  const statuses: RequestStatus[] = [
    'pendiente', 'pendiente', 'en_revision', 'pendiente',
    'aprobada', 'rechazada', 'pendiente', 'en_revision',
    'aprobada', 'pendiente', 'en_revision', 'aprobada',
    'rechazada', 'pendiente', 'en_revision', 'aprobada',
    'pendiente', 'aprobada', 'rechazada', 'pendiente',
  ];

  const priorities: Priority[] = [
    'alta', 'media', 'baja', 'alta', 'media',
    'baja', 'alta', 'media', 'baja', 'alta',
    'media', 'baja', 'alta', 'media', 'baja',
    'alta', 'media', 'baja', 'alta', 'media',
  ];

  const timestamps = [
    minutesAgo(15), minutesAgo(32), minutesAgo(48), hoursAgo(1),
    hoursAgo(2), hoursAgo(3), hoursAgo(4), hoursAgo(5),
    hoursAgo(8), hoursAgo(12), daysAgo(1), daysAgo(1),
    daysAgo(2), daysAgo(2), daysAgo(3), daysAgo(3),
    daysAgo(4), daysAgo(5), daysAgo(6), daysAgo(7),
  ];

  const notes = [
    'Solicitud de verificacion de identidad para tramite de credito.',
    `Emision de ${mainDocType} por primera vez.`,
    'Renovacion de documento por cambio de datos personales.',
    'Consulta de estado de tramite anterior SOL-2026-089.',
    'Verificacion urgente requerida por entidad bancaria.',
    `Solicitud de ${mainDocType} por perdida del original.`,
    'Tramite de renovacion por vencimiento proximo.',
    'Consulta sobre requisitos para emision de documento.',
    'Solicitud aprobada tras verificacion biometrica.',
    'Solicitud de verificacion de identidad para tramite gubernamental.',
    'Revision de documentacion enviada por el ciudadano.',
    `Emision de duplicado de ${mainDocType}.`,
    'Solicitud rechazada por documentacion incompleta.',
    'Solicitud de verificacion para acceso a servicios digitales.',
    'Revision de caso especial remitido por otra entidad.',
    'Tramite completado satisfactoriamente.',
    'Solicitud de renovacion por actualizacion de foto.',
    'Emision completada y documento entregado.',
    'Rechazada por inconsistencia en datos reportados.',
    'Solicitud nueva recibida en linea.',
  ];

  return citizenNames.map((name, i) => ({
    id: `req-${agencyKey}-${String(i + 1).padStart(3, '0')}`,
    requestId: `SOL-2026-${String(i + 1).padStart(3, '0')}`,
    type: types[i % types.length],
    citizenName: name,
    citizenDoc: citizenDocs[i],
    status: statuses[i],
    priority: priorities[i],
    requestedAt: timestamps[i],
    resolvedAt: statuses[i] === 'aprobada' || statuses[i] === 'rechazada'
      ? hoursAgo(Math.max(0, Math.floor(i / 2)))
      : null,
    resolvedBy: statuses[i] === 'aprobada' || statuses[i] === 'rechazada'
      ? 'Funcionario Administrativo'
      : null,
    resolution: statuses[i] === 'aprobada'
      ? 'Solicitud aprobada. Documento emitido correctamente.'
      : statuses[i] === 'rechazada'
      ? 'Solicitud rechazada por documentacion incompleta o inconsistente.'
      : null,
    notes: notes[i],
    documentType: docTypes[i % docTypes.length]?.label || mainDocType,
  }));
}

// ─── Tab type ────────────────────────────────────────────────────────────────

type TabId = 'pendientes' | 'en_revision' | 'resueltas' | 'todas';

// ─── Sort ────────────────────────────────────────────────────────────────────

type SortField = 'date' | 'priority';
type SortDirection = 'asc' | 'desc';

// ─── Constants ───────────────────────────────────────────────────────────────

const PAGE_SIZE = 8;

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function AgencyRequestsPage() {
  const params = useParams();
  const agencyKey = params.agencyKey as string;
  const { country } = useCountry();

  const agencyConfig = country.agencies[agencyKey];
  const agencyShortName = agencyConfig?.shortName ?? agencyKey;

  // Request data with local state for approve/reject
  const [requests, setRequests] = useState<VerificationRequest[]>([]);

  useEffect(() => {
    setRequests(buildMockRequests(agencyKey));
  }, [agencyKey]);

  // Tab state
  const [activeTab, setActiveTab] = useState<TabId>('pendientes');

  // Search & filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<RequestType | ''>('');
  const [priorityFilter, setPriorityFilter] = useState<Priority | ''>('');
  const [showFilters, setShowFilters] = useState(false);

  // Sort state
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Selection for bulk actions
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Toast message
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // ── Show toast ──────────────────────────────────────────────

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // ── Stats ───────────────────────────────────────────────────

  const stats = useMemo(() => {
    const total = requests.length;
    const pendientes = requests.filter((r) => r.status === 'pendiente').length;
    const aprobadas = requests.filter((r) => r.status === 'aprobada').length;
    const rechazadas = requests.filter((r) => r.status === 'rechazada').length;
    return { total, pendientes, aprobadas, rechazadas };
  }, [requests]);

  // ── Filter by tab ───────────────────────────────────────────

  const tabFilteredRequests = useMemo(() => {
    switch (activeTab) {
      case 'pendientes':
        return requests.filter((r) => r.status === 'pendiente');
      case 'en_revision':
        return requests.filter((r) => r.status === 'en_revision');
      case 'resueltas':
        return requests.filter((r) => r.status === 'aprobada' || r.status === 'rechazada');
      case 'todas':
        return requests;
    }
  }, [requests, activeTab]);

  // ── Search + Filter + Sort ──────────────────────────────────

  const filteredRequests = useMemo(() => {
    let result = [...tabFilteredRequests];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.citizenName.toLowerCase().includes(q) ||
          r.citizenDoc.toLowerCase().includes(q) ||
          r.requestId.toLowerCase().includes(q)
      );
    }

    // Type filter
    if (typeFilter) {
      result = result.filter((r) => r.type === typeFilter);
    }

    // Priority filter
    if (priorityFilter) {
      result = result.filter((r) => r.priority === priorityFilter);
    }

    // Sort
    result.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case 'date':
          cmp = new Date(a.requestedAt).getTime() - new Date(b.requestedAt).getTime();
          break;
        case 'priority': {
          const priorityOrder: Record<Priority, number> = { alta: 3, media: 2, baja: 1 };
          cmp = priorityOrder[a.priority] - priorityOrder[b.priority];
          break;
        }
      }
      return sortDirection === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [tabFilteredRequests, searchQuery, typeFilter, priorityFilter, sortField, sortDirection]);

  // ── Pagination ──────────────────────────────────────────────

  const totalPages = Math.max(1, Math.ceil(filteredRequests.length / PAGE_SIZE));
  const paginatedRequests = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredRequests.slice(start, start + PAGE_SIZE);
  }, [filteredRequests, currentPage]);

  // Reset page on filter changes
  useEffect(() => {
    setCurrentPage(1);
    setSelectedIds(new Set());
  }, [activeTab, searchQuery, typeFilter, priorityFilter]);

  // ── Action handlers ─────────────────────────────────────────

  const handleApprove = useCallback(
    (requestId: string) => {
      setRequests((prev) =>
        prev.map((r) =>
          r.id === requestId
            ? {
                ...r,
                status: 'aprobada' as RequestStatus,
                resolvedAt: new Date().toISOString(),
                resolvedBy: 'Funcionario Administrativo',
                resolution: 'Solicitud aprobada por el funcionario.',
              }
            : r
        )
      );
      showToast('Solicitud aprobada exitosamente', 'success');
    },
    [showToast]
  );

  const handleReject = useCallback(
    (requestId: string) => {
      setRequests((prev) =>
        prev.map((r) =>
          r.id === requestId
            ? {
                ...r,
                status: 'rechazada' as RequestStatus,
                resolvedAt: new Date().toISOString(),
                resolvedBy: 'Funcionario Administrativo',
                resolution: 'Solicitud rechazada por el funcionario.',
              }
            : r
        )
      );
      showToast('Solicitud rechazada', 'error');
    },
    [showToast]
  );

  const handleReview = useCallback(
    (requestId: string) => {
      setRequests((prev) =>
        prev.map((r) =>
          r.id === requestId
            ? { ...r, status: 'en_revision' as RequestStatus }
            : r
        )
      );
      showToast('Solicitud marcada en revision', 'success');
    },
    [showToast]
  );

  // ── Bulk actions ────────────────────────────────────────────

  const handleBulkApprove = useCallback(() => {
    setRequests((prev) =>
      prev.map((r) =>
        selectedIds.has(r.id) && (r.status === 'pendiente' || r.status === 'en_revision')
          ? {
              ...r,
              status: 'aprobada' as RequestStatus,
              resolvedAt: new Date().toISOString(),
              resolvedBy: 'Funcionario Administrativo',
              resolution: 'Aprobada en accion masiva.',
            }
          : r
      )
    );
    showToast(`${selectedIds.size} solicitud(es) aprobada(s)`, 'success');
    setSelectedIds(new Set());
  }, [selectedIds, showToast]);

  const handleBulkReject = useCallback(() => {
    setRequests((prev) =>
      prev.map((r) =>
        selectedIds.has(r.id) && (r.status === 'pendiente' || r.status === 'en_revision')
          ? {
              ...r,
              status: 'rechazada' as RequestStatus,
              resolvedAt: new Date().toISOString(),
              resolvedBy: 'Funcionario Administrativo',
              resolution: 'Rechazada en accion masiva.',
            }
          : r
      )
    );
    showToast(`${selectedIds.size} solicitud(es) rechazada(s)`, 'error');
    setSelectedIds(new Set());
  }, [selectedIds, showToast]);

  // ── Selection handlers ──────────────────────────────────────

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  // ── Sort handler ────────────────────────────────────────────

  const handleSort = useCallback(
    (field: SortField) => {
      if (sortField === field) {
        setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortField(field);
        setSortDirection('desc');
      }
    },
    [sortField]
  );

  // ── Clear filters ───────────────────────────────────────────

  const hasFilters = typeFilter || priorityFilter;
  const clearFilters = () => {
    setTypeFilter('');
    setPriorityFilter('');
    setSearchQuery('');
  };

  // ── Tab definitions ─────────────────────────────────────────

  const tabs = [
    { id: 'pendientes', label: 'Pendientes', badge: stats.pendientes },
    { id: 'en_revision', label: 'En Revision', badge: requests.filter((r) => r.status === 'en_revision').length },
    { id: 'resueltas', label: 'Resueltas', badge: stats.aprobadas + stats.rechazadas },
    { id: 'todas', label: 'Todas', badge: stats.total },
  ];

  return (
    <div className="space-y-6">
      {/* ── Toast ──────────────────────────────────────────── */}
      {toast && (
        <div
          role={toast.type === 'error' ? 'alert' : 'status'}
          aria-live={toast.type === 'error' ? 'assertive' : 'polite'}
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium animate-slide-up ${
            toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          }`}
        >
          <div className="flex items-center gap-2">
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
            ) : (
              <XCircle className="w-4 h-4" aria-hidden="true" />
            )}
            {toast.message}
          </div>
        </div>
      )}

      {/* ── Header ──────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">
          Solicitudes - {agencyShortName}
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Gestione las solicitudes de verificacion y documentos de {agencyConfig?.name || 'la agencia'}
        </p>
      </div>

      {/* ── Stats Row ───────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card variant="outlined" padding="md">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100">
              <ClipboardList className="w-5 h-5 text-blue-700" />
            </div>
            <div>
              <p className="text-xs text-text-secondary">Total Solicitudes</p>
              <p className="text-xl font-bold text-text-primary">{formatNumber(stats.total)}</p>
            </div>
          </div>
        </Card>
        <Card variant="outlined" padding="md">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-100">
              <Clock className="w-5 h-5 text-yellow-700" />
            </div>
            <div>
              <p className="text-xs text-text-secondary">Pendientes</p>
              <p className="text-xl font-bold text-yellow-600">{formatNumber(stats.pendientes)}</p>
            </div>
          </div>
        </Card>
        <Card variant="outlined" padding="md">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100">
              <CheckCircle2 className="w-5 h-5 text-green-700" />
            </div>
            <div>
              <p className="text-xs text-text-secondary">Aprobadas</p>
              <p className="text-xl font-bold text-green-600">{formatNumber(stats.aprobadas)}</p>
            </div>
          </div>
        </Card>
        <Card variant="outlined" padding="md">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-100">
              <XCircle className="w-5 h-5 text-red-700" />
            </div>
            <div>
              <p className="text-xs text-text-secondary">Rechazadas</p>
              <p className="text-xl font-bold text-red-600">{formatNumber(stats.rechazadas)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* ── Tab Navigation ──────────────────────────────────── */}
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={(id) => setActiveTab(id as TabId)}
        variant="underline"
        size="md"
      />

      {/* ── Search + Filters ────────────────────────────────── */}
      <Card variant="elevated">
        <CardBody>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <Input
                placeholder="Buscar por nombre, documento o ID de solicitud..."
                leftIcon={Search}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                inputSize="md"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={showFilters ? 'primary' : 'outline'}
                size="md"
                leftIcon={Filter}
                onClick={() => setShowFilters(!showFilters)}
              >
                Filtros
                {hasFilters && (
                  <span className="ml-1 px-1.5 py-0.5 text-[10px] bg-white text-colombia-blue rounded-full font-bold">
                    {[typeFilter, priorityFilter].filter(Boolean).length}
                  </span>
                )}
              </Button>
              {hasFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} leftIcon={X}>
                  Limpiar
                </Button>
              )}
              <div className="hidden sm:flex items-center gap-1 ml-2">
                <button
                  onClick={() => handleSort('date')}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    sortField === 'date'
                      ? 'bg-colombia-blue/10 text-colombia-blue'
                      : 'text-text-secondary hover:bg-gray-100'
                  }`}
                >
                  Fecha {sortField === 'date' && (sortDirection === 'desc' ? '(reciente)' : '(antigua)')}
                </button>
                <button
                  onClick={() => handleSort('priority')}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    sortField === 'priority'
                      ? 'bg-colombia-blue/10 text-colombia-blue'
                      : 'text-text-secondary hover:bg-gray-100'
                  }`}
                >
                  Prioridad {sortField === 'priority' && (sortDirection === 'desc' ? '(alta)' : '(baja)')}
                </button>
              </div>
            </div>
          </div>

          {/* Filter dropdowns */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-100">
              {/* Type filter */}
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1.5">
                  Tipo de Solicitud
                </label>
                <div className="relative">
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value as RequestType | '')}
                    className="w-full h-10 px-3 pr-8 rounded-lg border border-gray-200 bg-white text-sm text-text-primary appearance-none focus:outline-none focus:ring-2 focus:ring-colombia-blue/30 focus:border-colombia-blue"
                  >
                    <option value="">Todos los tipos</option>
                    <option value="verificacion_identidad">Verificacion de Identidad</option>
                    <option value="emision_documento">Emision de Documento</option>
                    <option value="renovacion">Renovacion</option>
                    <option value="consulta_estado">Consulta de Estado</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Priority filter */}
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1.5">
                  Prioridad
                </label>
                <div className="relative">
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value as Priority | '')}
                    className="w-full h-10 px-3 pr-8 rounded-lg border border-gray-200 bg-white text-sm text-text-primary appearance-none focus:outline-none focus:ring-2 focus:ring-colombia-blue/30 focus:border-colombia-blue"
                  >
                    <option value="">Todas las prioridades</option>
                    <option value="alta">Alta</option>
                    <option value="media">Media</option>
                    <option value="baja">Baja</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      {/* ── Bulk Actions Bar ────────────────────────────────── */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 bg-colombia-blue text-white px-4 py-3 rounded-xl animate-slide-up">
          <span className="text-sm font-medium">
            {selectedIds.size} solicitud{selectedIds.size !== 1 ? 'es' : ''} seleccionada{selectedIds.size !== 1 ? 's' : ''}
          </span>
          <div className="flex items-center gap-2 ml-auto">
            <Button
              variant="ghost"
              size="sm"
              className="!text-white hover:!bg-white/20"
              leftIcon={CheckCircle2}
              onClick={handleBulkApprove}
            >
              Aprobar Seleccionados
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="!text-white hover:!bg-white/20"
              leftIcon={XCircle}
              onClick={handleBulkReject}
            >
              Rechazar Seleccionados
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="!text-white hover:!bg-white/20"
              onClick={() => setSelectedIds(new Set())}
            >
              Limpiar
            </Button>
          </div>
        </div>
      )}

      {/* ── Request Cards ──────────────────────────────────── */}
      {filteredRequests.length === 0 ? (
        <Card variant="elevated">
          <CardBody>
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Inbox className="w-12 h-12 text-gray-300 mb-3" />
              <p className="text-lg font-medium text-text-primary">
                No hay solicitudes en esta categoria
              </p>
              <p className="text-sm text-text-secondary mt-2">
                {hasFilters
                  ? 'Intente ajustar los filtros de busqueda'
                  : 'Las nuevas solicitudes apareceran aqui'}
              </p>
              {hasFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="mt-3">
                  Limpiar todos los filtros
                </Button>
              )}
            </div>
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-3">
          {paginatedRequests.map((request) => (
            <Card
              key={request.id}
              variant="elevated"
              className={`transition-all ${
                selectedIds.has(request.id) ? 'ring-2 ring-colombia-blue' : ''
              }`}
            >
              <CardBody>
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Checkbox + Request info */}
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    {/* Checkbox - only for actionable requests */}
                    {(request.status === 'pendiente' || request.status === 'en_revision') && (
                      <input
                        type="checkbox"
                        checked={selectedIds.has(request.id)}
                        onChange={() => toggleSelect(request.id)}
                        className="w-4 h-4 mt-1 rounded border-gray-300 text-colombia-blue focus:ring-colombia-blue/30 flex-shrink-0"
                      />
                    )}

                    {/* Status icon */}
                    <div
                      className={`p-2.5 rounded-xl flex-shrink-0 ${
                        request.status === 'pendiente'
                          ? 'bg-yellow-100 text-yellow-700'
                          : request.status === 'en_revision'
                          ? 'bg-blue-100 text-blue-700'
                          : request.status === 'aprobada'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {request.status === 'pendiente' ? (
                        <Clock className="w-5 h-5" />
                      ) : request.status === 'en_revision' ? (
                        <Eye className="w-5 h-5" />
                      ) : request.status === 'aprobada' ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <XCircle className="w-5 h-5" />
                      )}
                    </div>

                    {/* Main content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-text-primary font-mono">
                          {request.requestId}
                        </span>
                        <Badge status={getRequestTypeBadge(request.type)} size="sm">
                          {getRequestTypeLabel(request.type)}
                        </Badge>
                        <Badge status={getPriorityBadge(request.priority)} size="sm" dot>
                          {getPriorityLabel(request.priority)}
                        </Badge>
                        <Badge status={getStatusBadge(request.status)} size="sm" dot>
                          {getStatusLabel(request.status)}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                        <span className="text-text-primary font-medium">{request.citizenName}</span>
                        <span className="text-text-secondary font-mono text-xs">CC {request.citizenDoc}</span>
                      </div>

                      <p className="text-xs text-text-secondary mt-1 line-clamp-2">
                        {request.notes}
                      </p>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-text-secondary">
                        <span>Tipo doc: {request.documentType}</span>
                        <span>Fecha: {formatDateTime(request.requestedAt)}</span>
                        {request.resolvedAt && (
                          <span>Resuelto: {formatDateTime(request.resolvedAt)}</span>
                        )}
                      </div>

                      {/* Resolution info for resolved requests */}
                      {request.resolution && (
                        <div
                          className={`mt-2 p-2 rounded-lg text-xs ${
                            request.status === 'aprobada'
                              ? 'bg-green-50 text-green-700 border border-green-200'
                              : 'bg-red-50 text-red-700 border border-red-200'
                          }`}
                        >
                          <span className="font-semibold">Resolucion:</span> {request.resolution}
                          {request.resolvedBy && (
                            <span className="block mt-0.5 text-[10px] opacity-70">
                              Por: {request.resolvedBy}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2 flex-shrink-0 lg:ml-4">
                    {request.status === 'pendiente' && (
                      <>
                        <Button
                          variant="primary"
                          size="sm"
                          leftIcon={CheckCircle2}
                          onClick={() => handleApprove(request.id)}
                        >
                          Aprobar
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          leftIcon={XCircle}
                          onClick={() => handleReject(request.id)}
                        >
                          Rechazar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          leftIcon={Eye}
                          onClick={() => handleReview(request.id)}
                        >
                          Revisar
                        </Button>
                      </>
                    )}

                    {request.status === 'en_revision' && (
                      <>
                        <Button
                          variant="primary"
                          size="sm"
                          leftIcon={CheckCircle2}
                          onClick={() => handleApprove(request.id)}
                        >
                          Aprobar
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          leftIcon={XCircle}
                          onClick={() => handleReject(request.id)}
                        >
                          Rechazar
                        </Button>
                      </>
                    )}

                    {(request.status === 'aprobada' || request.status === 'rechazada') && (
                      <span className="text-xs text-text-secondary italic px-2">
                        Solo lectura
                      </span>
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {/* ── Pagination ──────────────────────────────────────── */}
      {filteredRequests.length > PAGE_SIZE && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-4">
          <p className="text-sm text-text-secondary">
            Mostrando {(currentPage - 1) * PAGE_SIZE + 1}
            {' '}-{' '}
            {Math.min(currentPage * PAGE_SIZE, filteredRequests.length)} de{' '}
            {filteredRequests.length} solicitud{filteredRequests.length !== 1 ? 'es' : ''}
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
    </div>
  );
}
