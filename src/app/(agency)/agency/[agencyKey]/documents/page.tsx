'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
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
  Eye,
  Ban,
  X,
  Send,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardBody, CardDescription, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useCountry } from '@/lib/contexts/CountryContext';
import {
  getAgencyDataByKey,
  isValidAgencyKey,
  formatAgencyDate,
  getAgencyStatusVariant,
  getAgencyStatusLabel,
  type AgencyData,
} from '@/lib/mock/agencyData';

// ─── Tab type ────────────────────────────────────────────────────────────────

type PageTab = 'emitidos' | 'pendientes' | 'revocados';

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function AgencyDocumentsPage() {
  const params = useParams();
  const agencyKey = params.agencyKey as string;
  const { country } = useCountry();

  const [isLoading, setIsLoading] = useState(true);
  const [agencyData, setAgencyData] = useState<AgencyData | null>(null);
  const [activeTab, setActiveTab] = useState<PageTab>('emitidos');

  // Issue form state
  const [showIssueForm, setShowIssueForm] = useState(false);
  const [issueFormData, setIssueFormData] = useState({
    citizenDocNumber: '',
    documentType: '',
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

  // Agency config
  const agencyConfig = country.agencies[agencyKey];
  const agencyShortName = agencyConfig?.shortName ?? agencyKey;

  useEffect(() => {
    if (isValidAgencyKey(agencyKey)) {
      setAgencyData(getAgencyDataByKey(agencyKey));
    }
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [agencyKey]);

  // ── Filtered documents ──────────────────────────────────────────

  const allDocuments = agencyData?.documents ?? [];

  const filteredDocs = useMemo(() => {
    let docs = [...allDocuments];

    // Filter by tab
    if (activeTab === 'pendientes') {
      docs = docs.filter((d) => d.status === 'pending');
    } else if (activeTab === 'revocados') {
      docs = docs.filter((d) => d.status === 'revoked');
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      docs = docs.filter(
        (d) =>
          d.citizenName.toLowerCase().includes(q) ||
          d.documentNumber.toLowerCase().includes(q) ||
          d.citizenDocNumber.toLowerCase().includes(q)
      );
    }

    // Status filter
    if (statusFilter) {
      docs = docs.filter((d) => d.status === statusFilter);
    }

    // Type filter
    if (typeFilter) {
      docs = docs.filter((d) => d.documentType === typeFilter);
    }

    // Sort: most recent first
    docs.sort(
      (a, b) => new Date(b.issuedDate).getTime() - new Date(a.issuedDate).getTime()
    );

    return docs;
  }, [allDocuments, activeTab, searchQuery, statusFilter, typeFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredDocs.length / pageSize));
  const paginatedDocs = filteredDocs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, typeFilter, activeTab]);

  const hasFilters = statusFilter || typeFilter;

  // ── Document stats ──────────────────────────────────────────────

  const docStats = useMemo(() => {
    const total = allDocuments.length;
    const activos = allDocuments.filter((d) => d.status === 'issued').length;
    const pendientes = allDocuments.filter((d) => d.status === 'pending').length;
    const revocados = allDocuments.filter((d) => d.status === 'revoked').length;
    return { total, activos, pendientes, revocados };
  }, [allDocuments]);

  // ── Tab counts ──────────────────────────────────────────────────

  const tabCounts = useMemo(() => ({
    emitidos: allDocuments.length,
    pendientes: allDocuments.filter((d) => d.status === 'pending').length,
    revocados: allDocuments.filter((d) => d.status === 'revoked').length,
  }), [allDocuments]);

  // ── Document types for this agency ──────────────────────────────

  const documentTypes = agencyData?.documentTypes ?? [];

  // ── Loading ─────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="h-8 w-56 bg-gray-200 rounded animate-pulse" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md h-24 animate-pulse" />
            ))}
          </div>
          <div className="bg-white rounded-xl shadow-md h-96 animate-pulse" />
        </div>
      </div>
    );
  }

  // ── Invalid agency key ──────────────────────────────────────────

  if (!agencyData || !agencyConfig) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card variant="elevated" className="max-w-md w-full">
          <CardBody>
            <div className="text-center py-8">
              <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-text-primary mb-2">
                Agencia no encontrada
              </h2>
              <p className="text-sm text-text-secondary">
                La clave de agencia &ldquo;{agencyKey}&rdquo; no es valida.
                Verifique la URL e intente de nuevo.
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* ── Header ──────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">
              Gestion de Documentos &mdash; {agencyShortName}
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              Emitir, gestionar y revocar documentos &middot; {agencyConfig.name}
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
              Emitir Nuevo Documento
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
                <p className="text-xl font-bold text-green-600">{docStats.activos}</p>
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
                <p className="text-xl font-bold text-yellow-600">{docStats.pendientes}</p>
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
                <p className="text-xl font-bold text-red-600">{docStats.revocados}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* ── Issue Document Form ──────────────────────────────── */}
        {showIssueForm && (
          <Card variant="elevated" className="border-2 border-colombia-blue/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Emitir Nuevo Documento</CardTitle>
                  <CardDescription>
                    Completa los detalles para emitir un nuevo documento de {agencyShortName}
                  </CardDescription>
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
                {/* Citizen document number */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">
                    Numero de Documento del Ciudadano <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={issueFormData.citizenDocNumber}
                    onChange={(e) =>
                      setIssueFormData({ ...issueFormData, citizenDocNumber: e.target.value })
                    }
                    placeholder="Ej: 1.023.456.789"
                    className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-colombia-blue/30 focus:border-colombia-blue"
                  />
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
                          documentType: e.target.value,
                        })
                      }
                      className="w-full h-10 px-3 pr-8 rounded-lg border border-gray-200 bg-white text-sm text-text-primary appearance-none focus:outline-none focus:ring-2 focus:ring-colombia-blue/30 focus:border-colombia-blue"
                    >
                      <option value="">Seleccionar tipo...</option>
                      {documentTypes.map((dt) => (
                        <option key={dt.id} value={dt.id}>
                          {dt.label} ({dt.shortLabel})
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
                    placeholder="Notas adicionales para esta emision..."
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-colombia-blue/30 focus:border-colombia-blue resize-none"
                  />
                </div>
              </div>
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
                  disabled={!issueFormData.citizenDocNumber || !issueFormData.documentType}
                >
                  Emitir
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
                { id: 'emitidos' as PageTab, label: 'Emitidos', count: tabCounts.emitidos },
                { id: 'pendientes' as PageTab, label: 'Pendientes', count: tabCounts.pendientes },
                { id: 'revocados' as PageTab, label: 'Revocados', count: tabCounts.revocados },
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

        {/* ── Search + Filter ──────────────────────────────────── */}
        <Card variant="elevated">
          <CardBody>
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1">
                <Input
                  placeholder="Buscar por nombre o numero de documento..."
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
                      <option value="issued">Emitido</option>
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
                      {documentTypes.map((dt) => (
                        <option key={dt.id} value={dt.label}>
                          {dt.label}
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

        {/* ── Documents Table ──────────────────────────────────── */}
        <Card variant="elevated" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
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
                    Fecha de Emision
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider hidden lg:table-cell">
                    Fecha de Expiracion
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedDocs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center">
                      <FileText className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm font-medium text-text-secondary">
                        No se encontraron documentos
                      </p>
                      <p className="text-xs text-text-secondary mt-1">
                        Intente ajustar los filtros de busqueda
                      </p>
                    </td>
                  </tr>
                ) : (
                  paginatedDocs.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                      {/* Documento */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-lg flex-shrink-0 ${
                              doc.status === 'issued'
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
                              {doc.documentType}
                            </p>
                            <p className="text-xs text-text-secondary font-mono">
                              {doc.documentNumber}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Ciudadano */}
                      <td className="px-4 py-3">
                        <p className="text-sm text-text-primary">{doc.citizenName}</p>
                        <p className="text-xs text-text-secondary">CC {doc.citizenDocNumber}</p>
                      </td>

                      {/* Estado */}
                      <td className="px-4 py-3">
                        <Badge status={getAgencyStatusVariant(doc.status)} dot size="sm">
                          {getAgencyStatusLabel(doc.status)}
                        </Badge>
                      </td>

                      {/* Fecha de Emision */}
                      <td className="px-4 py-3 hidden md:table-cell">
                        <p className="text-sm text-text-secondary">
                          {formatAgencyDate(doc.issuedDate)}
                        </p>
                      </td>

                      {/* Fecha de Expiracion */}
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <p className="text-sm text-text-secondary">
                          {doc.expiryDate ? formatAgencyDate(doc.expiryDate) : 'N/A'}
                        </p>
                      </td>

                      {/* Acciones */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                            title="Ver detalles"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {doc.status === 'issued' && (
                            <button
                              className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                              title="Revocar"
                            >
                              <Ban className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
                            title="Descargar"
                          >
                            <Download className="w-4 h-4" />
                          </button>
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
      </div>
    </div>
  );
}
