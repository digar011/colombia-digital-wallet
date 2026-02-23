'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  MoreHorizontal,
  Eye,
  ShieldCheck,
  Ban,
  Trash2,
  UserPlus,
  ArrowUpDown,
  X,
  User,
} from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  mockCitizens,
  formatRelativeTime,
  formatNumber,
  getStatusBadgeVariant,
  getDocumentTypeLabel,
  type VerificationStatus,
  type DocumentType,
  type Department,
} from '@/lib/mock/adminData';

// ─── Constants ───────────────────────────────────────────────────────────────

const PAGE_SIZE_OPTIONS = [10, 25, 50];
const STATUS_OPTIONS: VerificationStatus[] = ['verified', 'pending', 'rejected', 'suspended'];
const DOC_TYPE_OPTIONS: DocumentType[] = ['cedula', 'passport', 'license', 'health_card', 'military_id', 'electoral'];

const DEPARTMENT_OPTIONS: Department[] = [
  'Bogotá D.C.',
  'Antioquia',
  'Valle del Cauca',
  'Cundinamarca',
  'Santander',
  'Atlántico',
  'Bolívar',
  'Nariño',
  'Boyacá',
  'Tolima',
  'Meta',
  'Caldas',
  'Risaralda',
  'Huila',
  'Magdalena',
];

