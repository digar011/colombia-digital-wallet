'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Search,
  FileText,
  FilePlus,
  FileCheck,
  FileX,
  Filter,
  Download,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Eye,
  Ban,
  RotateCcw,
  X,
  Send,
  CheckCircle2,
  Clock,
  Copy,
  Layers,
  Settings2,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardBody, CardDescription, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  mockIssuedDocuments,
  mockDocumentTemplates,
  mockCitizens,
  formatDate,
  formatRelativeTime,
  getStatusBadgeVariant,
  getDocumentTypeLabel,
  type DocumentType,
} from '@/lib/mock/adminData';

// ─── Tab for this page ───────────────────────────────────────────────────────

type PageTab = 'queue' | 'issued' | 'templates';

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function AdminDocumentsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<PageTab>('queue');

  // Issue form state
  const [showIssueForm, setShowIssueForm] = useState(false);
  const [issueFormData, setIssueFormData] = useState({
    citizenId: '',
    documentType: '' as DocumentType | '',
    notes: '',
  });

  // Search & filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Row action menu
  const [activeRowMenu, setActiveRowMenu] = useState<string | null>(null);

  // Batch selection
  const [selectedDocIds, setSelectedDocIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // ── Filtered documents ────────────────────────────────────────

  const filteredDocs = useMemo(() => {
    let docs = [...mockIssuedDocuments];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      docs = docs.filter(
        (d) =>
          d.citizenName.toLowerCase().includes(q) ||
          d.documentNumber.toLowerCase().includes(q)
      );
    }

    if (statusFilter) {
      docs = docs.filter((d) => d.status === statusFilter);
    }

    if (typeFilter) {
      docs = docs.filter((d) => d.type === typeFilter);
    }

    // Sort: most recent first
    docs.sort(
      (a, b) => new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime()
    );

    return docs;
  }, [searchQuery, statusFilter, typeFilter]);

  const pendingDocs = mockIssuedDocuments.filter((d) => d.status === 'pending');
  const totalPages = Math.max(1, Math.ceil(filteredDocs.length / pageSize));
  const paginatedDocs = filteredDocs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, typeFilter]);

  const hasFilters = statusFilter || typeFilter;

  // ── Document stats ────────────────────────────────────────────

  const docStats = useMemo(() => {
    const total = mockIssuedDocuments.length;
    const active = mockIssuedDocuments.filter((d) => d.status === 'active').length;
    const pending = mockIssuedDocuments.filter((d) => d.status === 'pending').length;
    const revoked = mockIssuedDocuments.filter((d) => d.status === 'revoked').length;
    return { total, active, pending, revoked };
  }, []);

  // ── Loading ───────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="h-8 w-56 bg-gray-200 rounded animate-pulse" />
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md h-24 animate-pulse" />
            ))}
          </div>
          <div className="bg-white rounded-xl shadow-md h-96 animate-pulse" />
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
            <h1 className="text-2xl font-bold text-text-primary">Gesti&oacute;n de Documentos</h1>
            <p className="text-sm text-text-secondary mt-1">
              Emitir, gestionar y revocar documentos ciudadanos
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" leftIcon={Download}>
              Exportar
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={FilePlus}
              onClick={() => setShowIssueForm(true)}
            >
              Emitir Documento
            </Button>
          </div>
        </div>

        {/* ── Stats Cards ─────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card variant="outlined" padding="md">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <FileText className="w-5 h-5 text-blue-700" />
              </div>
              <div>
                <p className="text-xs text-text-secondary">Total Emitidos</p>
                <p className="text-xl font-bold text-text-primary">{docStats.total}</p>
              </div>
            </div>
          </Card>
          <Card variant="outlined" padding="md">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <FileCheck className="w-5 h-5 text-green-700" />
              </div>
              <div>
                <p className="text-xs text-text-secondary">Activos</p>
                <p className="text-xl font-bold text-green-600">{docStats.active}</p>
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
                <p className="text-xl font-bold text-yellow-600">{docStats.pending}</p>
              </div>
            </div>
          </Card>
          <Card variant="outlined" padding="md">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-100">
                <FileX className="w-5 h-5 text-red-700" />
              </div>
              <div>
                <p className="text-xs text-text-secondary">Revocados</p>
                <p className="text-xl font-bold text-red-600">{docStats.revoked}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* ── Issue Document Form (Modal-like) ────────────────── */}
        {showIssueForm && (
          <Card variant="elevated" className="border-2 border-colombia-blue/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Emitir Nuevo Documento</CardTitle>
                  <CardDescription>Completa los detalles para emitir un nuevo documento</CardDescription>
                </div>
                <button
                  onClick={() => setShowIssueForm(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Citizen selector */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">
                    Ciudadano <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={issueFormData.citizenId}
                      onChange={(e) =>
                        setIssueFormData({ ...issueFormData, citizenId: e.target.value })
                      }
                      className="w-full h-10 px-3 pr-8 rounded-lg border border-gray-200 bg-white text-sm text-text-primary appearance-none focus:outline-none focus:ring-2 focus:ring-colombia-blue/30 focus:border-colombia-blue"
                    >
                      <option value="">Seleccionar ciudadano...</option>
                      {mockCitizens
                        .filter((c) => c.status === 'verified')
                        .map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.firstName} {c.lastName} - {c.documentNumber}
                          </option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Document type selector */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">
                    Tipo de Documento <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={issueFormData.documentType}
                      onChange={(e) =>
                        setIssueFormData({
                          ...issueFormData,
                          documentType: e.target.value as DocumentType,
                        })
                      }
                      className="w-full h-10 px-3 pr-8 rounded-lg border border-gray-200 bg-white text-sm text-text-primary appearance-none focus:outline-none focus:ring-2 focus:ring-colombia-blue/30 focus:border-colombia-blue"
                    >
                      <option value="">Seleccionar tipo...</option>
                      {mockDocumentTemplates
                        .filter((t) => t.active)
                        .map((t) => (
                          <option key={t.id} value={t.type}>
                            {t.name} (v{t.version})
                          </option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Notes */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-text-primary mb-1.5">
                    Notas (opcional)
                  </label>
                  <textarea
                    value={issueFormData.notes}
                    onChange={(e) =>
                      setIssueFormData({ ...issueFormData, notes: e.target.value })
                    }
                    placeholder="Notas adicionales para esta emisión..."
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-colombia-blue/30 focus:border-colombia-blue resize-none"
                  />
                </div>
              </div>

              {/* Template preview */}
              {issueFormData.documentType && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="w-4 h-4 text-text-secondary" />
                    <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                      Vista Previa de Plantilla
                    </span>
                  </div>
                  {(() => {
                    const tmpl = mockDocumentTemplates.find(
                      (t) => t.type === issueFormData.documentType
                    );
                    if (!tmpl) return null;
                    return (
                      <div className="grid grid-cols-3 gap-3 text-sm">
                        <div>
                          <p className="text-xs text-text-secondary">Plantilla</p>
                          <p className="font-medium text-text-primary">{tmpl.name}</p>
                        </div>
                        <div>
                          <p className="text-xs text-text-secondary">Versión</p>
                          <p className="font-medium text-text-primary">v{tmpl.version}</p>
                        </div>
                        <div>
                          <p className="text-xs text-text-secondary">Campos</p>
                          <p className="font-medium text-text-primary">{tmpl.fieldsCount}</p>
                        </div>
                      </div>
                    );
                  })()}
                  {/* Visual preview placeholder */}
                  <div className="mt-3 h-32 bg-white rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                    <div className="text-center">
                      <FileText className="w-8 h-8 text-gray-300 mx-auto mb-1" />
                      <p className="text-xs text-text-secondary">La vista previa del documento se mostrará aquí</p>
                    </div>
                  </div>
                </div>
              )}
            </CardBody>
            <CardFooter>
              <div className="flex items-center gap-2 ml-auto">
                <Button variant="ghost" size="sm" onClick={() => setShowIssueForm(false)}>
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={Send}
                  disabled={!issueFormData.citizenId || !issueFormData.documentType}
                >
                  Emitir Documento
                </Button>
              </div>
            </CardFooter>
          </Card>
        )}

        {/* ── Tab Navigation ──────────────────────────────────── */}
        <div className="border-b border-gray-200">
          <nav className="flex gap-0 -mb-px">
            {(
              [
                { id: 'queue' as PageTab, label: 'Cola de Emisión', count: pendingDocs.length },
                { id: 'issued' as PageTab, label: 'Todos los Documentos', count: mockIssuedDocuments.length },
                { id: 'templates' as PageTab, label: 'Plantillas', count: mockDocumentTemplates.length },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 border-b-2 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-colombia-blue text-colombia-blue'
                    : 'border-transparent text-text-secondary hover:text-text-primary hover:border-gray-300'
                }`}
              >
                {tab.label}
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    activeTab === tab.id
                      ? 'bg-colombia-blue/10 text-colombia-blue'
                      : 'bg-gray-100 text-text-secondary'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* ── Queue Tab ───────────────────────────────────────── */}
        {activeTab === 'queue' && (
          <Card variant="elevated">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Cola de Emisión Pendiente</CardTitle>
                  <CardDescription>
                    Documentos en espera de aprobación y emisión
                  </CardDescription>
                </div>
                <Button variant="primary" size="sm" leftIcon={CheckCircle2}>
                  Aprobar Todos
                </Button>
              </div>
            </CardHeader>
            <CardBody className="!p-0">
              {pendingDocs.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <CheckCircle2 className="w-12 h-12 text-green-300 mx-auto mb-2" />
                  <p className="text-sm font-medium text-text-secondary">Cola vacía</p>
                  <p className="text-xs text-text-secondary mt-1">
                    Todos los documentos han sido procesados
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {pendingDocs.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="p-2.5 rounded-xl bg-yellow-100 text-yellow-700 flex-shrink-0">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-text-primary">
                            {getDocumentTypeLabel(doc.type)}
                          </p>
                          <Badge status="pending" size="sm" dot>
                            Pendiente
                          </Badge>
                        </div>
                        <p className="text-xs text-text-secondary mt-0.5">
                          {doc.citizenName} &middot; {doc.documentNumber}
                        </p>
                        <p className="text-xs text-text-secondary">
                          Solicitado {formatRelativeTime(doc.issuedAt)} &middot; Por {doc.issuedBy}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button variant="primary" size="sm" leftIcon={CheckCircle2}>
                          Aprobar
                        </Button>
                        <Button variant="outline" size="sm" leftIcon={Ban}>
                          Rechazar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        )}

        {/* ── Issued Documents Tab ────────────────────────────── */}
        {activeTab === 'issued' && (
          <>
            {/* Search + Filter */}
            <Card variant="elevated">
              <CardBody>
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="flex-1">
                    <Input
                      placeholder="Buscar por nombre o número de documento..."
                      leftIcon={Search}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
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
                    </Button>
                    {hasFilters && (
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={X}
                        onClick={() => {
                          setStatusFilter('');
                          setTypeFilter('');
                        }}
                      >
                        Limpiar
                      </Button>
                    )}
                  </div>
                </div>

                {showFilters && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-100">
                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1.5">
                        Estado
                      </label>
                      <div className="relative">
                        <select
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className="w-full h-10 px-3 pr-8 rounded-lg border border-gray-200 bg-white text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-colombia-blue/30"
                        >
                          <option value="">Todos los estados</option>
                          <option value="active">Activo</option>
                          <option value="pending">Pendiente</option>
                          <option value="revoked">Revocado</option>
                          <option value="expired">Expirado</option>
                        </select>
                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1.5">
                        Tipo de Documento
                      </label>
                      <div className="relative">
                        <select
                          value={typeFilter}
                          onChange={(e) => setTypeFilter(e.target.value)}
                          className="w-full h-10 px-3 pr-8 rounded-lg border border-gray-200 bg-white text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-colombia-blue/30"
                        >
                          <option value="">Todos los tipos</option>
                          <option value="cedula">Cedula de Ciudadania</option>
                          <option value="passport">Pasaporte</option>
                          <option value="license">Licencia de Conduccion</option>
                          <option value="health_card">Carne de Salud</option>
                          <option value="military_id">Libreta Militar</option>
                          <option value="electoral">Tarjeta Electoral</option>
                        </select>
                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>

            {/* Batch actions bar */}
            {selectedDocIds.size > 0 && (
              <div className="flex items-center gap-3 bg-colombia-blue text-white px-4 py-3 rounded-xl">
                <span className="text-sm font-medium">
                  {selectedDocIds.size} documento{selectedDocIds.size !== 1 ? 's' : ''} seleccionado{selectedDocIds.size !== 1 ? 's' : ''}
                </span>
                <div className="flex items-center gap-2 ml-auto">
                  <Button variant="ghost" size="sm" className="!text-white hover:!bg-white/20" leftIcon={Ban}>
                    Revocar Seleccionados
                  </Button>
                  <Button variant="ghost" size="sm" className="!text-white hover:!bg-white/20" leftIcon={Download}>
                    Exportar Seleccionados
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="!text-white hover:!bg-white/20"
                    onClick={() => setSelectedDocIds(new Set())}
                  >
                    Limpiar
                  </Button>
                </div>
              </div>
            )}

            {/* Documents Table */}
            <Card variant="elevated" className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="w-12 px-4 py-3">
                        <input
                          type="checkbox"
                          checked={
                            paginatedDocs.length > 0 &&
                            selectedDocIds.size === paginatedDocs.length
                          }
                          onChange={() => {
                            if (selectedDocIds.size === paginatedDocs.length) {
                              setSelectedDocIds(new Set());
                            } else {
                              setSelectedDocIds(new Set(paginatedDocs.map((d) => d.id)));
                            }
                          }}
                          className="w-4 h-4 rounded border-gray-300"
                        />
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                        Documento
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                        Ciudadano
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider hidden md:table-cell">
                        Emitido
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider hidden lg:table-cell">
                        Expira
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider hidden lg:table-cell">
                        Emitido Por
                      </th>
                      <th className="w-12 px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginatedDocs.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-4 py-12 text-center">
                          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                          <p className="text-sm font-medium text-text-secondary">
                            No se encontraron documentos
                          </p>
                        </td>
                      </tr>
                    ) : (
                      paginatedDocs.map((doc) => (
                        <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3">
                            <input
                              type="checkbox"
                              checked={selectedDocIds.has(doc.id)}
                              onChange={() => {
                                setSelectedDocIds((prev) => {
                                  const next = new Set(prev);
                                  if (next.has(doc.id)) next.delete(doc.id);
                                  else next.add(doc.id);
                                  return next;
                                });
                              }}
                              className="w-4 h-4 rounded border-gray-300"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div
                                className={`p-2 rounded-lg flex-shrink-0 ${
                                  doc.status === 'active'
                                    ? 'bg-green-100 text-green-700'
                                    : doc.status === 'pending'
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-red-100 text-red-700'
                                }`}
                              >
                                <FileText className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-text-primary truncate">
                                  {getDocumentTypeLabel(doc.type)}
                                </p>
                                <p className="text-xs text-text-secondary font-mono">
                                  {doc.documentNumber}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-sm text-text-primary">{doc.citizenName}</p>
                          </td>
                          <td className="px-4 py-3">
                            <Badge status={getStatusBadgeVariant(doc.status)} dot size="sm">
                              {doc.status === 'active'
                                ? 'Activo'
                                : doc.status === 'pending'
                                ? 'Pendiente'
                                : doc.status === 'revoked'
                                ? 'Revocado'
                                : 'Expirado'}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 hidden md:table-cell">
                            <p className="text-sm text-text-secondary">
                              {formatDate(doc.issuedAt)}
                            </p>
                          </td>
                          <td className="px-4 py-3 hidden lg:table-cell">
                            <p className="text-sm text-text-secondary">
                              {formatDate(doc.expiresAt)}
                            </p>
                          </td>
                          <td className="px-4 py-3 hidden lg:table-cell">
                            <p className="text-xs text-text-secondary">{doc.issuedBy}</p>
                          </td>
                          <td className="px-4 py-3">
                            <div className="relative">
                              <button
                                onClick={() =>
                                  setActiveRowMenu(
                                    activeRowMenu === doc.id ? null : doc.id
                                  )
                                }
                                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                              >
                                <MoreHorizontal className="w-4 h-4 text-gray-500" />
                              </button>
                              {activeRowMenu === doc.id && (
                                <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                                  <button className="w-full px-3 py-2 text-left text-sm text-text-primary hover:bg-gray-50 flex items-center gap-2">
                                    <Eye className="w-4 h-4" /> Ver Detalles
                                  </button>
                                  <button className="w-full px-3 py-2 text-left text-sm text-text-primary hover:bg-gray-50 flex items-center gap-2">
                                    <Copy className="w-4 h-4" /> Copiar Número
                                  </button>
                                  <button className="w-full px-3 py-2 text-left text-sm text-text-primary hover:bg-gray-50 flex items-center gap-2">
                                    <Download className="w-4 h-4" /> Descargar
                                  </button>
                                  {doc.status === 'active' && (
                                    <>
                                      <div className="border-t border-gray-100 my-1" />
                                      <button className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                                        <Ban className="w-4 h-4" /> Revocar
                                      </button>
                                    </>
                                  )}
                                  {doc.status === 'revoked' && (
                                    <>
                                      <div className="border-t border-gray-100 my-1" />
                                      <button className="w-full px-3 py-2 text-left text-sm text-green-600 hover:bg-green-50 flex items-center gap-2">
                                        <RotateCcw className="w-4 h-4" /> Reinstalar
                                      </button>
                                    </>
                                  )}
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

              {/* Pagination */}
              {filteredDocs.length > 0 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50/50">
                  <p className="text-sm text-text-secondary">
                    Mostrando {(currentPage - 1) * pageSize + 1}
                    {' '}-{' '}
                    {Math.min(currentPage * pageSize, filteredDocs.length)} de{' '}
                    {filteredDocs.length}
                  </p>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:pointer-events-none"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 rounded-lg text-sm font-medium ${
                          currentPage === page
                            ? 'bg-colombia-blue text-white'
                            : 'hover:bg-gray-100 text-text-secondary'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:pointer-events-none"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </Card>
          </>
        )}

        {/* ── Templates Tab ───────────────────────────────────── */}
        {activeTab === 'templates' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockDocumentTemplates.map((tmpl) => (
              <Card key={tmpl.id} variant="elevated" className="relative">
                {!tmpl.active && (
                  <div className="absolute top-3 right-3">
                    <Badge status="default" size="sm">
                      Inactivo
                    </Badge>
                  </div>
                )}
                <CardBody>
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-3 rounded-xl flex-shrink-0 ${
                        tmpl.active
                          ? 'bg-colombia-blue/10 text-colombia-blue'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      <Layers className="w-6 h-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-text-primary">{tmpl.name}</p>
                      <p className="text-xs text-text-secondary mt-0.5">
                        Versión {tmpl.version}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="text-text-secondary">Campos</p>
                      <p className="font-semibold text-text-primary">{tmpl.fieldsCount}</p>
                    </div>
                    <div>
                      <p className="text-text-secondary">Última Actualización</p>
                      <p className="font-semibold text-text-primary">
                        {formatRelativeTime(tmpl.lastUpdated)}
                      </p>
                    </div>
                  </div>

                  {/* Visual template preview */}
                  <div className="mt-4 h-24 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-5">
                      <div className="w-full h-full" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 8px, #003893 8px, #003893 9px), repeating-linear-gradient(90deg, transparent, transparent 8px, #003893 8px, #003893 9px)' }} />
                    </div>
                    <div className="text-center z-10">
                      <FileText className="w-6 h-6 text-gray-400 mx-auto" />
                      <p className="text-[10px] text-text-secondary mt-1">{tmpl.name}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <Button variant="outline" size="sm" fullWidth leftIcon={Eye}>
                      Vista Previa
                    </Button>
                    <Button variant="ghost" size="sm" fullWidth leftIcon={Settings2}>
                      Editar
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Click-outside handler */}
      {activeRowMenu && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setActiveRowMenu(null)}
        />
      )}
    </div>
  );
}