type SortField = 'name' | 'documentNumber' | 'status' | 'lastActiveAt' | 'registeredAt';
type SortDirection = 'asc' | 'desc';

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function AdminUsersPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // Search & filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<VerificationStatus | ''>('');
  const [docTypeFilter, setDocTypeFilter] = useState<DocumentType | ''>('');
  const [departmentFilter, setDepartmentFilter] = useState<Department | ''>('');
  const [showFilters, setShowFilters] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Sort state
  const [sortField, setSortField] = useState<SortField>('registeredAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Bulk selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showBulkMenu, setShowBulkMenu] = useState(false);

  // Row action menu
  const [activeRowMenu, setActiveRowMenu] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // ── Filtering ─────────────────────────────────────────────────

  const filteredCitizens = useMemo(() => {
    let result = [...mockCitizens];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
          c.documentNumber.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q)
      );
    }

    // Status filter
    if (statusFilter) {
      result = result.filter((c) => c.status === statusFilter);
    }

    // Document type filter
    if (docTypeFilter) {
      result = result.filter((c) => c.documentType === docTypeFilter);
    }

    // Department filter
    if (departmentFilter) {
      result = result.filter((c) => c.department === departmentFilter);
    }

    // Sort
    result.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case 'name':
          cmp = `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
          break;
        case 'documentNumber':
          cmp = a.documentNumber.localeCompare(b.documentNumber);
          break;
        case 'status':
          cmp = a.status.localeCompare(b.status);
          break;
        case 'lastActiveAt':
          cmp = new Date(a.lastActiveAt).getTime() - new Date(b.lastActiveAt).getTime();
          break;
        case 'registeredAt':
          cmp = new Date(a.registeredAt).getTime() - new Date(b.registeredAt).getTime();
          break;
      }
      return sortDirection === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [searchQuery, statusFilter, docTypeFilter, departmentFilter, sortField, sortDirection]);

  // ── Pagination ────────────────────────────────────────────────

  const totalPages = Math.max(1, Math.ceil(filteredCitizens.length / pageSize));
  const paginatedCitizens = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCitizens.slice(start, start + pageSize);
  }, [filteredCitizens, currentPage, pageSize]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, docTypeFilter, departmentFilter, pageSize]);

  // ── Sort handler ──────────────────────────────────────────────

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

  // ── Selection handlers ────────────────────────────────────────

  const toggleSelectAll = useCallback(() => {
    if (selectedIds.size === paginatedCitizens.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedCitizens.map((c) => c.id)));
    }
  }, [selectedIds.size, paginatedCitizens]);

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  // ── Clear filters ─────────────────────────────────────────────

  const hasActiveFilters = statusFilter || docTypeFilter || departmentFilter;

  const clearFilters = () => {
    setStatusFilter('');
    setDocTypeFilter('');
    setDepartmentFilter('');
    setSearchQuery('');
  };

  // ── Sort icon ─────────────────────────────────────────────────

  function SortIcon({ field }: { field: SortField }) {
    if (sortField !== field)
      return <ArrowUpDown className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />;
    return (
      <ArrowUpDown
        className={`w-3 h-3 text-colombia-blue ${sortDirection === 'desc' ? 'rotate-180' : ''} transition-transform`}
      />
    );
  }

  // ── Loading state ─────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="h-12 w-full bg-gray-200 rounded animate-pulse" />
          <div className="bg-white rounded-xl shadow-md">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-gray-100">
                <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-28 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* ── Header ──────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Gestión de Ciudadanos</h1>
            <p className="text-sm text-text-secondary mt-1">
              {formatNumber(mockCitizens.length)} ciudadanos totales &middot;{' '}
              {formatNumber(filteredCitizens.length)} mostrando
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" leftIcon={Download}>
              Exportar
            </Button>
            <Button variant="primary" size="sm" leftIcon={UserPlus}>
              Agregar Ciudadano
            </Button>
          </div>
        </div>

        {/* ── Search & Filters ────────────────────────────────── */}
        <Card variant="elevated">
          <CardBody>
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1">
                <Input
                  placeholder="Buscar por nombre, número de documento o correo..."
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
                  {hasActiveFilters && (
                    <span className="ml-1 px-1.5 py-0.5 text-[10px] bg-white text-colombia-blue rounded-full font-bold">
                      {[statusFilter, docTypeFilter, departmentFilter].filter(Boolean).length}
                    </span>
                  )}
                </Button>
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} leftIcon={X}>
                    Limpiar
                  </Button>
                )}
              </div>
            </div>

            {/* Filter dropdowns */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-100">
                {/* Status filter */}
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1.5">
                    Estado de Verificación
                  </label>
                  <div className="relative">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as VerificationStatus | '')}
                      className="w-full h-10 px-3 pr-8 rounded-lg border border-gray-200 bg-white text-sm text-text-primary appearance-none focus:outline-none focus:ring-2 focus:ring-colombia-blue/30 focus:border-colombia-blue"
                    >
                      <option value="">Todos los estados</option>
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Document type filter */}
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1.5">
                    Tipo de Documento
                  </label>
                  <div className="relative">
                    <select
                      value={docTypeFilter}
                      onChange={(e) => setDocTypeFilter(e.target.value as DocumentType | '')}
                      className="w-full h-10 px-3 pr-8 rounded-lg border border-gray-200 bg-white text-sm text-text-primary appearance-none focus:outline-none focus:ring-2 focus:ring-colombia-blue/30 focus:border-colombia-blue"
                    >
                      <option value="">Todos los tipos</option>
                      {DOC_TYPE_OPTIONS.map((t) => (
                        <option key={t} value={t}>
                          {getDocumentTypeLabel(t)}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Department filter */}
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1.5">
                    Departamento
                  </label>
                  <div className="relative">
                    <select
                      value={departmentFilter}
                      onChange={(e) => setDepartmentFilter(e.target.value as Department | '')}
                      className="w-full h-10 px-3 pr-8 rounded-lg border border-gray-200 bg-white text-sm text-text-primary appearance-none focus:outline-none focus:ring-2 focus:ring-colombia-blue/30 focus:border-colombia-blue"
                    >
                      <option value="">Todos los departamentos</option>
                      {DEPARTMENT_OPTIONS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
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
              {selectedIds.size} ciudadano{selectedIds.size !== 1 ? 's' : ''} seleccionado{selectedIds.size !== 1 ? 's' : ''}
            </span>
            <div className="flex items-center gap-2 ml-auto">
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="!text-white hover:!bg-white/20"
                  onClick={() => setShowBulkMenu(!showBulkMenu)}
                  rightIcon={ChevronDown}
                >
                  Acciones Masivas
                </Button>
                {showBulkMenu && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                    <button className="w-full px-4 py-2 text-left text-sm text-text-primary hover:bg-gray-50 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-green-600" />
                      Verificar Seleccionados
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm text-text-primary hover:bg-gray-50 flex items-center gap-2">
                      <Ban className="w-4 h-4 text-yellow-600" />
                      Suspender Seleccionados
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm text-text-primary hover:bg-gray-50 flex items-center gap-2">
                      <Download className="w-4 h-4 text-blue-600" />
                      Exportar Seleccionados
                    </button>
                    <div className="border-t border-gray-100 my-1" />
                    <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                      <Trash2 className="w-4 h-4" />
                      Eliminar Seleccionados
                    </button>
                  </div>
                )}
              </div>
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

        {/* ── Citizens Table ──────────────────────────────────── */}
        <Card variant="elevated" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="w-12 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={
                        paginatedCitizens.length > 0 &&
                        selectedIds.size === paginatedCitizens.length
                      }
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-gray-300 text-colombia-blue focus:ring-colombia-blue/30"
                    />
                  </th>
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
                      Documento #
                      <SortIcon field="documentNumber" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <button
                      className="group flex items-center gap-1.5 text-xs font-semibold text-text-secondary uppercase tracking-wider"
                      onClick={() => handleSort('status')}
                    >
                      Estado
                      <SortIcon field="status" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left hidden lg:table-cell">
                    <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                      Departamento
                    </span>
                  </th>
                  <th className="px-4 py-3 text-left hidden md:table-cell">
                    <button
                      className="group flex items-center gap-1.5 text-xs font-semibold text-text-secondary uppercase tracking-wider"
                      onClick={() => handleSort('lastActiveAt')}
                    >
                      Última Actividad
                      <SortIcon field="lastActiveAt" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left hidden xl:table-cell">
                    <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                      Documentos
                    </span>
                  </th>
                  <th className="w-12 px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedCitizens.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <User className="w-12 h-12 text-gray-300" />
                        <p className="text-sm font-medium text-text-secondary">
                          No se encontraron ciudadanos
                        </p>
                        <p className="text-xs text-text-secondary">
                          Intenta ajustar tu búsqueda o criterios de filtro
                        </p>
                        {hasActiveFilters && (
                          <Button variant="ghost" size="sm" onClick={clearFilters}>
                            Limpiar todos los filtros
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedCitizens.map((citizen) => (
                    <tr
                      key={citizen.id}
                      onClick={() => router.push(`/admin/users/${citizen.id}`)}
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedIds.has(citizen.id)}
                          onChange={() => toggleSelect(citizen.id)}
                          className="w-4 h-4 rounded border-gray-300 text-colombia-blue focus:ring-colombia-blue/30"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {/* Avatar */}
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-colombia-blue to-colombia-blue-light flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                            {citizen.firstName[0]}
                            {citizen.lastName[0]}
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
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm font-mono text-text-primary">
                            {citizen.documentNumber}
                          </p>
                          <p className="text-xs text-text-secondary">
                            {getDocumentTypeLabel(citizen.documentType)}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          status={getStatusBadgeVariant(citizen.status)}
                          dot
                          size="sm"
                        >
                          {citizen.status.charAt(0).toUpperCase() + citizen.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <p className="text-sm text-text-secondary">{citizen.department}</p>
                        <p className="text-xs text-text-secondary">{citizen.city}</p>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <p className="text-sm text-text-secondary">
                          {formatRelativeTime(citizen.lastActiveAt)}
                        </p>
                      </td>
                      <td className="px-4 py-3 hidden xl:table-cell">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-semibold text-text-primary">
                            {citizen.verifiedDocuments}
                          </span>
                          <span className="text-xs text-text-secondary">
                            / {citizen.documentsCount}
                          </span>
                          {citizen.verifiedDocuments === citizen.documentsCount &&
                            citizen.documentsCount > 0 && (
                              <ShieldCheck className="w-3.5 h-3.5 text-green-500 ml-1" />
                            )}
                        </div>
                      </td>
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <div className="relative">
                          <button
                            onClick={() =>
                              setActiveRowMenu(
                                activeRowMenu === citizen.id ? null : citizen.id
                              )
                            }
                            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <MoreHorizontal className="w-4 h-4 text-gray-500" />
                          </button>
                          {activeRowMenu === citizen.id && (
                            <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                              <button
                                onClick={() => {
                                  router.push(`/admin/users/${citizen.id}`);
                                  setActiveRowMenu(null);
                                }}
                                className="w-full px-3 py-2 text-left text-sm text-text-primary hover:bg-gray-50 flex items-center gap-2"
                              >
                                <Eye className="w-4 h-4" />
                                Ver Detalles
                              </button>
                              <button className="w-full px-3 py-2 text-left text-sm text-text-primary hover:bg-gray-50 flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-green-600" />
                                Verificar
                              </button>
                              <button className="w-full px-3 py-2 text-left text-sm text-text-primary hover:bg-gray-50 flex items-center gap-2">
                                <Ban className="w-4 h-4 text-yellow-600" />
                                Suspender
                              </button>
                              <div className="border-t border-gray-100 my-1" />
                              <button className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                                <Trash2 className="w-4 h-4" />
                                Eliminar
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ── Pagination ──────────────────────────────────────── */}
          {filteredCitizens.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-6 py-4 border-t border-gray-200 bg-gray-50/50">
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <span>Mostrando</span>
                <div className="relative">
                  <select
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                    className="h-8 pl-2 pr-7 rounded border border-gray-200 bg-white text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-colombia-blue/30"
                  >
                    {PAGE_SIZE_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                </div>
                <span>
                  de {formatNumber(filteredCitizens.length)} resultado{filteredCitizens.length !== 1 ? 's' : ''}
                </span>
              </div>

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
      </div>

      {/* Click-outside handler for menus */}
      {(activeRowMenu || showBulkMenu) && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => {
            setActiveRowMenu(null);
            setShowBulkMenu(false);
          }}
        />
      )}
    </div>
  );
}
